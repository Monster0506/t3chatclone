import { Message } from '@ai-sdk/react';
import { User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock';

const markdownComponents = {
  code({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode }) {
    const match = /language-(\w+)/.exec(className || '');
    if (!inline) {
      return (
        <CodeBlock
          language={match ? match[1] : ''}
          value={String(children ?? '').replace(/\n$/, '')}
        />
      );
    }
    // Inline code: style it nicely
    return (
      <code
        className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-mono text-sm"
        {...props}
      >
        {children}
      </code>
    );
  },
};

export default function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && (
        <div className="flex-shrink-0 mr-2">
          <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center">
            <Bot className="text-purple-700" size={20} />
          </div>
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-lg p-4 shadow-sm whitespace-pre-wrap break-words ${
          isUser
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-none'
            : 'bg-white text-purple-900 border border-purple-100 rounded-bl-none'
        }`}
      >
        {message.parts?.map((part, idx) => {
          if (part.type === 'text') {
            return (
              <ReactMarkdown
                key={idx}
                components={markdownComponents}
              >
                {part.text}
              </ReactMarkdown>
            );
          }
          if (part.type === 'reasoning') return <pre key={idx} className="text-xs text-purple-400">{part.reasoning}</pre>;
          if (part.type === 'source') return (
            <a key={idx} href={part.source.url} target="_blank" rel="noopener noreferrer" className="text-xs underline text-blue-500">
              {part.source.title ?? new URL(part.source.url).hostname}
            </a>
          );
          if (part.type === 'file' && part.mimeType?.startsWith('image/')) return (
            <img key={idx} src={`data:${part.mimeType};base64,${part.data}`} alt="attachment" className="rounded mt-2 max-w-xs" />
          );
          return null;
        })}
      </div>
      {isUser && (
        <div className="flex-shrink-0 ml-2">
          <div className="w-8 h-8 rounded-full bg-pink-200 flex items-center justify-center">
            <User className="text-pink-700" size={20} />
          </div>
        </div>
      )}
    </div>
  );
} 