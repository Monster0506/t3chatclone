import { useTheme } from '@/theme/ThemeProvider';
import CodeBlockActions from './CodeBlockActions';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeBlock({ code, language, onCopy, onRun }: { code: string; language?: string; onCopy?: () => void; onRun?: () => void }) {
  const { theme } = useTheme();
  const style =  oneDark

  return (
    <div
      className="relative my-6 rounded-2xl shadow-xl overflow-x-auto border-l-4"
      style={{
        borderLeft: `6px solid ${theme.buttonBorder}`,
        border: `1.5px solid ${theme.buttonBorder}`,
        boxShadow: '0 8px 32px 0 rgba(31,38,135,0.10)',
        padding: '1.5rem 1.5rem 1.5rem 1.25rem',
        background: 'transparent',
      }}
    >
      <SyntaxHighlighter
        language={language}
        style={style}
        customStyle={{
          margin: 0,
          fontSize: '1rem',
        }}
        showLineNumbers={false}
      >
        {code}
      </SyntaxHighlighter>
      <CodeBlockActions onCopy={onCopy} onRun={onRun} small />

      <div className="flex items-center gap-2 absolute bottom-2 right-4 z-10">

        {language && (
          <span
            className="text-xs font-semibold opacity-60 mr-1"
            style={{ color: theme.inputText, letterSpacing: '0.05em' }}
          >
            {language}



          </span>
          

        )}


      </div>
    </div>
  );
} 
