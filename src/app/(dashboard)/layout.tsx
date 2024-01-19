"use client";
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation'
import React from 'react';

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    if (status === 'loading') {
        return <React.Fragment>Loading...</React.Fragment>;
    } else if (session) {
        console.log(session);
        return (children);
    } else {
        redirect('/');
    }
}
