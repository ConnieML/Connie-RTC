import { Inter } from 'next/font/google';

import ClientSideAuth from '@/components/client-auth';

import React from 'react';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between  ${inter.className}`}
    >
      <Navbar />
      <ClientSideAuth />
    </main>
  );
}
