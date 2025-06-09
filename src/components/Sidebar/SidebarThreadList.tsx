import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase/client';
import type { Tables } from '@/lib/supabase/types';
import { MoreVertical, Pin, Trash2, Edit2 } from 'lucide-react';
import SidebarChatItem from './SidebarChatItem';
import TagModal from './TagModal';

function formatTime(ts: string) {
  const date = new Date(ts);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString();
}

function getTagsFromMetadata(metadata: any): string[] {
  if (metadata && typeof metadata === 'object' && Array.isArray(metadata.tags)) {
    return metadata.tags.filter((t: any) => typeof t === 'string');
  }
  return [];
}

export default function SidebarThreadList({ search }: { search: string }) {
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
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [currentThread, setCurrentThread] = useState<Tables<'chats'> | null>(null);
  const [tagAnchorRef, setTagAnchorRef] = useState<React.RefObject<HTMLDivElement> | null>(null);

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
    setTagModalOpen(true);
  };

  const handleSaveTags = async (tags: string[]) => {
    if (currentThread) {
      const meta = typeof currentThread.metadata === 'object' && currentThread.metadata ? { ...currentThread.metadata } : {};
      meta.tags = tags;
      await supabase
        .from('chats')
        .update({ metadata: meta })
        .eq('id', currentThread.id);
      setTagModalOpen(false);
    }
  };

  const handleUpdateTags = async (thread: Tables<'chats'>, tags: string[]) => {
    const meta = typeof thread.metadata === 'object' && thread.metadata ? { ...thread.metadata } : {};
    meta.tags = tags;
    await supabase
      .from('chats')
      .update({ metadata: meta })
      .eq('id', thread.id);
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

  const renderMenu = (thread: Tables<'chats'>, isPinned: boolean) => (
    <div ref={menuRef} className="absolute z-50 mt-8 right-4 w-40 bg-white rounded shadow-lg border border-purple-100">
      {isPinned ? (
        <button className="w-full flex items-center gap-2 px-4 py-2 text-purple-700 hover:bg-purple-50" onClick={e => { e.stopPropagation(); handlePin(thread, false); }}> <Pin size={16} /> Unpin</button>
      ) : (
        <button className="w-full flex items-center gap-2 px-4 py-2 text-purple-700 hover:bg-purple-50" onClick={e => { e.stopPropagation(); handlePin(thread, true); }}> <Pin size={16} /> Pin</button>
      )}
      <button className="w-full flex items-center gap-2 px-4 py-2 text-purple-700 hover:bg-purple-50" onClick={e => { e.stopPropagation(); setRenamingId(thread.id); setRenameValue(thread.title); }}> <Edit2 size={16} /> Rename</button>
      <button className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50" onClick={e => { e.stopPropagation(); handleDelete(thread); }}> <Trash2 size={16} /> Delete</button>
    </div>
  );

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
                  />
                ))}
              </ul>
            </div>
          )}
          <div>
            {pinned.length > 0 && <div className="px-2 py-1 text-xs font-bold text-purple-500 uppercase tracking-widest mb-1">Recent</div>}
            <ul className="flex flex-col gap-2">
              {recent.map(thread => (
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
                />
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
} 