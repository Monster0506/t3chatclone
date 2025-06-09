'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase/client';
import Sidebar from '@/components/Sidebar/Sidebar';
import ChatContainer from '@/components/Chat/ChatContainer';
import LoginModal from '@/components/Auth/LoginModal';

export default function Page() {
  const { id: chatId } = useParams();
  const session = useSession();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [initialMessages, setInitialMessages] = useState<any[]>([]);

  const id = Array.isArray(chatId) ? chatId[0] : chatId;

  useEffect(() => {
    const fetchChat = async () => {
      if (!session?.user || !id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('id', id)
        .eq('user_id', session.user.id)
        .single();
      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      // Fetch messages from the API
      try {
        const res = await fetch(`/api/chat?chatId=${id}`);
        const messages = await res.json();
        setInitialMessages(messages);
      } catch (err) {
        console.error('Error fetching initial messages:', err);
      }
      setLoading(false);
    };
    fetchChat();
  }, [session, id]);

  return (
    <div className="flex h-screen w-screen bg-pink-50">
      <main className="flex-1 flex flex-col">
        {loading ? (
          <div className="flex flex-1 items-center justify-center text-lg text-gray-400">Loading...</div>
        ) : notFound ? (
          <div className="flex flex-1 items-center justify-center text-lg text-red-400">Chat not found.</div>
        ) : id ? (
          <ChatContainer chatId={id} initialMessages={initialMessages} />
        ) : null}
      </main>
      {!session && <LoginModal open={true} />}
    </div>
  );
} 