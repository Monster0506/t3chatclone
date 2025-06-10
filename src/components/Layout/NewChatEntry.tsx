'use client';
import { useRouter } from 'next/navigation';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase/client';
import { useState } from 'react';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Select from '@/components/UI/Select';
import { useTheme } from '@/theme/ThemeProvider';
import {
  Share2,
  Copy,
  Download,
  FileUp,
  Calculator,
  BookOpen,
  User,
  Bot,
} from 'lucide-react';

export default function NewChatEntry() {
  const session = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { theme, setTheme, themes } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme.name);

  const handleNewChat = async () => {
    if (!session?.user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('chats')
      .insert({
        user_id: session.user.id,
        title: 'New Chat',
        model: 'gemini-2.5-pro',
      })
      .select('id')
      .single();
    setLoading(false);
    if (data && data.id) {
      router.replace(`/chat/${data.id}`);
    }
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTheme(e.target.value);
    setTheme(e.target.value);
  };

  return (
    <div
      className="flex-1 w-full overflow-y-auto relative"
      style={{ background: theme.background, color: theme.foreground }}
    >
      {/* Decorative background blobs */}
      <div
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl z-0"
        style={{ background: theme.buttonBg }}
      />
      <div
        className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl z-0"
        style={{ background: theme.buttonHover }}
      />

      <div className="relative z-10 flex flex-col items-center w-full px-4 pb-16">
        {/* Welcome Section */}
        <div className="w-full max-w-2xl flex flex-col items-center text-center pt-20 md:pt-24">
          <Card
            className="w-full p-10 flex flex-col items-center gap-6"
            style={{ background: theme.glass }}
          >
            <h1
              className="text-5xl md:text-6xl font-extrabold mb-2 drop-shadow-lg"
              style={{ color: theme.foreground }}
            >
              Welcome to T3 Chat
            </h1>
            <p
              className="text-lg md:text-2xl mb-4 max-w-xl"
              style={{ color: theme.foreground }}
            >
              Your AI assistant powered by Gemini 2.5 Pro. Start a new
              conversation and explore its powerful new tools.
            </p>
            <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-center">
              <Button
                className="px-8 py-4 text-xl font-semibold shadow-lg"
                onClick={handleNewChat}
                disabled={!session?.user || loading}
              >
                {loading ? 'Starting...' : 'Start a New Chat'}
              </Button>
              <div className="flex flex-col items-center gap-1">
                <label
                  className="text-sm font-medium mb-1"
                  htmlFor="theme-picker"
                >
                  Theme
                </label>
                <Select
                  id="theme-picker"
                  value={selectedTheme}
                  onChange={handleThemeChange}
                  className="w-40"
                >
                  {themes.map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            {!session?.user && (
              <p className="mt-6 text-base opacity-70">
                Sign in to start chatting.
              </p>
            )}
          </Card>
        </div>

        {/* Features Section */}
        <div className="w-full max-w-6xl mt-16">
          <h2
            className="text-4xl font-bold text-center mb-8"
            style={{ color: theme.foreground }}
          >
            Powerful Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <FeatureCard
              icon={<Share2 />}
              title="Share Chats"
              theme={theme}
            >
              Easily share a read-only version of your conversations with a
              unique link.
            </FeatureCard>
            <FeatureCard
              icon={<Copy />}
              title="Clone Chats"
              theme={theme}
            >
              Duplicate any chat to branch your conversation or try different
              approaches.
            </FeatureCard>
            <FeatureCard
              icon={<Download />}
              title="Export to JSON"
              theme={theme}
            >
              Download your complete chat history as a structured JSON file for
              your records.
            </FeatureCard>
            <FeatureCard
              icon={<FileUp />}
              title="File Upload"
              theme={theme}
            >
              Upload documents, images, or data for analysis, summarization,
              or discussion.
            </FeatureCard>
          </div>

          <h3
            className="text-3xl font-bold text-center mb-8"
            style={{ color: theme.foreground }}
          >
            Integrated Tools
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ToolCard
              icon={<Calculator />}
              title="Advanced Calculator"
              description="Supports basic arithmetic, trig, logs, and matrix operations (with nice display). Just ask!"
              exampleUser="What is the product of 24*43?"
              exampleAi="The product of 24*43 is 1032."
              theme={theme}
            />
            <ToolCard
              icon={<BookOpen />}
              title="Wikipedia Search"
              description="Fetch summaries or full articles from Wikipedia using natural language queries."
              exampleUser="Give me a summary of the Gemini program"
              exampleAi="Project Gemini was NASA's second human spaceflight program..."
              theme={theme}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components for Features ---

const FeatureCard = ({ icon, title, children, theme }) => (
  <div
    className="flex flex-col items-center p-6 rounded-lg text-center"
    style={{
      background: theme.glass,
      border: `1px solid ${theme.buttonBorder}`,
    }}
  >
    <div className="text-4xl mb-3" style={{ color: theme.buttonBg }}>
      {icon}
    </div>
    <h3
      className="text-xl font-bold mb-2"
      style={{ color: theme.foreground }}
    >
      {title}
    </h3>
    <p className="text-base opacity-80" style={{ color: theme.foreground }}>
      {children}
    </p>
  </div>
);

const ToolCard = ({
  icon,
  title,
  description,
  exampleUser,
  exampleAi,
  theme,
}) => (
  <div
    className="p-6 rounded-lg"
    style={{
      background: theme.glass,
      border: `1px solid ${theme.buttonBorder}`,
    }}
  >
    <div className="flex items-center gap-4 mb-4">
      <div className="text-4xl" style={{ color: theme.buttonBg }}>
        {icon}
      </div>
      <h3 className="text-xl font-bold" style={{ color: theme.foreground }}>
        {title}
      </h3>
    </div>
    <p className="opacity-80 mb-4" style={{ color: theme.foreground }}>
      {description}
    </p>
    <div className="p-3 rounded" style={{ background: theme.inputBg }}>
      <div className="flex items-start gap-2 font-mono text-sm">
        <User className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p style={{ color: theme.inputText }}>User: "{exampleUser}"</p>
      </div>
      <div
        className="mt-2 p-3 rounded bg-opacity-20"
        style={{ color: theme.foreground, background: theme.buttonGlass }}
      >
        <div className="flex items-start gap-2 font-mono text-sm">
          <Bot className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>AI: {exampleAi}</p>
        </div>
      </div>
    </div>
  </div>
);