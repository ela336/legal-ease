
"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const Navbar = () => {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  return (
    <nav className="border-b border-[#292929] bg-[#0D0D0D] text-gray-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C9A227]">
            <span className="text-lg font-bold text-[#0D0D0D]">
              LE
            </span>
          </div>

          <h1 className="text-xl font-bold tracking-tight text-white">
            Legal<span className="text-[#C9A227]">Ease</span>
          </h1>
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium transition hover:text-[#C9A227]"
          >
            Home
          </Link>

          <Link
            href="/lawyers"
            className="text-sm font-medium transition hover:text-[#C9A227]"
          >
            Browse Lawyers
          </Link>

          <Link
            href="/about"
            className="text-sm font-medium transition hover:text-[#C9A227]"
          >
            About
          </Link>
        </div>

        {/* Authentication */}
        <div className="flex items-center gap-3">

          {!isPending && session?.user ? (
            <>
              {/* Profile */}
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-lg px-3 py-2 transition hover:bg-[#181818]"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C9A227] text-sm font-bold text-[#0D0D0D]">
                  {session.user.name?.charAt(0).toUpperCase()}
                </div>

                <span className="hidden text-sm font-medium text-white sm:block">
                  {session.user.name}
                </span>
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="rounded-lg border border-[#333] px-4 py-2 text-sm font-semibold text-gray-300 transition hover:border-[#C9A227] hover:bg-[#C9A227] hover:text-[#0D0D0D]"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Login */}
              <Link
                href="/auth/Login"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-300 transition hover:text-[#C9A227]"
              >
                Login
              </Link>

              {/* Get Started */}
              <Link
                href="/register"
                className="rounded-lg bg-[#C9A227] px-5 py-2.5 text-sm font-semibold text-[#0D0D0D] transition hover:bg-[#D9B43A]"
              >
                Get Started
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
