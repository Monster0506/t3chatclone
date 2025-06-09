'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import ChatContainer from '@/components/Chat/ChatContainer';

export default function SharePage() {
  const { id: chatId } = useParams();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [initialMessages, setInitialMessages] = useState<any[]>([]);
  const [chat, setChat] = useState<any>(null);

  const id = Array.isArray(chatId) ? chatId[0] : chatId;

  useEffect(() => {
    const fetchChat = async () => {
      if (!id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('id', id)
        .eq('public', true)
        .single();
      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setChat(data);
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
  }, [id]);

  return (
    <div className="flex h-screen w-screen bg-pink-50">
      <main className="flex-1 flex flex-col">
        {loading ? (
          <div className="flex flex-1 items-center justify-center text-lg text-gray-400">Loading...</div>
        ) : notFound ? (
          <div className="flex flex-1 items-center justify-center text-lg text-red-400">Chat not found or not public.</div>
        ) : id ? (
          <ChatContainer chatId={id} initialMessages={initialMessages} disabled />
        ) : null}
      </main>
    </div>
  );
} 