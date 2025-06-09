import { Calculator } from 'lucide-react';
import CalculatorResult from './CalculatorResult';

interface ToolResultProps {
  toolName: string;
  result: any;
  state: 'loading' | 'result' | 'error';
}

export default function ToolResult({ toolName, result, state }: ToolResultProps) {
  if (state === 'loading') {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <Calculator className="animate-spin" size={16} />
        <span>Calculating...</span>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="text-red-500">
        Error: {result?.error || 'An error occurred'}
      </div>
    );
  }

  switch (toolName) {
    case 'calculator':
      return (
        <CalculatorResult
          expression={result[0].result.expression}
          result={result[0].result.result}
        />
      );
    default:
      return (
        <div className="text-gray-500">
          Unknown tool: {toolName}
        </div>
      );
  }
} 