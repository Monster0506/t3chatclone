'use client';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase/client';
import { useState } from 'react';
import SettingsModal from '../Settings/SettingsModal';
import type { Tables } from '@/lib/supabase/types';
import Avatar from '../UI/Avatar';
import Modal from '../UI/Modal';
import { useTheme } from '../../theme/ThemeProvider';

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
  const { theme } = useTheme();

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
        className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg font-bold transition focus:outline-none"
        style={{ borderColor: theme.buttonBorder, background: theme.glass, color: theme.foreground }}
        onClick={() => setOpen(o => !o)}
        title={email || 'User'}
      >
        <Avatar src={avatarUrl} initials={getInitials(email)} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 glass shadow-lg z-50" style={{ background: theme.glass, color: theme.foreground }}>
          <div className="px-4 py-2 border-b text-xs opacity-70" style={{ borderColor: theme.buttonBorder }}>{email}</div>
          <button
            className="w-full text-left px-4 py-2 hover:opacity-80"
            onClick={() => {
              handleOpenSettings();
              setOpen(false);
            }}
          >
            Settings
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:opacity-80"
            onClick={async () => {
              await supabase.auth.signOut();
              setOpen(false);
            }}
          >
            Log out
          </button>
        </div>
      )}
      <Modal open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <SettingsModal
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          onSave={handleSaveSettings}
          initial={userSettings}
          loading={settingsLoading}
        />
      </Modal>
    </div>
  );
} 