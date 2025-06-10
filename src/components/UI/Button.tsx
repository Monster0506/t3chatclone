import { ButtonHTMLAttributes, useContext } from 'react';
import { ThemeContext } from '../../theme/ThemeProvider';

export default function Button({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { theme } = useContext(ThemeContext);
  return (
    <button
      className={`px-4 py-2 rounded-xl font-medium transition shadow-lg backdrop-blur-md border border-transparent focus:outline-none focus:ring-2 ${theme.buttonBg} ${theme.buttonText} ${theme.buttonHover} ${className}`}
      style={{ background: theme.buttonGlass, borderColor: theme.buttonBorder, color: theme.buttonText }}
      {...props}
    />
  );
} 