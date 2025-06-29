import { useState } from "react";
import { Copy, Languages, LoaderCircle } from "lucide-react";
import Button from "@/components/UI/Button";
import { useTheme } from "@/theme/ThemeProvider";
import LanguageSelectionModal from "./LanguageSelectionModal";
import { availableLanguages } from "@/lib/availableLanguages";

export default function CodeBlockActions({
  onCopy,
  small,
  currentLanguage,
  onLanguageChange,
  existingConversions = [],
  isLoading = false, 
}: {
  onCopy?: () => void;
  small?: boolean;
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  existingConversions?: string[];
  isLoading?: boolean; 
}) {
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const size = small ? 16 : 18;
  const padding = small ? "p-1" : "p-2";

  return (
    <>
      <div className="flex items-center gap-2 absolute bottom-2 right-4 z-10">
        {availableLanguages.length > 0 && (
          <Button
            type="button"
            onClick={() => setIsModalOpen(true)}
            disabled={isLoading}
            className="flex items-center gap-2 pl-2 pr-3 py-1 text-xs rounded-md shadow transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
            style={{
              backgroundColor: theme.buttonBg,
              borderColor: theme.buttonBorder,
              color: theme.inputText,
            }}
            aria-label="Convert code to another language"
          >
            {isLoading ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : (
              <Languages size={16} className="opacity-80" />
            )}
            <span>{currentLanguage}</span>
          </Button>
        )}

        <Button
          type="button"
          onClick={onCopy}
          disabled={isLoading} 
          className={`rounded-full ${padding} shadow transition hover:scale-110 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-70`}
          aria-label="Copy code"
          style={{
            backgroundColor: theme.buttonBg,
            borderColor: theme.buttonBorder,
            color: theme.inputText,
          }}
        >
          <Copy size={size} />
        </Button>
      </div>

      <LanguageSelectionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={onLanguageChange}
        existingConversions={existingConversions.map((c) => c.toLowerCase())}
        currentLanguage={currentLanguage}
      />
    </>
  );
}