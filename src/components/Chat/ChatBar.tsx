
import Button from '@/components/UI/Button';
import { modelFamilies } from '../ModelSelector/modelData';
import { useTheme } from '@/theme/ThemeProvider';

export default function ChatBar({ selectedModelId, onModelChange, onOpenModelSelector, onOpenSettings }: {
  selectedModelId: string;
  onModelChange: (modelId: string) => void;
  onOpenModelSelector: () => void;
  onOpenSettings: () => void;
}) {
  const selectedModel = modelFamilies.flatMap(f => f.models).find(m => m.id === selectedModelId);
  const { theme } = useTheme();

  return (
    <div
      className="w-full max-w-2xl mx-auto p-2 sm:p-3 flex items-center gap-2 rounded-2xl shadow border"
      style={{ background: theme.buttonGlass, borderColor: theme.buttonBorder }}
    >
      <Button
        className="flex items-center gap-2 px-3 py-2 rounded-lg font-semibold"
        style={{ background: theme.inputGlass, color: theme.buttonText, borderColor: theme.buttonBorder }}
        onClick={onOpenModelSelector}
      >
        <span>{selectedModel ? selectedModel.name : 'Select Model'}</span>
      </Button>
      <div className="flex-1 min-w-0" />
      <div className="flex-shrink-0">
        <Button onClick={onOpenSettings} className="rounded-full px-3 py-2 font-semibold" style={{ background: theme.inputGlass, color: theme.buttonText, borderColor: theme.buttonBorder }}>Settings</Button>
      </div>
    </div>
  );
} 