'use client';
import Sidebar from '../Sidebar/Sidebar';
import { useSession } from '@supabase/auth-helpers-react';
import LoginModal from '../Auth/LoginModal';
import { ReactNode, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { useTheme } from '@/theme/ThemeProvider';
import KeyboardShortcutsModal from '@/components/UI/KeyboardShortcutsModal';
import KeyboardShortcutsButton from '@/components/UI/KeyboardShortcutsButton';
import CopiedToast from '@/components/UI/CopiedToast';
import { PanelLeftClose } from 'lucide-react';

export default function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = useSession();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    setSidebarCollapsed(false);
  }, [pathname]);

  // Set up keyboard shortcuts
  useKeyboardShortcuts({
    'ctrl+b': () => setSidebarCollapsed(c => !c),
    'ctrl+k': () => window.dispatchEvent(new CustomEvent('focus-sidebar-search')),
    'ctrl+shift+n': () => window.dispatchEvent(new CustomEvent('new-conversation')),
    'ctrl+shift+d': () => window.dispatchEvent(new CustomEvent('toggle-pin-current-conversation')),
    'ctrl+/': () => setShortcutsOpen(s => !s),
    'ctrl+c': () => {
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
    'ctrl+y': () => window.dispatchEvent(new CustomEvent('focus-chat-input')),
  });

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
        <Sidebar onCollapse={setSidebarCollapsed} collapsed={sidebarCollapsed} />

        {!sidebarCollapsed && (
          <div className="flex flex-row gap-2 items-center absolute top-4 right-4 z-50">
            <KeyboardShortcutsButton onClick={() => setShortcutsOpen(true)} size={40} />

            <button
              className="w-10 h-10 flex items-center justify-center rounded-full border-2 transition focus:outline-none"
              style={{ borderColor: theme.buttonBorder, background: theme.buttonGlass, color: theme.foreground }}
              onClick={() => setSidebarCollapsed(true)}
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose size={24} />
            </button>
          </div>
        )}
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