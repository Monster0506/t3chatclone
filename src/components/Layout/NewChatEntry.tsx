'use client';
import { useRouter } from 'next/navigation';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase/client';
import { useState, useRef } from 'react';
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
  Pin,
  Archive,
  Tag,
  Search,
  BookText,
  ChevronDown,
  Cpu,
  Server,
} from 'lucide-react';

// --- Helper Component for Scrolling (Corrected) ---
const ScrollIndicator = ({ onClick, theme, className = '' }) => (
  <div className={`w-full text-center ${className}`}>
    <button
      onClick={onClick}
      className="p-2 rounded-full transition-transform duration-300 hover:scale-110 focus:outline-none focus-visible:ring-2"
      style={{
        color: theme.buttonBg,
        ringColor: theme.buttonHover,
      }}
      aria-label="Scroll to next section"
    >
      <ChevronDown className="w-10 h-10 animate-bounce" />
    </button>
  </div>
);

// --- Helper Component for Feature Cards ---
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

// --- Helper Component for Tool Cards ---
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
        className="mt-2 p-3 rounded"
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

// --- Helper Component for Stats ---
const StatsCard = ({ icon, value, label, theme }) => (
  <div
    className="flex items-center gap-4 p-4 rounded-lg"
    style={{
      background: theme.glass,
      border: `1px solid ${theme.buttonBorder}`,
    }}
  >
    <div className="text-4xl" style={{ color: theme.buttonBg }}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold" style={{ color: theme.foreground }}>
        {value}
      </p>
      <p className="text-sm opacity-80" style={{ color: theme.foreground }}>
        {label}
      </p>
    </div>
  </div>
);

