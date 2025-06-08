import Button from '../UI/Button';
import { Plus } from 'lucide-react';

export default function SidebarNewChatButton() {
  return (
    <Button className="w-full flex items-center gap-2 justify-center text-base font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
      <Plus/> New Chat
    </Button>
  );
} 