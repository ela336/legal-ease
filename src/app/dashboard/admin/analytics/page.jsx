"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Users, Scale, Handshake, DollarSign } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

const STATUS_COLORS = { Pending: "#EAB308", Accepted: "#16A34A", Rejected: "#DC2626" };

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0D0D0D] text-[#C9A227]">
        <Icon size={22} />
      </div>
      <div>
        <p className="text-2xl font-bold text-[#22333b]">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="mb-4 font-semibold text-[#22333b]">{title}</h2>
      <div className="h-72">{children}</div>
    </div>
  );
}

export default function Analytics() {
  const { data: session, isPending } = authClient.useSession();
  const isAdmin = session?.user?.role === "admin";

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      if (!isPending) setLoading(false);
      return;
    }
    apiFetch("/api/stats", { auth: true })
      .then(setStats)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [isAdmin, isPending]);

  if (isPending || loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-200" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-80 animate-pulse rounded-2xl bg-gray-200" />
          <div className="h-80 animate-pulse rounded-2xl bg-gray-200" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-gray-600">Only administrators can view analytics.</p>
      </div>
    );
  }

  if (!stats) return <p className="text-sm text-gray-500">Analytics could not be loaded.</p>;

  const hasHires = stats.hiresByStatus.some((s) => s.value > 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#22333b]">Analytics Overview</h1>
        <p className="mt-1 text-sm text-gray-500">A snapshot of activity across LegalEase.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Total users" value={stats.totalUsers} />
        <StatCard icon={Scale} label="Total lawyers" value={stats.totalLawyers} />
        <StatCard icon={Handshake} label="Total hires" value={stats.totalHires} />
        <StatCard icon={DollarSign} label="Total revenue" value={`$${stats.totalRevenue.toFixed(2)}`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Revenue (last 6 months)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip formatter={(v) => [`$${v}`, "Revenue"]} />
              <Bar dataKey="revenue" fill="#C9A227" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Hiring requests by status">
          {hasHires ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.hiresByStatus} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {stats.hiresByStatus.map((s) => (
                    <Cell key={s.name} fill={STATUS_COLORS[s.name]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="flex h-full items-center justify-center text-sm text-gray-400">No hiring requests yet.</p>
          )}
        </ChartCard>
      </div>

      <ChartCard title="Lawyers by specialization">
        {stats.categories.length === 0 ? (
          <p className="flex h-full items-center justify-center text-sm text-gray-400">No lawyer profiles yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.categories}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="count" name="Lawyers" fill="#22333b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </div>
  );
}