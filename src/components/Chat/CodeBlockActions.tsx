import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CodeBlockActions({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs"
      title="Copy code"
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  );
} 