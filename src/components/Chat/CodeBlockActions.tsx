import { Copy, Languages } from "lucide-react";
import Button from "@/components/UI/Button";
import { useTheme } from "@/theme/ThemeProvider";
import Select from "@/components/UI/Select";

export default function CodeBlockActions({
  onCopy,
  small,
  availableLanguages,
  currentLanguage,
  onLanguageChange,
}: {
  onCopy?: () => void;
  small?: boolean;
  availableLanguages: string[];
  currentLanguage?: string;
  onLanguageChange: (language: string) => void;
}) {
  const { theme } = useTheme();
  const size = small ? 16 : 18;
  const padding = small ? "p-1" : "p-2";

  return (
    <div className="flex items-center gap-2 absolute bottom-2 right-4 z-10">
      {/* Language Selector Dropdown */}
      {availableLanguages.length > 0 && (
        <div className="relative flex items-center">
          <Languages
            size={16}
            className="absolute left-2 pointer-events-none opacity-60"
            style={{ color: theme.inputText }}
          />
          <Select
            value={currentLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="pl-8 pr-2 py-1 text-xs rounded-md border appearance-none cursor-pointer"
            style={{
              backgroundColor: theme.buttonBg,
              borderColor: theme.buttonBorder,
              color: theme.inputText,
            }}
            aria-label="Select code language"
          >
            {availableLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
            <option
              key="--convert--"
              value="--convert--"
              className="font-bold"
            >
              Convert...
            </option>
          </Select>
        </div>
      )}

      {/* Copy Button */}
      <Button
        type="button"
        onClick={onCopy}
        className={`rounded-full ${padding} shadow transition hover:scale-110 focus:ring-2`}
        aria-label="Copy code"
      >
        <Copy size={size} />
      </Button>
    </div>
  );
}