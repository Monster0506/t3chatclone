import { useState } from 'react';
import ModelSelectorModal from '../ModelSelector/ModelSelectorModal';
import Button from '../UI/Button';
import { modelFamilies } from '../ModelSelector/modelData';
import UserMenu from './UserMenu';
import { useTheme } from '../../theme/ThemeProvider';

export default function ChatBar({ selectedModelId, onModelChange }: {
  selectedModelId: string;
  onModelChange: (modelId: string) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
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
        onClick={() => setModalOpen(true)}
      >
        <span>{selectedModel ? selectedModel.name : 'Select Model'}</span>
      </Button>
      <ModelSelectorModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={onModelChange}
        selectedModelId={selectedModelId}
      />
      <div className="flex-1 min-w-0" />
      <div className="flex-shrink-0">
        <UserMenu />
      </div>
    </div>
  );
} 