import { useState, useEffect, useRef, useMemo } from "react";
import Card from "@/components/UI/Card";
import Input from "@/components/UI/Input";
import { useTheme } from "@/theme/ThemeProvider";
import { Search, X } from "lucide-react";
import { availableLanguages } from "@/lib/availableLanguages";
interface LanguageSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (language: string) => void;
  existingConversions: string[];
  currentLanguage: string;
}

export default function LanguageSelectionModal({
  open,
  onClose,
  onSelect,
  existingConversions,
  currentLanguage,
}: LanguageSelectionModalProps) {
  const { theme } = useTheme();
  const modalRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    if (!open) {
      setSearchTerm("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    if (open) {
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  const filteredLanguages = useMemo(() => {
    return availableLanguages.filter(
      (lang) =>
        lang.toLowerCase().includes(searchTerm.toLowerCase()) &&
        lang !== currentLanguage &&
        !existingConversions.includes(lang)
    );
  }, [searchTerm, availableLanguages, currentLanguage, existingConversions]);

  const handleSelect = (lang: string) => {
    onSelect(lang.toLowerCase());
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card
        ref={modalRef}
        className="w-full max-w-2xl h-[70vh] p-6 relative rounded-2xl shadow-xl flex flex-col"
        style={{ background: theme.glass, borderColor: theme.buttonBorder }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl z-10"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <h2
          className="text-2xl font-bold mb-4"
          style={{ color: theme.buttonText }}
        >
          Convert Code
        </h2>

        <div className="relative mb-4">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50"
            size={20}
            style={{ color: theme.inputText }}
          />
          <Input
            type="text"
            placeholder="Search for a language..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10"
            autoFocus
            style={{
              background: theme.inputGlass,
              color: theme.inputText,
              borderColor: theme.buttonBorder,
            }}
          />
        </div>

        <div className="overflow-y-auto flex-grow pr-2 -mr-2">
          {existingConversions.length > 0 && searchTerm.length === 0 && (
            <div className="mb-6">
              <h3
                className="font-semibold mb-2 text-lg"
                style={{ color: theme.buttonText }}
              >
                Existing Conversions
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {existingConversions.map((lang) => (
                  <button
                    key={lang.toLowerCase()}
                    onClick={() => handleSelect(lang)}
                    className="p-3 rounded-lg text-left transition-colors duration-200"
                    style={{
                      background: theme.buttonGlass,
                      color: theme.buttonText,
                    }}
                  >
                    {lang.toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3
              className="font-semibold mb-2 text-lg"
              style={{ color: theme.buttonText }}
            >
              {searchTerm.length > 0 ? "Search Results" : "All Languages"}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {filteredLanguages.map((lang) => (
                <button
                  key={lang.toLowerCase()}
                  onClick={() => handleSelect(lang)}
                  className="p-3 rounded-lg text-left transition-colors duration-200 hover:opacity-80"
                  style={{
                    background: theme.inputGlass,
                    color: theme.inputText,
                  }}
                >
                  {lang.toLowerCase()}
                </button>
              ))}
            </div>
            {filteredLanguages.length === 0 && (
              <p
                style={{ color: theme.inputText }}
                className="opacity-70 mt-4 text-center"
              >
                No matching languages found.
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}