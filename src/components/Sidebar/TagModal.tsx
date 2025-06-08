import React, { useState, useRef, useEffect } from 'react';

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
  let style: React.CSSProperties = { position: 'absolute', zIndex: 1000 };
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
      <div ref={modalRef} style={style} className="bg-white rounded-lg p-4 w-64 shadow-lg border border-purple-100">
        <h2 className="text-base font-bold mb-2">Manage Tags</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map(tag => (
            <span key={tag} className="bg-purple-100 text-purple-700 px-2 py-1 rounded flex items-center">
              {tag}
              <button onClick={() => onSave(tags.filter(t => t !== tag))} className="ml-1 text-red-500">×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
            placeholder="Add a tag"
            className="flex-1 border border-purple-200 rounded px-2 py-1"
            onKeyDown={e => { if (e.key === 'Enter') { if (newTag && !tags.includes(newTag)) { onSave([...tags, newTag]); setNewTag(''); } } }}
          />
          <button onClick={() => { if (newTag && !tags.includes(newTag)) { onSave([...tags, newTag]); setNewTag(''); } }} className="bg-purple-600 text-white px-3 py-1 rounded">Add</button>
        </div>
      </div>
    </>
  );
} 