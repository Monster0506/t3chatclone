import { Calculator } from 'lucide-react';

export default function CalculatorResult({ expression, result }: { expression: string, result: string | number }) {
  return (
    <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 my-2 shadow">
      <Calculator className="text-yellow-500" size={20} />
      <span className="font-mono text-gray-700">{expression} =</span>
      <span className="font-bold text-lg text-yellow-700">{result}</span>
    </div>
  );
} 