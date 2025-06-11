import { ReactNode, useContext, useEffect, useRef } from 'react';
import { ThemeContext } from '@/theme/ThemeProvider';

export default function Modal({ open, onClose, children, className = '' }: { open: boolean; onClose: () => void; children: ReactNode; className?: string }) {
  const { theme } = useContext(ThemeContext);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div
        ref={modalRef}
        className={`glass shadow-2xl p-8 rounded-2xl relative ${className}`}
        style={{ background: theme.glass, borderColor: theme.buttonBorder }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-xl opacity-60 hover:opacity-100">×</button>
        {children}
      </div>
    </div>
  );
} 