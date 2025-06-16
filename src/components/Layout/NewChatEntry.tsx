'use client';
import { useRouter } from 'next/navigation';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase/client';
import { useState } from 'react';
import Button from '@/components/UI/Button';
import ThemePicker from '@/components/Settings/ThemePicker';
import { useTheme } from '@/theme/ThemeProvider';
import {
  Cpu,
  Server,
  Palette,
  Sparkles,
  CheckCircle2,
  Lightbulb,
  BookText,
  LayoutGrid,
  User,
  Briefcase,
  Bot,
  FileText,
  Code,
  Keyboard,
} from 'lucide-react';
import { Theme, SHORTCUTS, ShortcutGroup } from '@/lib/types';

// --- Helper: Checklist Item for Core/Bonus Features ---
const ChecklistItem = ({
  title,
  notes,
  status,
  theme,
}: {
  title: string;
  notes: string;
  status: string;
  theme: Theme;
}) => (
  <div
    className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-lg"
    style={{ border: `1px solid ${theme.buttonBorder}` }}
  >
    <div className="flex items-center gap-3 w-full sm:w-1/3 flex-shrink-0">
      {status === 'done' ? (
        <CheckCircle2 className="w-6 h-6 text-green-400" />
      ) : (
        <Lightbulb className="w-6 h-6 text-yellow-400" />
      )}
      <h3 className="font-bold text-lg">{title}</h3>
    </div>
    <p className="opacity-80 text-base w-full sm:w-2/3">{notes}</p>
  </div>
);

// --- Helper: Card for Unique Features ---
const UniqueFeatureCard = ({
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
    className="p-8 rounded-xl text-center flex flex-col items-center h-full"
    style={{
      background: theme.glass,
      border: `1px solid ${theme.buttonBorder}`,
    }}
  >
    <div className="mb-4 text-4xl" style={{ color: theme.buttonBg }}>
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-2">{title}</h3>
    <p className="opacity-80">{description}</p>
  </div>
);

// --- Helper: Detail item for the Personalization Card ---
const PersonalizationDetail = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 w-8 h-8 mt-1">{icon}</div>
    <div>
      <h4 className="font-bold">{title}</h4>
      <p className="text-sm opacity-80">{description}</p>
    </div>
  </div>
);

// --- Helper: Stat Card ---
const StatCard = ({
  value,
  label,
  icon,
  theme,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
  theme: Theme;
}) => (
  <div
    className="p-6 rounded-xl text-center flex flex-col justify-center"
    style={{
      background: theme.glass,
      border: `1px solid ${theme.buttonBorder}`,
    }}
  >
    <div
      className="mx-auto w-fit mb-2 text-3xl"
      style={{ color: theme.buttonBg }}
    >
      {icon}
    </div>
    <p className="text-4xl md:text-5xl font-extrabold">{value}</p>
    <p className="text-md mt-1 font-semibold opacity-80">{label}</p>
  </div>
);

