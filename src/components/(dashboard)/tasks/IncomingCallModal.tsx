import { Button } from '@/components/ui/button';
import { formatPhoneNumber } from '@/lib/utils';
import { CircleUser } from 'lucide-react';

export default function IncomingCallModal({
    number,
    acceptCall,
    rejectCall,
}: {
    number: string;
    acceptCall: () => void;
    rejectCall: () => void;
}) {
    return (
        <div className="fixed z-10 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-sm">
                <section className="flex flex-col items-center justify-between p-8 gap-y-12">
                    <article className="flex flex-col gap-y-4 items-center">
                        <CircleUser size="100" color="#D9D9D9" />
                        <div className="text-2xl font-light">
                            {formatPhoneNumber(number)}
                        </div>
                        <div className="text-lg font-lgiht text-[#6B7280]">
                            Incoming Call
                        </div>
                    </article>

                    <article className="flex flex-row gap-x-10">
                        <Button
                            className="rounded-md w-[120px] h-12 bg-[#22E4AC] text-white hover:bg-[#1BB88A]"
                            onClick={() => acceptCall()}
                        >
                            Accept Call
                        </Button>
                        <button
                            className="rounded-md w-[120px] h-12 bg-[#F93C5C] text-white hover:bg-[#E03652]"
                            onClick={() => rejectCall()}
                        >
                            Reject Call
                        </button>
                    </article>
                </section>
            </div>
        </div>
    );
}
