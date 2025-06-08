import { useRef } from 'react';
import { MoreVertical, Pin, Trash2, Edit2 } from 'lucide-react';
import type { Tables } from '@/lib/supabase/types';

function formatTime(ts: string) {
  const date = new Date(ts);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString();
}

export default function SidebarChatItem({
  thread,
  isActive,
  onClick,
  onRename,
  onDelete,
  onPin,
  onArchive,
  renamingId,
  renameValue,
  setRenamingId,
  setRenameValue,
  menuOpen,
  setMenuOpen,
  inputRef,
}: {
  thread: Tables<'chats'>;
  isActive: boolean;
  onClick: () => void;
  onRename: (thread: Tables<'chats'>) => void;
  onDelete: (thread: Tables<'chats'>) => void;
  onPin: (thread: Tables<'chats'>, pinned: boolean) => void;
  onArchive: (thread: Tables<'chats'>) => void;
  renamingId: string | null;
  renameValue: string;
  setRenamingId: (id: string | null) => void;
  setRenameValue: (v: string) => void;
  menuOpen: string | null;
  setMenuOpen: (id: string | null) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}) {
  const isPinned = !!(typeof thread.metadata === 'object' && thread.metadata && (thread.metadata as any).pinned === true);
  return (
    <li
      className={`relative group flex items-center px-2 py-2 cursor-pointer hover:bg-purple-50 transition rounded-lg ${isActive ? 'bg-purple-100' : ''}`}
      onClick={onClick}
      onContextMenu={e => {
        e.preventDefault();
        setMenuOpen(thread.id);
      }}
    >
      {renamingId === thread.id ? (
        <input
          ref={inputRef}
          className="flex-1 bg-white border border-purple-200 rounded px-2 py-1 text-purple-900 text-sm"
          value={renameValue}
          onChange={e => setRenameValue(e.target.value)}
          onBlur={() => setRenamingId(null)}
          onKeyDown={e => { if (e.key === 'Enter') onRename(thread); }}
        />
      ) : (
        <>
          <span className="flex-1 truncate font-medium text-purple-900">{thread.title || 'Untitled Chat'}</span>
          <span className="ml-2 text-xs text-gray-400">{formatTime(thread.updated_at)}</span>
          <button
            className="ml-2 p-1 rounded hover:bg-purple-200"
            onClick={e => { e.stopPropagation(); setMenuOpen(thread.id === menuOpen ? null : thread.id); }}
          >
            <MoreVertical size={16} />
          </button>
          {menuOpen === thread.id && (
            <div className="absolute right-0 top-8 w-40 bg-white rounded shadow-lg border border-purple-100 z-50">
              {isPinned ? (
                <button className="w-full flex items-center gap-2 px-4 py-2 text-purple-700 hover:bg-purple-50" onClick={e => { e.stopPropagation(); onPin(thread, false); }}> <Pin size={16} /> Unpin</button>
              ) : (
                <button className="w-full flex items-center gap-2 px-4 py-2 text-purple-700 hover:bg-purple-50" onClick={e => { e.stopPropagation(); onPin(thread, true); }}> <Pin size={16} /> Pin</button>
              )}
              <button className="w-full flex items-center gap-2 px-4 py-2 text-purple-700 hover:bg-purple-50" onClick={e => { e.stopPropagation(); setRenamingId(thread.id); setRenameValue(thread.title); }}> <Edit2 size={16} /> Rename</button>
              <button className="w-full flex items-center gap-2 px-4 py-2 text-purple-700 hover:bg-purple-50" onClick={e => { e.stopPropagation(); onArchive(thread); }}> <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-archive" viewBox="0 0 24 24"><rect width="20" height="5" x="2" y="3" rx="2"/><path d="M4 8v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M10 12h4"/></svg> Archive</button>
              <button className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50" onClick={e => { e.stopPropagation(); onDelete(thread); }}> <Trash2 size={16} /> Delete</button>
            </div>
          )}
        </>
      )}
    </li>
  );
} 