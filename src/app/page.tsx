"use client";
import { useSession } from 'next-auth/react';
import React from 'react';
import { redirect } from 'next/navigation'

export default function Home() {
  const {data: session, status} = useSession();
  if (status === 'loading') {
    return <React.Fragment>Loading...</React.Fragment>;
  } else if (session) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
}
