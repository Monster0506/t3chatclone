import { useTheme } from '@/theme/ThemeProvider';
import React from 'react';

import Image from 'next/image';
export function WikipediaResult({ title, summary, url, thumbnail }: { title: string; summary: string; url: string; thumbnail?: string | null; }) {
  const { theme } = useTheme();
  return (
    <div
      className="flex flex-col md:flex-row gap-4 rounded-2xl px-6 py-5 my-3 shadow-xl border"
      style={{
        background: theme.inputGlass,
        border: `1.5px solid ${theme.buttonBorder}`,
        boxShadow: '0 8px 32px 0 rgba(31,38,135,0.10)',
        alignItems: 'center',
        maxWidth: 600,
      }}
    >
      <div className="flex flex-col items-center md:items-start md:w-32">
        <Image
          src={thumbnail || 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Wikipedia%27s_W.svg'}
          alt={title}
          className="w-24 h-24 object-cover rounded-lg mb-3 border shadow" />
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full text-center px-4 py-2 rounded-lg text-sm font-semibold shadow bg-white text-blue-700 border border-blue-200 hover:bg-blue-50 transition"
          style={{ textDecoration: 'none', marginTop: 4 }}
        >
          <span className="inline-flex items-center gap-1">
            <Image src="https://en.wikipedia.org/favicon.ico" alt="Wikipedia" className="w-4 h-4" />
            Read on Wikipedia
          </span>
        </a>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Image src="https://en.wikipedia.org/favicon.ico" alt="Wikipedia" className="w-5 h-5" />
          <span className="font-bold text-xl" style={{ color: theme.inputText }}>{title}</span>
        </div>
        <div className="text-base mt-1" style={{ color: theme.inputText }}>
          {summary}
        </div>
      </div>
    </div>
  );
}
