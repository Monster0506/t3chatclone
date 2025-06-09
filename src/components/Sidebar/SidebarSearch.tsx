import Input from '../UI/Input';
import { Search } from 'lucide-react';

export default function SidebarSearch({ value, onChange }: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="mb-6 relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400">
        <Search size={18} />
      </span>
      <Input
        className="w-full pl-10 pr-3 py-2 rounded-full bg-white shadow focus:ring-2 focus:ring-purple-300 border border-purple-200 text-black placeholder-purple-300"
        placeholder="Search your threads..."
        type="search"
        value={value}
        onChange={onChange}
      />
    </div>
  );
} 