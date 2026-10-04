
"use client";

import React, { useState } from "react";
import Link from "next/link";

import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";

import { Mail } from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email) return;

    alert("Thanks for subscribing!");
    setEmail("");
  };

  return (
    <footer className="border-t border-[#292929] bg-[#0D0D0D] text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* ================= TOP SECTION ================= */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* ================= LOGO / ABOUT ================= */}
          <div className="carenterleft">
            <Link
              href="/"
              className="inline-flex items-center gap-2"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C9A227]">
                <span className="text-lg font-bold text-[#0D0D0D]">
                  LE
                </span>
              </div>

              <h2 className="text-xl font-bold tracking-tight text-white">
                Legal<span className="text-[#C9A227]">Ease</span>
              </h2>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-gray-500">
              Your trusted platform for finding and hiring qualified lawyers.
              Legal help made simple, accessible, and convenient.
            </p>
          </div>

          
          <div className="textenter">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/about"
                  className="transition hover:text-[#C9A227]"
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="transition hover:text-[#C9A227]"
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy-policy"
                  className="transition hover:text-[#C9A227]"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

         
          <div className="textenter">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Follow Us
            </h3>

            <div className="flex items-center gap-3">

              
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#333] transition hover:border-[#C9A227] hover:bg-[#C9A227] hover:text-[#0D0D0D]"
              >
                <FaFacebookF size={16} />
              </a>

              {/* Twitter */}
              <a
                href="#"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#333] transition hover:border-[#C9A227] hover:bg-[#C9A227] hover:text-[#0D0D0D]"
              >
                <FaTwitter size={16} />
              </a>

              {/* LinkedIn */}
              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#333] transition hover:border-[#C9A227] hover:bg-[#C9A227] hover:text-[#0D0D0D]"
              >
                <FaLinkedinIn size={16} />
              </a>

              {/* Instagram */}
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#333] transition hover:border-[#C9A227] hover:bg-[#C9A227] hover:text-[#0D0D0D]"
              >
                <FaInstagram size={16} />
              </a>

            </div>
          </div>

          
          <div className="carenterright">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Newsletter
            </h3>

            <p className="mb-4 text-sm leading-5 text-gray-500">
              Subscribe to get legal tips, updates, and news from LegalEase.
            </p>

            <form
              onSubmit={handleSubscribe}

              className="flex overflow-hidden rounded-lg border border-[#333] bg-[#181818]"
            >
              <div className="flex items-center pl-3">
                <Mail
                  width={17}
                  height={17}
                  className="text-gray-500"
                />
              </div>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-600"
              />

              <button
                type="submit"
                className="bg-[#C9A227] px-4 text-sm font-semibold text-[#0D0D0D] transition hover:bg-[#D9B43A]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* ================= BOTTOM SECTION ================= */}
        <div className="mt-10 border-t border-[#292929] pt-6">
          <div className="flex flex-col items-center justify-between gap-3 text-sm text-gray-500 sm:flex-row">

            <p>
              © {new Date().getFullYear()} LegalEase. All rights reserved.
            </p>

            <p>
              Making legal help{" "}
              <span className="text-[#C9A227]">
                simple & accessible.
              </span>
            </p>

          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
