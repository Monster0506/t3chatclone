import Button from '../UI/Button';
import { Settings } from 'lucide-react';

export default function SidebarSettingsButton({ onClick }: { onClick?: () => void }) {
  return (
    <Button className="w-full flex items-center gap-2 justify-center text-base font-semibold bg-white text-purple-600 border border-purple-200 hover:bg-purple-50" onClick={onClick}>
      <span className="material-symbols-outlined"><Settings/></span> Settings
    </Button>
  );
} 