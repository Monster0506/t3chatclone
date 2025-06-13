import { useState, useMemo, useRef } from 'react';
import { modelFamilies} from './modelData';
import Button from '@/components/UI/Button';
import Card from '@/components/UI/Card';
import { X, Grid } from 'lucide-react';
import { useTheme } from '@/theme/ThemeProvider';
import Sidebar from './Sidebar';
import { ModelFamily } from '@/lib/types';
import { useCloseModal } from '@/hooks/use-close-modal';

function ModelGrid({ models, selectedModelId, onSelect, onClose, theme }: any) {
  const getModelDescription = (model: any) => {
    if (model.description) return model.description;
    if (model.id.toLowerCase().includes('flash')) return 'Fast, lightweight model';
    if (model.id.toLowerCase().includes('pro')) return 'High-quality, advanced model';
    if (model.id.toLowerCase().includes('latest')) return 'Latest version';
    return 'AI Model';
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 overflow-y-auto pr-2" style={{ maxHeight: 'calc(90vh - 120px)' }}>
      {models.map((model: any) => {
        const selected = selectedModelId === model.id;
        return (
          <button
            key={model.id}
            className={`relative flex flex-col items-center justify-center p-6 rounded-3xl shadow-xl transition-all group border-2 ${selected ? 'scale-105' : 'hover:scale-105'} ${selected ? 'ring-4 ring-purple-400' : ''}`}
            style={{
              background: selected ? theme.buttonBg : theme.inputGlass,
              color: theme.buttonText,
              borderColor: selected ? theme.buttonBorder : theme.inputGlass,
              boxShadow: selected ? '0 0 24px 4px ' + theme.buttonBorder : '0 8px 32px 0 rgba(31,38,135,0.10)',
              zIndex: selected ? 2 : 1,
            }}
            onClick={() => {
              onSelect(model.id);
              onClose();
            }}
          >
            <div className="mb-3 text-4xl opacity-90">
              {(modelFamilies.find(f => f.models.some(m => m.id === model.id))?.icon) || <Grid size={32} />}
            </div>
            <div className="font-bold text-lg mb-1 text-center" style={{ color: theme.buttonText }}>{model.name}</div>
            <div className="text-xs opacity-70 text-center mb-2" style={{ color: theme.inputText }}>{getModelDescription(model)}</div>
            {selected && (
              <span className="absolute top-3 right-3 bg-purple-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">Selected</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default function ModelSelectorModal({ open, onClose, onSelect, selectedModelId }: {
  open: boolean;
  onClose: () => void;
  onSelect: (modelId: string) => void;
  selectedModelId?: string;
}) {
  const [search, setSearch] = useState('');
  const [activeFamily, setActiveFamily] = useState<ModelFamily | null>(modelFamilies[0]);
  const [showAll, setShowAll] = useState(false);
  const { theme } = useTheme();
  const modalRef = useRef<HTMLDivElement>(null);

  useCloseModal({
    ref: modalRef,
    isOpen: open,
    onClose,
  });

  const allModels = useMemo(() => modelFamilies.flatMap(fam => fam.models), []);

  const filteredFamilies = useMemo(() => {
    if (!search.trim()) return modelFamilies;
    return modelFamilies
      .map(fam => ({
        ...fam,
        models: fam.models.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.id.toLowerCase().includes(search.toLowerCase())),
      }))
      .filter(fam => fam.models.length > 0);
  }, [search]);

  const filteredAllModels = useMemo(() => {
    if (!search.trim()) return allModels;
    return allModels.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.id.toLowerCase().includes(search.toLowerCase()));
  }, [search, allModels]);

  if (!open) return null;

  const modelsToShow = showAll
    ? filteredAllModels
    : (activeFamily?.models ?? []).filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto"
    >
      <Card ref={modalRef} className="w-full max-w-5xl flex min-h-[520px] relative rounded-3xl shadow-2xl p-0 overflow-hidden" style={{ background: theme.glass, borderColor: theme.buttonBorder, maxHeight: '90vh' }}>
          <button 
            type="button"
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
            aria-label="Close model selector"
          >
            <X />
          </button>
        <Sidebar
          filteredFamilies={filteredFamilies}
          activeFamily={activeFamily}
          setActiveFamily={setActiveFamily}
          showAll={showAll}
          setShowAll={setShowAll}
          theme={theme}
        />
        <div className="flex-1 flex flex-col p-8" style={{ background: theme.glass, maxHeight: '90vh' }}>
          <div className="mb-6">
            <input
              className="w-full px-5 py-3 rounded-2xl border text-lg shadow focus:outline-none"
              style={{ background: theme.inputGlass, color: theme.inputText, borderColor: theme.buttonBorder }}
              placeholder="Search models..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <ModelGrid
            models={modelsToShow}
            selectedModelId={selectedModelId}
            onSelect={onSelect}
            onClose={onClose}
            theme={theme}
          />
        </div>
      </Card>
    </div>
  );
} 