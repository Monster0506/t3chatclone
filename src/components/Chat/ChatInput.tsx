import Input from '../UI/Input';
import Button from '../UI/Button';
import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { Paperclip, Send, X } from 'lucide-react';

interface ChatInputProps {
  input: string;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>, files?: FileList) => void;
  disabled?: boolean;
}

export default function ChatInput({ input, onInputChange, onSubmit, disabled }: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const session = useSession();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files ?? undefined);
  };

  const removeFile = (index: number) => {
    if (!files) return;
    const dt = new DataTransfer();
    Array.from(files).forEach((file, i) => {
      if (i !== index) dt.items.add(file);
    });
    setFiles(dt.files);
    if (fileInputRef.current) {
      fileInputRef.current.files = dt.files;
    }
  };

  return (
    <form
      className="flex flex-col gap-2 p-4 border-t border-purple-100 bg-white"
      onSubmit={e => {
        onSubmit(e, files);
        setFiles(undefined);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }}
    >
      {/* Selected files preview */}
      {files && files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {Array.from(files).map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg text-sm"
            >
              <span className="truncate max-w-[200px]">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-purple-500 hover:text-purple-700"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={onInputChange}
          placeholder="Type your message here..."
          className="flex-1 text-black"
          disabled={disabled || !session}
        />
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          id="chat-file-upload"
          disabled={!session}
          accept="image/*"
        />
        <label htmlFor="chat-file-upload" className="cursor-pointer px-3 py-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200">
          <Paperclip size={20} />
        </label>
        <Button type="submit" disabled={disabled} className="ml-2">
          <Send size={20} />
        </Button>
      </div>
    </form>
  );
} 