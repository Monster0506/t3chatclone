import { Message } from '@ai-sdk/react';
import { User, Bot, Image as ImageIcon, Calculator } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock';
import ToolResult from './ToolResult';
import { useTheme } from '../../theme/ThemeProvider';
import { ExtendedMessage, FileAttachment, DBAttachment } from '@/lib/types';


const markdownComponents = {
  code({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode }) {
    const match = /language-(\w+)/.exec(className || '');
    if (!inline) {
      return (
        <CodeBlock
          code={String(children ?? '').replace(/\n$/, '') || ""}
          language={match ? match[1] : undefined}
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

export default function ChatMessage({ message }: { message: ExtendedMessage }) {
  const { theme } = useTheme();
  const isUser = message.role === 'user';
  const isTool = message.role === 'tool';

  // If message.parts is missing but message.content is an array, treat content as parts
  const parts = Array.isArray(message.parts)
    ? message.parts
    : Array.isArray(message.content)
      ? message.content
      : [];


  // Get attachments from message parts, experimental_attachments, or metadata
  const partsAttachments = (parts.filter((part: any) => part.type === 'file') || []) as FileAttachment[];
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

  // If it's a tool message, render it differently
  if (isTool) {
    return (
      <div id={`msg-${message.id}`} className="flex justify-start mb-8">
        <div className="flex-shrink-0 mr-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg" style={{ background: theme.inputGlass }}>
            <Calculator style={{ color: theme.inputText }} size={22} />
          </div>
        </div>
        <div className="max-w-[80%] rounded-2xl p-5 shadow-xl" style={{ background: theme.inputGlass, border: `1.5px solid ${theme.buttonBorder}`, color: theme.inputText }}>
          <ToolResult 
            toolName="calculator"
            result={message.content}
            state="result"
          />
        </div>
      </div>
    );
  }

  return (
    <div id={`msg-${message.id}`} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-8`}>
      {!isUser && (
        <div className="flex-shrink-0 mr-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg" style={{ background: theme.inputGlass, border: `1.5px solid ${theme.buttonBorder}` }}>
            <Bot style={{ color: theme.inputText }} size={22} />
          </div>
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl p-5 shadow-xl whitespace-pre-wrap break-words ${isUser ? 'rounded-br-3xl' : 'rounded-bl-3xl'}`}
        style={isUser
          ? {
              background: theme.buttonBg,
              color: theme.buttonText,
              border: `1.5px solid ${theme.buttonBorder}`,
              boxShadow: '0 8px 32px 0 rgba(31,38,135,0.10)',
              marginRight: 0,
            }
          : {
              background: theme.inputGlass,
              color: theme.inputText,
              border: `1.5px solid ${theme.buttonBorder}`,
              boxShadow: '0 8px 32px 0 rgba(31,38,135,0.10)',
              marginLeft: 0,
            }}
      >
        {/* Text content */}
        {parts.map((part: any, idx: number) => {
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
          if (part.type === 'tool-result' && part.toolName === 'calculator' && part.result) {
            return (
              <ToolResult
                key={idx}
                toolName="calculator"
                result={part.result}
                state="result"
              />
            );
          }
          if (part.type === 'reasoning') return <pre key={idx} className="text-xs" style={{ color: theme.inputText }}>{part.reasoning}</pre>;
          if (part.type === 'source') return (
            <a key={idx} href={part.source.url} target="_blank" rel="noopener noreferrer" className="text-xs underline" style={{ color: theme.buttonText }}>
              {part.source.title ?? new URL(part.source.url).hostname}
            </a>
          );
          return null;
        })}

        {/* Tool invocations */}
        {message.toolInvocations?.map((invocation) => {
          // Map the tool invocation state to our ToolResult state
          const state = invocation.state === 'partial-call' || invocation.state === 'call' 
            ? 'loading' 
            : invocation.state === 'result' 
              ? 'result' 
              : 'error';

          // Get the result based on the state
          let result;
          if (state === 'loading') {
            result = { expression: invocation.args?.expression || 'Calculating...', result: '...' };
          } else if (state === 'error') {
            result = { error: 'An error occurred' };
          } else {
            result = invocation.result || { expression: '', result: '' };
          }

          return (
            <div key={invocation.toolCallId} className="mt-2">
              <ToolResult
                toolName={invocation.toolName}
                result={result}
                state={state}
              />
            </div>
          );
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
                      style={{ border: `1.5px solid ${theme.buttonBorder}` }}
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
                      style={{ border: `1.5px solid ${theme.buttonBorder}` }}
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
        <div className="flex-shrink-0 ml-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg" style={{ background: theme.buttonBg, border: `1.5px solid ${theme.buttonBorder}` }}>
            <User style={{ color: theme.buttonText }} size={20} />
          </div>
        </div>
      )}
    </div>
  );
} 