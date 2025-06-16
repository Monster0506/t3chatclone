'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, useSessionContext } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase/client';

export default function Page() {
  const session = useSession();
  const { isLoading } = useSessionContext();
  const router = useRouter();

  useEffect(() => {
    const createChat = async () => {
      if (!session?.user) return;
      const { data } = await supabase
        .from('chats')
        .insert({
          user_id: session.user.id,
          title: 'New Chat',
          model: 'gemini-2.0-flash',
        })
        .select('id')
        .single();
      if (data && data.id) {
        router.replace(`/chat/${data.id}`);
      } else {
        router.replace('/');
      }
    };
    if (session) createChat();
  }, [session, router]);

  useEffect(() => {
    // If not loading and no session, redirect to home
    if (!isLoading && !session) {
      router.replace('/');
    }
  }, [isLoading, session, router]);

  return <div className="flex flex-1 items-center justify-center text-lg text-gray-400">Loading...</div>;
} 