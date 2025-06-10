import { useTheme } from '../../theme/ThemeProvider';
import Card from '../UI/Card';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase/client';

export default function LoginModal({ open, onClose }: { open: boolean; onClose?: () => void }) {
  const { theme } = useTheme();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" style={{ backdropFilter: 'blur(8px)' }}>
      <Card className="w-full max-w-md p-8 relative rounded-2xl shadow-2xl flex flex-col items-center" style={{ background: theme.glass, borderColor: theme.buttonBorder }}>
        {onClose && (
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">×</button>
        )}
        <h2 className="text-2xl font-extrabold mb-6 tracking-tight text-center" style={{ color: theme.buttonText, letterSpacing: '-0.02em' }}>
          Welcome to T3 Chat
        </h2>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: theme.buttonBg,
                  brandAccent: theme.buttonBorder,
                  inputBorder: theme.buttonBorder,
                  inputLabelText: theme.inputText,
                  inputText: theme.inputText,
                  anchorTextColor: theme.buttonText,
                  messageText: theme.inputText,
                  defaultButtonBackground: theme.buttonBg,
                  defaultButtonText: theme.buttonText,
                  defaultButtonBorder: theme.buttonBorder,
                  inputBackground: theme.inputGlass,
                  inputPlaceholder: theme.inputText,
                  dividerBackground: theme.buttonBorder,
                },
              },
            },
          }}
          theme="dark"
          providers={[]}
        />
      </Card>
    </div>
  );
} 