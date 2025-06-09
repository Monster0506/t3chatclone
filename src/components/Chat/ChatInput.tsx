import Input from '../UI/Input';
import Button from '../UI/Button';
import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { Paperclip, Send, X, File as FileIcon, Image as ImageIcon } from 'lucide-react';

interface ChatInputProps {
  input: string;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>, files?: FileList) => void;
  disabled?: boolean;
}

function FilePreview({ files, onRemove }: { files: FileList, onRemove: (index: number) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-1">
      {Array.from(files).map((file, index) => {
        const isImage = file.type.startsWith('image/');
        return (
          <div
            key={index}
            className="flex items-center gap-2 bg-purple-50 text-purple-700 px-2 py-1.5 rounded-lg text-sm border border-purple-200 shadow-sm"
          >
            <div className="flex items-center justify-center w-8 h-8 bg-white rounded-md border border-purple-100">
              {isImage ? <ImageIcon size={20} /> : <FileIcon size={20} />}
            </div>
            <span className="truncate max-w-[80px]">{file.name}</span>
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="text-purple-400 hover:text-purple-700 ml-auto"
              aria-label="Remove file"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
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
      className="w-full max-w-2xl mx-auto p-2 sm:p-3 bg-white rounded-2xl shadow border border-purple-100 flex flex-col gap-2"
      onSubmit={e => {
        onSubmit(e, files);
        setFiles(undefined);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }}
    >
      {/* Selected files preview */}
      {files && files.length > 0 && (
        <FilePreview files={files} onRemove={removeFile} />
      )}
      <div className="flex items-center gap-2 w-full">
      <Input
        value={input}
        onChange={onInputChange}
        placeholder="Type your message here..."
          className="flex-1 min-w-0 max-w-full text-black bg-purple-50 rounded-lg px-3 py-2 border border-purple-200"
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
        <label htmlFor="chat-file-upload" className="cursor-pointer p-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 flex-shrink-0">
          <Paperclip size={20} />
      </label>
        <Button type="submit" disabled={disabled} className="ml-1 flex-shrink-0 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow hover:from-purple-600 hover:to-pink-600">
          <Send size={20} />
      </Button>
      </div>
    </form>
  );
} 