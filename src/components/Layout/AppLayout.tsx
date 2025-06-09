'use client';
import Sidebar from '../Sidebar/Sidebar';
import { useSession } from '@supabase/auth-helpers-react';
import LoginModal from '../Auth/LoginModal';
import { ReactNode } from 'react';

export default function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = useSession();

  return (
    <div className="flex h-screen w-screen bg-pink-50">
      <div className="w-72 flex-shrink-0">
        <Sidebar />
      </div>
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      {!session && <LoginModal open={true} />}
    </div>
  );
} 