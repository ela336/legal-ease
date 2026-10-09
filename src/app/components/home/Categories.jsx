"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Gavel, Building2, Users, Home, Plane, Receipt, Briefcase, Scale } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

const icons = {
  Criminal: Gavel,
  Corporate: Building2,
  Family: Users,
  Property: Home,
  Immigration: Plane,
  Tax: Receipt,
  Labor: Briefcase,
  Civil: Scale,
};

export default function Categories() {
  return (
    <section className="bg-[#f8f5ef] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#7d7236]">Practice areas</p>
          <h2 className="mt-2 text-3xl font-bold text-[#22333b]">Legal Categories</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((category, i) => {
            const Icon = icons[category] || Scale;
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 4) * 0.08 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link
                  href={`/lawyers?category=${encodeURIComponent(category)}`}
                  className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 text-center transition hover:border-[#C9A227] hover:shadow-md"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#0D0D0D] text-[#C9A227]">
                    <Icon size={26} />
                  </div>
                  <p className="mt-4 font-semibold text-[#22333b]">{category}</p>
                  <p className="mt-1 text-xs text-gray-500">Browse {category.toLowerCase()} lawyers</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}