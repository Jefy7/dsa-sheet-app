'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { setupAxiosInterceptors } from '@/services/api';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const eject = setupAxiosInterceptors(store.dispatch);
    return () => eject();
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
