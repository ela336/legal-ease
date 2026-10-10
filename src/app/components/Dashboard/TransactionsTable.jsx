"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Receipt, Search } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

export default function TransactionsTable({ role, title, subtitle }) {
  const { data: session, isPending } = authClient.useSession();
  const allowed = session?.user?.role === role;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!allowed) {
      if (!isPending) setLoading(false);
      return;
    }
    apiFetch("/api/payments/transactions", { auth: true })
      .then(setItems)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [allowed, isPending]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (t) =>
        t.transactionId?.toLowerCase().includes(q) ||
        t.userEmail?.toLowerCase().includes(q) ||
        t.lawyerEmail?.toLowerCase().includes(q) ||
        t.lawyerName?.toLowerCase().includes(q)
    );
  }, [items, search]);

  const total = visible.reduce((sum, t) => sum + (t.amount || 0), 0);

  if (isPending) return <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />;

  if (!allowed) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-gray-600">You don't have access to this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#22333b]">{title}</h1>
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className="rounded-2xl bg-[#0D0D0D] px-6 py-3 text-right text-white">
          <p className="text-xs text-gray-400">
            {role === "admin" ? "Total revenue" : role === "lawyer" ? "Total earned" : "Total paid"}
          </p>
          <p className="text-2xl font-bold text-[#C9A227]">${total.toFixed(2)}</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by ID, email or lawyer"
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-black outline-none placeholder:text-gray-400 focus:border-[#7d7236] focus:ring-2 focus:ring-[#7d7236]/10"
        />
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
            <Receipt size={40} className="mx-auto text-gray-300" />
            <p className="mt-3 text-sm text-gray-500">
              {items.length === 0 ? "No transactions yet." : "No transactions match your search."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-3">Transaction ID</th>
                  <th className="px-6 py-3">Client email</th>
                  <th className="px-6 py-3">Lawyer</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {visible.map((t) => (
                  <tr key={t._id}>
                    <td className="max-w-[200px] truncate px-6 py-4 font-mono text-xs text-gray-700" title={t.transactionId}>
                      {t.transactionId}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{t.userEmail}</td>
                    <td className="px-6 py-4 text-gray-600">
                      <p className="font-medium text-gray-800">{t.lawyerName}</p>
                      <p className="text-xs text-gray-400">{t.lawyerEmail}</p>
                    </td>
                    <td className="px-6 py-4 font-semibold text-green-700">${t.amount?.toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-600">{formatDate(t.date)}</td>
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