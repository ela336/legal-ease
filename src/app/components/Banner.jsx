"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Scale, Gavel, FileText } from "lucide-react";

const slides = [
  {
    title: "Find & Hire Expert Legal Counsel",
    description: "Connect with qualified lawyers for your legal needs.",
    icon: Scale,
  },
  {
    title: "Professional Legal Guidance",
    description: "Get trusted legal assistance from experienced professionals.",
    icon: Gavel,
  },
  {
    title: "Legal Help Made Simple",
    description: "Find and hire the right lawyer quickly and easily.",
    icon: FileText,
  },
];

const Banner = () => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const previousSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [paused]);

  const Icon = slides[current].icon;

  return (
    <section
      className="relative h-[520px] w-full overflow-hidden bg-[#0D0D0D] text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: "url('/nabber-legalease.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D]/60 via-transparent to-[#0D0D0D]/80" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[640px] rounded-2xl border border-white/10 bg-[#252422]/90 p-8 text-center shadow-2xl backdrop-blur-sm sm:p-10"
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#C9A227]">
              <Icon size={32} className="text-[#0D0D0D]" />
            </div>

            <h1 className="text-3xl font-bold text-[#EAE0D5] sm:text-4xl">
              {slides[current].title}
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-[#C6AC8F]">
              {slides[current].description}
            </p>

            <Link
              href="/lawyer"
              className="mt-7 inline-block rounded-lg bg-[#C9A227] px-7 py-3 font-semibold text-[#0D0D0D] transition hover:bg-[#D9B43A]"
            >
              Browse Lawyers
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="mt-6 flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2.5 rounded-full transition-all ${
                current === index ? "w-6 bg-[#C9A227]" : "w-2.5 bg-gray-500"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <button
        onClick={previousSlide}
        className="absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-[#22333B]/80 p-3 text-[#EAE0D5] transition hover:bg-[#C9A227] hover:text-[#0D0D0D] sm:block"
        aria-label="Previous slide"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-[#22333B]/80 p-3 text-[#EAE0D5] transition hover:bg-[#C9A227] hover:text-[#0D0D0D] sm:block"
        aria-label="Next slide"
      >
        <ChevronRight size={22} />
      </button>
    </section>
  );
};

export default Banner;