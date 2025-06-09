'use client';
import { useRouter } from 'next/navigation';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase/client';
import { useState } from 'react';

export default function NewChatEntry() {
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
    <div className="flex flex-1 flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-pink-50 to-purple-100">
      {/* Decorative background blob */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-purple-200 rounded-full opacity-30 blur-3xl z-0" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-pink-200 rounded-full opacity-30 blur-3xl z-0" />
      <div className="z-10 flex flex-col items-center text-center px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold text-purple-700 mb-6 drop-shadow-lg">Welcome to T3 Chat</h1>
        <p className="text-lg md:text-2xl text-purple-900 mb-8 max-w-xl">
          Your all-in-one AI chat assistant. Start a new conversation and experience the power of modern AI, tailored just for you.
        </p>
        <button
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-semibold shadow-lg hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-60"
          onClick={handleNewChat}
          disabled={!session?.user || loading}
        >
          {loading ? 'Starting...' : 'Start a New Chat'}
        </button>
        {!session?.user && (
          <p className="mt-6 text-purple-500 text-base">Sign in to start chatting.</p>
        )}
      </div>
    </div>
  );
} 