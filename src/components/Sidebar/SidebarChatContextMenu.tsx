import React, { RefObject } from 'react';
import { Pin, Edit2, Trash2, Link as LinkIcon, Archive, Copy, Download } from 'lucide-react';
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
  isArchived: boolean;
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
  isArchived,
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
        <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition hover:opacity-80" style={{ color: theme.buttonText }} onClick={onClone}><Copy size={16} /> Clone</button>
        <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition hover:opacity-80" style={{ color: theme.buttonText }} onClick={onDownload}><Download size={16} /> Download</button>
        {isArchived ? (
          <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition hover:opacity-80" style={{ color: theme.buttonText }} onClick={onArchive}><Archive size={16} /> Unarchive</button>
        ) : (
          <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition hover:opacity-80" style={{ color: theme.buttonText }} onClick={onArchive}><Archive size={16} /> Archive</button>
        )}
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