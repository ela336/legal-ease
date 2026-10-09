"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, CalendarDays, ShieldCheck, Pencil, BriefcaseBusiness, Clock, CheckCircle2, Scale } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

const roleLabel = { user: "Client", lawyer: "Lawyer", admin: "Administrator" };

function StatCard({ icon: Icon, label, value, href }) {
  const body = (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0D0D0D] text-[#C9A227]">
        <Icon size={22} />
      </div>
      <div>
        <p className="text-2xl font-bold text-[#22333b]">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

export default function DashboardHome() {
  const { data: session, isPending } = authClient.useSession();
  const [stats, setStats] = useState(null);

  const user = session?.user;
  const role = user?.role || "user";

  useEffect(() => {
    if (!user) return;

    if (role === "user") {
      apiFetch("/api/hires/mine", { auth: true })
        .then((hires) =>
          setStats([
            { icon: BriefcaseBusiness, label: "Total requests", value: hires.length, href: "/dashboard/user/hiring-history" },
            { icon: Clock, label: "Pending", value: hires.filter((h) => h.status === "pending").length, href: "/dashboard/user/hiring-history" },
            { icon: CheckCircle2, label: "Accepted", value: hires.filter((h) => h.status === "accepted").length, href: "/dashboard/user/hiring-history" },
          ])
        )
        .catch(() => setStats([]));
    }

    if (role === "lawyer") {
      Promise.all([
        apiFetch("/api/hires/received", { auth: true }),
        apiFetch("/api/lawyers/mine", { auth: true }),
      ])
        .then(([hires, profiles]) =>
          setStats([
            { icon: Scale, label: "My profiles", value: profiles.length, href: "/dashboard/lawyer/manage-legal-profile" },
            { icon: Clock, label: "Pending requests", value: hires.filter((h) => h.status === "pending").length, href: "/dashboard/lawyer/hiring-history" },
            { icon: CheckCircle2, label: "Accepted clients", value: hires.filter((h) => h.status === "accepted").length, href: "/dashboard/lawyer/hiring-history" },
          ])
        )
        .catch(() => setStats([]));
    }
  }, [user?.email, role]);

  if (isPending) {
    return (
      <div className="space-y-6">
        <div className="h-48 animate-pulse rounded-2xl bg-gray-200" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) return null;

  const joined = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#22333b]">Welcome back, {user.name?.split(" ")[0]}</h1>
        <p className="mt-1 text-sm text-gray-500">Here is your profile and a quick summary of your activity.</p>
      </div>

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl bg-white shadow-sm"
      >
        <div className="h-24 bg-gradient-to-r from-[#0D0D0D] to-[#22333b]" />
        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-wrap items-end justify-between gap-4">
            {user.image ? (
              <img src={user.image} alt={user.name} className="h-24 w-24 rounded-full border-4 border-white object-cover" />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-[#C9A227] text-3xl font-bold text-[#0D0D0D]">
                {user.name?.charAt(0)?.toUpperCase()}
              </div>
            )}

            <Link
              href="/dashboard/user/update-profile"
              className="flex items-center gap-2 rounded-xl bg-[#22333b] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#18272d]"
            >
              <Pencil size={16} />
              Update Profile
            </Link>
          </div>

          <h2 className="mt-4 text-xl font-bold text-[#22333b]">{user.name}</h2>

          <div className="mt-4 grid gap-3 text-sm text-gray-600 sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <Mail size={17} className="text-[#C9A227]" />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={17} className="text-[#C9A227]" />
              <span>{roleLabel[role] || role}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays size={17} className="text-[#C9A227]" />
              <span>Joined {joined}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Role summary */}
      {role === "admin" ? (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">
            Manage users and review platform activity from{" "}
            <Link href="/dashboard/admin/analytics" className="font-semibold text-[#7d7236] hover:underline">
              Analytics
            </Link>
            .
          </p>
        </div>
      ) : stats === null ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-200" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      )}
    </div>
  );
}