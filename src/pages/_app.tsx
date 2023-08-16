import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import { Session } from 'next-auth'
import Login from './Login'; // Login.tsx component

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session; }>) {
  const isLoggedIn = session?.user; // conditionally checking if user is logged in:

  return (
    <>
      <SessionProvider session={session}>
        {/* if logged in, we show rest of app; otherwise, we show Login component */}
        {isLoggedIn ? (
          <Component {...pageProps} />
        ) : (
          <Login />
        )}
      </SessionProvider>
    </>
  );
}
