import Button from '../UI/Button';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase/client';

export default function SidebarNewChatButton() {
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