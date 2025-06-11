import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase/client';
import type { Tables } from '@/lib/supabase/types';
import { MoreVertical, Pin, Trash2, Edit2, MessageSquare, ChevronDown, ChevronRight, Archive, Globe } from 'lucide-react';
import SidebarChatItem from './SidebarChatItem';
import Badge from '@/components/UI/Badge';
import { useTheme } from '@/theme/ThemeProvider';
import { differenceInCalendarDays, parseISO } from 'date-fns';

function formatTime(ts: string) {
  const date = new Date(ts);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString();
}

function getTagsFromMetadata(metadata: any): string[] {
  if (metadata && typeof metadata === 'object' && !Array.isArray(metadata) && Array.isArray(metadata.tags)) {
    return metadata.tags.filter((t: any) => typeof t === 'string');
  }
  return [];
}

export default function SidebarThreadList({ search, collapsed }: { search: string; collapsed?: boolean }) {
  const [threads, setThreads] = useState<Tables<'chats'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [currentThread, setCurrentThread] = useState<Tables<'chats'> | null>(null);
  const [tagAnchorRef, setTagAnchorRef] = useState<React.RefObject<HTMLDivElement> | null>(null);
  const [archivedOpen, setArchivedOpen] = useState(false);
  const { theme } = useTheme();

  // Fetch threads function (extracted for polling)
  const fetchThreads = async () => {
    if (!session?.user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', session.user.id)
      .order('updated_at', { ascending: false });
    if (!error && data) setThreads(data);
    setLoading(false);
  };

  useEffect(() => {
    if (renamingId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [renamingId]);

  useEffect(() => {
    fetchThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  // --- Poll for Gemini title/tags update after first exchange ---
  useEffect(() => {
    // Find any chat with title 'New Chat' and exactly 2 messages
    const pollForGeminiUpdate = async () => {
      if (!session?.user) return;
      // Find candidate chats
      const newChats = threads.filter(t => t.title === 'New Chat');
      for (const chat of newChats) {
        // Count messages for this chat
        const { data: msgs } = await supabase
          .from('messages')
          .select('id')
          .eq('chat_id', chat.id);
        if (msgs && msgs.length === 2) {
          let tries = 0;
          const poll = setInterval(async () => {
            tries++;
            const { data: updated, error } = await supabase
              .from('chats')
              .select('title,metadata')
              .eq('id', chat.id)
              .maybeSingle();
            if (error || !updated) {
              clearInterval(poll);
              return;
            }
            const tags = getTagsFromMetadata(updated.metadata);
            if (updated.title !== 'New Chat' || tags.length > 0) {
              await fetchThreads();
              clearInterval(poll);
            }
            if (tries > 5) clearInterval(poll);
          }, 2000);
        }
      }
    };
    pollForGeminiUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threads, session]);

  // Actions
  const handlePin = async (thread: Tables<'chats'>, pinned: boolean) => {
    const meta = typeof thread.metadata === 'object' && thread.metadata ? thread.metadata : {};
    await supabase
      .from('chats')
      .update({ metadata: { ...meta, pinned } })
      .eq('id', thread.id);
    setThreads(ts => ts.map(t => t.id === thread.id ? { ...t, metadata: { ...meta, pinned } } : t));
    setMenuOpen(null);
  };
  const handleRename = async (thread: Tables<'chats'>) => {
    if (!renameValue.trim()) return;
    await supabase
      .from('chats')
      .update({ title: renameValue.trim() })
      .eq('id', thread.id);
    setThreads(ts => ts.map(t => t.id === thread.id ? { ...t, title: renameValue.trim() } : t));
    setRenamingId(null);
    setMenuOpen(null);
  };
  const handleDelete = async (thread: Tables<'chats'>) => {
    await supabase
      .from('chats')
      .delete()
      .eq('id', thread.id);
    setThreads(ts => ts.filter(t => t.id !== thread.id));
    setMenuOpen(null);
  };
  const handleArchive = async (thread: Tables<'chats'>) => {
    const meta = typeof thread.metadata === 'object' && thread.metadata ? thread.metadata : {};
    await supabase
      .from('chats')
      .update({ metadata: { ...meta, archived: true } })
      .eq('id', thread.id);
    setThreads(ts => ts.map(t => t.id === thread.id ? { ...t, metadata: { ...meta, archived: true } } : t));
    setMenuOpen(null);
  };
  const handleClone = async (thread: Tables<'chats'>) => {
    const meta = typeof thread.metadata === 'object' && thread.metadata ? { ...thread.metadata, archived: false } : {};
    // Create new chat
    const { data: newChat, error } = await supabase
      .from('chats')
      .insert({
        user_id: thread.user_id,
        title: thread.title + ' (Copy)',
        model: thread.model,
        metadata: meta,
      })
      .select('id')
      .single();
    if (newChat && newChat.id) {
      // Copy messages
      const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', thread.id);
      if (messages && messages.length > 0) {
        const newMessages = messages.map(m => ({
          ...m,
          id: undefined, // Let DB generate new UUID
          chat_id: newChat.id,
          created_at: new Date().toISOString(),
        }));
        // Insert all messages (in batches if needed)
        for (const msg of newMessages) {
          await supabase.from('messages').insert(msg);
        }
      }
      setMenuOpen(null);
      router.push(`/chat/${newChat.id}`);
    }
  };
  const handleDownload = async (thread: Tables<'chats'>) => {
    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', thread.id);
    if (messages) {
      const data = {
        chat: thread,
        messages,
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${thread.title || 'Untitled Chat'}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };
  const handleTags = (thread: Tables<'chats'>, menuRef: React.RefObject<HTMLDivElement> | null) => {
    setCurrentThread(thread);
    setTagAnchorRef(menuRef);
  };

  const handleSaveTags = async (tags: string[]) => {
    if (currentThread) {
      const meta = typeof currentThread.metadata === 'object' && !Array.isArray(currentThread.metadata) && currentThread.metadata ? { ...currentThread.metadata } : {};
      meta.tags = tags;
      await supabase
        .from('chats')
        .update({ metadata: meta })
        .eq('id', currentThread.id);
    }
  };

  const handleUpdateTags = async (thread: Tables<'chats'>, tags: string[]) => {
    const meta = typeof thread.metadata === 'object' && !Array.isArray(thread.metadata) && thread.metadata ? { ...thread.metadata } : {};
    meta.tags = tags;
    await supabase
      .from('chats')
      .update({ metadata: meta })
      .eq('id', thread.id);
  };

  const handleTogglePublic = async (thread: Tables<'chats'>) => {
    await supabase
      .from('chats')
      .update({ public: !thread.public })
      .eq('id', thread.id);
    setThreads(ts => ts.map(t => t.id === thread.id ? { ...t, public: !thread.public } : t));
  };

  // Filter and organize
  const filtered = threads.filter(t => {
    const titleMatch = t.title.toLowerCase().includes(search.toLowerCase());
    const tags = getTagsFromMetadata(t.metadata);
    const tagMatch = tags.some((tag: string) => tag.toLowerCase().includes(search.toLowerCase()));
    return titleMatch || tagMatch;
  });
  const notArchived = filtered.filter(t => !(typeof t.metadata === 'object' && t.metadata && (t.metadata as any).archived));
  const pinned = notArchived.filter(t => typeof t.metadata === 'object' && t.metadata && (t.metadata as any).pinned === true);
  const recent = notArchived.filter(t => !t.metadata || typeof t.metadata !== 'object' || !(t.metadata as any).pinned);
  const archived = filtered.filter(t => typeof t.metadata === 'object' && t.metadata && (t.metadata as any).archived === true);

  // Helper: get last message preview (stub for now)
  const getLastMessage = (thread: Tables<'chats'>) => {
    // You could fetch last message from messages table if needed
    return '';
  };

  // Helper: is active
  const isActive = (id: string) => pathname?.includes(id);

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(null);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  // Group threads by time
  const now = new Date();
  const groupByTime = (thread: Tables<'chats'>) => {
    const updated = new Date(thread.updated_at);
    const daysAgo = differenceInCalendarDays(now, updated);
    if (daysAgo === 0) return 'Today';
    if (daysAgo === 1) return 'Yesterday';
    if (daysAgo <= 7) return 'Last 7 Days';
    if (daysAgo <= 30) return 'Last 30 Days';
    return 'Older';
  };
  const timeGroups = {
    'Today': [] as Tables<'chats'>[],
    'Yesterday': [] as Tables<'chats'>[],
    'Last 7 Days': [] as Tables<'chats'>[],
    'Last 30 Days': [] as Tables<'chats'>[],
    'Older': [] as Tables<'chats'>[],
  };
  recent.forEach(thread => {
    const group = groupByTime(thread);
    timeGroups[group].push(thread);
  });

  useEffect(() => {
    function handleTogglePin() {
      const active = threads.find(t => isActive(t.id));
      if (active) {
        const meta = typeof active.metadata === 'object' && !Array.isArray(active.metadata) && active.metadata ? active.metadata : {};
        handlePin(active, !meta.pinned);
      }
    }
    window.addEventListener('toggle-pin-current-conversation', handleTogglePin);
    return () => window.removeEventListener('toggle-pin-current-conversation', handleTogglePin);
  }, [threads]);

  useEffect(() => {
    function handleNewConversation() {
      // Duplicated from Sidebar's handleNewChat
      if (!session?.user) return;
      (async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from('chats')
          .insert({
            user_id: session.user.id,
            title: 'New Chat',
            model: 'gemini-2.0-flash',
          })
          .select('id')
          .single();
        setLoading(false);
        if (data && data.id) {
          router.replace(`/chat/${data.id}`);
        }
      })();
    }
    window.addEventListener('new-conversation', handleNewConversation);
    return () => window.removeEventListener('new-conversation', handleNewConversation);
  }, [session, router]);

  if (collapsed) {
    // Render a minimal list of all chat icons for each thread, clickable, with correct icon
    // Order: pinned, recent, archived
    const allCollapsedThreads = [
      ...pinned.map(t => ({ ...t, _type: 'pinned' as const })),
      ...recent.map(t => ({ ...t, _type: 'recent' as const })),
      ...archived.map(t => ({ ...t, _type: 'archived' as const })),
    ];
    return (
      <div className="flex flex-col items-center mt-4" style={{ height: 'calc(100vh - 7rem)' }}>
        <div className="flex flex-col gap-3 items-center overflow-y-auto px-2" style={{ maxHeight: '100%', minWidth: 0}}>
          {allCollapsedThreads.map(thread => {
            let Icon = MessageSquare;
            let iconColor = theme.buttonText;
            if (thread._type === 'pinned') {
              Icon = Pin;
              iconColor = theme.buttonText;
            } else if (thread._type === 'archived') {
              Icon = Archive;
              iconColor = theme.inputText;
            } else if (thread.public) {
              Icon = Globe;
              iconColor = theme.inputText;
            }
            return (
              <button
                key={thread.id}
                title={thread.title || 'Untitled Chat'}
                className={`rounded-lg p-2 shadow cursor-pointer focus:outline-none focus:ring-2`}
                style={{ background: theme.buttonGlass, color: iconColor, borderColor: theme.buttonBorder }}
                onClick={() => router.push(`/chat/${thread.id}`)}
              >
                <Icon size={22} style={{ color: iconColor }} />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto flex flex-col px-1 pb-2">
      {loading ? (
        <div className="text-gray-400 text-sm text-center mt-8">Loading...</div>
      ) : (
        <>
          {pinned.length > 0 && (
            <div className="mb-3">
              <div className="px-2 py-1 text-xs font-bold text-purple-500 uppercase tracking-widest mb-1">Pinned</div>
              <ul className="flex flex-col gap-2">
                {pinned.map(thread => (
                  <SidebarChatItem
                    key={thread.id}
                    thread={thread}
                    isActive={isActive(thread.id)}
                    onClick={() => router.push(`/chat/${thread.id}`)}
                    onRename={handleRename}
                    onDelete={handleDelete}
                    onPin={handlePin}
                    onArchive={handleArchive}
                    onClone={handleClone}
                    onDownload={handleDownload}
                    onTags={(thread, menuRef) => handleTags(thread, menuRef)}
                    onUpdateTags={handleUpdateTags}
                    renamingId={renamingId}
                    renameValue={renameValue}
                    setRenamingId={setRenamingId}
                    setRenameValue={setRenameValue}
                    menuOpen={menuOpen}
                    setMenuOpen={setMenuOpen}
                    inputRef={inputRef as React.RefObject<HTMLInputElement>}
                    pinned={!!(typeof thread.metadata === 'object' && thread.metadata && (thread.metadata as any).pinned === true)}
                    archived={!!(typeof thread.metadata === 'object' && thread.metadata && (thread.metadata as any).archived === true)}
                    isPublic={thread.public}
                    onTogglePublic={() => handleTogglePublic(thread)}
                  />
                ))}
              </ul>
            </div>
          )}
          {/* Time-based groups */}
          {Object.entries(timeGroups).map(([label, threads]) => (
            threads.length > 0 && (
              <div key={label} className="mb-2">
                <div className="px-2 py-1 text-xs font-bold text-purple-500 uppercase tracking-widest mb-1">{label}</div>
                <ul className="flex flex-col gap-2">
                  {threads.map(thread => (
                    <SidebarChatItem
                      key={thread.id}
                      thread={thread}
                      isActive={isActive(thread.id)}
                      onClick={() => router.push(`/chat/${thread.id}`)}
                      onRename={handleRename}
                      onDelete={handleDelete}
                      onPin={handlePin}
                      onArchive={handleArchive}
                      onClone={handleClone}
                      onDownload={handleDownload}
                      onTags={(thread, menuRef) => handleTags(thread, menuRef)}
                      onUpdateTags={handleUpdateTags}
                      renamingId={renamingId}
                      renameValue={renameValue}
                      setRenamingId={setRenamingId}
                      setRenameValue={setRenameValue}
                      menuOpen={menuOpen}
                      setMenuOpen={setMenuOpen}
                      inputRef={inputRef as React.RefObject<HTMLInputElement>}
                      pinned={!!(typeof thread.metadata === 'object' && thread.metadata && (thread.metadata as any).pinned === true)}
                      archived={!!(typeof thread.metadata === 'object' && thread.metadata && (thread.metadata as any).archived === true)}
                      isPublic={thread.public}
                      onTogglePublic={() => handleTogglePublic(thread)}
                    />
                  ))}
                </ul>
              </div>
            )
          ))}
          {/* Archived dropdown */}
          {archived.length > 0 && (
            <div className="mt-4">
              <button
                className="flex items-center gap-2 w-full px-2 py-1 text-xs font-bold text-purple-500 uppercase tracking-widest hover:bg-purple-100 rounded transition"
                onClick={() => setArchivedOpen(o => !o)}
                aria-expanded={archivedOpen}
              >
                {archivedOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                Archived
                <span className="ml-auto text-purple-400 font-normal">{archived.length}</span>
              </button>
              {archivedOpen && (
                <ul className="flex flex-col gap-2 mt-2">
                  {archived.map(thread => (
                    <SidebarChatItem
                      key={thread.id}
                      thread={thread}
                      isActive={isActive(thread.id)}
                      onClick={() => router.push(`/chat/${thread.id}`)}
                      onRename={handleRename}
                      onDelete={handleDelete}
                      onPin={handlePin}
                      onArchive={handleArchive}
                      onClone={handleClone}
                      onDownload={handleDownload}
                      onTags={(thread, menuRef) => handleTags(thread, menuRef)}
                      onUpdateTags={handleUpdateTags}
                      renamingId={renamingId}
                      renameValue={renameValue}
                      setRenamingId={setRenamingId}
                      setRenameValue={setRenameValue}
                      menuOpen={menuOpen}
                      setMenuOpen={setMenuOpen}
                      inputRef={inputRef as React.RefObject<HTMLInputElement>}
                      pinned={!!(typeof thread.metadata === 'object' && thread.metadata && (thread.metadata as any).pinned === true)}
                      archived={!!(typeof thread.metadata === 'object' && thread.metadata && (thread.metadata as any).archived === true)}
                      isPublic={thread.public}
                      onTogglePublic={() => handleTogglePublic(thread)}
                    />
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
} 