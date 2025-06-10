import { Calculator } from 'lucide-react';
import CalculatorResult from './CalculatorResult';
import { useTheme } from '../../theme/ThemeProvider';

interface ToolResultProps {
  toolName: string;
  result: any;
  state: 'loading' | 'result' | 'error';
}

export default function ToolResult({ toolName, result, state }: ToolResultProps) {
  const { theme } = useTheme();
  if (state === 'loading') {
    return (
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-xl shadow"
        style={{ background: theme.inputGlass, color: theme.inputText, border: `1.5px solid ${theme.buttonBorder}` }}
      >
        <Calculator className="animate-spin" size={18} />
        <span className="font-medium">Calculating...</span>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div
        className="px-4 py-2 rounded-xl shadow font-medium"
        style={{ background: theme.inputGlass, color: '#e53935', border: `1.5px solid ${theme.buttonBorder}` }}
      >
        Error: {result?.error || 'An error occurred'}
      </div>
    );
  }
  

  if (Array.isArray(result)) {
    result = result[0];
  }

  switch (toolName) {
    case 'calculator':
      return (
        <CalculatorResult
          expression={result.result.expression}
          result={result.result.result}
        />
      );
    default:
      return (
        <div
          className="px-4 py-2 rounded-xl shadow font-medium"
          style={{ background: theme.inputGlass, color: theme.inputText, border: `1.5px solid ${theme.buttonBorder}` }}
        >
          Unknown tool: {toolName}
        </div>
      );
  }
} 