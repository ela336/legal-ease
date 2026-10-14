"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { apiFetch } from "@/lib/api";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

export default function Testimonials() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/api/comments/latest")
      .then(setComments)
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#7d7236]">Client stories</p>
          <h2 className="mt-2 text-3xl font-bold text-[#22333b]">What clients are saying</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500">
            Only clients whose hiring request was accepted can leave a comment.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 animate-pulse rounded-2xl bg-gray-200" />
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 p-10 text-center">
            <Quote size={36} className="mx-auto text-gray-300" />
            <p className="mt-3 text-sm text-gray-500">
              Client comments will appear here once lawyers have accepted hiring requests.
            </p>
            <Link href="/lawyer" className="mt-4 inline-block text-sm font-semibold text-[#7d7236] hover:underline">
              Browse lawyers
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {comments.map((c, i) => (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
                className="flex flex-col rounded-2xl border border-gray-200 p-6"
              >
                <Quote size={24} className="text-[#C9A227]" />
                <p className="mt-3 line-clamp-4 flex-1 text-sm leading-6 text-gray-600">{c.text}</p>

                <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4">
                  {c.userImage ? (
                    <img src={c.userImage} alt={c.userName} className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A227] text-sm font-bold text-[#0D0D0D]">
                      {c.userName?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#22333b]">{c.userName}</p>
                    <p className="truncate text-xs text-gray-500">
                      on{" "}
                      <Link href={`/lawyer/${c.lawyerId}`} className="font-medium text-[#7d7236] hover:underline">
                        {c.lawyerName || "a lawyer"}
                      </Link>{" "}
                      · {formatDate(c.createdAt)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}