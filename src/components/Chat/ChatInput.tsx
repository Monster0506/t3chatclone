import Input from '../UI/Input';
import Button from '../UI/Button';
import { ChangeEvent, FormEvent, useRef, useState } from 'react';

interface ChatInputProps {
  input: string;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>, files?: FileList) => void;
  disabled?: boolean;
}

export default function ChatInput({ input, onInputChange, onSubmit, disabled }: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileList | undefined>(undefined);

  return (
    <form
      className="flex gap-2 p-4 border-t border-purple-100 bg-white"
      onSubmit={e => {
        onSubmit(e, files);
        setFiles(undefined);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }}
    >
      <Input
        value={input}
        onChange={onInputChange}
        placeholder="Type your message here..."
        className="flex-1"
        disabled={disabled}
      />
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={e => setFiles(e.target.files ?? undefined)}
        className="hidden"
        id="chat-file-upload"
      />
      <label htmlFor="chat-file-upload" className="cursor-pointer px-3 py-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200">
        <span className="material-symbols-outlined">attach_file</span>
      </label>
      <Button type="submit" disabled={disabled} className="ml-2">
        <span className="material-symbols-outlined">send</span>
      </Button>
    </form>
  );
} 