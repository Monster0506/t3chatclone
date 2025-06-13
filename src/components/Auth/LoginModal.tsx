import { useTheme } from '@/theme/ThemeProvider';
import Card from '@/components/UI/Card';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase/client';
import { Sparkles } from 'lucide-react';
import { useRef } from 'react';
import { useCloseModal } from '@/hooks/use-close-modal';

export default function LoginModal({ open, onClose }: { open: boolean; onClose?: () => void }) {
  const { theme } = useTheme();
  const modalRef = useRef<HTMLDivElement>(null);

  useCloseModal({
    ref: modalRef,
    isOpen: open,
    onClose: onClose ?? (() => {}),
    disableEscape: !onClose,
  });

  if (!open || !onClose) return null;
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" 
      style={{ backdropFilter: 'blur(10px)' }}
      onClick={e => { if (onClose && e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          style={{
            width: 480,
            height: 480,
            borderRadius: 240,
            background: `radial-gradient(circle, ${theme.buttonBg}33 0%, transparent 80%)`,
            filter: 'blur(32px)',
          }}
        />
      </div>
      <Card
        ref={modalRef}
        className="w-full max-w-md p-0 relative rounded-3xl shadow-2xl flex flex-col items-center"
        style={{
          background: theme.glass,
          borderColor: theme.buttonBorder,
          boxShadow: '0 8px 40px 0 rgba(31,38,135,0.18)',
        }}
      >
        {onClose && (
          <button 
            type="button"
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl z-10"
            aria-label="Close modal"
          >
            ×
          </button>
        )}
        <div className="flex flex-col items-center w-full px-8 py-10">
          <div className="mb-3">
            <Sparkles size={40} style={{ color: theme.buttonBg, filter: 'drop-shadow(0 2px 8px ' + theme.buttonBg + '44)' }} />
          </div>
          <h2
            className="text-3xl font-extrabold mb-6 tracking-tight text-center"
            style={{ color: theme.buttonText, letterSpacing: '-0.02em' }}
          >
            Welcome to T3 Clone
          </h2>
          <div className="w-full">
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
                    radii: {
                      inputBorderRadius: '1rem',
                      buttonBorderRadius: '1.5rem',
                    },
                    fontSizes: {
                      baseBodySize: '1.1rem',
                      baseLabelSize: '1rem',
                    },
                  },
                },
              }}
              theme="dark"
              providers={[]}
            />
          </div>
        </div>
      </Card>
    </div>
  );
} 