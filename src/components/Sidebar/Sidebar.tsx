import { SidebarHeader, SidebarSearch, SidebarThreadList, SidebarNewChatButton, SidebarSettingsButton } from './index';

export default function Sidebar({ onOpenSettings }: { onOpenSettings?: () => void }) {
  return <aside className="w-72 bg-gradient-to-b from-purple-200 to-pink-100 p-4 flex flex-col h-full border-r border-purple-100">
    <SidebarHeader />
    <SidebarSearch />
    <SidebarThreadList />
    <div className="mt-auto flex flex-col gap-2">
      <SidebarNewChatButton />
      <SidebarSettingsButton onClick={onOpenSettings} />
    </div>
  </aside>;
} 