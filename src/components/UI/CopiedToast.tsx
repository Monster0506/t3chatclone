import React from 'react';

export default function CopiedToast({ show }: { show: boolean }) {
  return (
    <div
      className={`fixed left-1/2 bottom-10 z-50 transform -translate-x-1/2 transition-opacity duration-300 pointer-events-none ${show ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="bg-purple-600 text-white px-6 py-3 rounded-full shadow-lg text-lg font-semibold">
        Copied!
      </div>
    </div>
  );
} 