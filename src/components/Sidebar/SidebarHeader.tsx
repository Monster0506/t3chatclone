import Card from '../UI/Card';
import Avatar from '../UI/Avatar';
import { useTheme } from '../../theme/ThemeProvider';
import { useSession } from '@supabase/auth-helpers-react';

export default function SidebarHeader() {
  const { theme } = useTheme();
  const session = useSession();
  const user = session?.user;
  const avatarUrl = user?.user_metadata?.avatar_url;
  const initials = user?.email ? user.email[0].toUpperCase() : '?';

  return (
    <Card
      className="flex items-center gap-3 px-4 py-3 mb-4 rounded-2xl shadow-lg"
      style={{ background: theme.glass, borderColor: theme.buttonBorder }}
    >
      <span className="text-xl font-extrabold tracking-tight" style={{ color: theme.buttonText, letterSpacing: '-0.02em' }}>
        T3 Clone
      </span>

    </Card>
  );
} 