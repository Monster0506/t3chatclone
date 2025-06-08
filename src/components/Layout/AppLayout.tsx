'use client';
import Sidebar from '../Sidebar/Sidebar';
import ChatContainer from '../Chat/ChatContainer';
import { useSession } from '@supabase/auth-helpers-react';
import LoginModal from '../Auth/LoginModal';
import { useState } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const session = useSession();

  return (
    <div className="flex h-screen w-screen bg-pink-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <ChatContainer />
        {children}
      </main>
      {!session && <LoginModal open={true} />}
    </div>
  );
} 