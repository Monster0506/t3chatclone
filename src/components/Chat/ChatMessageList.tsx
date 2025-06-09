import { Message } from '@ai-sdk/react';
import ChatMessage from './ChatMessage';

// Extend the Message type to include tool messages
type ExtendedMessage = Omit<Message, 'role'> & {
  role: 'system' | 'user' | 'assistant' | 'data' | 'tool';
  content: string;
  parts?: Array<{
    type: string;
    text: string;
    toolName?: string;
    result?: {
      expression: string;
      result: string | number;
    };
  }>;
};

export default function ChatMessageList({ messages }: { messages: ExtendedMessage[] }) {
  return (
    <div className="flex flex-col gap-2 px-2 py-1 overflow-y-auto flex-1 max-w-4xl mx-auto w-full">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message as Message} />
      ))}
    </div>
  );
} 