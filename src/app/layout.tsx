import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import "../styles/globals.css";

import Appbar from "../components/appbar";
import Sidebar from "../components/sidebar";
import { NextAuthProvider } from "../components/nextAuthProvider"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Connie",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isProgramManager = true; // TODO
  const initials = "AA"; // TODO get initials from user name

  return (
    <NextAuthProvider>
        <html lang="en">
          <body className={cn(inter.className, "h-screen overflow-hidden")}>
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
          </body>
        </html>
    </NextAuthProvider>
  );
}
