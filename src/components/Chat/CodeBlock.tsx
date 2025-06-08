import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CodeBlockActions from './CodeBlockActions';

export default function CodeBlock({ language, value }: { language?: string; value: string }) {
  return (
    <div className="relative group my-2">
      <div className="absolute top-2 right-2 flex gap-2 z-10">
        <CodeBlockActions value={value} />
      </div>
      <SyntaxHighlighter
        style={oneDark}
        language={language}
        PreTag="div"
        className="rounded-md text-sm whitespace-pre"
        wrapLongLines={false}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
} 