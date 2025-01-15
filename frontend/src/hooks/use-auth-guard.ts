'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

export function useAuthGuard() {
  const { status } = useSession();
  const [showSignIn, setShowSignIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated' && pathname !== '/') {
      setShowSignIn(true);
    }
  }, [status, pathname]);

  return {
    showSignIn,
    closeSignIn: () => {
      setShowSignIn(false);
      router.push('/');
    }
  };
} 