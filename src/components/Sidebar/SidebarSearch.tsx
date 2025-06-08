import Input from '../UI/Input';

export default function SidebarSearch({ value, onChange }: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="mb-4">
      <Input
        className="w-full text-black"
        placeholder="Search your threads..."
        type="search"
        value={value}
        onChange={onChange}
      />
    </div>
  );
} 