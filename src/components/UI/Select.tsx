import { useTheme } from '@/theme/ThemeProvider';

export default function Select({ className = '', style = {}, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { theme } = useTheme();
  return (
    <select
      className={`rounded-xl px-3 py-2 border text-base shadow transition-colors ${className}`}
      style={{
        background: theme.inputGlass,
        color: theme.inputText,
        borderColor: theme.buttonBorder,
        ...style,
      }}
      {...props}
    />
  );
} 