"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function TopExperts() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/api/lawyers/top")
      .then(setLawyers)
      .catch(() => setLawyers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-[#0D0D0D] py-16 text-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#C9A227]">Most trusted</p>
          <h2 className="mt-2 text-3xl font-bold">Top Legal Experts</h2>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-52 animate-pulse rounded-2xl bg-[#181818]" />
            ))}
          </div>
        ) : lawyers.length === 0 ? (
          <p className="text-center text-gray-400">Top experts will appear here once lawyers are hired.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-3">
            {lawyers.map((lawyer, i) => (
              <motion.div
                key={lawyer._id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.04 }}
              >
                <Link
                  href={`/lawyer/${lawyer._id}`}
                  className="flex flex-col items-center rounded-2xl border border-white/10 bg-[#181818] p-6 text-center transition hover:border-[#C9A227]"
                >
                  <div className="relative">
                    {lawyer.image ? (
                      <img src={lawyer.image} alt={lawyer.name} className="h-24 w-24 rounded-full border-4 border-[#C9A227] object-cover" />
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#C9A227] text-3xl font-bold text-[#0D0D0D]">
                        {lawyer.name?.charAt(0)}
                      </div>
                    )}
                    <span className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#C9A227] text-[#0D0D0D]">
                      <Trophy size={16} />
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{lawyer.name}</h3>
                  <p className="mt-1 text-sm text-gray-400">{lawyer.specialization}</p>
                  <p className="mt-3 text-xs font-medium text-[#C9A227]">
                    {lawyer.hireCount || 0} {lawyer.hireCount === 1 ? "hire" : "hires"}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}