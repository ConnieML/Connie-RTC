import Image from 'next/image';

// TODO asa logo should be customizable for each CBO
export default function Logo() {
  return (
    <div className="flex flex-row">
      <Image
        src="/connie-logo.png"
        alt="connie logo"
        className="h-24 sm:h-32"
      />
      <div className="self-center w-0.5 h-6 mx-2 bg-slate-400" />
      <Image
        src="/asa-logo.png"
        alt="asa logo"
        className="h-6 sm:h-8 self-center"
      />
    </div>
  );
}
