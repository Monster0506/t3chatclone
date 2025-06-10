import { useTheme } from '../../theme/ThemeProvider';

export default function SidebarHeader({ collapsed }: { collapsed?: boolean }) {
  const { theme } = useTheme();
  return (
    <div className={`flex items-center gap-3 mb-8 justify-center ${collapsed ? 'justify-center' : ''}`}>

      {!collapsed && (
        <span className="text-2xl font-extrabold" style={{ color: theme.foreground }}>T3 Clone</span>
      )}
    </div>
  );
} 