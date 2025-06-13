import { supabaseServer } from '@/lib/supabase/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('user_id');
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { data: chats, error: chatError } = await supabaseServer
    .from('chats')
    .select('id, title')
    .eq('user_id', userId);

  if (chatError || !chats) {
    return new Response(JSON.stringify({ error: chatError?.message || 'No chats found' }), { status: 500 });
  }

  const chatIdToTitle: Record<string, string> = {};
  chats.forEach((c: any) => { chatIdToTitle[c.id] = c.title; });
  const chatIds = chats.map((c: any) => c.id);

  if (chatIds.length === 0) {
    return new Response(JSON.stringify([]), { status: 200 });
  }

  const { data: indexItems, error: indexError } = await supabaseServer
    .from('chat_index' as any)
    .select('id, chat_id, message_id, type, snippet, created_at')
    .in('chat_id', chatIds)
    .order('created_at', { ascending: false });

  if (indexError) {
    return new Response(JSON.stringify({ error: indexError.message }), { status: 500 });
  }

  const items = (indexItems || []).map((item: any) => ({
    ...item,
    chatTitle: chatIdToTitle[item.chat_id] || 'Untitled Chat',
  }));

  return new Response(JSON.stringify(items), { status: 200 });
} 