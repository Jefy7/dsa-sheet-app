'use client';

import { useEffect, useState } from 'react';

export default function OfflineBanner() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const updateOnline = () => setOnline(navigator.onLine);
    updateOnline();
    window.addEventListener('online', updateOnline);
    window.addEventListener('offline', updateOnline);

    return () => {
      window.removeEventListener('online', updateOnline);
      window.removeEventListener('offline', updateOnline);
    };
  }, []);

  if (online) return null;

  return (
    <div className="bg-amber-500 px-4 py-2 text-center text-sm font-medium text-black">
      You are offline. Some actions may fail until connection is restored.
    </div>
  );
}
