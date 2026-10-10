"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Briefcase } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import StatusBadge from "@/app/components/Dashboard/StatusBadge";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

export default function UserHiringHistory() {
  const { data: session, isPending } = authClient.useSession();
  const isClient = session?.user?.role === "user";

  const [hires, setHires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);

  useEffect(() => {
    if (!isClient) {
      if (!isPending) setLoading(false);
      return;
    }
    apiFetch("/api/hires/mine", { auth: true })
      .then(setHires)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [isClient, isPending]);

  
 const handlePay = async (hire) => {
  setPayingId(hire._id);
  try {
    const { url } = await apiFetch("/api/payments/create-checkout-session", {
      method: "POST",
      auth: true,
      body: { hireId: hire._id },
    });
    window.location.href = url;
  } catch (err) {
    toast.error(err.message);
    setPayingId(null);
  }
};

  if (isPending) return <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />;

  if (!isClient) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-gray-600">Hiring history is available for client accounts.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#22333b]">Hiring History</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track your hiring requests. You can pay a lawyer once they accept your request.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {loading ? (
          <div className="space-y-3 p-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-gray-100" />
            ))}
          </div>
        ) : hires.length === 0 ? (
          <div className="p-12 text-center">
            <Briefcase size={40} className="mx-auto text-gray-300" />
            <p className="mt-3 text-sm text-gray-500">You haven't hired anyone yet.</p>
            <Link
              href="/lawyer"
              className="mt-5 inline-block rounded-xl bg-[#C9A227] px-6 py-2.5 text-sm font-semibold text-[#0D0D0D] hover:bg-[#D9B43A]"
            >
              Browse Lawyers
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-3">Lawyer</th>
                  <th className="px-6 py-3">Specialization</th>
                  <th className="px-6 py-3">Fee</th>
                  <th className="px-6 py-3">Hiring date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {hires.map((h) => (
                  <tr key={h._id}>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      <Link href={`/lawyer/${h.lawyerId}`} className="hover:text-[#7d7236] hover:underline">
                        {h.lawyerName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{h.specialization}</td>
                    <td className="px-6 py-4 text-gray-600">${h.fee}</td>
                    <td className="px-6 py-4 text-gray-600">{formatDate(h.createdAt)}</td>
                    <td className="px-6 py-4"><StatusBadge status={h.status} /></td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        {h.status === "accepted" ? (
                          <button
                            onClick={() => handlePay(h)}
                            disabled={h.paid || payingId === h._id}
                            className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
                              h.paid
                                ? "cursor-not-allowed bg-gray-100 text-gray-500"
                                : "bg-[#C9A227] text-[#0D0D0D] hover:bg-[#D9B43A] disabled:opacity-60"
                            }`}
                          >
                            {h.paid ? "Paid" : payingId === h._id ? "Please wait..." : "Pay"}
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">
                            {h.status === "pending" ? "Awaiting lawyer" : "-"}
                          </span>
                        )}
                      </div>
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