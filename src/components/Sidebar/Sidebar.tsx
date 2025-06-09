import { useState } from 'react';
import { SidebarHeader, SidebarSearch, SidebarThreadList, SidebarNewChatButton } from './index';
import { PanelTopClose, PanelTopOpen } from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

export default function Sidebar({ collapsed = false, onCollapse }: SidebarProps) {
  const [search, setSearch] = useState('');

  return (
    <aside
      className={`h-full flex flex-col bg-gradient-to-b from-purple-200 to-pink-100 rounded-xl shadow-xl border-r border-purple-100 transition-all duration-300 ${
        collapsed ? 'w-16 p-2' : 'w-72 p-6'
      }`}
    >
      {collapsed ? (
        <div className="flex flex-col items-center justify-center mt-4 mb-6">
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-purple-600 shadow-lg border border-purple-200 hover:bg-purple-100 transition"
            onClick={() => onCollapse?.(false)}
            aria-label="Expand sidebar"
          >
            <PanelTopOpen size={26} />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex-1">
            <SidebarHeader collapsed={collapsed} />
          </div>
          <button
            className="ml-2 p-1 rounded-full bg-white text-purple-600 shadow border border-purple-200 hover:bg-purple-100 transition"
            onClick={() => onCollapse?.(true)}
            aria-label="Collapse sidebar"
          >
            <PanelTopClose size={24} />
          </button>
      </div>
      )}
      {!collapsed && <SidebarSearch value={search} onChange={e => setSearch(e.target.value)} collapsed={collapsed} />}
      <SidebarThreadList search={search} collapsed={collapsed} />
      <div className="mt-auto flex flex-col gap-2 relative">
        <div className="sticky bottom-0 z-10">
          <SidebarNewChatButton collapsed={collapsed} />
        </div>
      </div>
    </aside>
  );
} 