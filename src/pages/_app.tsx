import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import { Session } from 'next-auth'
import '../styles/globals.css'


export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session; }>) {
  return (
    // Any components here will be rendered on every page
    <>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
}

