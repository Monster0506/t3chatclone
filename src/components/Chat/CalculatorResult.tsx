import { Calculator } from 'lucide-react';
import { useTheme } from '../../theme/ThemeProvider';

export default function CalculatorResult({ expression, result }: { expression: string, result: string | number }) {
  const { theme } = useTheme();
  return (
    <div
      className="flex items-center gap-3 rounded-2xl px-5 py-3 my-3 shadow-xl"
      style={{
        background: theme.inputGlass,
        border: `1.5px solid ${theme.buttonBorder}`,
        boxShadow: '0 8px 32px 0 rgba(31,38,135,0.10)',
      }}
    >
      <Calculator style={{ color: theme.inputText }} size={22} />
      <span className="font-mono text-base font-medium" style={{ color: theme.inputText }}>{expression} =</span>
      <span className="font-bold text-xl" style={{ color: theme.inputText }}>{result}</span>
    </div>
  );
} 