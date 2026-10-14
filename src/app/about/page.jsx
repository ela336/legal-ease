import Link from "next/link";
import {
  Scale,
  Search,
  Handshake,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  Users,
  Gavel,
  Eye,
  CheckCircle2,
} from "lucide-react";
import Reveal from "@/app/components/Reveal";

export const metadata = {
  title: "About | LegalEase",
  description:
    "LegalEase connects clients and businesses with verified lawyers through one trusted online marketplace.",
};

const steps = [
  {
    icon: Search,
    title: "Browse and compare",
    text: "Search lawyers by name or specialization, then compare fees and availability.",
  },
  {
    icon: Handshake,
    title: "Send a hiring request",
    text: "Pick a lawyer and send a request in one click. No phone calls or office visits.",
  },
  {
    icon: CreditCard,
    title: "Pay securely",
    text: "Once the lawyer accepts, pay the consultation fee online through Stripe.",
  },
  {
    icon: MessageSquare,
    title: "Share your experience",
    text: "After you hire a lawyer, leave a comment to help other clients decide.",
  },
];

const clientPoints = [
  "Browse lawyers across practice areas without creating an account",
  "Filter by fee range, specialization and availability",
  "Track every request from pending to accepted",
  "Pay only after the lawyer accepts your request",
];

const lawyerPoints = [
  "Publish your profile with your photo, bio and consultation fee",
  "Mark yourself Available or Busy whenever your schedule changes",
  "Accept or reject hiring requests from your dashboard",
  "See your earnings and transaction history in one place",
];

const values = [
  {
    icon: Eye,
    title: "Transparency",
    text: "Fees, availability and client comments are visible before you hire.",
  },
  {
    icon: ShieldCheck,
    title: "Security",
    text: "Secure sign-in, role-based access and payments handled by Stripe.",
  },
  {
    icon: Users,
    title: "Access for everyone",
    text: "Legal help should reach people and businesses, not only large firms.",
  },
  {
    icon: Gavel,
    title: "Opportunity for lawyers",
    text: "Emerging lawyers can reach new clients and manage their services online.",
  },
];

function CheckList({ items }) {
  return (
    <ul className="mt-5 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-sm leading-6 text-gray-600">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#C9A227]" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function About() {
  return (
    <main className="min-h-screen bg-[#f8f5ef]">
      {/* Hero */}
      <section className="bg-[#0D0D0D] px-4 py-20 text-center text-white">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#C9A227]">
          <Scale size={32} className="text-[#0D0D0D]" />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-[#C9A227]">About LegalEase</p>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
          Legal help, made simple and accessible
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-gray-400">
          LegalEase is an online marketplace that connects people and businesses with talented
          lawyers, so finding and hiring legal counsel takes minutes instead of weeks.
        </p>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#7d7236]">Our mission</p>
            <h2 className="mt-2 text-3xl font-bold text-[#22333b]">Why we built LegalEase</h2>
            <p className="mt-4 leading-7 text-gray-600">
              Hiring a lawyer has traditionally meant relying on law firms and in-person consultations,
              which can be slow, costly and hard to compare. LegalEase opens that process up.
            </p>
            <p className="mt-4 leading-7 text-gray-600">
              Clients can discover lawyers, see clear fees and book with confidence. Lawyers get a
              simple way to present their services and reach clients across the country.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <div className="grid grid-cols-2 gap-6 text-center">
                {[
                  { label: "Clients", sub: "Find and hire" },
                  { label: "Lawyers", sub: "Publish and manage" },
                  { label: "Admins", sub: "Oversee the platform" },
                  { label: "Stripe", sub: "Secure payments" },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-xl font-bold text-[#22333b]">{item.label}</p>
                    <p className="mt-1 text-sm text-gray-500">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#7d7236]">How it works</p>
            <h2 className="mt-2 text-3xl font-bold text-[#22333b]">Hire a lawyer in four steps</h2>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0D0D0D] text-[#C9A227]">
                      <Icon size={22} />
                    </div>
                    <span className="text-3xl font-bold text-gray-200">{i + 1}</span>
                  </div>
                  <h3 className="mt-4 font-semibold text-[#22333b]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Clients and lawyers */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-[#22333b]">For clients</h2>
              <CheckList items={clientPoints} />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-2xl bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-[#22333b]">For lawyers</h2>
              <CheckList items={lawyerPoints} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#0D0D0D] px-4 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#C9A227]">What we stand for</p>
            <h2 className="mt-2 text-3xl font-bold">Our values</h2>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-white/10 bg-[#181818] p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C9A227] text-[#0D0D0D]">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-4 font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-400">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="px-4 py-16 text-center">
        <Reveal>
          <h2 className="text-3xl font-bold text-[#22333b]">Ready to find the right lawyer?</h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-600">
            Browse verified lawyers today, or join LegalEase as a lawyer and start reaching new clients.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/lawyer"
              className="rounded-xl bg-[#C9A227] px-8 py-3.5 font-semibold text-[#0D0D0D] transition hover:bg-[#D9B43A]"
            >
              Browse Lawyers
            </Link>
            <Link
              href="/auth/Register"
              className="rounded-xl border border-gray-300 px-8 py-3.5 font-semibold text-gray-700 transition hover:bg-white"
            >
              Create an account
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            Questions?{" "}
            <Link href="/contact" className="font-semibold text-[#7d7236] hover:underline">
              Contact us
            </Link>
          </p>
        </Reveal>
      </section>
    </main>
  );
}