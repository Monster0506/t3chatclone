import Button from "@/components/UI/Button";
import { ChangeEvent, FormEvent, useRef, useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import {
  Paperclip,
  Send,
  X,
  File as FileIcon,
  Image as ImageIcon,
} from "lucide-react";
import { useTheme } from "@/theme/ThemeProvider";
import { useAutocomplete } from "@/hooks/use-autocomplete";

interface ChatInputProps {
  input: string;
  onInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>, files?: FileList) => void;
  disabled?: boolean;
}

function FilePreview({
  files,
  onRemove,
}: {
  files: FileList;
  onRemove: (index: number) => void;
}) {
  const { theme } = useTheme();
  return (
    <div className="flex flex-wrap gap-2 mb-2 px-1">
      {Array.from(files).map((file, index) => {
        const isImage = file.type.startsWith("image/");
        return (
          <div
            key={index}
            className="flex items-center gap-2 rounded-full px-3 py-1 shadow"
            style={{
              background: theme.inputGlass,
              color: theme.inputText,
              border: `1px solid ${theme.buttonBorder}`,
            }}
          >
            <div
              className="flex items-center justify-center w-7 h-7 rounded-full mr-1"
              style={{ background: theme.glass, color: theme.inputText }}
            >
              {isImage ? <ImageIcon size={16} /> : <FileIcon size={16} />}
            </div>
            <span className="truncate max-w-[90px] text-xs font-medium">
              {file.name}
            </span>
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="ml-1 rounded-full p-1 hover:opacity-80 transition"
              style={{ color: theme.buttonText, background: theme.inputGlass }}
              aria-label="Remove file"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// New component for displaying suggestions
function SuggestionBox({
  suggestion,
  onAccept,
  onDismiss,
  isLoading,
}: {
  suggestion: string;
  onAccept: () => void;
  onDismiss: () => void;
  isLoading: boolean;
}) {
  const { theme } = useTheme();

  // Don't render if there's no suggestion and we are not loading a new one
  if (!suggestion && !isLoading) return null;

  return (
    <div
      className="flex items-center justify-between gap-4 mb-2 px-3 py-2 rounded-lg shadow-md"
      style={{
        background: theme.inputGlass,
        border: `1px solid ${theme.buttonBorder}`,
      }}
    >
      {isLoading && !suggestion ? (
        <p className="text-sm italic" style={{ color: theme.inputText }}>
          Thinking...
        </p>
      ) : (
        <>
          <p className="text-sm" style={{ color: theme.inputText }}>
            {suggestion}
          </p>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={onAccept}
              className="text-xs font-semibold px-2 py-1 rounded-md hover:opacity-80 transition"
              style={{ background: theme.buttonBg, color: theme.buttonText }}
            >
              Accept <span className="ml-1 text-xs opacity-70">[Tab]</span>
            </button>
            <button
              type="button"
              onClick={onDismiss}
              className="p-1 rounded-full hover:opacity-80 transition"
              style={{ color: theme.inputText }}
              aria-label="Dismiss suggestion"
            >
              <X size={14} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function ChatInput({
  input,
  onInputChange,
  onSubmit,
  disabled,
}: ChatInputProps) {
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const session = useSession();
  const textareaRef = useRef<HTMLTextAreaElement>(null!);
  const [cursorPosition, setCursorPosition] = useState(0);
  const { suggestion, isLoading, acceptSuggestion, setSuggestion } =
    useAutocomplete({
      input,
      cursorPosition,
      onInputChange,
      textareaRef,
      setCursorPosition,
    });

  useEffect(() => {
    function handleFocusEvent() {
      textareaRef.current?.focus();
    }
    window.addEventListener("focus-chat-input", handleFocusEvent);

    return () => window.removeEventListener("focus-chat-input", handleFocusEvent);
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0 && !input.trim()) {
      onInputChange({
        target: { value: "analyze this file:" },
      } as React.ChangeEvent<HTMLTextAreaElement>);
    }
    setFiles(selectedFiles ?? undefined);
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

  const dismissSuggestion = () => {
    setSuggestion("");
  };

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (suggestion && e.key === "Tab") {
      e.preventDefault();
      acceptSuggestion();
      return;
    }

    if (e.key === "Enter") {
      if (e.shiftKey) {
        return;
      } else {
        e.preventDefault();
        const form =
          textareaRef.current?.form || (e.target as HTMLTextAreaElement)?.form;
        if (form) {
          form.requestSubmit();
        }
      }
    } else if (e.ctrlKey && (e.key === "Backspace" || e.key === "Delete")) {
      e.preventDefault();
      onInputChange({
        ...e,
        target: { ...textareaRef.current, value: "" },
      } as any);
    }
  }

  return (
    <form
      className="w-full max-w-2xl mx-auto flex flex-col"
      onSubmit={(e) => {
        onSubmit(e, files);
        setFiles(undefined);
        setSuggestion(""); // Clear suggestion on submit
        if (fileInputRef.current) fileInputRef.current.value = "";
      }}
    >
      {/* The new suggestion box is rendered here, above other elements */}
      <SuggestionBox
        suggestion={suggestion}
        onAccept={acceptSuggestion}
        onDismiss={dismissSuggestion}
        isLoading={isLoading}
      />

      {files && files.length > 0 && (
        <FilePreview files={files} onRemove={removeFile} />
      )}
      <div
        className="flex items-center gap-2 w-full p-2 rounded-2xl shadow-xl"
        style={{
          background: theme.glass,
          border: `1.5px solid ${theme.buttonBorder}`,
          boxShadow: "0 8px 32px 0 rgba(31,38,135,0.10)",
        }}
      >
        <div className="relative flex-1">
          {/* The textarea no longer needs the complex overlay structure */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              const target = e.target as HTMLTextAreaElement;
              setCursorPosition(target.selectionStart || 0);
              onInputChange(e);
            }}
            onKeyDown={handleKeyDown}
            onSelect={(e) => {
              const target = e.target as HTMLTextAreaElement;
              setCursorPosition(target.selectionStart || 0);
            }}
            onClick={(e) => {
              const target = e.target as HTMLTextAreaElement;
              setCursorPosition(target.selectionStart || 0);
            }}
            placeholder="Type your message here..."
            className="w-full min-w-0 text-base px-4 py-3 rounded-xl resize-none border-none bg-transparent focus:outline-none"
            style={{
              color: theme.inputText,
              caretColor: theme.inputText,
            }}
            rows={1}
            disabled={disabled || !session}
          />
        </div>
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
        <label
          htmlFor="chat-file-upload"
          className="cursor-pointer p-2 rounded-full flex-shrink-0 transition"
          style={{
            background: theme.inputGlass,
            color: theme.inputText,
            border: `1px solid ${theme.buttonBorder}`,
          }}
        >
          <Paperclip size={20} />
        </label>
        <Button
          type="submit"
          disabled={disabled}
          className="ml-1 flex-shrink-0 px-5 py-3 rounded-full font-semibold shadow-lg text-lg transition"
          style={{
            background: theme.buttonBg,
            color: theme.buttonText,
            borderColor: theme.buttonBorder,
            boxShadow: "0 4px 16px 0 rgba(31,38,135,0.10)",
          }}
        >
          <Send size={22} />
        </Button>
      </div>
    </form>
  );
}