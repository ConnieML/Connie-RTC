import { Inter } from 'next/font/google';
import { useSession } from 'next-auth/react';
import AdminSettings from './admin-settings';
import ClientSideAuth from '@/components/client-auth';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      {/* <AdminSettings /> */}
      <ClientSideAuth />
    </main>
  );
}
