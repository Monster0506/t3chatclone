// components/Settings/SettingsModal.tsx
import { useState, useEffect, useRef, ElementType } from "react";
import Button from "@/components/UI/Button";
import Spinner from "@/components/UI/Spinner";
import Card from "@/components/UI/Card";
import Input from "@/components/UI/Input";
import ThemePicker from "./ThemePicker";
import { useTheme } from "@/theme/ThemeProvider";
import { supabase } from "@/lib/supabase/client";
import {
  GraduationCap,
  Lightbulb,
  Code2,
  Leaf,
  Rocket,
  Globe,
  Check,
  ChevronDown,
} from "lucide-react";
// Make sure to import your themes array, e.g.:
// import { themes } from '@/theme/themeData';

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

interface Persona {
  title: string;
  description: string;
  icon: ElementType;
  settings: {
    traits: string[];
    extra: string;
  };
}

const personas: Persona[] = [
  {
    title: "Socratic Tutor",
    description: "Helps you learn by asking thought-provoking questions.",
    icon: GraduationCap,
    settings: {
      traits: ["inquisitive", "patient", "analytical", "encouraging"],
      extra:
        "You are a Socratic Tutor. Your goal is to help the user learn by asking thought-provoking questions. Guide them through complex topics by breaking them down and asking questions, rather than giving direct answers. Help them think for themselves and arrive at their own understanding.",
    },
  },
  {
    title: "Brainstorming Partner",
    description: "A creative collaborator for generating new ideas.",
    icon: Lightbulb,
    settings: {
      traits: ["creative", "open-minded", "energetic", "supportive"],
      extra:
        "You are a creative strategist and brainstorming partner. Your goal is to help the user generate new ideas. Build on their concepts, offer different perspectives, and help find connections they might have missed. No idea is too wild.",
    },
  },
  {
    title: "Code Reviewer",
    description: "Provides feedback on code for quality and best practices.",
    icon: Code2,
    settings: {
      traits: ["detail-oriented", "precise", "constructive", "knowledgeable"],
      extra:
        "You are a Senior Software Engineer acting as a code reviewer. Review the user's code for correctness, style, performance, and security. Provide specific, actionable feedback and explain the reasoning behind your suggestions, citing best practices.",
    },
  },
  {
    title: "Mindful Companion",
    description: "Offers a calm and supportive presence for reflection.",
    icon: Leaf,
    settings: {
      traits: ["calm", "empathetic", "present", "non-judgmental"],
      extra:
        "You are a Mindful Companion. Your purpose is to provide a calm, grounding, and non-judgmental presence. The user can talk to you about their thoughts and feelings. You can guide them through simple mindfulness exercises or just offer a supportive space.",
    },
  },
  {
    title: "Pitch Coach",
    description: "Helps you refine your business ideas and pitches.",
    icon: Rocket,
    settings: {
      traits: ["strategic", "critical", "encouraging", "concise"],
      extra:
        "You are a Pitch Coach and Venture Capitalist. Your role is to help the user sharpen their ideas and perfect their pitch. Act as a friendly but critical investor, asking tough questions about their business model, market, and strategy to make their presentation compelling.",
    },
  },
  {
    title: "World Explorer",
    description: "Shares facts about history, culture, and geography.",
    icon: Globe,
    settings: {
      traits: ["curious", "adventurous", "storyteller", "knowledgeable"],
      extra:
        "You are a World Explorer, historian, and geographer. You are an avid explorer of our world's history, cultures, and geography. Share stories and little-known facts that bring the world to life when asked about different topics.",
    },
  },
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
  const [activePersona, setActivePersona] = useState<string | null>(null);
  const [isPersonaSelectorOpen, setIsPersonaSelectorOpen] = useState(false);
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
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!activePersona) return;
    const persona = personas.find((p) => p.title === activePersona);
    if (!persona) return;

    const traitsAreEqual =
      traits.length === persona.settings.traits.length &&
      traits.every((trait) => persona.settings.traits.includes(trait));

    if (!traitsAreEqual || extra !== persona.settings.extra) {
      setActivePersona(null);
    }
  }, [traits, extra, activePersona]);

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
    setTheme(themeName);
  };

  const handlePersonaSelect = (persona: Persona) => {
    setTraits(persona.settings.traits);
    setExtra(persona.settings.extra);
    setActivePersona(persona.title);
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <Card
        ref={modalRef}
        className="w-full max-w-lg flex flex-col relative rounded-2xl shadow-xl max-h-[90vh]"
        style={{ background: theme.glass, borderColor: theme.buttonBorder }}
      >
        <div
          className="p-8 pb-6 border-b"
          style={{ borderColor: theme.buttonBorder + "40" }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl z-10"
          >
            ×
          </button>
          <h2
            className="text-2xl font-bold"
            style={{ color: theme.buttonText }}
          >
            Customize T3 Clone
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
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
              What should T3 Clone call you? (Your Name)
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
              What do you do? (Your Occupation)
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
              AI Traits
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
              Custom Instructions for T3 Clone
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
              placeholder="Define the AI's personality, role, and rules. E.g., 'You are a formal and professional editor.'"
            />
            <div className="text-xs opacity-60 text-right">
              {extra.length}/{EXTRA_LIMIT}
            </div>
          </div>

          {/* Expandable Persona Selector */}
          <div className="text-center my-4">
            <div
              className="opacity-60 text-sm mb-2"
              style={{ color: theme.buttonText }}
            >
              — or —
            </div>
            <button
              onClick={() => setIsPersonaSelectorOpen(!isPersonaSelectorOpen)}
              className="inline-flex items-center gap-2 text-sm font-semibold"
              style={{ color: theme.buttonText }}
            >
              Browse Pre-made Personas
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  isPersonaSelectorOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              isPersonaSelectorOpen ? "max-h-[500px] mt-4" : "max-h-0"
            }`}
          >
            <div className="space-y-2">
              {personas.map((persona) => (
                <button
                  key={persona.title}
                  onClick={() => handlePersonaSelect(persona)}
                  className={`w-full flex items-center p-3 rounded-lg text-left transition-all border-2 hover:bg-white/5`}
                  style={{
                    borderColor:
                      activePersona === persona.title
                        ? theme.buttonBg
                        : theme.buttonBorder,
                  }}
                >
                  <persona.icon
                    className="w-6 h-6 mr-4 flex-shrink-0"
                    style={{ color: theme.buttonText }}
                  />
                  <div>
                    <h4
                      className="font-bold"
                      style={{ color: theme.buttonText }}
                    >
                      {persona.title}
                    </h4>
                    <p className="text-xs opacity-80">{persona.description}</p>
                  </div>
                  {activePersona === persona.title && (
                    <Check
                      className="w-5 h-5 ml-auto flex-shrink-0"
                      style={{ color: theme.buttonBg }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className="p-8 pt-6 border-t"
          style={{ borderColor: theme.buttonBorder + "40" }}
        >
          <div className="flex justify-end gap-2 mb-4">
            <Button
              type="button"
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
        </div>
      </Card>
    </div>
  );
}