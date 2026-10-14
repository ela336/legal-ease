"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { Scale, Users, BriefcaseBusiness, LayoutGrid } from "lucide-react";
import { apiFetch } from "@/lib/api";

function CountUp({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return <span ref={ref}>{n}</span>;
}

const items = [
  { key: "lawyers", label: "Lawyers listed", icon: Scale },
  { key: "clients", label: "Registered clients", icon: Users },
  { key: "hires", label: "Hires accepted", icon: BriefcaseBusiness },
  { key: "specializations", label: "Practice areas", icon: LayoutGrid },
];

export default function Statistics() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    apiFetch("/api/stats/public")
      .then(setStats)
      .catch(() => setError(true));
  }, []);

  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#7d7236]">LegalEase in numbers</p>
          <h2 className="mt-2 text-3xl font-bold text-[#22333b]">A growing legal marketplace</h2>
        </div>

        {error ? (
          <p className="text-center text-sm text-gray-500">Statistics are unavailable right now.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {items.map(({ key, label, icon: Icon }) => (
              <div key={key} className="rounded-2xl border border-gray-200 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#0D0D0D] text-[#C9A227]">
                  <Icon size={22} />
                </div>
                {stats ? (
                  <p className="mt-4 text-3xl font-bold text-[#22333b]">
                    <CountUp value={stats[key] || 0} />
                  </p>
                ) : (
                  <div className="mx-auto mt-4 h-9 w-16 animate-pulse rounded bg-gray-200" />
                )}
                <p className="mt-1 text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}