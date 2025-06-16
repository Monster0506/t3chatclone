import Card from '@/components/UI/Card';
import { useTheme } from '@/theme/ThemeProvider';
import KeyboardShortcutsButton from '../UI/KeyboardShortcutsButton';

export default function SidebarHeader({ setShortcutsOpen, collapsed }: { setShortcutsOpen: (open: boolean) => void, collapsed: boolean }) {
  const { theme } = useTheme();

  return (
    <div>
      <Card
        className="flex items-center gap-3 px-4 py-3 mb-4 rounded-2xl shadow-lg w-fit"
        style={{ background: theme.glass, borderColor: theme.buttonBorder }}
      >
        <span className="text-xl font-extrabold tracking-tight" style={{ color: theme.buttonText, letterSpacing: '-0.02em' }}>
          T3 Clone
        </span>
        <KeyboardShortcutsButton onClick={() => setShortcutsOpen(true)} size={40} sidebarCollapsed={collapsed} />


      </Card>

    </div>
  );
} 