import { ReactNode, useContext, CSSProperties, MouseEventHandler } from 'react';
import { ThemeContext } from '../../theme/ThemeProvider';

export default function Badge({ children, className = '', style, onClick }: { children: ReactNode; className?: string; style?: CSSProperties; onClick?: MouseEventHandler<HTMLSpanElement> }) {
  const { theme } = useContext(ThemeContext);
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold shadow ${theme.buttonBg} ${theme.buttonText} ${className}`}
      style={{ background: theme.buttonGlass, color: theme.foreground, ...style }}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(e as any); } : undefined}
      aria-pressed={undefined}
    >
      {children}
    </span>
  );
} 