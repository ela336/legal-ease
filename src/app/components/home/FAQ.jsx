"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How do I hire a lawyer?",
    a: "Browse the lawyers, open a profile and click Hire. After you confirm, your request goes to the lawyer, who accepts or rejects it from their dashboard. You can follow its status in your Hiring History.",
  },
  {
    q: "When do I pay?",
    a: "Only after the lawyer accepts your request. A Pay button then appears in your Hiring History, and payment is completed through Stripe Checkout. Once paid, the button shows Paid.",
  },
  {
    q: "Can I hire a lawyer who is marked Busy?",
    a: "No. A Busy lawyer can't receive new requests until they switch back to Available, so check the badge on the profile before you hire.",
  },
  {
    q: "Who can leave a comment on a lawyer's profile?",
    a: "Only clients whose hiring request was accepted by that lawyer. This keeps comments tied to real hires.",
  },
  {
    q: "How do I join LegalEase as a lawyer?",
    a: "Register and choose the Lawyer role. Then open Manage Legal Profile in your dashboard, add your photo, bio, specialization and consultation fee, and publish. You can edit, unpublish or delete your profile at any time.",
  },
  {
    q: "Is my payment information safe?",
    a: "Yes. Payments are processed by Stripe, and LegalEase never sees or stores your card details.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="bg-[#f8f5ef] py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#7d7236]">FAQ</p>
          <h2 className="mt-2 text-3xl font-bold text-[#22333b]">Frequently asked questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((item, i) => (
            <div key={item.q} className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-semibold text-[#22333b]">{item.q}</span>
                <ChevronDown
                  size={20}
                  className={`shrink-0 text-[#C9A227] transition-transform ${open === i ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-sm leading-7 text-gray-600">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}