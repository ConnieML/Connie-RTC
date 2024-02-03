"use client";
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation'
import React from 'react';
import Appbar from "../../components/appbar";
import Sidebar from "../../components/sidebar";

import "../../styles/globals.css";


export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    if (status === 'loading') {
        return <React.Fragment>Loading...</React.Fragment>;
    } else if (session) {
        console.log(session)
        console.log("ASDASDAS")
        const isProgramManager = true; // TODO
        const initials = "AA"; // TODO get initials from user name
      
        return (
            <div className="h-screen w-screen">
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
            </div>
        );
    } else {
        redirect('/login');
    }
}
