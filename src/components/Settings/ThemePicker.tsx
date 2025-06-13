import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Theme } from "@/lib/types";

const CrescentIcon = ({ theme }: { theme: Theme | undefined }) => {
  if (!theme) return null;
  return (
    <div
      className="w-5 h-5 rounded-full relative overflow-hidden"
      style={{
        backgroundColor: theme.foreground,
        borderColor: theme.buttonBorder,
        borderWidth: "1px",
        boxSizing: "border-box",
      }}
    >
      <div
        className="w-full h-full rounded-full absolute top-0"
        style={{
          backgroundColor: theme.representativeBg,
          left: "3px", 
        }}
      ></div>
    </div>
  );
};

interface ThemePickerProps {
  selectedThemeName: string;
  onThemeSelect: (themeName: string) => void;
  themes: Theme[];
  currentTheme: Theme; 
}

export default function ThemePicker({
  selectedThemeName,
  onThemeSelect,
  themes,
  currentTheme,
}: ThemePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (themeName: string) => {
    onThemeSelect(themeName);
    setIsOpen(false);
  };

  const selectedThemeObject = themes.find((t) => t.name === selectedThemeName);

  return (
    <div className="relative">
      <button
        type="button"
        className="w-full px-4 py-2 rounded-xl border flex items-center justify-between text-lg shadow focus:outline-none cursor-pointer"
        style={{
          background: currentTheme.inputGlass,
          color: currentTheme.inputText,
          borderColor: currentTheme.buttonBorder,
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <span>{selectedThemeName}</span>
          <CrescentIcon theme={selectedThemeObject} />
        </div>
        <span className="text-xs">
          <ChevronDown className="w-4 h-4" />
        </span>
      </button>

      {isOpen && (
        <ul
          className="absolute z-10 w-full mt-1 rounded-xl shadow-lg max-h-60 overflow-auto p-1"
          style={{
            background: currentTheme.inputGlass,
            borderColor: currentTheme.buttonBorder,
            borderWidth: "1px",
            backdropFilter: "blur(12px)",
          }}
        >
          {themes.map((t) => {
            const isSelected = selectedThemeName === t.name;
            return (
              <li
                key={t.name}
                className="px-3 py-2 cursor-pointer rounded-lg transition-colors duration-200"
                style={{
                  color: currentTheme.inputText,
                  backgroundColor: isSelected
                    ? currentTheme.buttonGlass
                    : "transparent",
                }}
                onClick={() => handleSelect(t.name)}
                onMouseEnter={(e) => {
                  if (!isSelected)
                    e.currentTarget.style.backgroundColor =
                      currentTheme.buttonGlass;
                }}
                onMouseLeave={(e) => {
                  if (!isSelected)
                    e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <div className="flex items-center gap-3">
                  <span>{t.name}</span>
                  <CrescentIcon theme={t} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}