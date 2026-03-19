'use client';

import { useEffect } from 'react';
import { fetchMe } from '@/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export default function AuthInitializer() {
  const dispatch = useAppDispatch();
  const initialized = useAppSelector((state) => state.auth.initialized);

  useEffect(() => {
    if (!initialized) {
      void dispatch(fetchMe());
    }
  }, [dispatch, initialized]);

  return null;
}
