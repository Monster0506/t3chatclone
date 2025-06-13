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
  const [, setChat] = useState<any>(null);

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
      try {
        const res = await fetch(`/api/chat?chatId=${id}`);
        let messages = await res.json();
        // Hydrate tool messages
        messages = messages.map((msg: any) => {
          if (msg.role === 'tool' && Array.isArray(msg.content)) {
            const toolResultPart = msg.content.find((part: any) => part.type === 'tool-result');
            if (toolResultPart) {
              return {
                ...msg,
                toolName: toolResultPart.toolName,
                result: toolResultPart.result,
              };
            }
          }
          if (msg.role === 'tool' && msg.metadata?.toolMessage) {
            const toolMsg = msg.metadata.toolMessage;
            if (Array.isArray(toolMsg.content)) {
              const toolResultPart = toolMsg.content.find((part: any) => part.type === 'tool-result');
              if (toolResultPart) {
                return {
                  ...msg,
                  toolName: toolResultPart.toolName,
                  result: toolResultPart.result,
                };
              }
            }
            return {
              ...msg,
              ...toolMsg,
              db_id: msg.id,
              db_created_at: msg.created_at,
            };
          }
          return msg;
        });
        // Merge assistant, tool, and assistant messages into one
        const mergedMessages = [];
        for (let i = 0; i < messages.length; i++) {
          const msg = messages[i];
          if (
            msg.role === 'assistant' &&
            messages[i + 1] && messages[i + 1].role === 'tool' &&
            messages[i + 2] && messages[i + 2].role === 'assistant' &&
            (messages[i + 1].toolName || (messages[i + 1].result && messages[i + 1].result.expression))
          ) {
            mergedMessages.push({
              ...msg,
              mergedParts: [
                { type: 'text', text: msg.content },
                { type: 'tool', toolName: messages[i + 1].toolName, result: messages[i + 1].result },
                { type: 'text', text: messages[i + 2].content }
              ]
            });
            i += 2;
          } else {
            mergedMessages.push(msg);
          }
        }
        setInitialMessages(mergedMessages);
      } catch (_err) {
        console.error('Error fetching initial messages:', _err);
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