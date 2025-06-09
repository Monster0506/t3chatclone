'use client';
import { useChat } from '@ai-sdk/react';
import { ChatMessageList, ChatInput, ChatStatus, ChatQuickActions } from './index';
import ChatBar from './ChatBar';
import { useCallback, useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase/client';
import type { Tables } from '@/lib/supabase/types';

const DEFAULT_MODEL = 'gemini-2.0-flash';

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Remove the data URL prefix, keep only base64
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ChatContainer({ chatId, initialMessages = [], sidebarCollapsed }: { chatId: string, initialMessages?: any[], sidebarCollapsed?: boolean }) {
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);
  const [userSettings, setUserSettings] = useState<Tables<'user_settings'> | null>(null);
  const session = useSession();

  // Fetch user settings
  useEffect(() => {
    const fetchSettings = async () => {
      if (session?.user) {
        const { data } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        setUserSettings(data);
      }
    };
    fetchSettings();
  }, [session]);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    stop,
    reload,
    setInput,
  } = useChat({
    body: {
      chat_id: chatId,
      model: selectedModel,
      userSettings,
    },
    initialMessages,
  });

  const [optimisticMessages, setOptimisticMessages] = useState<any[]>([]);

  // Handle quick action prompt click
  const handleQuickPrompt = useCallback((prompt: string) => {
    setInput(prompt);
  }, [setInput]);

  // Custom submit handler to support attachments
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>, files?: FileList) => {
    e.preventDefault();
    if (files && files.length > 0) {
      const attachments = await Promise.all(
        Array.from(files).map(async (file) => ({
          type: 'file',
          mimeType: file.type,
          name: file.name,
          data: await fileToBase64(file),
        }))
      );
      // Create an optimistic message object
      const optimisticMsg = {
        id: `optimistic-${Date.now()}`,
        role: 'user',
        content: input,
        type: 'text',
        created_at: new Date().toISOString(),
        parts: [
          { type: 'text', text: input },
          ...attachments,
        ],
      };
      setOptimisticMessages((prev) => [...prev, optimisticMsg]);
      handleSubmit(e, {
        experimental_attachments: files,
        body: {
          chat_id: chatId,
          model: selectedModel,
          userSettings,
        },
      });
    } else {
      const optimisticMsg = {
        id: `optimistic-${Date.now()}`,
        role: 'user',
        content: input,
        type: 'text',
        created_at: new Date().toISOString(),
        parts: [{ type: 'text', text: input }],
      };
      setOptimisticMessages((prev) => [...prev, optimisticMsg]);
      handleSubmit(e, {
        body: {
          chat_id: chatId,
          model: selectedModel,
          userSettings,
        },
      });
    }
  };

  // Clear optimistic messages after real messages update
  useEffect(() => {
    setOptimisticMessages([]);
  }, [messages]);

  const showWelcome = messages && messages.length === 0;

  // Add logging for merged messages
  const mergedMessages = [...messages, ...optimisticMessages];


  return (
    <section className={`flex flex-col flex-1 h-full bg-pink-50 transition-all duration-300 ${sidebarCollapsed ? 'px-8' : ''}`}>
      <ChatBar selectedModelId={selectedModel} onModelChange={setSelectedModel} />
      {showWelcome && (
        <div className="flex-1 flex flex-col justify-center items-center">
          <h1 className="text-4xl font-bold text-purple-700 mb-4">How can I help you?</h1>
          <div className="flex gap-2 mb-8">
            <span className="px-3 py-1 rounded bg-white border border-purple-100 text-purple-700 font-medium">Create</span>
            <span className="px-3 py-1 rounded bg-white border border-purple-100 text-purple-700 font-medium">Explore</span>
            <span className="px-3 py-1 rounded bg-white border border-purple-100 text-purple-700 font-medium">Code</span>
            <span className="px-3 py-1 rounded bg-white border border-purple-100 text-purple-700 font-medium">Learn</span>
          </div>
          <ChatQuickActions onPrompt={handleQuickPrompt} />
        </div>
      )}
      <ChatMessageList messages={mergedMessages} />
      <ChatStatus status={status} onStop={stop} onReload={reload} />
      <ChatInput
        input={input}
        onInputChange={handleInputChange}
        onSubmit={onSubmit}
        disabled={status !== 'ready'}
      />
    </section>
  );
} 