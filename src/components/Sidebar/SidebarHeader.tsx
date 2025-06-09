export default function SidebarHeader({ collapsed }: { collapsed?: boolean }) {
  return (
    <div className={`flex items-center gap-3 mb-8 justify-center ${collapsed ? 'justify-center' : ''}`}>
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center">
        <span className="text-white text-2xl font-bold">T3</span>
      </div>
      {!collapsed && (
        <span className="text-2xl font-extrabold text-purple-700 tracking-tight">T3.chat</span>
      )}
    </div>
  );
} 