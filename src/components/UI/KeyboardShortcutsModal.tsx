import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';

const SHORTCUTS = [
  {
    group: 'Navigation',
    items: [
      { label: 'Toggle sidebar', keys: ['Ctrl', 'B'] },
      { label: 'Search conversations', keys: ['Ctrl', 'K'] },
      { label: 'New conversation', keys: ['Ctrl', 'Shift', 'N'] },
      { label: 'Show keyboard shortcuts', keys: ['Ctrl', '?'] },
    ],
  },
  {
    group: 'Conversation',
    items: [
      { label: 'Send message', keys: ['Enter'] },
      { label: 'New line', keys: ['Shift', 'Enter'] },
      { label: 'Clear input', keys: ['Ctrl', 'Backspace'] },
    ],
  },
  {
    group: 'Messages',
    items: [
      { label: 'Pin/unpin current conversation', keys: ['Ctrl', 'Shift', 'D'] },
      { label: 'Copy last message', keys: ['Ctrl', 'C'] },
    ],
  },
];

export default function KeyboardShortcutsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { theme } = useTheme();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div
        className="relative rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4"
        style={{
          background: theme.glass,
          border: `2px solid ${theme.buttonBorder}`,
          color: theme.buttonText,
        }}
      >
        <button
          className="absolute top-4 right-4 text-2xl opacity-60 hover:opacity-100"
          onClick={onClose}
          aria-label="Close"
          style={{ color: theme.buttonText }}
        >
          ×
        </button>
        <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: theme.buttonText }}>Keyboard Shortcuts</h2>
        <div className="space-y-6">
          {SHORTCUTS.map(group => (
            <div key={group.group}>
              <h3 className="text-lg font-semibold mb-2" style={{ color: theme.buttonBg }}>{group.group}</h3>
              <ul className="space-y-2">
                {group.items.map(item => (
                  <li key={item.label} className="flex items-center justify-between">
                    <span style={{ color: theme.inputText }}>{item.label}</span>
                    <span className="flex gap-1">
                      {item.keys.map((k, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded text-sm font-mono border"
                          style={{
                            background: theme.buttonGlass,
                            color: theme.buttonText,
                            borderColor: theme.buttonBorder,
                          }}
                        >
                          {k}
                        </span>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 