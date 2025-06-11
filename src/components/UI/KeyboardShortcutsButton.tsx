import React from 'react';

export default function KeyboardShortcutsButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-9 h-9 flex items-center justify-center rounded-full bg-purple-500 text-white shadow-lg hover:bg-purple-600 transition focus:outline-none focus:ring-2 focus:ring-purple-400"
      aria-label="Show keyboard shortcuts"
      type="button"
    >
      <span className="text-xl font-bold">?</span>
    </button>
  );
} 