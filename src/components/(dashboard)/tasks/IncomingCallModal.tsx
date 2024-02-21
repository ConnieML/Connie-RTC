import { formatPhoneNumber } from '@/lib/utils';

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
            <div className="bg-white p-4 rounded-lg">
                <section className="flex flex-col items-center justify-between p-8 gap-y-12">
                    <article className="flex flex-col gap-y-4 items-center">
                        <div className="text-xl font-medium text-[#6B7280]">
                            Incoming Call
                        </div>
                        <div className="text-4xl font-semibold">
                            {formatPhoneNumber(number)}
                        </div>
                    </article>

                    <article className="flex flex-row gap-x-10">
                        <button
                            className="w-[120px] h-12 border-2 border-[#6366f1] text-[#6366f1] rounded-[10px] hover:bg-[#6366f1] hover:text-white"
                            onClick={() => acceptCall()}
                        >
                            Accept Call
                        </button>
                        <button
                            className="w-[120px] h-12 rounded-[10px] hover:bg-black hover:text-white"
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
