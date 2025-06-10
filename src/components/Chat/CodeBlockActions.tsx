import { Copy, Play } from 'lucide-react';
import Button from '../UI/Button';
import { useTheme } from '../../theme/ThemeProvider';

export default function CodeBlockActions({ onCopy, onRun }: { onCopy?: () => void; onRun?: () => void }) {
  const { theme } = useTheme();
  return (
    <div className="flex gap-2 mt-2">
      {onCopy && (
        <Button
          type="button"
          onClick={onCopy}
          className="rounded-xl px-3 py-1 shadow"
          style={{ background: theme.inputGlass, color: theme.buttonText, borderColor: theme.buttonBorder }}
        >
          <Copy size={16} />
        </Button>
      )}
      {onRun && (
        <Button
          type="button"
          onClick={onRun}
          className="rounded-xl px-3 py-1 shadow"
          style={{ background: theme.inputGlass, color: theme.buttonText, borderColor: theme.buttonBorder }}
        >
          <Play size={16} />
        </Button>
      )}
    </div>
  );
} 