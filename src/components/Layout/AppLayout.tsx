'use client';
import Sidebar from '../Sidebar/Sidebar';
import { useSession } from '@supabase/auth-helpers-react';
import LoginModal from '../Auth/LoginModal';
import { ReactNode, useState } from 'react';

export default function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = useSession();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-pink-50">
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-72'} flex-shrink-0 transition-all duration-300`}>
        <Sidebar onCollapse={setSidebarCollapsed} collapsed={sidebarCollapsed} />
      </div>
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      {!session && <LoginModal open={true} />}
    </div>
  );
} 