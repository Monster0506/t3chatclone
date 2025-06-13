import { useState, useEffect, useCallback } from 'react';

type ShortcutHandler = (e: KeyboardEvent) => void;

export function useKeyboardShortcuts(shortcuts: Record<string, ShortcutHandler>) {
  const [isEnabled, setIsEnabled] = useState(true);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isEnabled) return;
    
    const tag = (e.target as HTMLElement)?.tagName;
    // Skip if typing in an input, textarea, or contenteditable
    if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) {
      return;
    }

    // Generate a key identifier from the event
    const key = e.key.toLowerCase();
    const keyCombination = [
      e.ctrlKey ? 'ctrl' : '',
      e.shiftKey ? 'shift' : '',
      e.altKey ? 'alt' : '',
      key
    ].filter(Boolean).join('+');

    // Find and execute the matching shortcut handler
    for (const [shortcut, handler] of Object.entries(shortcuts)) {
      if (keyCombination === shortcut.toLowerCase()) {
        e.preventDefault();
        handler(e);
        break;
      }
    }
  }, [isEnabled, shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    isEnabled,
    setEnabled: setIsEnabled,
  };
}

// Predefined shortcut handlers
export const shortcutHandlers = {
  // Toggle sidebar (Ctrl+B)
  toggleSidebar: (setSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void) => 
    (_e: KeyboardEvent) => setSidebarCollapsed(c => !c),
  
  // Focus search (Ctrl+K)
  focusSearch: () => {
    window.dispatchEvent(new CustomEvent('focus-sidebar-search'));
  },
  
  // New conversation (Ctrl+Shift+N)
  newConversation: () => {
    window.dispatchEvent(new CustomEvent('new-conversation'));
  },
  
  // Toggle pin current conversation (Ctrl+Shift+D)
  togglePinCurrentConversation: () => {
    window.dispatchEvent(new CustomEvent('toggle-pin-current-conversation'));
  },
  
  // Toggle shortcuts modal (Ctrl+/ or Ctrl+?)
  toggleShortcutsModal: (setShortcutsOpen: (open: boolean) => void, isOpen: boolean) => {
    setShortcutsOpen(!isOpen);
  },
  
  // Copy last message (Ctrl+C)
  copyLastMessage: (setShowCopied: (show: boolean) => void) => {
    const chatMessages = document.querySelectorAll('[id^="msg-"]');
    if (chatMessages.length > 0) {
      const lastMsg = chatMessages[chatMessages.length - 1] as HTMLElement;
      const bubble = lastMsg.querySelector('[class*="rounded-2xl"]');
      const text = bubble ? bubble.textContent : lastMsg.textContent;
      if (text) {
        navigator.clipboard.writeText(text.trim());
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 1500);
      }
    }
  },
  
  // Focus chat input (Ctrl+Y)
  focusChatInput: () => {
    window.dispatchEvent(new CustomEvent('focus-chat-input'));
  }
} as const;
