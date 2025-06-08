'use client';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase/client';
import { useState } from 'react';
import SettingsModal from '../Settings/SettingsModal';

function getInitials(email?: string) {
  if (!email) return '?';
  return email[0].toUpperCase();
}

export default function UserMenu() {
  const session = useSession();
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  if (!session) return null;
  const user = session.user;
  const avatarUrl = user.user_metadata?.avatar_url;
  const email = user.email;

  return (
    <div className="relative flex items-center justify-center">
      <button
        className="w-9 h-9 rounded-full bg-purple-200 flex items-center justify-center text-lg font-bold text-purple-700 border-2 border-purple-300 hover:border-purple-500 transition"
        onClick={() => setOpen(o => !o)}
        title={email || 'User'}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="avatar" className="w-9 h-9 rounded-full object-cover" />
        ) : (
          getInitials(email)
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-50">
          <div className="px-4 py-2 border-b text-xs text-gray-500">{email}</div>
          <button
            className="w-full text-left px-4 py-2 hover:bg-purple-100 text-purple-700"
            onClick={() => {
              setSettingsOpen(true);
              setOpen(false);
            }}
          >
            Settings
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-purple-100 text-purple-700"
            onClick={async () => {
              await supabase.auth.signOut();
              setOpen(false);
            }}
          >
            Log out
          </button>
        </div>
      )}
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} onSave={() => setSettingsOpen(false)} />
    </div>
  );
} 