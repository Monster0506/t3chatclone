import Input from '../UI/Input';
import { useTheme } from '../../theme/ThemeProvider';

export default function SidebarSearch({ value, onChange, collapsed }: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; collapsed?: boolean }) {
  const { theme } = useTheme();
  if (collapsed) return null;
  return (
    <Input
      value={value}
      onChange={onChange}
      placeholder="Search chats..."
      className="w-full"
      style={{ background: theme.inputGlass, color: theme.inputText, borderColor: theme.inputBorder }}
    />
  );
} 