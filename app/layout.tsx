import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import { Providers } from './providers';
import AuthInitializer from '@/components/AuthInitializer';
import OfflineBanner from '@/components/OfflineBanner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DSA Sheet App',
  description: 'Track your DSA progress efficiently',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AuthInitializer />
          <OfflineBanner />
          <Toaster position="top-right" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
