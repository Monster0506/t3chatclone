import { useState } from 'react';
import { SidebarHeader, SidebarSearch, SidebarThreadList, SidebarNewChatButton } from './index';

export default function Sidebar() {
  const [search, setSearch] = useState('');
  return (
    <aside className="w-72 h-full flex flex-col bg-gradient-to-b from-purple-200 to-pink-100 rounded-xl shadow-xl p-6 border-r border-purple-100">
      <div className="mb-6">
        <SidebarHeader />
      </div>
      <SidebarSearch value={search} onChange={e => setSearch(e.target.value)} />
      <SidebarThreadList search={search} />
      <div className="mt-auto flex flex-col gap-2 relative">
        <div className="sticky bottom-0 z-10">
          <SidebarNewChatButton />
        </div>
      </div>
    </aside>
  );
} 