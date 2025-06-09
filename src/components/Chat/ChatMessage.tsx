import { Message } from '@ai-sdk/react';
import { User, Bot, Image as ImageIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock';

interface FileAttachment {
  type: 'file';
  mimeType?: string;
  data?: string;
  name?: string;
  url?: string;
}

interface DBAttachment {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  url: string;
  metadata: any;
}

const markdownComponents = {
  code({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode }) {
    const match = /language-(\w+)/.exec(className || '');
    if (!inline) {
      return (
        <CodeBlock
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

  // Get attachments from message parts, experimental_attachments, or metadata
  const partsAttachments = (message.parts?.filter(part => part.type === 'file') || []) as FileAttachment[];
  const expAttachments = (message as any).experimental_attachments || [];
  // Map experimental_attachments to FileAttachment shape if present
  const expFileAttachments = Array.isArray(expAttachments)
    ? expAttachments.map((att: any) => ({
        type: 'file',
        mimeType: att.mimeType || att.contentType,
        data: att.data || (att.url && att.url.startsWith('data:') ? att.url.split(',')[1] : undefined),
        name: att.name,
        url: att.url,
      }))
    : [];
  const dbAttachments = (message as any).attachments || [];
  const allAttachments = [...partsAttachments, ...expFileAttachments];
  const hasAttachments = allAttachments.length > 0 || dbAttachments.length > 0;


 

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
        {/* Text content */}
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
          return null;
        })}

        {/* Attachments grid */}
        {hasAttachments && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {/* Render attachments from parts and experimental_attachments */}
            {allAttachments.map((attachment, idx) => {
              if (attachment.type === 'file' && attachment.mimeType?.startsWith('image/')) {
                const imageUrl = attachment.data
                  ? `data:${attachment.mimeType};base64,${attachment.data}`
                  : attachment.url;
                return (
                  <div key={`part-${idx}`} className="relative group">
                    <img
                      src={imageUrl}
                      alt={attachment.name || 'Attachment'}
                      className="rounded-lg w-full h-48 object-cover hover:opacity-90 transition-opacity"
                    />
                  </div>
                );
              }
              return null;
            })}
            {/* Render attachments from database */}
            {dbAttachments.map((attachment: DBAttachment, idx: number) => {
              if (attachment.file_type.startsWith('image/')) {
                return (
                  <div key={`db-${attachment.id}`} className="relative group">
                    <img
                      src={attachment.url}
                      alt={attachment.file_name}
                      className="rounded-lg w-full h-48 object-cover hover:opacity-90 transition-opacity"
                    />
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
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