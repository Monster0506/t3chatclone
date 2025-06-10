import { useContext } from 'react';
import { ThemeContext } from '@/theme/ThemeProvider';

export default function Toggle({ checked, onChange, className = '' }: { checked: boolean; onChange: (v: boolean) => void; className?: string }) {
  const { theme } = useContext(ThemeContext);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`w-12 h-7 rounded-full flex items-center transition px-1 ${checked ? theme.buttonBg : 'bg-gray-300'} ${className}`}
      style={{ background: checked ? theme.buttonGlass : 'rgba(200,200,200,0.5)', borderColor: theme.buttonBorder }}
    >
      <span
        className={`block w-5 h-5 rounded-full shadow-md transform transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'} ${checked ? theme.buttonText : 'bg-white'}`}
        style={{ background: checked ? theme.buttonText : '#fff' }}
      />
    </button>
  );
} 