"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function LawyerCard({ lawyer, index = 0 }) {
  const busy = lawyer.status === "busy";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index, 5) * 0.08 }}
      whileHover={{ scale: 1.03 }}
    >
      <Link
        href={`/lawyer/${lawyer._id}`}
        className="relative flex h-full flex-col items-center rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm transition hover:shadow-lg"
      >
        {busy && (
          <span className="absolute right-3 top-3 rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-semibold text-red-600">
            Busy
          </span>
        )}

        {lawyer.image ? (
          <img
            src={lawyer.image}
            alt={lawyer.name}
            className="h-24 w-24 rounded-full border-4 border-[#C9A227]/30 object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#C9A227] text-3xl font-bold text-[#0D0D0D]">
            {lawyer.name?.charAt(0)?.toUpperCase()}
          </div>
        )}

        <h3 className="mt-4 line-clamp-1 text-base font-semibold text-[#22333b]">
          {lawyer.name}
        </h3>

        <span className="mt-2 rounded-full bg-[#7d7236]/10 px-3 py-1 text-xs font-medium text-[#7d7236]">
          {lawyer.specialization}
        </span>

        <p className="mt-4 text-sm text-gray-500">
          <span className="text-lg font-bold text-[#22333b]">${lawyer.fee}</span> / consultation
        </p>
      </Link>
    </motion.div>
  );
}