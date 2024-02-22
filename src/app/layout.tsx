import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { PropsWithChildren } from 'react';

import { NextAuthProvider } from '@/components/nextAuthProvider';
import { cn } from '@/lib/utils';

import '../styles/globals.css';

const sansFont = Roboto({
  subsets: ['latin'],
  weight: ['500', '700'],
});

export const metadata: Metadata = {
  title: 'Connie',
  description:
    'A realtime communication center for community-based organizations',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <NextAuthProvider>
      <html lang="en">
        <body className={cn(sansFont.className, 'h-dvh')}>{children}</body>
      </html>
    </NextAuthProvider>
  );
}
