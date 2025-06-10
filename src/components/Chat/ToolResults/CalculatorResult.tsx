import { Calculator } from 'lucide-react';
import { useTheme } from '@/theme/ThemeProvider';
import React from 'react';

interface CalculatorResultProps {
  expression: string;
  result: string | number | any[] | object;
  details?: {
    type: string;
    isComplex: boolean;
    isMatrix: boolean;
    isUnit: boolean;
  };
  inputDetails?: {
    type: string;
    isComplex: boolean;
    isMatrix: boolean;
    isUnit: boolean;
  };
}

function formatMatrix(matrixStr: string): React.ReactElement {
  try {
    // Parse the matrix string into a 2D array
    const matrix = JSON.parse(matrixStr.replace(/\s+/g, ''));
    return (
      <div className="inline-block p-2 rounded bg-transparent border border-white/20">
        {matrix.map((row: number[], rowIndex: number) => (
          <div key={rowIndex} className="flex flex-row justify-center">
            {row.map((cell: number, cellIndex: number) => (
              <span
                key={cellIndex}
                className="font-mono text-lg mx-3"
                style={{ minWidth: '2ch', display: 'inline-block', textAlign: 'center' }}
              >
                {cell}
              </span>
            ))}
          </div>
        ))}
      </div>
    );
  } catch (e) {
    // If parsing fails, return the original string
    return <span>{matrixStr}</span>;
  }
}

function renderTypeBadges(details?: {isComplex: boolean, isMatrix: boolean, isUnit: boolean, type: string}, label?: string) {
  if (!details) return null;
  return (
    <div className="flex gap-2 text-xs opacity-70 items-center">
      {label && <span className="font-semibold mr-1">{label}:</span>}
      {details.isComplex && <span>Complex</span>}
      {details.isMatrix && <span>Matrix</span>}
      {details.isUnit && <span>Unit</span>}
      {!details.isComplex && !details.isMatrix && !details.isUnit && (
        <span>Type: {details.type}</span>
      )}
    </div>
  );
}

function renderResult(result: any, details?: { isMatrix?: boolean }): React.ReactNode {
  if (details?.isMatrix && typeof result === 'string') {
    return formatMatrix(result);
  }
  if (typeof result === 'string' || typeof result === 'number') {
    return <span className="font-bold text-xl">{result}</span>;
  }
  if (Array.isArray(result) || (typeof result === 'object' && result !== null)) {
    return <pre className="font-mono text-xs bg-transparent p-2 rounded">{JSON.stringify(result, null, 2)}</pre>;
  }
  return <span>{String(result)}</span>;
}

export default function CalculatorResult({ expression, result, details, inputDetails }: CalculatorResultProps) {
  const { theme } = useTheme();
  return (
    <div
      className="flex flex-col gap-2 rounded-2xl px-5 py-3 my-3 shadow-xl"
      style={{
        background: theme.inputGlass,
        border: `1.5px solid ${theme.buttonBorder}`,
        boxShadow: '0 8px 32px 0 rgba(31,38,135,0.10)',
      }}
    >
      <div className="flex items-center gap-3">
        <Calculator style={{ color: theme.inputText }} size={22} />
        <span className="font-mono text-base font-medium" style={{ color: theme.inputText }}>{expression} =</span>
      </div>
      <div className="flex items-center justify-center" style={{ color: theme.inputText }}>
        {renderResult(result, details)}
      </div>
      <div className="flex flex-col gap-1 mt-1">
        {renderTypeBadges(inputDetails, 'Input')}
        {renderTypeBadges(details, 'Output')}
      </div>
    </div>
  );
} 