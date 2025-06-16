'use client';
import { useSession, useSessionContext } from '@supabase/auth-helpers-react';
import { ReactNode } from 'react';
import LoginModal from './LoginModal';

interface AuthWrapperProps {
  children: ReactNode;
  requireAuth?: boolean;
  fallback?: ReactNode;
}

export default function AuthWrapper({ 
  children, 
  requireAuth = false, 
  fallback 
}: AuthWrapperProps) {
  const session = useSession();
  const { isLoading } = useSessionContext();

  // Show loading state while session is being determined
  if (isLoading) {
    return fallback || (
      <div className="flex flex-1 items-center justify-center text-lg text-gray-400">
        Loading...
      </div>
    );
  }

  // If auth is required but no session exists, show login modal
  if (requireAuth && !session) {
    return (
      <>
        {fallback || (
          <div className="flex flex-1 items-center justify-center text-lg text-gray-400">
            Please log in to continue
          </div>
        )}
        <LoginModal open={true} />
      </>
    );
  }

  // Render children when session state is resolved
  return <>{children}</>;
} 