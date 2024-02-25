"use client";
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation'
import React from 'react';
import Appbar from "../../components/appbar";
import Sidebar from "../../components/sidebar";

import "../../styles/globals.css";
import useCalls from '@/lib/hooks/useCalls';
import CallsContext from '@/contexts/CallsContext';
export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();

    const calls = useCalls({
        email: session?.user?.email || "",
        workerSid: session?.employeeNumber || "",
        friendlyName: session?.user?.name || "",
      });

    if (status === 'loading') {
        return <React.Fragment>Loading...</React.Fragment>;
    } else if (session) {
        
        const isProgramManager = true; // TODO: Just check session token groups property and see if its contains 'admin' (name not yet determined)
        let initials = "AA";
        if (session.user?.name) {
            const parts = session.user.name.split(' ');
            if (parts.length > 1) {
                initials = (parts[0][0] + parts[1][0]).toUpperCase();
            } else if (parts.length > 0) {
                initials = parts[0][0].toUpperCase();
            }
        }
        
        return (
            <div className="h-screen w-screen">
                <CallsContext.Provider value={calls}>
                <Appbar initials={initials} isProgramManager={isProgramManager} />
                <div className="h-full flex flex-row">
                    <Sidebar
                        isProgramManager={isProgramManager}
                        className="hidden sm:block"
                    />
                    <div className="p-8 w-full bg-neutral-100 overflow-auto">
                        {children}
                    </div>
                </div>
                </CallsContext.Provider>

            </div>
        );
    } else {
        redirect('/login');
    }
}
