'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loader from './Loader';
import { useAppSelector } from '@/store/hooks';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, initialized, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!initialized || loading) return;
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [initialized, isAuthenticated, loading, router]);

  if (!initialized || loading) {
    return <Loader label="Checking session..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
