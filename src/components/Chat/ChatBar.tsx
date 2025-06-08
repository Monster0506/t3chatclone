import { useState } from 'react';
import ModelSelectorModal from '../ModelSelector/ModelSelectorModal';
import Button from '../UI/Button';
import { modelFamilies } from '../ModelSelector/modelData';
import UserMenu from './UserMenu';

export default function ChatBar({ selectedModelId, onModelChange }: {
  selectedModelId: string;
  onModelChange: (modelId: string) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const selectedModel = modelFamilies.flatMap(f => f.models).find(m => m.id === selectedModelId);

  return (
    <div className="flex items-center gap-2 p-2 border-b border-purple-100 bg-white justify-between">
      <Button
        className="flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-2 rounded-lg hover:bg-purple-200"
        onClick={() => setModalOpen(true)}
      >
        <span className="font-semibold">{selectedModel ? selectedModel.name : 'Select Model'}</span>
      </Button>
      <ModelSelectorModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={onModelChange}
        selectedModelId={selectedModelId}
      />
      <div className="flex-1" />
      <UserMenu />
    </div>
  );
} 