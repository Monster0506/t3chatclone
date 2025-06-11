import { InputHTMLAttributes, useContext, forwardRef } from 'react';
import { ThemeContext } from '@/theme/ThemeProvider';

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => {
    const { theme } = useContext(ThemeContext);
    return (
      <input
        ref={ref}
        className={`px-3 py-2 rounded-xl border transition shadow-sm backdrop-blur-md focus:outline-none focus:ring-2 ${theme.inputBg} ${theme.inputText} ${theme.inputFocus} ${className}`}
        style={{ background: theme.inputGlass, borderColor: theme.inputBorder }}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
export default Input; 