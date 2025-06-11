import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { Keyboard } from 'lucide-react';

export default function KeyboardShortcutsButton({ onClick, size = 40 }: { onClick: () => void; size?: number }) {
  const { theme } = useTheme();
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
        {/* <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block align-middle"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h.01M10 14h.01M14 14h.01M18 14h.01"/></svg> */}
        {/* <span className="text-xl font-bold">?</span> */}
      </span>
      <span className="absolute left-1/2 -bottom-2 -translate-x-1/2 translate-y-full bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none transition" style={{zIndex:99}}>Show keyboard shortcuts</span>
    </button>
  );
} 