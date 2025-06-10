import { useTheme } from '@/theme/ThemeProvider';
import ChatMessage from './ChatMessage';
import { ExtendedMessage } from '@/lib/types';
// Extend the Message type to include tool messages and invocations





export default function ChatMessageList({ messages }: { messages: ExtendedMessage[] }) {
  return (
    <div
      className="flex flex-col gap-6 px-2 py-6 w-full max-w-2xl mx-auto"

    >
      {messages.map((msg, i) => (
        <ChatMessage message={msg} key={msg.id || i} />
      ))}
    </div>
  );
} 