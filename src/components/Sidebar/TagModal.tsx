import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import Card from '../UI/Card';

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  tags: string[];
  onSave: (tags: string[]) => void;
  anchorRef?: React.RefObject<HTMLElement>;
}

export default function TagModal({ isOpen, onClose, tags, onSave, anchorRef }: TagModalProps) {
  const [newTag, setNewTag] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Position the modal near the anchor (context menu)
  let style: React.CSSProperties = { position: 'absolute', zIndex: 1000, minWidth: 260 };
  if (anchorRef && anchorRef.current) {
    const rect = anchorRef.current.getBoundingClientRect();
    style.top = rect.bottom + window.scrollY + 8;
    style.left = rect.left + window.scrollX;
  } else {
    style.top = '50%';
    style.left = '50%';
    style.transform = 'translate(-50%, -50%)';
  }

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-10 z-40" />
      <Card
        ref={modalRef}
        style={{ ...style, background: theme.glass, borderColor: theme.buttonBorder, boxShadow: '0 8px 32px 0 rgba(31,38,135,0.15)' }}
        className="p-5 flex flex-col gap-4 rounded-2xl z-50"
      >
        <h2 className="text-lg font-bold mb-2" style={{ color: theme.foreground }}>Manage Tags</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map(tag => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-sm font-semibold cursor-pointer shadow"
              style={{ background: theme.inputGlass, color: theme.inputText }}
            >
              {tag}
              <button
                onClick={() => onSave(tags.filter(t => t !== tag))}
                className="ml-2 text-base font-bold opacity-60 hover:opacity-100"
                style={{ color: theme.buttonText }}
              >×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
            placeholder="Add a tag"
            className="flex-1 rounded-xl px-3 py-2 border focus:outline-none"
            style={{ background: theme.inputGlass, color: theme.inputText, borderColor: theme.buttonBorder }}
            onKeyDown={e => { if (e.key === 'Enter') { if (newTag && !tags.includes(newTag)) { onSave([...tags, newTag]); setNewTag(''); } } }}
          />
          <button
            onClick={() => { if (newTag && !tags.includes(newTag)) { onSave([...tags, newTag]); setNewTag(''); } }}
            className="px-4 py-2 rounded-xl font-semibold transition shadow"
            style={{ background: theme.buttonGlass, color: theme.buttonText, borderColor: theme.buttonBorder }}
          >Add</button>
        </div>
      </Card>
    </>
  );
} 