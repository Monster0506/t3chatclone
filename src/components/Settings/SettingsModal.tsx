// components/Settings/SettingsModal.tsx
import { useState, useEffect, useRef } from "react";
import Button from "@/components/UI/Button";
import Spinner from "@/components/UI/Spinner";
import Card from "@/components/UI/Card";
import Input from "@/components/UI/Input";
import ThemePicker from "./ThemePicker"; 
import { useTheme } from "@/theme/ThemeProvider";
import { supabase } from "@/lib/supabase/client";

const TRAIT_LIMIT = 50;
const TRAIT_MAX_LENGTH = 100;
const NAME_LIMIT = 50;
const OCCUPATION_LIMIT = 100;
const EXTRA_LIMIT = 3000;

const defaultTraits = [
  "friendly",
  "witty",
  "concise",
  "curious",
  "empathetic",
  "creative",
  "patient",
];

export default function SettingsModal({
  open,
  onClose,
  onSave,
  initial,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (settings: any) => void;
  initial?: any;
  loading?: boolean;
}) {
  const [name, setName] = useState(initial?.name || "");
  const [occupation, setOccupation] = useState(initial?.occupation || "");
  const [traits, setTraits] = useState<string[]>(
    initial?.traits || defaultTraits
  );
  const [traitInput, setTraitInput] = useState("");
  const [extra, setExtra] = useState(initial?.extra || "");
  const { theme, setTheme, themes } = useTheme();
  const [selectedThemeName, setSelectedThemeName] = useState(
    initial?.theme || theme.name
  );
  const [logoutLoading, setLogoutLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initial) {
      setName(initial.name || "");
      setOccupation(initial.occupation || "");
      setTraits(initial.traits || defaultTraits);
      setExtra(initial.extra || "");
      setSelectedThemeName(initial.theme || theme.name);
    }
  }, [initial, theme.name]);

  useEffect(() => {
    setSelectedThemeName(theme.name);
  }, [theme.name]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  const addTrait = (trait: string) => {
    if (
      trait &&
      !traits.includes(trait) &&
      traits.length < TRAIT_LIMIT &&
      trait.length <= TRAIT_MAX_LENGTH
    ) {
      setTraits([...traits, trait]);
    }
  };

  const removeTrait = (trait: string) => {
    setTraits(traits.filter((t) => t !== trait));
  };

  const handleThemeSelection = (themeName: string) => {
    setSelectedThemeName(themeName);
    setTheme(themeName); // Update the global theme context
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    await supabase.auth.signOut();
    setLogoutLoading(false);
    onClose();
    window.location.reload();
  };

  if (!open) return null;

  return loading ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <Spinner />
    </div>
  ) : (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <Card
        ref={modalRef}
        className="w-full max-w-lg p-8 relative rounded-2xl shadow-xl"
        style={{ background: theme.glass, borderColor: theme.buttonBorder }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
        >
          ×
        </button>
        <h2
          className="text-2xl font-bold mb-6"
          style={{ color: theme.buttonText }}
        >
          Customize T3 Clone
        </h2>

        <div className="mb-4">
          <label
            className="block mb-1 font-semibold"
            style={{ color: theme.buttonText }}
          >
            Theme
          </label>
          <ThemePicker
            selectedThemeName={selectedThemeName}
            onThemeSelect={handleThemeSelection}
            themes={themes}
            currentTheme={theme}
          />
        </div>

        <div className="mb-4">
          <label
            className="block mb-1 font-semibold"
            style={{ color: theme.buttonText }}
          >
            What should T3 Clone call you?
          </label>
          <Input
            maxLength={NAME_LIMIT}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full"
            style={{
              background: theme.inputGlass,
              color: theme.inputText,
              borderColor: theme.buttonBorder,
            }}
          />
          <div className="text-xs opacity-60 text-right">
            {name.length}/{NAME_LIMIT}
          </div>
        </div>

        <div className="mb-4">
          <label
            className="block mb-1 font-semibold"
            style={{ color: theme.buttonText }}
          >
            What do you do?
          </label>
          <Input
            maxLength={OCCUPATION_LIMIT}
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            placeholder="Engineer, student, etc."
            className="w-full"
            style={{
              background: theme.inputGlass,
              color: theme.inputText,
              borderColor: theme.buttonBorder,
            }}
          />
          <div className="text-xs opacity-60 text-right">
            {occupation.length}/{OCCUPATION_LIMIT}
          </div>
        </div>

        <div className="mb-4">
          <label
            className="block mb-1 font-semibold"
            style={{ color: theme.buttonText }}
          >
            T3 traits
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {traits.map((trait) => (
              <span
                key={trait}
                className="px-2 py-1 rounded-full text-sm flex items-center gap-1 shadow"
                style={{
                  background: theme.inputGlass,
                  color: theme.inputText,
                }}
              >
                {trait}
                <button
                  onClick={() => removeTrait(trait)}
                  className="hover:text-purple-300"
                  style={{ color: theme.buttonText }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={traitInput}
              onChange={(e) => setTraitInput(e.target.value)}
              placeholder="Add trait"
              className="flex-1"
              maxLength={TRAIT_MAX_LENGTH}
              style={{
                background: theme.inputGlass,
                color: theme.inputText,
                borderColor: theme.buttonBorder,
              }}
            />
            <Button
              type="button"
              onClick={() => {
                addTrait(traitInput);
                setTraitInput("");
              }}
              style={{
                background: theme.buttonGlass,
                color: theme.buttonText,
                borderColor: theme.buttonBorder,
              }}
            >
              Add
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <label
            className="block mb-1 font-semibold"
            style={{ color: theme.buttonText }}
          >
            Anything else T3 Clone should know about you?
          </label>
          <textarea
            className="w-full rounded-xl border px-3 py-2 min-h-[80px]"
            style={{
              background: theme.inputGlass,
              color: theme.inputText,
              borderColor: theme.buttonBorder,
            }}
            maxLength={EXTRA_LIMIT}
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            placeholder="Interests, values, or preferences to keep in mind"
          />
          <div className="text-xs opacity-60 text-right">
            {extra.length}/{EXTRA_LIMIT}
          </div>
        </div>

        <div className="flex justify-end gap-2 mb-4">
          <Button
            type="button"
            className="bg-neutral-700 hover:bg-neutral-800"
            style={{
              background: theme.inputGlass,
              color: theme.buttonText,
              borderColor: theme.buttonBorder,
            }}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() =>
              onSave({
                name,
                occupation,
                traits,
                extra,
                theme: selectedThemeName,
              })
            }
            style={{
              background: theme.buttonBg,
              color: theme.buttonText,
              borderColor: theme.buttonBorder,
            }}
          >
            Save
          </Button>
        </div>

        <Button
          type="button"
          onClick={handleLogout}
          className="w-full py-3 mt-2 font-bold rounded-xl shadow-lg"
          style={{
            background: theme.buttonGlass,
            color: theme.buttonText,
            borderColor: theme.buttonBorder,
            opacity: logoutLoading ? 0.7 : 1,
          }}
          disabled={logoutLoading}
        >
          {logoutLoading ? "Logging out..." : "Log out"}
        </Button>
      </Card>
    </div>
  );
}