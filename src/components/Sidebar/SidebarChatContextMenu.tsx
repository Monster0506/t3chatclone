import React, { RefObject } from 'react';
import { Pin, Edit2, Trash2 } from 'lucide-react';

interface SidebarChatContextMenuProps {
  menuRef: RefObject<HTMLDivElement | null>;
  pinned: boolean;
  onPin: () => void;
  onRename: () => void;
  onClone: () => void;
  onDownload: () => void;
  onArchive: () => void;
  onDelete: () => void;
  tags: string[];
  tagInput: string;
  setTagInput: (v: string) => void;
  onAddTag: () => void;
  onTagInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onRemoveTag: (tag: string) => void;
}

export default function SidebarChatContextMenu({
  menuRef,
  pinned,
  onPin,
  onRename,
  onClone,
  onDownload,
  onArchive,
  onDelete,
  tags,
  tagInput,
  setTagInput,
  onAddTag,
  onTagInputKeyDown,
  onRemoveTag,
}: SidebarChatContextMenuProps) {
  return (
    <div ref={menuRef} className="absolute right-0 top-8 w-48 bg-white rounded shadow-lg border border-purple-100 z-50 flex flex-col">
      {pinned ? (
        <button className="w-full flex items-center gap-2 px-4 py-2 text-purple-700 hover:bg-purple-50" onClick={onPin}> <Pin size={16} /> Unpin</button>
      ) : (
        <button className="w-full flex items-center gap-2 px-4 py-2 text-purple-700 hover:bg-purple-50" onClick={onPin}> <Pin size={16} /> Pin</button>
      )}
      <button className="w-full flex items-center gap-2 px-4 py-2 text-purple-700 hover:bg-purple-50" onClick={onRename}> <Edit2 size={16} /> Rename</button>
      <button className="w-full flex items-center gap-2 px-4 py-2 text-purple-700 hover:bg-purple-50" onClick={onClone}> <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy" viewBox="0 0 24 24"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg> Clone</button>
      <button className="w-full flex items-center gap-2 px-4 py-2 text-purple-700 hover:bg-purple-50" onClick={onDownload}> <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg> Download</button>
      <button className="w-full flex items-center gap-2 px-4 py-2 text-purple-700 hover:bg-purple-50" onClick={onArchive}> <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-archive" viewBox="0 0 24 24"><rect width="20" height="5" x="2" y="3" rx="2"/><path d="M4 8v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M10 12h4"/></svg> Archive</button>
      <button className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50" onClick={onDelete}> <Trash2 size={16} /> Delete</button>
      <div className="border-t border-purple-100 mt-2 pt-2 px-2 pb-2 flex flex-wrap gap-2 items-center">
        {tags.map((tag: string) => (
          <span
            key={tag}
            className="text-xs font-bold bg-purple-600 text-white px-2 py-1 rounded cursor-pointer hover:bg-purple-700 shadow"
            onClick={() => onRemoveTag(tag)}
          >
            {tag}
          </span>
        ))}
        <input
          className="text-xs border border-purple-300 rounded px-2 py-1 w-20 focus:outline-none font-semibold"
          type="text"
          value={tagInput}
          placeholder="+ tag"
          onChange={e => setTagInput(e.target.value)}
          onKeyDown={onTagInputKeyDown}
        />
      </div>
    </div>
  );
} 