'use client';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase/client';
import { useState } from 'react';
import SettingsModal from '../Settings/SettingsModal';
import type { Tables } from '@/lib/supabase/types';

function getInitials(email?: string) {
  if (!email) return '?';
  return email[0].toUpperCase();
}

export default function UserMenu() {
  const session = useSession();
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [userSettings, setUserSettings] = useState<Tables<'user_settings'> | null>(null);

  if (!session) return null;
  const user = session.user;
  const avatarUrl = user.user_metadata?.avatar_url;
  const email = user.email;
  const userId = user.id;

  // Load settings when modal opens
  const handleOpenSettings = async () => {
    setSettingsLoading(true);
    setSettingsOpen(true);
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching settings:', error);
        // If no settings exist, create default settings
        if (error.code === 'PGRST116') {
          const defaultSettings = {
            user_id: userId,
            name: user.email?.split('@')[0] || null,
            occupation: null,
            traits: [],
            theme: 'dark',
            language: 'en',
            notification_preferences: {},
            extra: null,
            updated_at: new Date().toISOString()
          };

          const { data: newSettings, error: insertError } = await supabase
            .from('user_settings')
            .insert(defaultSettings)
            .select()
            .single();
          
          if (insertError) {
            console.error('Error creating default settings:', insertError);
          } else {
            setUserSettings(newSettings);
          }
        }
      } else {
        setUserSettings(data);
      }
    } catch (error) {
      console.error('Unexpected error loading settings:', error);
    } finally {
      setSettingsLoading(false);
    }
  };

  // Save settings to Supabase
  const handleSaveSettings = async (settings: any) => {
    setSettingsLoading(true);
    try {
      const settingsToSave = {
        user_id: userId,
        ...settings,
        updated_at: new Date().toISOString()
      };

      const { error, data } = await supabase
        .from('user_settings')
        .upsert(settingsToSave, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving settings:', error);
      } else {
        setUserSettings(data);
      }
    } catch (error) {
      console.error('Unexpected error saving settings:', error);
    } finally {
      setSettingsLoading(false);
      setSettingsOpen(false);
    }
  };

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
              handleOpenSettings();
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
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSave={handleSaveSettings}
        initial={userSettings}
        loading={settingsLoading}
      />
    </div>
  );
} 