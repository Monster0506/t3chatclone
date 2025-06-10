import { Grid } from 'lucide-react';

export default function Sidebar({ filteredFamilies, activeFamily, setActiveFamily, showAll, setShowAll, theme }) {
  return (
    <aside
      className="flex flex-col py-8 px-2 gap-2 border-r overflow-y-auto"
      style={{ background: theme.inputGlass, borderColor: theme.buttonBorder, borderRightWidth: 1, minWidth: 180, maxHeight: '90vh' }}
    >
      <button
        className={`flex items-center gap-3 rounded-2xl p-3 mb-2 transition-all font-semibold text-base ${showAll ? 'ring-2 ring-offset-2' : ''}`}
        style={{ background: showAll ? theme.buttonGlass : 'transparent', color: theme.buttonText, borderColor: theme.buttonBorder, boxShadow: showAll ? '0 0 0 2px ' + theme.buttonBorder : undefined }}
        onClick={() => { setShowAll(true); }}
        title="All Models"
      >
        <Grid size={24} />
        <span>All Models</span>
      </button>
      {filteredFamilies.map((fam) => (
        <button
          key={fam.id}
          className={`flex items-center gap-3 rounded-2xl p-3 transition-all font-semibold text-base group relative ${!showAll && activeFamily?.id === fam.id ? 'ring-2 ring-offset-2' : ''}`}
          style={{ background: !showAll && activeFamily?.id === fam.id ? theme.buttonGlass : 'transparent', color: theme.buttonText, borderColor: theme.buttonBorder, boxShadow: !showAll && activeFamily?.id === fam.id ? '0 0 0 2px ' + theme.buttonBorder : undefined }}
          onClick={() => { setActiveFamily(fam); setShowAll(false); }}
          title={fam.name}
        >
          {fam.icon}
          <span>{fam.name}</span>
        </button>
      ))}
    </aside>
  );
} 