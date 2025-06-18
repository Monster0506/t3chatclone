import { useState } from "react";
import { ChevronDown, X } from "lucide-react"; // Added X for close button
import { Theme } from "@/lib/types";

// A more elaborate icon for visual appeal
const SwirlIcon = ({ theme }: { theme: Theme | undefined }) => {
  if (!theme) return null;
  return (
    <div
      className="relative w-8 h-8 rounded-full overflow-hidden flex items-center justify-center"
      style={{
        background: `linear-gradient(45deg, ${theme.representativeBg}, ${theme.foreground})`,
        boxShadow: `0 0 8px 2px ${theme.buttonBorder}`,
      }}
    >
      <div
        className="absolute w-5 h-5 rounded-full"
        style={{
          background: theme.inputText,
          transform: "scale(0.6)",
          opacity: 0.8,
          filter: "blur(1px)",
        }}
      ></div>
      <div
        className="absolute w-3 h-3 rounded-full"
        style={{
          background: theme.buttonBorder,
          transform: "translate(-6px, 6px)",
          opacity: 0.9,
        }}
      ></div>
      <div
        className="absolute w-2 h-2 rounded-full"
        style={{
          background: theme.foreground,
          transform: "translate(6px, -6px)",
          opacity: 0.7,
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
        className="w-full px-6 py-3 rounded-2xl border flex items-center justify-between text-xl font-semibold shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none cursor-pointer"
        style={{
          background: currentTheme.inputGlass,
          color: currentTheme.inputText,
          borderColor: currentTheme.buttonBorder,
          boxShadow: `0 4px 15px rgba(0,0,0,0.2), inset 0 0 10px ${currentTheme.buttonBorder}`,
        }}
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-center gap-4">
          <SwirlIcon theme={selectedThemeObject} />
          <span>{selectedThemeName}</span>
        </div>
        <span className="text-sm">
          <ChevronDown className="w-6 h-6" />
        </span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(0,0,0,0.6)", // Dark overlay for background blur effect
            backdropFilter: "blur(8px)",
          }}
          onClick={() => setIsOpen(false)} // Close popup when clicking outside
        >
          <div
            className="relative w-full max-w-2xl rounded-3xl p-6 shadow-2xl animate-fade-in-up"
            style={{
              background: `linear-gradient(145deg, ${currentTheme.inputGlass}, ${currentTheme.buttonGlass})`,
              borderColor: currentTheme.buttonBorder,
              borderWidth: "2px",
              backdropFilter: "blur(20px)",
              boxShadow: `0 8px 30px rgba(0,0,0,0.4), inset 0 0 20px ${currentTheme.foreground}`,
            }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the popup
          >
            <button
              type="button"
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-8 h-8" />
            </button>

            <h2
              className="text-3xl font-bold mb-6 text-center"
              style={{ color: currentTheme.inputText }}
            >
              Choose Your Theme
            </h2>

            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {themes.map((t) => {
                const isSelected = selectedThemeName === t.name;
                return (
                  <li
                    key={t.name}
                    className="p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-4"
                    style={{
                      color: currentTheme.inputText,
                      backgroundColor: isSelected
                        ? currentTheme.buttonGlass
                        : "transparent",
                      border: `1px solid ${
                        isSelected ? currentTheme.foreground : "transparent"
                      }`,
                      boxShadow: isSelected
                        ? `0 0 15px ${currentTheme.buttonBorder}`
                        : "none",
                    }}
                    onClick={() => handleSelect(t.name)}
                  >
                    <SwirlIcon theme={t} />
                    <span className="text-xl font-medium">{t.name}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}