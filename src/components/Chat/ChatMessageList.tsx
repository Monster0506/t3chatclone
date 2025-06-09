import { Message } from '@ai-sdk/react';
import ChatMessage from './ChatMessage';

export default function ChatMessageList({ messages }: { messages: Message[] }) {
  return (
    <div className="flex flex-col gap-2 px-2 py-1 overflow-y-auto flex-1 max-w-4xl mx-auto w-full">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
    </div>
  );
} 