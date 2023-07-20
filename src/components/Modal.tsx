import { ReactNode } from 'react';

export default function Modal({ children }: { children: ReactNode }) {
  return (
    <div className="fixed z-10 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg">{children}</div>
    </div>
  );
}
