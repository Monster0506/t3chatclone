'use client';
import Sidebar from '../Sidebar/Sidebar';
import { useSession } from '@supabase/auth-helpers-react';
import LoginModal from '../Auth/LoginModal';
import { ReactNode, useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/theme/ThemeProvider';
import KeyboardShortcutsModal from '@/components/UI/KeyboardShortcutsModal';
import KeyboardShortcutsButton from '@/components/UI/KeyboardShortcutsButton';
import CopiedToast from '@/components/UI/CopiedToast';

export default function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = useSession();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  // Reset sidebar state when pathname changes
  useEffect(() => {
    setSidebarCollapsed(false);
  }, [pathname]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Only trigger if not in an input or textarea
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return;
      // Ctrl+B: Toggle sidebar
      if (e.ctrlKey && !e.shiftKey && !e.altKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setSidebarCollapsed((c) => !c);
      }
      // Ctrl+K: Focus search
      if (e.ctrlKey && !e.shiftKey && !e.altKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('focus-sidebar-search'));
      }
      // Ctrl+Shift+N: New conversation
      if (e.ctrlKey && e.shiftKey && !e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('new-conversation'));
      }
      // Ctrl+Shift+D: Pin/unpin current conversation
      if (e.ctrlKey && e.shiftKey && !e.altKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('toggle-pin-current-conversation'));
      }
      // Ctrl+?

      if (e.ctrlKey && !e.altKey && e.key.toLowerCase() === '/') {
        e.preventDefault();
        setShortcutsOpen(!shortcutsOpen);
      }
      // Ctrl+C: Copy last message
      if (e.ctrlKey && !e.shiftKey && !e.altKey && e.key.toLowerCase() === 'c') {
        // Only if not in input/textarea
        e.preventDefault();
        // Try to find the last message in the chat
        const chatMessages = document.querySelectorAll('[id^="msg-"]');
        if (chatMessages.length > 0) {
          const lastMsg = chatMessages[chatMessages.length - 1] as HTMLElement;
          // Try to get the text content of the message bubble
          const bubble = lastMsg.querySelector('[class*="rounded-2xl"]');
          const text = bubble ? bubble.textContent : lastMsg.textContent;
          if (text) {
            navigator.clipboard.writeText(text.trim());
            setShowCopied(true);
            setTimeout(() => setShowCopied(false), 1500);
          }
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sidebar widths
  const sidebarWidth = sidebarCollapsed ? '4rem' : '18rem';
  
  return (
    <div
      className="flex min-h-screen"
      style={{ background: theme.background, color: theme.foreground }}
    >
      <div
        className="fixed inset-y-0 left-0 flex items-center z-30"
        style={{ width: sidebarWidth }}
      >
        <Sidebar onCollapse={setSidebarCollapsed} collapsed={sidebarCollapsed} >
          <div className="absolute top-4 right-4 z-50">
            <KeyboardShortcutsButton onClick={() => setShortcutsOpen(true)} />
          </div>
        </Sidebar>
      </div>
      <main
        className="flex-1 flex flex-col"
        style={{ marginLeft: sidebarWidth }}
      >
        {children}
      </main>
      <KeyboardShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      <CopiedToast show={showCopied} />
      {!session && <LoginModal open={true} />}
    </div>
  );
} 