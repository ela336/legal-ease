"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api";
import LawyerCard from "../LawyerCard";
import LawyerCardSkeleton from "../LawyerCardSkeleton";

export default function FeaturedLawyers() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/api/lawyers/featured")
      .then(setLawyers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-[#f8f5ef] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-[#7d7236]">Meet our lawyers</p>
          <h2 className="mt-2 text-3xl font-bold text-[#22333b]">Featured Lawyers</h2>
        </motion.div>

        {error ? (
          <p className="text-center text-sm text-red-600">Could not load lawyers. {error}</p>
        ) : loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <LawyerCardSkeleton key={i} />
            ))}
          </div>
        ) : lawyers.length === 0 ? (
          <p className="text-center text-gray-500">No lawyers have joined yet. Check back soon.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lawyers.map((lawyer, i) => (
              <LawyerCard key={lawyer._id} lawyer={lawyer} index={i} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/lawyer"
            className="inline-block rounded-lg border border-[#22333b] px-6 py-3 text-sm font-semibold text-[#22333b] transition hover:bg-[#22333b] hover:text-white"
          >
            View all lawyers
          </Link>
        </div>
      </div>
    </section>
  );
}