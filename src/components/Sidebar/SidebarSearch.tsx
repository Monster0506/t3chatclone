import Input from '../UI/Input';
import { Search } from 'lucide-react';
import { useTheme } from '../../theme/ThemeProvider';

export default function SidebarSearch({ value, onChange }: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  const { theme } = useTheme();
  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-lg opacity-60" style={{ color: theme.inputText }} size={18} />
      <Input
        value={value}
        onChange={onChange}
        placeholder="Search chats..."
        className="w-full pl-10 pr-3 py-2 rounded-xl text-base shadow"
        style={{ background: theme.inputGlass, color: theme.inputText, borderColor: theme.buttonBorder }}
      />
    </div>
  );
} 