import { useTheme } from '../../theme/ThemeProvider';
import ChatMessage from './ChatMessage';

// Extend the Message type to include tool messages
// Extend the Message type to include tool messages and invocations
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
  toolInvocations?: Array<{
    toolName: string;
    toolCallId: string;
    state: 'loading' | 'result' | 'error' | 'partial-call' | 'call';
    result?: {
      expression: string;
      result: string | number;
    } | {
      error: string;
    };
    step?: number;
    args?: {
      expression: string;
    };
  }>;
};




export default function ChatMessageList({ messages }: { messages: ExtendedMessage[] }) {
  const { theme } = useTheme();
  return (
    <div
      className="flex flex-col gap-6 px-2 py-6 w-full max-w-2xl mx-auto"
      style={{
        background: theme.glass,
        borderRadius: '2rem',
        boxShadow: '0 8px 32px 0 rgba(31,38,135,0.10)',
        border: `1.5px solid ${theme.buttonBorder}`,
      }}
    >
      {messages.map((msg, i) => (
        <ChatMessage message={msg} key={msg.id || i} />
      ))}
    </div>
  );
} 