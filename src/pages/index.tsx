import { Inter } from 'next/font/google'
import { useSession } from "next-auth/react"
import AdminSettings from './admin-settings'
import Login from './Login'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const { data: session, status } = useSession()

  if (session) {
    return (
      <main
        className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <AdminSettings/>
    </main>
    )
  }

  else {
    return (
      <Login/>
    )
  }
}
