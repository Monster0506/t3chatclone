import Spinner from '@/components/UI/Spinner';
import Button from '@/components/UI/Button';
import { useTheme } from '@/theme/ThemeProvider';

interface ChatStatusProps {
  status: 'submitted' | 'streaming' | 'ready' | 'error';
  error?: Error | null;
  onStop?: () => void;
  onReload?: () => void;
}

export default function ChatStatus({ status, error, onStop, onReload }: ChatStatusProps) {
  const { theme } = useTheme();
  if (status === 'submitted' || status === 'streaming') {
    return (
      <div
        className="flex items-center gap-3 px-5 py-3 mt-4 mb-2 rounded-2xl shadow-xl mx-auto max-w-lg"
        style={{
          background: theme.glass,
          color: theme.inputText,
          border: `1.5px solid ${theme.buttonBorder}`,
          boxShadow: '0 8px 32px 0 rgba(31,38,135,0.10)',
        }}
      >
        <Spinner />
        <span className="font-medium">Thinking...</span>
        {onStop && (
          <Button type="button" onClick={onStop} className="ml-2 font-semibold px-4 py-2 rounded-xl"
            style={{ background: theme.inputGlass, color: theme.buttonText, borderColor: theme.buttonBorder }}>
            Stop
          </Button>
        )}
      </div>
    );
  }
  if (status === 'error') {
    // This is so horrible, but it's the best we can do for now.
    let errorMessage = error?.message.startsWith("Failed to parse") ? "The selected model is not supported. Please choose a different model (gemini-2.0-flash is recommended)." : (error?.message || 'Something went wrong.');

    return (
      <div
        className="flex items-center gap-3 px-5 py-3 mt-4 mb-2 rounded-2xl shadow-xl mx-auto max-w-lg"
        style={{
          background: theme.glass,
          color: '#e53935',
          border: `1.5px solid ${theme.buttonBorder}`,
          boxShadow: '0 8px 32px 0 rgba(31,38,135,0.10)',
        }}
      >
        <span className="font-medium">{errorMessage}</span>
        {onReload && (
          <Button type="button" onClick={onReload} className="ml-2 font-semibold px-4 py-2 rounded-xl"
            style={{ background: theme.inputGlass, color: theme.buttonText, borderColor: theme.buttonBorder }}>
            Retry
          </Button>
        )}
      </div>
    );
  }
  return null;
} 