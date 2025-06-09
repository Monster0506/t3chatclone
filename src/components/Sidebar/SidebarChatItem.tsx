import { useRef, useState, useEffect, RefObject } from 'react';
import { MoreVertical, Pin, Trash2, Edit2 } from 'lucide-react';
import type { Tables } from '@/lib/supabase/types';
import SidebarChatContextMenu from './SidebarChatContextMenu';

function formatTime(ts: string) {
  const date = new Date(ts);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString();
}

function getTags(metadata: any): string[] {
  if (metadata && typeof metadata === 'object' && Array.isArray(metadata.tags)) {
    return metadata.tags.filter((t: any) => typeof t === 'string');
  }
  return [];
}

export default function SidebarChatItem({
  thread,
  isActive,
  onClick,
  onRename,
  onDelete,
  onPin,
  onArchive,
  onClone,
  onDownload,
  onTags,
  onUpdateTags,
  renamingId,
  renameValue,
  setRenamingId,
  setRenameValue,
  menuOpen,
  setMenuOpen,
  inputRef,
  pinned,
  archived,
}: {
  thread: Tables<'chats'>;
  isActive: boolean;
  onClick: () => void;
  onRename: (thread: Tables<'chats'>) => void;
  onDelete: (thread: Tables<'chats'>) => void;
  onPin: (thread: Tables<'chats'>, pinned: boolean) => void;
  onArchive: (thread: Tables<'chats'>) => void;
  onClone: (thread: Tables<'chats'>) => void;
  onDownload: (thread: Tables<'chats'>) => void;
  onTags: (thread: Tables<'chats'>, menuRef: React.RefObject<HTMLDivElement> | null) => void;
  onUpdateTags: (thread: Tables<'chats'>, tags: string[]) => void;
  renamingId: string | null;
  renameValue: string;
  setRenamingId: (id: string | null) => void;
  setRenameValue: (v: string) => void;
  menuOpen: string | null;
  setMenuOpen: (id: string | null) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  pinned: boolean;
  archived: boolean;
}) {
  const initialTags = getTags(thread.metadata);
  const [tags, setTags] = useState<string[]>(initialTags);
  useEffect(() => {
    setTags(initialTags);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initialTags)]);
  const [tagInput, setTagInput] = useState('');
  return (
    <li
      className={`group flex items-center px-4 py-2 transition-colors duration-150 cursor-pointer select-none ${isActive ? 'bg-purple-900/10 text-purple-900 font-semibold' : 'hover:bg-purple-900/5 text-purple-800'}`}
    >
      {renamingId === thread.id ? (
        <input
          ref={inputRef}
          className="flex-1 bg-transparent border border-purple-200 rounded px-2 py-1 text-purple-900 text-sm"
          value={renameValue}
          onChange={e => setRenameValue(e.target.value)}
          onBlur={() => setRenamingId(null)}
          onKeyDown={e => { if (e.key === 'Enter') onRename(thread); }}
        />
      ) : (
        <>
          <span
            className="flex-1 truncate font-medium flex items-center gap-1 cursor-pointer"
            onClick={onClick}
          >
            {thread.title || 'Untitled Chat'}
            {pinned && <Pin size={14} className="text-purple-400" />}
            {archived && <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-archive text-purple-400" viewBox="0 0 24 24"><rect width="20" height="5" x="2" y="3" rx="2"/><path d="M4 8v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M10 12h4"/></svg>}
          </span>
          <div className="relative">
            <button
              className="ml-2 p-1 rounded hover:bg-purple-200"
              onClick={e => { e.stopPropagation(); setMenuOpen(thread.id === menuOpen ? null : thread.id); }}
            >
              <MoreVertical size={16} />
            </button>
            {menuOpen === thread.id && (
              <SidebarChatContextMenu
                pinned={pinned}
                onPin={() => onPin(thread, !pinned)}
                onRename={() => { setRenamingId(thread.id); setRenameValue(thread.title); }}
                onClone={() => onClone(thread)}
                onDownload={() => onDownload(thread)}
                onArchive={() => onArchive(thread)}
                onDelete={() => onDelete(thread)}
                tags={tags}
                tagInput={tagInput}
                setTagInput={setTagInput}
                onAddTag={() => {
                  if (tagInput.trim() && !tags.includes(tagInput.trim())) {
                    const newTags = [...tags, tagInput.trim()];
                    setTags(newTags);
                    onUpdateTags(thread, newTags);
                    setTagInput('');
                  }
                }}
                onTagInputKeyDown={e => {
                  if (e.key === 'Enter' && tagInput.trim() && !tags.includes(tagInput.trim())) {
                    const newTags = [...tags, tagInput.trim()];
                    setTags(newTags);
                    onUpdateTags(thread, newTags);
                    setTagInput('');
                  }
                }}
                onRemoveTag={tag => {
                  const newTags = tags.filter((t: string) => t !== tag);
                  setTags(newTags);
                  onUpdateTags(thread, newTags);
                }}
                className="absolute right-0 top-8 z-[9999]"
              />
            )}
          </div>
        </>
      )}
    </li>
  );
} 