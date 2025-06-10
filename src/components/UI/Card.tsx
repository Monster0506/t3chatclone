import { ReactNode, useContext, CSSProperties, forwardRef } from 'react';
import { ThemeContext } from '../../theme/ThemeProvider';

const Card = forwardRef<HTMLDivElement, { children: ReactNode; className?: string; style?: CSSProperties }>(
  ({ children, className = '', style }, ref) => {
    const { theme } = useContext(ThemeContext);
    return (
      <div
        ref={ref}
        className={`glass shadow-lg p-6 rounded-2xl ${className}`}
        style={{ background: theme.glass, borderColor: theme.buttonBorder, ...style }}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';
export default Card; 