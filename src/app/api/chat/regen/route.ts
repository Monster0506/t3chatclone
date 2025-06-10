import { supabaseServer } from '@/lib/supabase/server';
import { google } from '@ai-sdk/google';
import { modelFamilies as modelMap } from '@/components/ModelSelector/modelData';

export const runtime = 'edge';

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  const { messageId } = await req.json();
  if (!messageId) {
    return new Response('Missing messageId', { status: 400 });
  }

  // Fetch the assistant message
  const { data: assistantMsg, error: msgError } = await supabaseServer
    .from('messages')
    .select('*')
    .eq('id', messageId)
    .single();
  if (msgError || !assistantMsg) {
    return new Response('Message not found', { status: 404 });
  }
  if (assistantMsg.role !== 'assistant') {
    return new Response('Can only regen assistant messages', { status: 400 });
  }

  // Fetch all messages in the chat up to and including this one
  const { data: allMessages, error: allError } = await supabaseServer
    .from('messages')
    .select('*')
    .eq('chat_id', assistantMsg.chat_id)
    .order('created_at', { ascending: true });
  if (allError || !allMessages) {
    return new Response('Could not fetch chat history', { status: 500 });
  }

  // Find the previous user message
  const idx = allMessages.findIndex((m: any) => m.id === messageId);
  if (idx < 1) {
    return new Response('No previous user message found', { status: 400 });
  }
  const userMsg = allMessages[idx - 1];
  if (userMsg.role !== 'user') {
    return new Response('Previous message is not a user message', { status: 400 });
  }

  // Get the chat row for model info
  const { data: chatRow } = await supabaseServer
    .from('chats')
    .select('*')
    .eq('id', assistantMsg.chat_id)
    .single();
  const modelId = chatRow?.model || 'gpt-4o';
  const model = modelMap[modelId] || google('gpt-4o');

  // Call the model with the user message
  const systemPrompt = 'You are a helpful assistant.';
  const response = await model.call({
    system: systemPrompt,
    messages: [
      { role: 'user', content: userMsg.content },
    ],
  });
  const newContent = response.choices?.[0]?.message?.content || '';

  // Update the assistant message in the DB
  await supabaseServer
    .from('messages')
    .update({ content: newContent })
    .eq('id', messageId);

  return new Response(JSON.stringify({ content: newContent }), { status: 200 });
} 