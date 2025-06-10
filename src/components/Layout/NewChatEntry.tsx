'use client';
import { useRouter } from 'next/navigation';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase/client';
import { useState } from 'react';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Select from '@/components/UI/Select';
import { useTheme } from '@/theme/ThemeProvider';

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
      className="flex flex-1 flex-col items-center justify-center relative overflow-hidden"
      style={{ background: theme.background, color: theme.foreground }}
    >
      {/* Decorative background blob */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl z-0"
        style={{ background: theme.buttonBg }}
      />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl z-0"
        style={{ background: theme.buttonHover }}
      />
      <div className="z-10 flex flex-col items-center text-center px-4 w-full max-w-2xl">
        <Card className="w-full p-10 flex flex-col items-center gap-6" style={{ background: theme.glass }}>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-2 drop-shadow-lg" style={{ color: theme.foreground }}>Welcome to T3 Clone</h1>
          <p className="text-lg md:text-2xl mb-4 max-w-xl" style={{ color: theme.foreground }}>
            Your all-in-one AI chat assistant. Start a new conversation and experience the power of modern AI, tailored just for you.
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
              <label className="text-sm font-medium mb-1" htmlFor="theme-picker">Theme</label>
              <Select
                id="theme-picker"
                value={selectedTheme}
                onChange={handleThemeChange}
                className="w-40"
              >
                {themes.map(t => (
                  <option key={t.name} value={t.name}>{t.name}</option>
                ))}
              </Select>
            </div>
          </div>
          {!session?.user && (
            <p className="mt-6 text-base opacity-70">Sign in to start chatting.</p>
          )}
        </Card>
      </div>
    </div>
  );
} 