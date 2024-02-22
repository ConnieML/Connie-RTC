'use client';

import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import asaLogo from '@/assets/asa-logo.png';
import connieLogo from '@/assets/connie-logo.png';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

/**
 * The landing page for Connie.
 *
 * Route: /
 */
export default function Home() {
  const { data: session, status } = useSession();
  if (session) {
    redirect('/dashboard');
  } else {
    return (
      <div className="h-full flex flex-col justify-center">
        <main className="h-[600px] flex flex-col items-center justify-between">
          <Card className="mt-[10vh] p-6 max-w-md w-full text-center space-y-6">
            <div className="my-6 flex justify-center">
              <Image
                src={connieLogo}
                alt=""
                width={240}
                height={68}
                className="object-contain"
              />
            </div>
            <div>
              {status === 'loading' ? (
                <div className="">Loading...</div>
              ) : (
                <Button onClick={() => signIn('okta')}>
                  Sign in with Okta
                </Button>
              )}
              <noscript>
                This app requires JavaScript to function. Please enable it to
                continue.
              </noscript>
            </div>
            <div className="mt-4 text-emphasis-low">
              Don&apos;t have an account?
              <br />
              Contact your organization admin.
            </div>
          </Card>
          <div className="">
            <Link href="https://asaging.org">
              <Image
                src={asaLogo}
                alt=""
                width={160}
                height={120}
                className="object-contain"
              />
            </Link>
          </div>
        </main>
      </div>
    );
  }
}
