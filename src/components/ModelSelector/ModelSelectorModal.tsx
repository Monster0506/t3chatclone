import { useState, useMemo } from 'react';
import { modelFamilies, ModelFamily } from './modelData';
import Button from '../UI/Button';
import { X } from 'lucide-react';

export default function ModelSelectorModal({ open, onClose, onSelect, selectedModelId }: {
  open: boolean;
  onClose: () => void;
  onSelect: (modelId: string) => void;
  selectedModelId?: string;
}) {
  const [search, setSearch] = useState('');
  const [activeFamily, setActiveFamily] = useState<ModelFamily | null>(modelFamilies[0]);

  // Filter models by search
  const filteredFamilies = useMemo(() => {
    if (!search.trim()) return modelFamilies;
    return modelFamilies
      .map(fam => ({
        ...fam,
        models: fam.models.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.id.toLowerCase().includes(search.toLowerCase())),
      }))
      .filter(fam => fam.models.length > 0);
  }, [search]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-neutral-900 text-white rounded-xl shadow-xl w-full max-w-2xl flex min-h-[400px] relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X/></button>
        {/* Sidebar */}
        <aside className="w-48 border-r border-neutral-800 flex flex-col py-6 px-2 bg-neutral-950 rounded-l-xl">
          <div className="mb-4 px-2 text-xs text-neutral-400 uppercase tracking-widest">switch model</div>
          {filteredFamilies.map(fam => (
            <button
              key={fam.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium mb-1 transition-colors ${activeFamily?.id === fam.id ? 'bg-neutral-800 text-white' : 'text-neutral-300 hover:bg-neutral-800'}`}
              onClick={() => setActiveFamily(fam)}
            >
              {fam.icon}
              {fam.name}
            </button>
          ))}
        </aside>
        {/* Main content */}
        <div className="flex-1 flex flex-col p-6">
          <input
            className="w-full mb-4 px-3 py-2 rounded bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Search models..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="flex flex-col gap-2 overflow-y-auto">
            {activeFamily && activeFamily.models.length === 0 && (
              <div className="text-neutral-500 text-sm">No models in this family.</div>
            )}
            {activeFamily && activeFamily.models
              .filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.id.toLowerCase().includes(search.toLowerCase()))
              .map(model => (
                <Button
                  key={model.id}
                  className={`w-full flex items-center justify-between px-4 py-3 text-base font-medium ${selectedModelId === model.id ? 'bg-purple-600 text-white' : 'bg-neutral-800 text-white hover:bg-purple-700'}`}
                  onClick={() => {
                    onSelect(model.id);
                    onClose();
                  }}
                >
                  <span>{model.name}</span>
                  {selectedModelId === model.id && <span className="ml-2 text-xs">(Selected)</span>}
                </Button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
} 