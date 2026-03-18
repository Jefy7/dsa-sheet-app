'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, initialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!initialized) return;
    router.replace(isAuthenticated ? '/dashboard' : '/login');
  }, [initialized, isAuthenticated, router]);

  return <div className="flex min-h-screen items-center justify-center">Redirecting...</div>;
}
