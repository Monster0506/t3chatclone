import Input from '../UI/Input';

export default function SidebarSearch() {
  return (
    <div className="mb-4">
      <Input
        className="w-full text-black"
        placeholder="Search your threads..."
        type="search"
      />
    </div>
  );
} 