import { Copy, Play } from 'lucide-react';
import Button from '@/components/UI/Button';
import { useTheme } from '@/theme/ThemeProvider';

export default function CodeBlockActions({ onCopy, onRun, small }: { onCopy?: () => void; onRun?: () => void; small?: boolean }) {
  const { theme } = useTheme();
  const size = small ? 16 : 18;
  const padding = small ? 'p-1' : 'p-2';
  return (
    <div className="flex gap-1">
      <div className="flex items-center gap-2 absolute bottom-2 right-4 z-10">
        <Button
          type="button"
          onClick={onCopy}
          className={`rounded-full ${padding} shadow transition hover:scale-110 focus:ring-2`}

          aria-label="Copy code"
        >
          <Copy size={size} />
        </Button>
      </div>
      {onRun && (
        <Button
          type="button"
          onClick={onRun}
          className={`rounded-full ${padding} shadow transition hover:scale-110 focus:ring-2`}
          aria-label="Run code"
        >
          <Play size={size} />
        </Button>
      )}
    </div>
  );
} 