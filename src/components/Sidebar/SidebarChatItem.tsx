import { useRef, useState, useEffect, RefObject } from 'react';
import { MoreVertical, Pin, Trash2, Edit2, Globe } from 'lucide-react';
import type { Tables } from '@/lib/supabase/types';
import SidebarChatContextMenu from './SidebarChatContextMenu';
import { useTheme } from '@/theme/ThemeProvider';


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
  collapsed,
  isPublic,
  onTogglePublic,
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
  collapsed?: boolean;
  isPublic: boolean;
  onTogglePublic: () => void;
}) {
  const { theme } = useTheme();
  const initialTags = getTags(thread.metadata);
  const [tags, setTags] = useState<string[]>(initialTags);
  useEffect(() => {
    setTags(initialTags);
  }, [JSON.stringify(initialTags)]);
  const [tagInput, setTagInput] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  return (
    <li
      className={`group flex items-center px-4 py-2 transition-colors duration-150 cursor-pointer select-none rounded-xl mb-1`}
      style={{ background: isActive ? theme.buttonGlass : 'transparent', color: theme.foreground, border: isActive ? `2px solid ${theme.buttonBorder}` : 'none' }}
    >
      {renamingId === thread.id ? (
        <input
          ref={inputRef}
          className={`flex-1 bg-transparent border border-${theme.buttonBorder} rounded px-2 py-1 text-${theme.foreground} text-sm`}
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
            {archived && <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-archive text-purple-400" viewBox="0 0 24 24"><rect width="20" height="5" x="2" y="3" rx="2" /><path d="M4 8v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M10 12h4" /></svg>}
            {thread.public && (
              <span title="Public chat" className="ml-1 text-blue-500"><Globe size={14} /></span>
            )}
          </span>
          {collapsed && thread.public && (
            <span title="Public chat" className="ml-2 text-blue-500"><Globe size={16} /></span>
          )}
          <div className="relative">
            <button
              className={`ml-2 p-1 rounded hover:bg-${theme.buttonBorder}`}
              onClick={e => { e.stopPropagation(); setMenuOpen(thread.id === menuOpen ? null : thread.id); }}
            >
              <MoreVertical size={16} />
            </button>
            {menuOpen === thread.id && (
              <SidebarChatContextMenu
                chatId={thread.id}
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
                menuRef={menuRef}
                isPublic={isPublic}
                onTogglePublic={onTogglePublic}
              />
            )}
          </div>
        </>
      )}
    </li>
  );
} 