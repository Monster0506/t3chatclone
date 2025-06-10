import { SelectHTMLAttributes, useContext } from 'react';
import { ThemeContext } from '../../theme/ThemeProvider';

export default function Select({ className = '', ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  const { theme } = useContext(ThemeContext);
  return (
    <select
      className={`px-3 py-2 rounded-xl border transition shadow-sm backdrop-blur-md focus:outline-none focus:ring-2 ${theme.inputBg} ${theme.inputText} ${theme.inputFocus} ${className}`}
      style={{ background: theme.inputGlass, borderColor: theme.inputBorder }}
      {...props}
    />
  );
} 