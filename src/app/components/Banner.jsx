"use client";

import { useState } from "react";

const slides = [
  {
    title: "Find & Hire Expert Legal Counsel",
    description: "Connect with qualified lawyers for your legal needs.",
    icon: "⚖️",
  },
  {
    title: "Professional Legal Guidance",
    description:
      "Get trusted legal assistance from experienced professionals.",
    icon: "🧑‍⚖️",
  },
  {
    title: "Legal Help Made Simple",
    description: "Find and hire the right lawyer quickly and easily.",
    icon: "📜",
  },
];

const Banner = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const previousSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative mx-auto h-[500px] w-full overflow-hidden text-white">
      
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
        style={{
          backgroundImage: "url('/nabber-legalease.png')",
        }}
      />

      {/* Optional dark overlay */}
      <div className="absolute inset-0 " />

      {/* Main Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
        
        {/* Slide Card */}
        <div className=" textenter w-full max-w-[600px] rounded-xl  bg-[#252422] p-8 text-center shadow-2xl backdrop-blur-sm">
          
          <div className="mb-5 text-6xl">
            {slides[current].icon}
          </div>

          <h1 className="text-4xl font-bold text-[#EAE0D5]">
            {slides[current].title}
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-[#C6AC8F]">
            {slides[current].description}
          </p>

          <button className="mt-6 rounded-lg bg-[#C6AC8F] px-6 py-3 font-semibold text-[#0A0908] transition hover:bg-[#EAE0D5]">
            Browse Lawyers
          </button>
        </div>

        {/* Dots */}
        <div className="mt-6 flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                current === index
                  ? "bg-[#C9A227]"
                  : "bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Previous Button */}
      <button
        onClick={previousSlide}
        className="absolute left-5 top-1/2 z-20 -translate-y-1/2 rounded-full bg-[#22333B]/80 px-4 py-2 text-2xl text-[#EAE0D5] transition hover:bg-[#C6AC8F] hover:text-[#0A0908]"
        aria-label="Previous slide"
      >
        ←
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        className="absolute right-5 top-1/2 z-20 -translate-y-1/2 rounded-full bg-[#22333B]/80 px-4 py-2 text-2xl text-[#EAE0D5] transition hover:bg-[#C6AC8F] hover:text-[#0A0908]"
        aria-label="Next slide"
      >
        →
      </button>
    </div>
  );
};

export default Banner;