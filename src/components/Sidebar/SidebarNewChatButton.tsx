import Button from '@/components/UI/Button';
import { useTheme } from '@/theme/ThemeProvider';
import { Plus } from 'lucide-react';

export default function SidebarNewChatButton({ collapsed, onClick }: { collapsed?: boolean; onClick?: () => void }) {
  const { theme } = useTheme();
  return (
    <Button
      className={`w-full flex items-center gap-2 justify-center text-base font-semibold`}
      style={{ background: theme.buttonGlass, color: theme.buttonText, borderColor: theme.buttonBorder }}
      onClick={onClick}
    >
      <Plus size={20} />
      {!collapsed && 'New Chat'}
    </Button>
  );
} 