export default function NewChatEntry() {
  const session = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { theme, setTheme, themes } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme.name);

  // Refs for smooth scrolling
  const featuresRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);
  const useCasesRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  const handleScrollTo = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleNewChat = async () => {
    if (!session?.user) return;
    setLoading(true);
    const { data, error } = await supabase
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
        <div className="w-full flex flex-col items-center justify-center text-center min-h-screen relative">
          <Card
            className="w-full max-w-2xl p-10 flex flex-col items-center gap-6"
            style={{ background: theme.glass }}
          >
            <h1
              className="text-5xl md:text-6xl font-extrabold mb-2 drop-shadow-lg"
              style={{ color: theme.foreground }}
            >
              Welcome to T3 Clone
            </h1>
            <p
              className="text-lg md:text-2xl mb-4 max-w-xl"
              style={{ color: theme.foreground }}
            >
              Your AI assistant powered by Gemini 2.0 Flash (current testing
              model). Start a new conversation and explore its powerful new
              tools.
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
          <ScrollIndicator
            onClick={() => handleScrollTo(featuresRef)}
            theme={theme}
            className="absolute bottom-4"
          />
        </div>

        {/* Features Section */}
        <div ref={featuresRef} className="w-full max-w-6xl pt-16">
          <h2
            className="text-4xl font-bold text-center mb-8"
            style={{ color: theme.foreground }}
          >
            Powerful Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard icon={<Pin />} title="Pin Chats" theme={theme}>
              Keep important conversations at the top of your list for quick
              access.
            </FeatureCard>
            <FeatureCard icon={<Archive />} title="Archive Chats" theme={theme}>
              Declutter your main view by archiving chats you no longer need.
            </FeatureCard>
            <FeatureCard icon={<Tag />} title="Tag Chats" theme={theme}>
              Organize your chats with custom tags for easy filtering and
              retrieval.
            </FeatureCard>
            <FeatureCard icon={<Search />} title="Search Chats" theme={theme}>
              Instantly find conversations by searching titles, content, or
              tags.
            </FeatureCard>
            <FeatureCard icon={<Share2 />} title="Share Chats" theme={theme}>
              Share a read-only version of your conversations with a unique
              link.
            </FeatureCard>
            <FeatureCard icon={<Copy />} title="Clone Chats" theme={theme}>
              Duplicate any chat to branch your conversation or try different
              approaches.
            </FeatureCard>
            <FeatureCard
              icon={<Download />}
              title="Export to JSON"
              theme={theme}
            >
              Download your chat history as a structured JSON file for your
              records.
            </FeatureCard>
            <FeatureCard icon={<FileUp />} title="File Upload" theme={theme}>
              Upload documents or images for analysis, summarization, or
              discussion.
            </FeatureCard>
          </div>
          <ScrollIndicator
            onClick={() => handleScrollTo(toolsRef)}
            theme={theme}
            className="my-8 md:my-12"
          />
        </div>

        {/* Advanced Navigation & Tools Section */}
        <div ref={toolsRef} className="w-full max-w-6xl pt-16">
          <h2
            className="text-4xl font-bold text-center mb-12"
            style={{ color: theme.foreground }}
          >
            Advanced Navigation & Tools
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div
              className="lg:col-span-2 p-6 rounded-lg flex flex-col md:flex-row items-center gap-6"
              style={{
                background: theme.glass,
                border: `1px solid ${theme.buttonBorder}`,
              }}
            >
              <div className="text-6xl" style={{ color: theme.buttonBg }}>
                <BookText />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3
                  className="text-2xl font-bold mb-2"
                  style={{ color: theme.foreground }}
                >
                  Full Chat Index
                </h3>
                <p
                  className="text-lg opacity-80"
                  style={{ color: theme.foreground }}
                >
                  Navigate long conversations effortlessly. Get an AI-generated
                  summary for key messages and jump directly to any point in
                  the chat.
                </p>
              </div>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatsCard
                icon={<Cpu />}
                value="65+"
                label="Models Supported"
                theme={theme}
              />
              <StatsCard
                icon={<Server />}
                value="7"
                label="Providers Integrated"
                theme={theme}
              />
            </div>
            <ToolCard
              icon={<Calculator />}
              title="Advanced Calculator"
              description="Supports basic arithmetic, trig, logs, and matrix operations. Just ask!"
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
          <ScrollIndicator
            onClick={() => handleScrollTo(modelRef)}
            theme={theme}
            className="my-8 md:my-12"
          />
        </div>

        {/* Model Showcase Section */}
        <div ref={modelRef} className="w-full max-w-6xl pt-16">
          <h2
            className="text-4xl font-bold text-center mb-12"
            style={{ color: theme.foreground }}
          >
            Powered by Gemini 2.0 Flash
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className="p-6 rounded-lg"
              style={{
                background: theme.glass,
                border: `1px solid ${theme.buttonBorder}`,
              }}
            >
              <h3 className="text-xl font-bold mb-3" style={{ color: theme.foreground }}>Lightning Fast</h3>
              <p className="opacity-80" style={{ color: theme.foreground }}>
                Experience near-instant responses with our optimized Gemini 2.0 Flash model.
              </p>
            </div>
            <div
              className="p-6 rounded-lg"
              style={{
                background: theme.glass,
                border: `1px solid ${theme.buttonBorder}`,
              }}
            >
              <h3 className="text-xl font-bold mb-3" style={{ color: theme.foreground }}>Advanced Reasoning</h3>
              <p className="opacity-80" style={{ color: theme.foreground }}>
                Complex problem-solving capabilities with step-by-step explanations.
              </p>
            </div>
            <div
              className="p-6 rounded-lg"
              style={{
                background: theme.glass,
                border: `1px solid ${theme.buttonBorder}`,
              }}
            >
              <h3 className="text-xl font-bold mb-3" style={{ color: theme.foreground }}>Multimodal Support</h3>
              <p className="opacity-80" style={{ color: theme.foreground }}>
                Process and understand both text and images in your conversations.
              </p>
            </div>
          </div>
          <ScrollIndicator
            onClick={() => handleScrollTo(useCasesRef)}
            theme={theme}
            className="my-8 md:my-12"
          />
        </div>

        {/* Use Cases Section */}
        <div ref={useCasesRef} className="w-full max-w-6xl pt-16">
          <h2
            className="text-4xl font-bold text-center mb-12"
            style={{ color: theme.foreground }}
          >
            Perfect For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              className="p-6 rounded-lg"
              style={{
                background: theme.glass,
                border: `1px solid ${theme.buttonBorder}`,
              }}
            >
              <h3 className="text-xl font-bold mb-3" style={{ color: theme.foreground }}>Students</h3>
              <p className="opacity-80" style={{ color: theme.foreground }}>
                Get help with homework, research, and study materials.
              </p>
            </div>
            <div
              className="p-6 rounded-lg"
              style={{
                background: theme.glass,
                border: `1px solid ${theme.buttonBorder}`,
              }}
            >
              <h3 className="text-xl font-bold mb-3" style={{ color: theme.foreground }}>Developers</h3>
              <p className="opacity-80" style={{ color: theme.foreground }}>
                Debug code, get programming help, and explore new technologies.
              </p>
            </div>
            <div
              className="p-6 rounded-lg"
              style={{
                background: theme.glass,
                border: `1px solid ${theme.buttonBorder}`,
              }}
            >
              <h3 className="text-xl font-bold mb-3" style={{ color: theme.foreground }}>Researchers</h3>
              <p className="opacity-80" style={{ color: theme.foreground }}>
                Analyze data, summarize papers, and explore complex topics.
              </p>
            </div>
            <div
              className="p-6 rounded-lg"
              style={{
                background: theme.glass,
                border: `1px solid ${theme.buttonBorder}`,
              }}
            >
              <h3 className="text-xl font-bold mb-3" style={{ color: theme.foreground }}>Professionals</h3>
              <p className="opacity-80" style={{ color: theme.foreground }}>
                Draft documents, analyze reports, and get business insights.
              </p>
            </div>
          </div>
          <ScrollIndicator
            onClick={() => handleScrollTo(faqRef)}
            theme={theme}
            className="my-8 md:my-12"
          />
        </div>

        {/* FAQ Section */}
        <div ref={faqRef} className="w-full max-w-6xl pt-16 pb-16">
          <h2
            className="text-4xl font-bold text-center mb-12"
            style={{ color: theme.foreground }}
          >
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className="p-6 rounded-lg"
              style={{
                background: theme.glass,
                border: `1px solid ${theme.buttonBorder}`,
              }}
            >
              <h3 className="text-xl font-bold mb-3" style={{ color: theme.foreground }}>Is it free to use?</h3>
              <p className="opacity-80" style={{ color: theme.foreground }}>
                Yes! Our basic features are completely free to use. We may introduce premium features in the future.
              </p>
            </div>
            <div
              className="p-6 rounded-lg"
              style={{
                background: theme.glass,
                border: `1px solid ${theme.buttonBorder}`,
              }}
            >
              <h3 className="text-xl font-bold mb-3" style={{ color: theme.foreground }}>How do I get started?</h3>
              <p className="opacity-80" style={{ color: theme.foreground }}>
                Simply sign in and click "Start a New Chat". You can immediately begin conversing with our AI.
              </p>
            </div>
            <div
              className="p-6 rounded-lg"
              style={{
                background: theme.glass,
                border: `1px solid ${theme.buttonBorder}`,
              }}
            >
              <h3 className="text-xl font-bold mb-3" style={{ color: theme.foreground }}>Can I share my chats?</h3>
              <p className="opacity-80" style={{ color: theme.foreground }}>
                Yes! You can share any chat with a unique link. The shared version is read-only.
              </p>
            </div>
            <div
              className="p-6 rounded-lg"
              style={{
                background: theme.glass,
                border: `1px solid ${theme.buttonBorder}`,
              }}
            >
              <h3 className="text-xl font-bold mb-3" style={{ color: theme.foreground }}>Is my data secure?</h3>
              <p className="opacity-80" style={{ color: theme.foreground }}>
                Absolutely. We use industry-standard encryption and never share your data with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}