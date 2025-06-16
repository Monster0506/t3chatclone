'use client';
import { useRouter } from 'next/navigation';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase/client';
import { useRef, useState } from 'react';
import Button from '@/components/UI/Button';
import ThemePicker from '@/components/Settings/ThemePicker';
import { useTheme } from '@/theme/ThemeProvider';
import {
  Lightbulb,
  BookText,
  Code,
  BrainCircuit,
  Sparkles,
  Rocket,
} from 'lucide-react';
import { Theme } from '@/lib/types';
import { FeaturesModal } from '@/components/Layout/FeaturesModal'; // Import the modal

// --- Helper: Suggestion Card for the new landing page ---
const SuggestionCard = ({
  icon,
  title,
  description,
  theme,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  theme: Theme;
}) => (
  <div
    className="p-4 rounded-xl text-left h-full transition-all duration-200 hover:scale-105"
    style={{
      background: theme.glass,
      border: `1px solid ${theme.buttonBorder}`,
    }}
  >
    <div className="flex items-center gap-3 mb-2">
      <div style={{ color: theme.buttonBg }}>{icon}</div>
      <h3 className="font-bold text-base">{title}</h3>
    </div>
    <p className="opacity-70 text-sm">{description}</p>
  </div>
);

export default function NewChatEntry() {
  const triggerButtonRef = useRef<HTMLDivElement | null>(null); // Ref for the trigger
  const session = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { theme, setTheme, themes } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme.name);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal

  const handleNewChat = async () => {
    if (!session?.user) return;
    setLoading(true);
    const { data } = await supabase
      .from('chats')
      .insert({
        user_id: session.user.id,
        title: 'New Chat',
        model: 'gemini-2.0-flash',
      })
      .select('id')
      .single();
    setLoading(false);
    if (data && data.id) {
      router.replace(`/chat/${data.id}`);
    }
  };

  const handleThemeSelect = (themeName: string) => {
    setSelectedTheme(themeName);
    setTheme(themeName);
  };

  return (
    <>
      <div
        className="flex-1 w-full overflow-y-hidden relative flex flex-col"
        style={{ background: theme.background, color: theme.foreground }}
      >
        <div
          className="absolute -top-48 -left-48 w-[600px] h-[600px] rounded-full opacity-30 blur-3xl z-0"
          style={{ background: theme.buttonBg }}
        />
        <div
          className="absolute -bottom-48 -right-48 w-[600px] h-[600px] rounded-full opacity-30 blur-3xl z-0"
          style={{ background: theme.buttonHover }}
        />

        <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex-grow flex flex-col items-center justify-center">
            <div
              className="p-3 rounded-full mb-6"
              style={{
                background: theme.glass,
                border: `1px solid ${theme.buttonBorder}`,
              }}
            >
              <Sparkles
                className="w-10 h-10"
                style={{ color: theme.buttonBg }}
              />
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
              Yet Another AI Chat App.
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-80 mb-8">
              The brief was &quot;build a cool AI chat app.&quot; I may have
              taken that a bit too seriously.
            </p>
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-2">Change the theme</h2>
              <ThemePicker
                selectedThemeName={selectedTheme}
                onThemeSelect={handleThemeSelect}
                themes={themes}
                currentTheme={theme}
              />
            </div>
            <div className="grid grid-cols-1  gap-4 w-full max-w-4xl mb-10">

              <Button
              onClick={handleNewChat}
              disabled={!session?.user || loading}
              className="px-8 py-4 text-xl font-semibold shadow-lg w-full sm:w-auto"
              style={{
                background: theme.buttonHover,
                color: theme.buttonText,
                borderColor: theme.buttonBorder,
                borderWidth: '1px',
              }}
            >
              {loading ? 'Spinning up...' : 'Fire It Up'}
            </Button>
            </div>

            
            {!session?.user && (
              <p className="mt-4 text-base opacity-70">
                You gotta sign in to play, chief.
              </p>
            )}
          </div>

          <footer className="w-full py-8 space-y-4">
            <div className="max-w-sm mx-auto flex flex-col items-center gap-4 mb-10 mt-10 border-2 shadow-lg">
              <Button
                onClick={() => setIsModalOpen(true)}
                className="w-full"
                style={{
                  background: theme.background,
                  color: theme.buttonText,
                  boxShadow: `0 0 10px 0 ${theme.buttonHover}`,
                }}
              >
                Behold, The Over-Engineering 
              </Button>
            </div>
            <p className="text-sm opacity-80">
              A project by{' '}
              <a
                href="https://monster0506.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline"
                style={{ color: theme.foreground }}
              >
                monster0506
              </a>
            </p>
          </footer>
        </main>
      </div>
      <FeaturesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        theme={theme}
        excludeRefs={[triggerButtonRef]}
      />
    </>
  );
}