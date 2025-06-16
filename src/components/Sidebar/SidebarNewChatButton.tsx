import Button from '@/components/UI/Button';
import { useTheme } from '@/theme/ThemeProvider';
import { Plus } from 'lucide-react';

export default function SidebarNewChatButton({
  collapsed,
  onClick,
}: {
  collapsed?: boolean;
  onClick?: () => void;
}) {
  const { theme } = useTheme();

  if (collapsed) {
    return (
      <div className="flex justify-center">
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full"
          style={{
            background: theme.buttonGlass,
            color: theme.buttonText,
            borderColor: theme.buttonBorder,
          }}
          onClick={onClick}
          aria-label="New Chat"
        >
          <Plus size={24} style={{ color: theme.buttonText }} />
        </button>
      </div>
    );
  }

  return (
    <Button
      className={`w-full flex items-center gap-2 justify-center text-base font-semibold`}
      style={{
        background: theme.buttonGlass,
        color: theme.buttonText,
        borderColor: theme.buttonBorder,
      }}
      onClick={onClick}
    >
      <Plus size={24} />
      New Chat
    </Button>
  );
}