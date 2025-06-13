import { useContext } from 'react';
import { ThemeContext } from '@/theme/ThemeProvider';
import Image from 'next/image';
export default function Avatar({ src, alt, initials, className = '' }: { src?: string; alt?: string; initials?: string; className?: string }) {
  const { theme } = useContext(ThemeContext);
  return src ? (
    <Image
      src={src}
      alt={alt || 'Avatar'}
      className={`w-10 h-10 rounded-full object-cover border-2 ${className}`}
      style={{ borderColor: theme.buttonBorder, background: theme.glass }}
    />
  ) : (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${className}`}
      style={{ borderColor: theme.buttonBorder, background: theme.glass, color: theme.foreground }}
    >
      {initials || '?'}
    </div>
  );
} 