import Button from '../UI/Button';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase/client';

export default function SidebarNewChatButton({ collapsed }: { collapsed?: boolean }) {
  const router = useRouter();
  const session = useSession();

  const handleNewChat = async () => {
    if (!session?.user) return;
    const { data, error } = await supabase
      .from('chats')
      .insert({
        user_id: session.user.id,
        title: 'New Chat',
        model: 'gpt-4o',
      })
      .select('id')
      .single();
    if (data && data.id) {
      router.push(`/chat/${data.id}`);
    }
    // Optionally handle error (e.g., show toast)
  };

  if (collapsed) {
    return (
      <button
        className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg mx-auto mb-2"
        onClick={handleNewChat}
        disabled={!session?.user}
        aria-label="New Chat"
      >
        <Plus size={22} />
      </button>
    );
  }

  return (
    <Button
      className="w-full flex items-center gap-2 justify-center text-base font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
      onClick={handleNewChat}
      disabled={!session?.user}
    >
      <Plus/> New Chat
    </Button>
  );
} 