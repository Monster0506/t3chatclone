'use client';
import { SessionContextProvider, useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase/client';
import { useEffect } from 'react';

function EnsureProfile() {
  const session = useSession();
  useEffect(() => {
    const createProfile = async () => {
      if (!session?.user?.email) {
        console.warn('No user email available for profile creation');
        return;
      }

      try {
        const profileData = {
          id: session.user.id,
          email: session.user.email,
          full_name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
          avatar_url: session.user.user_metadata?.avatar_url || null,
          updated_at: new Date().toISOString(),
        };


        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert(profileData, {
            onConflict: 'id',
            ignoreDuplicates: false
          })
          .select()
          .single();

        if (upsertError) {
          console.error('Error upserting profile:', upsertError);
        }
      } catch (_error) {
        console.error('Unexpected error in profile creation:', _error);
      }
    };

    if (session) {
      createProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, supabase]);
  return null;
}

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <EnsureProfile />
      {children}
    </SessionContextProvider>
  );
} 