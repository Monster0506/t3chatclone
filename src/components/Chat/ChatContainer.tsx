'use client';
import { useChat } from '@ai-sdk/react';
import { ChatMessageList, ChatInput, ChatStatus, ChatQuickActions } from './index';
import { useCallback } from 'react';

export default function ChatContainer() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    stop,
    reload,
    setInput,
  } = useChat({});

  // Handle quick action prompt click
  const handleQuickPrompt = useCallback((prompt: string) => {
    setInput(prompt);
  }, [setInput]);

  // Custom submit handler to support attachments
  const onSubmit = (e: React.FormEvent<HTMLFormElement>, files?: FileList) => {
    handleSubmit(e, files ? { experimental_attachments: files } : undefined);
  };

  return (
    <section className="flex flex-col flex-1 h-full bg-pink-50">
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
      <ChatMessageList messages={messages} />
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