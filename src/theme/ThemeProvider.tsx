'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = {
  name: string;
  buttonBg: string;
  buttonText: string;
  buttonHover: string;
  buttonGlass: string;
  buttonBorder: string;
  inputBg: string;
  inputText: string;
  inputFocus: string;
  inputGlass: string;
  inputBorder: string;
  background: string;
  foreground: string;
  glass: string;
};

const themes: Theme[] = [
  {
    name: 'Lite',
    buttonBg: 'bg-gradient-to-r from-pink-400 to-purple-400',
    buttonText: 'text-black',
    buttonHover: 'hover:from-pink-500 hover:to-purple-500',
    buttonGlass: 'rgba(255,255,255,0.7)',
    buttonBorder: 'rgba(200,150,255,0.3)',
    inputBg: 'bg-white',
    inputText: 'text-purple-900',
    inputFocus: 'focus:ring-pink-400',
    inputGlass: 'rgba(255,255,255,0.6)',
    inputBorder: 'rgba(200,150,255,0.3)',
    background: 'linear-gradient(135deg, #f8fafc 0%, #fbeffb 100%)',
    foreground: '#2d0036',
    glass: 'rgba(255,255,255,0.5)',
  },
  {
    name: 'Midnite',
    buttonBg: 'bg-gradient-to-r from-gray-900 to-purple-900',
    buttonText: 'text-white',
    buttonHover: 'hover:from-gray-800 hover:to-purple-800',
    buttonGlass: 'rgba(30,20,60,0.7)',
    buttonBorder: 'rgba(100,80,200,0.3)',
    inputBg: 'bg-gray-900',
    inputText: 'text-purple-100',
    inputFocus: 'focus:ring-purple-700',
    inputGlass: 'rgba(30,20,60,0.6)',
    inputBorder: 'rgba(100,80,200,0.3)',
    background: 'linear-gradient(135deg, #18122b 0%, #2d0036 100%)',
    foreground: '#fbeffb',
    glass: 'rgba(30,20,60,0.5)',
  },
  {
    name: 'Aurora',
    buttonBg: 'bg-gradient-to-r from-green-400 to-blue-400',
    buttonText: 'text-blue-900',
    buttonHover: 'hover:from-green-500 hover:to-blue-500',
    buttonGlass: 'rgba(200,255,255,0.7)',
    buttonBorder: 'rgba(100,255,200,0.3)',
    inputBg: 'bg-blue-50',
    inputText: 'text-blue-900',
    inputFocus: 'focus:ring-green-400',
    inputGlass: 'rgba(200,255,255,0.6)',
    inputBorder: 'rgba(100,255,200,0.3)',
    background: 'linear-gradient(135deg, #e0fff7 0%, #c7d2fe 100%)',
    foreground: '#0a2a2a',
    glass: 'rgba(200,255,255,0.5)',
  },
  {
    name: 'Sakura',
    buttonBg: 'bg-gradient-to-r from-pink-300 to-red-300',
    buttonText: 'text-red-900',
    buttonHover: 'hover:from-pink-400 hover:to-red-400',
    buttonGlass: 'rgba(255,220,230,0.7)',
    buttonBorder: 'rgba(255,150,200,0.3)',
    inputBg: 'bg-pink-50',
    inputText: 'text-red-900',
    inputFocus: 'focus:ring-pink-300',
    inputGlass: 'rgba(255,220,230,0.6)',
    inputBorder: 'rgba(255,150,200,0.3)',
    background: 'linear-gradient(135deg, #fff0f6 0%, #ffe0e9 100%)',
    foreground: '#7a0036',
    glass: 'rgba(255,220,230,0.5)',
  },
  {
    name: 'Neon',
    buttonBg: 'bg-gradient-to-r from-cyan-400 to-fuchsia-400',
    buttonText: 'text-black',
    buttonHover: 'hover:from-cyan-500 hover:to-fuchsia-500',
    buttonGlass: 'rgba(205, 255, 200, 0.8)',
    buttonBorder: 'rgba(255,0,255,0.3)',
    inputBg: 'bg-fuchsia-50',
    inputText: 'text-fuchsia-900',
    inputFocus: 'focus:ring-cyan-400',
    inputGlass: 'rgba(255,200,255,0.6)',
    inputBorder: 'rgba(255,0,255,0.3)',
    background: 'linear-gradient(135deg, #e0fcff 0%, #fbe0ff 100%)',
    foreground: '#1a0036',
    glass: 'rgba(255,200,255,0.5)',
  },
  {
    name: 'Solar',
    buttonBg: 'bg-gradient-to-r from-yellow-400 to-orange-400',
    buttonText: 'text-black',
    buttonHover: 'hover:from-yellow-500 hover:to-orange-500',
    buttonGlass: 'rgba(255,240,200,0.7)',
    buttonBorder: 'rgba(255,200,100,0.3)',
    inputBg: 'bg-yellow-50',
    inputText: 'text-orange-900',
    inputFocus: 'focus:ring-yellow-400',
    inputGlass: 'rgba(255,240,200,0.6)',
    inputBorder: 'rgba(255,200,100,0.3)',
    background: 'linear-gradient(135deg, #fffbe0 0%, #ffe0b2 100%)',
    foreground: '#7a3e00',
    glass: 'rgba(255,240,200,0.5)',
  },
  {
    name: 'Forest',
    buttonBg: 'bg-gradient-to-r from-green-700 to-lime-500',
    buttonText: 'text-green-900',
    buttonHover: 'hover:from-green-800 hover:to-lime-600',
    buttonGlass: 'rgba(200,255,200,0.7)',
    buttonBorder: 'rgba(100,255,100,0.3)',
    inputBg: 'bg-lime-50',
    inputText: 'text-green-900',
    inputFocus: 'focus:ring-green-700',
    inputGlass: 'rgba(200,255,200,0.6)',
    inputBorder: 'rgba(100,255,100,0.3)',
    background: 'linear-gradient(135deg, #e0ffe0 0%, #d0f5c7 100%)',
    foreground: '#00361a',
    glass: 'rgba(200,255,200,0.5)',
  },
  {
    name: 'Oceanic',
    buttonBg: 'bg-gradient-to-r from-blue-700 to-cyan-400',
    buttonText: 'text-black',
    buttonHover: 'hover:from-blue-800 hover:to-cyan-500',
    buttonGlass: 'rgba(200,240,255,0.7)',
    buttonBorder: 'rgba(100,200,255,0.3)',
    inputBg: 'bg-cyan-50',
    inputText: 'text-blue-900',
    inputFocus: 'focus:ring-blue-700',
    inputGlass: 'rgba(200,240,255,0.6)',
    inputBorder: 'rgba(100,200,255,0.3)',
    background: 'linear-gradient(135deg, #e0f7ff 0%, #c7eaff 100%)',
    foreground: '#002d36',
    glass: 'rgba(200,240,255,0.5)',
  },
  {
    name: 'Retro',
    buttonBg: 'bg-gradient-to-r from-orange-400 to-pink-400',
    buttonText: 'text-black',
    buttonHover: 'hover:from-orange-500 hover:to-pink-500',
    buttonGlass: 'rgba(255,220,180,0.7)',
    buttonBorder: 'rgba(255,150,100,0.3)',
    inputBg: 'bg-orange-50',
    inputText: 'text-pink-900',
    inputFocus: 'focus:ring-orange-400',
    inputGlass: 'rgba(255,220,180,0.6)',
    inputBorder: 'rgba(255,150,100,0.3)',
    background: 'linear-gradient(135deg, #fff0e0 0%, #ffe0f0 100%)',
    foreground: '#7a0036',
    glass: 'rgba(255,220,180,0.5)',
  },
  {
    name: 'Terminal',
    buttonBg: 'bg-gradient-to-r from-black to-gray-800',
    buttonText: 'text-green-400',
    buttonHover: 'hover:from-gray-900 hover:to-black',
    buttonGlass: 'rgba(20,30,20,0.8)',
    buttonBorder: 'rgba(0,255,100,0.3)',
    inputBg: 'bg-black',
    inputText: 'text-green-400',
    inputFocus: 'focus:ring-green-400',
    inputGlass: 'rgba(20,30,20,0.7)',
    inputBorder: 'rgba(0,255,100,0.3)',
    background: 'linear-gradient(135deg, #181818 0%, #232323 100%)',
    foreground: '#00ff64',
    glass: 'rgba(20,30,20,0.5)',
  },
];

export const ThemeContext = createContext({
  theme: themes[0],
  setTheme: (name: string) => {},
  themes,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<string>(themes[0].name);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    if (stored) setThemeName(stored);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem('theme', themeName);
  }, [themeName, mounted]);

  const theme = themes.find(t => t.name === themeName) || themes[0];

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeName, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
} 