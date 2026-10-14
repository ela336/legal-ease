"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Handshake, CreditCard, MessageSquare } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Find a lawyer",
    text: "Browse by specialization, compare fees and see who is available right now.",
  },
  {
    icon: Handshake,
    title: "Send a request",
    text: "Confirm your hiring request. The lawyer reviews it and accepts or rejects it.",
  },
  {
    icon: CreditCard,
    title: "Pay securely",
    text: "Once your request is accepted, pay the consultation fee online with Stripe.",
  },
  {
    icon: MessageSquare,
    title: "Share feedback",
    text: "After a lawyer accepts you, leave a comment to help other clients choose.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#7d7236]">How it works</p>
          <h2 className="mt-2 text-3xl font-bold text-[#22333b]">Hire a lawyer in four steps</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C9A227] text-[#0D0D0D]">
                  <Icon size={22} />
                </div>
                <span className="text-3xl font-bold text-gray-200">{i + 1}</span>
              </div>
              <h3 className="mt-4 font-semibold text-[#22333b]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{text}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/lawyer"
            className="rounded-xl bg-[#C9A227] px-7 py-3 text-sm font-semibold text-[#0D0D0D] transition hover:bg-[#D9B43A]"
          >
            Browse Lawyers
          </Link>
          <Link
            href="/auth/Register"
            className="rounded-xl border border-gray-300 px-7 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Join as a lawyer
          </Link>
        </div>
      </div>
    </section>
  );
}