// --- Helper: Shortcut Display ---
const ShortcutDisplay = ({
  shortcuts,
  theme,
}: {
  shortcuts: ShortcutGroup[];
  theme: Theme;
}) => (
  <div
    className="w-full text-left space-y-4 p-6 rounded-xl"
    style={{
      background: theme.glass,
      border: `1px solid ${theme.buttonBorder}`,
    }}
  >
    {shortcuts.map(group => (
      <div key={group.group}>
        <h4 className="font-semibold text-lg mb-2">{group.group}</h4>
        <div className="space-y-2">
          {group.items.map(item => (
            <div
              key={item.label}
              className="flex justify-between items-center text-sm"
            >
              <p className="opacity-80">{item.label}</p>
              <div className="flex items-center gap-1">
                {item.keys.map(key => (
                  <kbd
                    key={key}
                    className="px-2 py-1 text-xs font-mono rounded-md"
                    style={{
                      background: theme.inputBg,
                      border: `1px solid ${theme.buttonBorder}`,
                    }}
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default function NewChatEntry() {
  const session = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { theme, setTheme, themes } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme.name);

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
    <div
      className="flex-1 w-full overflow-y-auto relative"
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

      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-24 md:space-y-32">
        <section className="text-center">
          <div
            className="inline-block bg-opacity-10 text-sm font-semibold py-1 px-3 rounded-full mb-4"
            style={{
              background: theme.buttonGlass,
              color: theme.buttonBg,
            }}
          >
            Official Entry: T3 ChatCloneathon
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg">
            Yet Another AI Chat App.
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-80 mb-8">
            The brief was &quot;build a cool AI chat app.&quot; I may have taken
            that a bit too seriously.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button
              onClick={handleNewChat}
              disabled={!session?.user || loading}
              className="px-8 py-4 text-xl font-semibold shadow-lg w-full sm:w-auto"
            >
              {loading ? 'Spinning up...' : 'Fire It Up'}
            </Button>
            <a
              href="https://github.com/monster0506/t3chatclone"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button className="px-8 py-4 text-xl font-semibold shadow-lg w-full">
                Judge My Code
              </Button>
            </a>
          </div>
          <div
            className="max-w-md mx-auto p-4 rounded-xl"
            style={{ background: theme.buttonGlass }}
          >
            <p className="text-sm font-semibold mb-3 opacity-80">
              Don&apos;t Like the Vibe? Change It.
            </p>
            <ThemePicker
              selectedThemeName={selectedTheme}
              onThemeSelect={handleThemeSelect}
              themes={themes}
              currentTheme={theme}
            />
          </div>
        </section>

        <section>
          <h2 className="text-4xl font-bold text-center mb-12">
            Passing the Vibe Check
          </h2>
          <div className="max-w-5xl mx-auto space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-center sm:text-left">
                Core Requirements
              </h3>
              <div className="space-y-4">
                <ChecklistItem
                  status="done"
                  title="Chat with Various LLMs"
                  notes="Plumbed into the Vercel AI SDK to support 70+ models. Go on, pick your poison. Or your price point."
                  theme={theme}
                />
                <ChecklistItem
                  status="done"
                  title="Authentication & Sync"
                  notes="Full Supabase Auth with RLS so your questionable prompts are synced and secured across devices. No peeking."
                  theme={theme}
                />
                <ChecklistItem
                  status="done"
                  title="Browser Friendly"
                  notes="Fully responsive with Tailwind CSS. Works on Chrome, Firefox, Safari. If you test this on Internet Explorer, we are no longer friends."
                  theme={theme}
                />
                <ChecklistItem
                  status="done"
                  title="Easy to Try"
                  notes="One-click deploy on Vercel. I'm even footing the bill for a public Gemini Flash model, but there's a BYOK option for when you want to get serious. Just chuck it into the .env"
                  theme={theme}
                />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6 text-center sm:text-left">
                🔥 Bonus Features (aka Scope Creep)
              </h3>
              <div className="space-y-4">
                <ChecklistItem
                  status="done"
                  title="Advanced Calculator"
                  notes="Handles trig, logs, and even matrix operations, rendering the output (especially of matrices) beautifully. Your TI-84 is collecting dust anyway."
                  theme={theme}
                />
                <ChecklistItem
                  status="done"
                  title="Web Search"
                  notes="Integrated Wikipedia tool that shows a clean article preview before polluting the context window. I refuse to allow LLMs to use the internet unfettered."
                  theme={theme}
                />
                <ChecklistItem
                  status="done"
                  title="Attachment Support"
                  notes="Upload PDFs and images directly to Supabase Storage. The AI can see them, read them, and summarize them. Yes, it's as cool as it sounds."
                  theme={theme}
                />
                <ChecklistItem
                  status="done"
                  title="Full Chat Index"
                  notes="AI-generated summaries of long conversations, so you can find that one brilliant idea you had three weeks ago without endless scrolling."
                  theme={theme}
                />
                <ChecklistItem
                  status="done"
                  title="Chat Sharing"
                  notes="Share your genius (or horrifying) conversations with a single link. No take-backsies, because I forgot to implement making them private again."
                  theme={theme}
                />
                <ChecklistItem
                  status="done"
                  title="Syntax Highlighting"
                  notes="For 250+ languages. Because staring at uncolored code is a form of cruel and unusual punishment."
                  theme={theme}
                />
                <ChecklistItem
                  status="done"
                  title="Keyboard Shortcuts"
                  notes="A full suite of hotkeys because real pros don't use the mouse. Press Ctrl+? to see the cheat sheet."
                  theme={theme}
                />
                <ChecklistItem
                  status="done"
                  title="Mind-Reading Autocomplete"
                  notes="Starts completing your sentences as you type. It's either incredibly helpful or a sign the AI is getting a little too familiar. You decide."
                  theme={theme}
                />
                <ChecklistItem
                  status="idea"
                  title="Chat Branching"
                  notes="The 'Clone Chat' feature, because who doesn't love a good git fork on their conversations?"
                  theme={theme}
                />
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-4xl font-bold text-center mb-12">
            Where We Went Off-Script
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div
              className="p-8 rounded-xl md:col-span-3"
              style={{
                background: theme.glass,
                border: `1px solid ${theme.buttonBorder}`,
              }}
            >
              <h3 className="text-3xl font-bold mb-2">
                Stop Explaining Yourself to a Toaster.
              </h3>
              <p className="opacity-80 mb-8">
                We built a settings panel so you can make the AI your own
                personal, slightly-less-annoying intern.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <PersonalizationDetail
                  icon={<User style={{ color: theme.buttonBg }} />}
                  title="Custom Name"
                  description="So it stops calling you 'User.' Unless your name is actually User."
                />
                <PersonalizationDetail
                  icon={<Briefcase style={{ color: theme.buttonBg }} />}
                  title="Your Profession"
                  description="Tell it you're an engineer (or a pirate) for context-aware advice."
                />
                <PersonalizationDetail
                  icon={<Bot style={{ color: theme.buttonBg }} />}
                  title="AI Personality"
                  description="Pick from 6 presets or Frankenstein your own with custom traits. Want a sarcastic greengrocer engineer? Go for it."
                />
                <PersonalizationDetail
                  icon={<FileText style={{ color: theme.buttonBg }} />}
                  title="Persistent Instructions"
                  description="A 3000-character system prompt to hard-code its core directives. It's like .bashrc for your AI."
                />
              </div>
            </div>

            <UniqueFeatureCard
              icon={<LayoutGrid />}
              title="Advanced Chat Organization"
              description="For the user who color-codes their node_modules folder. Includes tags, archiving, and pinning."
              theme={theme}
            />
            <UniqueFeatureCard
              icon={<Code />}
              title="Polyglot Code Converter"
              description="Translate code snippets between 295+ languages. Perfect for porting a legacy COBOL function to Rust for... reasons."
              theme={theme}
            />
            <UniqueFeatureCard
              icon={<BookText />}
              title="Full Chat Index"
              description="AI-generated summaries of long conversations, letting you jump to any key point instantly. Because Ctrl+F is for amateurs."
              theme={theme}
            />
          </div>
        </section>

        <section>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">
              The Spec Sheet
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
              <StatCard
                value="70+"
                label="Available Brains"
                icon={<Cpu />}
                theme={theme}
              />
              <StatCard
                value="50+"
                label="UI Themes"
                icon={<Palette />}
                theme={theme}
              />
              <StatCard
                value="7"
                label="API Providers"
                icon={<Server />}
                theme={theme}
              />
              <StatCard
                value="15+"
                label="Over-Engineered Features"
                icon={<Sparkles />}
                theme={theme}
              />
            </div>
          </div>
        </section>

        <section>
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="text-center lg:text-left">
                <div
                  className="text-4xl mb-4 inline-block"
                  style={{ color: theme.buttonBg }}
                >
                  <Keyboard />
                </div>
                <h2 className="text-4xl font-bold mb-4">
                  For the Keyboard Warriors
                </h2>
                <p className="text-lg opacity-80">
                  Because clicking is for mortals. A full suite of hotkeys to
                  navigate and chat without ever touching your mouse.
                </p>
              </div>
              <ShortcutDisplay shortcuts={SHORTCUTS} theme={theme} />
            </div>
            <div className="text-center mt-16">
              <p className="text-lg font-semibold opacity-80">
                Glued together with the usual suspects: Next.js, Supabase,
                Vercel AI SDK, and Tailwind CSS.
              </p>
            </div>
          </div>
        </section>

        <section className="text-center max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Alright, Enough Talk.</h2>
          <p className="text-lg opacity-80 mb-8">
            The app speaks for itself. Go on, find the edge cases. I dare you.
          </p>
          <Button
            onClick={handleNewChat}
            disabled={!session?.user || loading}
            className="px-10 py-5 text-2xl font-semibold shadow-lg"
          >
            {loading ? 'Starting...' : 'Launch It Already'}
          </Button>
          {!session?.user && (
            <p className="mt-6 text-base opacity-70">
              You gotta sign in to play, chief.
            </p>
          )}
        </section>

        <footer
          className="text-center border-t pt-8 space-y-4"
          style={{ borderColor: theme.buttonBorder }}
        >
          <p className="opacity-70">
            Built with code and vibes for the T3 ChatCloneathon.
          </p>
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
  );
}