import Spinner from '../UI/Spinner';
import Button from '../UI/Button';

interface ChatStatusProps {
  status: 'submitted' | 'streaming' | 'ready' | 'error';
  error?: Error | null;
  onStop?: () => void;
  onReload?: () => void;
}

export default function ChatStatus({ status, error, onStop, onReload }: ChatStatusProps) {
  if (status === 'submitted' || status === 'streaming') {
    return (
      <div className="flex items-center gap-2 px-4 py-2">
        <Spinner />
        <span className="text-purple-500">Thinking...</span>
        {onStop && (
          <Button type="button" onClick={onStop} className="ml-2 bg-white text-purple-600 border border-purple-200 hover:bg-purple-50">Stop</Button>
        )}
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="flex items-center gap-2 px-4 py-2 text-red-500">
        <span>Something went wrong.</span>
        {onReload && (
          <Button type="button" onClick={onReload} className="ml-2 bg-white text-purple-600 border border-purple-200 hover:bg-purple-50">Retry</Button>
        )}
      </div>
    );
  }
  return null;
} 