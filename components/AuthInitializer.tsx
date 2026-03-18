'use client';

import { useEffect } from 'react';
import { fetchUser } from '@/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export default function AuthInitializer() {
  const dispatch = useAppDispatch();
  const initialized = useAppSelector((state) => state.auth.initialized);

  useEffect(() => {
    if (!initialized) {
      void dispatch(fetchUser());
    }
  }, [dispatch, initialized]);

  return null;
}
