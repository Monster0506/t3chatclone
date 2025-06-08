import { UIMessage } from '@ai-sdk/react';

export default function ChatMessage({ message }: { message: UIMessage }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-[80%] rounded-lg p-4 shadow-sm ${
          isUser
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
            : 'bg-white text-purple-900 border border-purple-100'
        }`}
      >
        {/* Render message parts for flexibility */}
        {message.parts?.map((part, idx) => {
          if (part.type === 'text') return <div key={idx}>{part.text}</div>;
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
    </div>
  );
} 