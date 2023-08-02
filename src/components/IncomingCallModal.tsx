import Modal from './Modal';

export default function IncomingCallModal({ acceptCall, endCall }) {
  return (
    <Modal>
      <section className="flex flex-col items-center justify-between p-8 gap-y-12">
        <article className="flex flex-col gap-y-4 items-center">
          <div className="text-xl font-medium text-[#6B7280]">
            Incoming Call
          </div>
          <div className="text-4xl font-semibold">111-111-1111</div>
        </article>

        <article className="flex flex-row gap-x-10">
          <button
            className="w-[120px] h-12 border-2 border-[#6366f1] text-[#6366f1] rounded-[10px] hover:bg-[#6366f1] hover:text-white"
            onClick={() => acceptCall()}
          >
            Accept Call
          </button>
          <button
            className="w-[120px] h-12 border-2 border-black rounded-[10px] hover:bg-black hover:text-white"
            onClick={() => endCall()}
          >
            Reject Call
          </button>
        </article>
      </section>
    </Modal>
  );
}
