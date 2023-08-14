import logoImage from '@public/logo.png';
import Image from 'next/image';
import { useRouter } from 'next/router';

/**
 * This component is used to navigate across Connie
 * Generally, put this component at the top of each page
 * @param callback - invoke this method whenever you need to run a cleanup function on the page. We
 * currently use this to close the websocket and WebRTC connections from the Twilio SDKs
 * @returns
 */
export default function Navbar({ callback }: { callback?: () => void }) {
  const router = useRouter();

  const handleNavigate = (route: string) => {
    if (callback) {
      callback();
    }
    router.push(route);
  };
  return (
    <section className="w-screen h-[12vh] box-border justify-between flex flex-row px-10 items-center bg-white border-b-2 border-b-[#D4D4D4]">
      <Image
        className="cursor-pointer"
        src={logoImage}
        alt="Logo"
        width="120"
        onClick={() => handleNavigate('/')}
      />
      <article className="flex flex-row gap-x-10 text-xl">
        <button onClick={() => handleNavigate('/call')} className="w-10">
          Agent
        </button>
        <button onClick={() => handleNavigate('/queues-stats')}>
          Dashboard
        </button>
        <button onClick={() => handleNavigate('/admin-settings')}>
          Settings
        </button>
      </article>
    </section>
  );
}
