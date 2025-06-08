import { useState } from 'react';
import { SidebarHeader, SidebarSearch, SidebarThreadList, SidebarNewChatButton } from './index';

export default function Sidebar() {
  const [search, setSearch] = useState('');
  return <aside className="w-72 bg-gradient-to-b from-purple-200 to-pink-100 p-4 flex flex-col h-full border-r border-purple-100">
    <SidebarHeader />
    <SidebarSearch value={search} onChange={e => setSearch(e.target.value)} />
    <SidebarThreadList search={search} />
    <div className="mt-auto flex flex-col gap-2">
      <SidebarNewChatButton />
    </div>
  </aside>;
} 