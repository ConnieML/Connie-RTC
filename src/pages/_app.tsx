import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="px-4 mx-auto mt-32 max-w-7xl sm:px-6 lg:px-8">
      <Component {...pageProps} />
    </div>
  )
}
