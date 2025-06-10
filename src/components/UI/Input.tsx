import { InputHTMLAttributes, useContext } from 'react';
import { ThemeContext } from '@/theme/ThemeProvider';

export default function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const { theme } = useContext(ThemeContext);
  return (
    <input
      className={`px-3 py-2 rounded-xl border transition shadow-sm backdrop-blur-md focus:outline-none focus:ring-2 ${theme.inputBg} ${theme.inputText} ${theme.inputFocus} ${className}`}
      style={{ background: theme.inputGlass, borderColor: theme.inputBorder }}
      {...props}
    />
  );
} 