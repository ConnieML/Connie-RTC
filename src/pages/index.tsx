import Image from 'next/image'
import { Inter } from 'next/font/google'
import { signIn, signOut, useSession } from "next-auth/react"
import ClientSideAuth from '../components/client-auth'
import UserRegister from '../components/create-user'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const { data: session, status } = useSession()

  return (

    <main

      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <ClientSideAuth/>
      <UserRegister/>

    </main>
  )}
