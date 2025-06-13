import { useState, useContext } from 'react';
import { SidebarHeader, SidebarSearch, SidebarThreadList, SidebarNewChatButton } from './index';
import Card from '@/components/UI/Card';
import { useTheme } from '@/theme/ThemeProvider';
import { useSession } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { PanelLeftOpen } from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  children?: React.ReactNode;
}

export default function Sidebar({ collapsed = false, onCollapse, children }: SidebarProps) {
  const [search, setSearch] = useState('');
  const { theme } = useTheme();
  const session = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleNewChat = async () => {
    if (!session?.user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('chats')
      .insert({
        user_id: session.user.id,
        title: 'New Chat',
        model: 'gemini-2.0-flash',
      })
      .select('id')
      .single();
    setLoading(false);
    if (data && data.id) {
      router.replace(`/chat/${data.id}`);
    }
  };

  return (
    <Card
      className={`h-screen flex flex-col justify-between transition-all duration-300 ${collapsed ? 'w-16 p-2' : 'w-72 p-6'}`}
      style={{ background: theme.glass, borderColor: theme.buttonBorder, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}
    >
      {children}
      {collapsed ? (
        <div className="flex flex-col items-center justify-center mt-4 mb-6">
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full border-2 transition focus:outline-none"
            style={{ borderColor: theme.buttonBorder, background: theme.buttonGlass, color: theme.foreground }}
            onClick={() => onCollapse?.(false)}
            aria-label="Expand sidebar"
          >
            <PanelLeftOpen size={26} />
          </button>
        </div>
      ) : (
        <div className="mb-6 px-2">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <SidebarHeader />
            </div>
          </div>
          {!collapsed && (
            <div className="pt-2">
              <SidebarSearch value={search} onChange={e => setSearch(e.target.value)}  />
            </div>
          )}
        </div>
      )}
      <SidebarThreadList search={search} collapsed={collapsed} />
      <div className="mt-4">
        <SidebarNewChatButton collapsed={collapsed} onClick={handleNewChat} />
      </div>
    </Card>
  );
} 