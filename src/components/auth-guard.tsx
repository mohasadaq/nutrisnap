
"use client";

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Ensure that redirection only happens after loading is complete and no user is found
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-150px)]"> {/* Adjust height as needed */}
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If there's no user and not loading (which means useEffect should have redirected),
  // return null to prevent rendering children before redirect happens.
  if (!user) {
    return null; 
  }

  return <>{children}</>;
}
