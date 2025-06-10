import Button from '../UI/Button';
import { Settings } from 'lucide-react';
import { useTheme } from '../../theme/ThemeProvider';

export default function SidebarSettingsButton({ onClick }: { onClick?: () => void }) {
  const { theme } = useTheme();
  return (
    <Button
      className="w-full flex items-center gap-2 justify-center text-base font-semibold"
      style={{ background: theme.buttonGlass, color: theme.buttonText, borderColor: theme.buttonBorder }}
      onClick={onClick}
    >
      <Settings /> Settings
    </Button>
  );
} 