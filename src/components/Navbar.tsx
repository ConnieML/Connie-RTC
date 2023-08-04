import Link from 'next/link';
import logoImage from '../logo.png';
import Image from 'next/image';

export default function Navbar() {
  return (
    <section className="w-screen h-[12vh] box-border justify-between flex flex-row px-10 items-center bg-white border-b-2 border-b-[#D4D4D4]">
      <Image src={logoImage} alt="Logo" width="120" />
      <article className="flex flex-row gap-x-10 text-xl">
        <Link href="/call" className="w-10">
          Agent
        </Link>
        <Link href="/queues-stats">Dashboard</Link>
        <Link href="admin-settings">Settings</Link>
      </article>
    </section>
  );
}
