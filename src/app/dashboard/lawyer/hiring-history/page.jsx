"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Check, X, Inbox } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import StatusBadge from "@/app/components/Dashboard/StatusBadge";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const tabs = ["all", "pending", "accepted", "rejected"];

export default function LawyerHiringHistory() {
  const { data: session, isPending } = authClient.useSession();
  const isLawyer = session?.user?.role === "lawyer";

  const [hires, setHires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    try {
      setHires(await apiFetch("/api/hires/received", { auth: true }));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLawyer) load();
    else if (!isPending) setLoading(false);
  }, [isLawyer, isPending]);

  const respond = async (id, status) => {
    setBusyId(id);
    try {
      await apiFetch(`/api/hires/${id}/status`, { method: "PATCH", auth: true, body: { status } });
      toast.success(status === "accepted" ? "Request accepted" : "Request rejected");
      await load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  if (isPending) return <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />;

  if (!isLawyer) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-gray-600">Only lawyer accounts can view hiring requests.</p>
      </div>
    );
  }

  const visible = tab === "all" ? hires : hires.filter((h) => h.status === tab);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#22333b]">Hiring History</h1>
        <p className="mt-1 text-sm text-gray-500">Review hiring requests from clients and accept or reject them.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
              tab === t ? "bg-[#22333b] text-white" : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {t}
            {t !== "all" && (
              <span className="ml-1.5 text-xs opacity-70">{hires.filter((h) => h.status === t).length}</span>
            )}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {loading ? (
          <div className="space-y-3 p-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-gray-100" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="p-12 text-center">
            <Inbox size={40} className="mx-auto text-gray-300" />
            <p className="mt-3 text-sm text-gray-500">
              {hires.length === 0 ? "No hiring requests yet." : `No ${tab} requests.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-3">Client</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Request date</th>
                  <th className="px-6 py-3">Fee</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {visible.map((h) => (
                  <tr key={h._id}>
                    <td className="px-6 py-4 font-medium text-gray-800">{h.userName}</td>
                    <td className="px-6 py-4 text-gray-600">{h.userEmail}</td>
                    <td className="px-6 py-4 text-gray-600">{formatDate(h.createdAt)}</td>
                    <td className="px-6 py-4 text-gray-600">
                      ${h.fee}
                      {h.paid && <span className="ml-2 text-xs font-semibold text-green-600">Paid</span>}
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={h.status} /></td>
                    <td className="px-6 py-4">
                      {h.status === "pending" ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => respond(h._id, "accepted")}
                            disabled={busyId === h._id}
                            className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                          >
                            <Check size={14} /> Accept
                          </button>
                          <button
                            onClick={() => respond(h._id, "rejected")}
                            disabled={busyId === h._id}
                            className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            <X size={14} /> Reject
                          </button>
                        </div>
                      ) : (
                        <p className="text-right text-xs text-gray-400">Handled</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}