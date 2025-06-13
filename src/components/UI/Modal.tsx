import { ReactNode, useContext, useRef } from 'react';
import { ThemeContext } from '@/theme/ThemeProvider';
import { useCloseModal } from '@/hooks/use-close-modal';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  disableEscape?: boolean;
}

export default function Modal({ 
  open, 
  onClose, 
  children, 
  className = '',
  disableEscape = false 
}: ModalProps) {
  const { theme } = useContext(ThemeContext);
  const modalRef = useRef<HTMLDivElement>(null);

  useCloseModal({
    ref: modalRef,
    isOpen: open,
    onClose,
    disableEscape,
  });

  if (!open) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className={`glass shadow-2xl p-8 rounded-2xl relative ${className}`}
        style={{ background: theme.glass, borderColor: theme.buttonBorder }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          type="button"
          onClick={onClose} 
          className="absolute top-4 right-4 text-xl opacity-60 hover:opacity-100"
          aria-label="Close modal"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}