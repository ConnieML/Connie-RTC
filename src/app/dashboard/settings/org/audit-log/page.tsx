import AuditTable from "@/components/audittable/AuditTable";
import { Button } from "@/components/ui/button";

export default function AuditLog() {
  return (
    <main>
      <h1 className="text-3xl font-bold">Audit Log</h1>
      <p className="text-[#64748B] mt-2 text-sm">
        View all calls and SMS message your organization made via Connie.
      </p>
      <hr className="my-6 border-t border-gray-200" />

      <div>
        <AuditTable />
      </div>
    </main>
  );
}
