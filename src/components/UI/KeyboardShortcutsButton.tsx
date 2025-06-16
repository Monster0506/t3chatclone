import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { Keyboard } from 'lucide-react';

export default function KeyboardShortcutsButton({ onClick, size = 40, sidebarCollapsed }: { onClick: () => void; size?: number, sidebarCollapsed: boolean }) {
  const { theme } = useTheme();
  console.log('sidebarCollapsed', sidebarCollapsed);
  if (sidebarCollapsed) {
    console.log('sidebarCollapsed', sidebarCollapsed);
    return (
      <button
        onClick={onClick}
        className="w-10 h-10 flex items-center justify-center rounded-full border-2 transition focus:outline-none"
        style={{ borderColor: theme.buttonBorder, background: theme.buttonGlass, color: theme.foreground }}
      >
        <Keyboard />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center rounded-full shadow-lg transition focus:outline-none focus:ring-2 group relative"
      style={{
        width: size,
        height: size,
        background: theme.buttonBg,
        color: theme.buttonText,
        border: `2px solid ${theme.buttonBorder}`,
      }}
      aria-label="Show keyboard shortcuts"
      type="button"
    >
      <span className="flex items-center gap-1">
        <Keyboard />
      </span>
      <span className="absolute left-1/2 -bottom-2 -translate-x-1/2 translate-y-full bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none transition" style={{zIndex:99}}>Show keyboard shortcuts</span>
    </button>
  );
} 