import React, { RefObject } from 'react';
import { Pin, Edit2, Trash2, Link as LinkIcon, Globe } from 'lucide-react';
import { useTheme } from '@/theme/ThemeProvider';
import Card from '@/components/UI/Card';

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
  isPublic: boolean;
  onTogglePublic: () => void;
  chatId: string;
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
  onTagInputKeyDown,
  onRemoveTag,
  isPublic,
  onTogglePublic,
  chatId,
}: SidebarChatContextMenuProps) {
  const { theme } = useTheme();
  const [copied, setCopied] = React.useState(false);
  const handleShare = async () => {
    if (!isPublic) {
      await onTogglePublic();
    }
    const url = `${window.location.origin}/share/${chatId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <Card
      ref={menuRef}
      className="absolute right-0 top-8 w-56 z-50 flex flex-col p-2"
      style={{
        background: theme.glass,
        borderColor: theme.buttonBorder,
        boxShadow: '0 8px 32px 0 rgba(31,38,135,0.15)',
        minWidth: 220,
      }}
    >
      <div className="flex flex-col gap-1">
        {pinned ? (
          <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition hover:opacity-80" style={{ color: theme.buttonText }} onClick={onPin}><Pin size={16} /> Unpin</button>
        ) : (
          <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition hover:opacity-80" style={{ color: theme.buttonText }} onClick={onPin}><Pin size={16} /> Pin</button>
        )}
        <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition hover:opacity-80" style={{ color: theme.buttonText }} onClick={onRename}><Edit2 size={16} /> Rename</button>
        <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition hover:opacity-80" style={{ color: theme.buttonText }} onClick={onClone}><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy" viewBox="0 0 24 24"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg> Clone</button>
        <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition hover:opacity-80" style={{ color: theme.buttonText }} onClick={onDownload}><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg> Download</button>
        <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition hover:opacity-80" style={{ color: theme.buttonText }} onClick={onArchive}><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-archive" viewBox="0 0 24 24"><rect width="20" height="5" x="2" y="3" rx="2"/><path d="M4 8v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M10 12h4"/></svg> Archive</button>
        <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition hover:opacity-80" style={{ color: theme.buttonText }} onClick={handleShare}>
          <LinkIcon size={16} /> Share
          {copied && <span className="ml-2 text-xs" style={{ color: theme.inputText }}>Copied!</span>}
        </button>
        <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition hover:opacity-80" style={{ color: '#e53935' }} onClick={onDelete}><Trash2 size={16} /> Delete</button>
      </div>
      <div className="border-t mt-2 pt-2 px-2 pb-2 flex flex-wrap gap-2 items-center" style={{ borderColor: theme.buttonBorder }}>
        {tags.map((tag: string) => (
          <span
            key={tag}
            className="text-xs font-bold px-2 py-1 rounded-full cursor-pointer shadow"
            style={{ background: theme.inputGlass, color: theme.inputText }}
            onClick={() => onRemoveTag(tag)}
          >
            {tag}
          </span>
        ))}
        <input
          className="text-xs border rounded px-2 py-1 w-20 focus:outline-none font-semibold"
          style={{ background: theme.inputGlass, color: theme.inputText, borderColor: theme.buttonBorder }}
          type="text"
          value={tagInput}
          placeholder="+ tag"
          onChange={e => setTagInput(e.target.value)}
          onKeyDown={onTagInputKeyDown}
        />
      </div>
    </Card>
  );
} 