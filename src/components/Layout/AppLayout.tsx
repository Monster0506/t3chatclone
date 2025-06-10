'use client';
import Sidebar from '../Sidebar/Sidebar';
import { useSession } from '@supabase/auth-helpers-react';
import LoginModal from '../Auth/LoginModal';
import { ReactNode, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from '../../theme/ThemeProvider';

export default function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = useSession();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();

  // Reset sidebar state when pathname changes
  useEffect(() => {
    setSidebarCollapsed(false);
  }, [pathname]);

  // Sidebar widths
  const sidebarWidth = sidebarCollapsed ? '4rem' : '18rem';

  return (
    <div
      className="flex min-h-screen"
      style={{ background: theme.background, color: theme.foreground }}
    >
      <div
        className="fixed inset-y-0 left-0 flex items-center z-30"
        style={{ width: sidebarWidth }}
      >
        <Sidebar onCollapse={setSidebarCollapsed} collapsed={sidebarCollapsed} />
      </div>
      <main
        className="flex-1 flex flex-col"
        style={{ marginLeft: sidebarWidth }}
      >
        {children}
      </main>
      {!session && <LoginModal open={true} />}
    </div>
  );
} 