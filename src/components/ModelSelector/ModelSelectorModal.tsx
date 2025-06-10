import { useState, useMemo } from 'react';
import { modelFamilies, ModelFamily } from './modelData';
import Button from '../UI/Button';
import Card from '../UI/Card';
import { X, Grid } from 'lucide-react';
import { useTheme } from '../../theme/ThemeProvider';

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

  // All models flat list
  const allModels = useMemo(() => modelFamilies.flatMap(fam => fam.models), []);

  // Filtered families for sidebar
  const filteredFamilies = useMemo(() => {
    if (!search.trim()) return modelFamilies;
    return modelFamilies
      .map(fam => ({
        ...fam,
        models: fam.models.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.id.toLowerCase().includes(search.toLowerCase())),
      }))
      .filter(fam => fam.models.length > 0);
  }, [search]);

  // Filtered all models for grid
  const filteredAllModels = useMemo(() => {
    if (!search.trim()) return allModels;
    return allModels.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.id.toLowerCase().includes(search.toLowerCase()));
  }, [search, allModels]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" style={{ backdropFilter: 'blur(8px)' }}>
      <Card className="w-full max-w-3xl flex min-h-[420px] relative rounded-2xl shadow-2xl p-0 overflow-hidden" style={{ background: theme.glass, borderColor: theme.buttonBorder }}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10 text-2xl"><X /></button>
        {/* Sidebar */}
        <aside
          className="w-52 flex flex-col py-6 px-2 border-r"
          style={{ background: theme.inputGlass, borderColor: theme.buttonBorder, borderRightWidth: 1 }}
        >
          <div className="mb-4 px-2 text-xs font-bold uppercase tracking-widest opacity-70" style={{ color: theme.buttonText }}>Switch Model</div>
          <Button
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-base font-semibold mb-1 transition-colors w-full ${showAll ? 'ring-2 ring-offset-2' : ''}`}
            style={{ background: showAll ? theme.buttonGlass : 'transparent', color: theme.buttonText, borderColor: theme.buttonBorder, boxShadow: showAll ? '0 0 0 2px ' + theme.buttonBorder : undefined }}
            onClick={() => { setShowAll(true); }}
          >
            <Grid size={18} /> All
          </Button>
          {filteredFamilies.map(fam => (
            <Button
              key={fam.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-base font-semibold mb-1 transition-colors w-full ${!showAll && activeFamily?.id === fam.id ? 'ring-2 ring-offset-2' : ''}`}
              style={{ background: !showAll && activeFamily?.id === fam.id ? theme.buttonGlass : 'transparent', color: theme.buttonText, borderColor: theme.buttonBorder, boxShadow: !showAll && activeFamily?.id === fam.id ? '0 0 0 2px ' + theme.buttonBorder : undefined }}
              onClick={() => { setActiveFamily(fam); setShowAll(false); }}
            >
              {fam.icon}
              {fam.name}
            </Button>
          ))}
        </aside>
        {/* Main content */}
        <div className="flex-1 flex flex-col p-6" style={{ background: theme.glass }}>
          <input
            className="w-full mb-4 px-3 py-2 rounded-xl border text-base shadow focus:outline-none"
            style={{ background: theme.inputGlass, color: theme.inputText, borderColor: theme.buttonBorder }}
            placeholder="Search models..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="flex-1 overflow-y-auto" style={{ maxHeight: 400 }}>
            {showAll ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredAllModels.length === 0 && (
                  <div className="text-neutral-500 text-sm">No models found.</div>
                )}
                {filteredAllModels.map(model => (
                  <Button
                    key={model.id}
                    className={`w-full flex items-center justify-between px-4 py-4 rounded-xl text-base font-semibold transition-colors border shadow-lg ${selectedModelId === model.id ? 'ring-2 ring-offset-2' : ''}`}
                    style={{
                      background: selectedModelId === model.id ? theme.buttonBg : theme.inputGlass,
                      color: theme.buttonText,
                      borderColor: theme.buttonBorder,
                      boxShadow: selectedModelId === model.id ? '0 0 0 2px ' + theme.buttonBorder : undefined,
                    }}
                    onClick={() => {
                      onSelect(model.id);
                      onClose();
                    }}
                  >
                    <span>{model.name}</span>
                    {selectedModelId === model.id && <span className="ml-2 text-xs opacity-80">(Selected)</span>}
                  </Button>
                ))}
              </div>
            ) :
              activeFamily && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeFamily.models.length === 0 && (
                    <div className="text-neutral-500 text-sm">No models in this family.</div>
                  )}
                  {activeFamily.models
                    .filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.id.toLowerCase().includes(search.toLowerCase()))
                    .map(model => (
                      <Button
                        key={model.id}
                        className={`w-full flex items-center justify-between px-4 py-4 rounded-xl text-base font-semibold transition-colors border shadow-lg ${selectedModelId === model.id ? 'ring-2 ring-offset-2' : ''}`}
                        style={{
                          background: selectedModelId === model.id ? theme.buttonBg : theme.inputGlass,
                          color: theme.buttonText,
                          borderColor: theme.buttonBorder,
                          boxShadow: selectedModelId === model.id ? '0 0 0 2px ' + theme.buttonBorder : undefined,
                        }}
                        onClick={() => {
                          onSelect(model.id);
                          onClose();
                        }}
                      >
                        <span>{model.name}</span>
                        {selectedModelId === model.id && <span className="ml-2 text-xs opacity-80">(Selected)</span>}
                      </Button>
                    ))}
                </div>
              )
            }
          </div>
        </div>
      </Card>
    </div>
  );
} 