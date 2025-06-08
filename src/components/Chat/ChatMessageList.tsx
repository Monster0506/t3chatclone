import { Message } from '@ai-sdk/react';
import ChatMessage from './ChatMessage';

export default function ChatMessageList({ messages }: { messages: Message[] }) {
  return (
    <div className="flex flex-col gap-2 px-4 py-2 overflow-y-auto flex-1">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
    </div>
  );
} 