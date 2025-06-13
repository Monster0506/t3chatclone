import { RefObject, useEffect } from 'react';

interface UseCloseModalProps<T extends HTMLElement = HTMLElement> {
  ref: RefObject<T>;
  isOpen: boolean;
  onClose: () => void;
  excludeRefs?: RefObject<HTMLElement>[];
  disableEscape?: boolean;
}

export function useCloseModal<T extends HTMLElement = HTMLElement>({
  ref,
  isOpen,
  onClose,
  excludeRefs = [],
  disableEscape = false,
}: UseCloseModalProps<T>) {
  // Handle click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleEvent = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      
      // Don't close if clicking on the ref element or its children
      if (ref.current && !ref.current.contains(target)) {
        // Check if the click was on an excluded ref
        const clickedOnExcluded = excludeRefs.some(
          excludeRef => excludeRef.current?.contains(target)
        );
        
        if (!clickedOnExcluded) {
          onClose();
        }
      }
    };

    // Use capture phase to ensure we catch the event before it bubbles up
    document.addEventListener('mousedown', handleEvent as EventListener, true);
    document.addEventListener('touchstart', handleEvent as EventListener, true);
    
    return () => {
      document.removeEventListener('mousedown', handleEvent as EventListener, true);
      document.removeEventListener('touchstart', handleEvent as EventListener, true);
    };
  }, [isOpen, onClose, ref, excludeRefs]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen || disableEscape) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, disableEscape]);
}
