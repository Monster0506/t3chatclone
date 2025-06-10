import { useTheme } from '@/theme/ThemeProvider';
import CodeBlockActions from './CodeBlockActions';

export default function CodeBlock({ code, language, onCopy, onRun }: { code: string; language?: string; onCopy?: () => void; onRun?: () => void }) {
  const { theme } = useTheme();
  return (
    <div
      className="relative my-4 p-4 rounded-2xl shadow-xl overflow-x-auto"
      style={{
        background: theme.inputGlass,
        border: `1.5px solid ${theme.buttonBorder}`,
        boxShadow: '0 8px 32px 0 rgba(31,38,135,0.10)',
      }}
    >
      <pre className="whitespace-pre-wrap break-words text-sm font-mono" style={{ color: theme.inputText }}>
        <code>{code}</code>
      </pre>
      <div className="absolute top-2 right-2">
        <CodeBlockActions onCopy={onCopy} onRun={onRun} />
      </div>
    </div>
  );
} 