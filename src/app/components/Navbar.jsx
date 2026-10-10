// src/app/components/Navbar.jsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Search } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const links = [
  { name: "Home", href: "/" },
  { name: "Browse Lawyers", href: "/lawyer" },
 
];

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { data: session, isPending, error } = authClient.useSession();

  const userName = session?.user?.name || "User";
  const firstLetter = userName.charAt(0).toUpperCase();

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/lawyer?search=${encodeURIComponent(query.trim())}`);
      setOpen(false);
    }
  };

  const linkClass = (href) =>
    `text-sm font-medium transition hover:text-[#C9A227] ${
      pathname === href ? "text-[#C9A227]" : "text-gray-300"
    }`;

  return (
    <nav className="sticky top-0 z-40 border-b border-[#292929] bg-[#0D0D0D] text-gray-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C9A227]">
            <span className="text-lg font-bold text-[#0D0D0D]">LE</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Legal<span className="text-[#C9A227]">Ease</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(l.href)}>
              {l.name}
            </Link>
          ))}
          {session?.user && (
            <Link href="/dashboard" className={linkClass("/dashboard")}>
              Dashboard
            </Link>
          )}
        </div>

        <form onSubmit={handleSearch} className="hidden flex-1 max-w-xs md:flex">
          <div className="relative w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name or specialization"
              className="w-full rounded-lg border border-[#333] bg-[#181818] py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-[#C9A227]"
            />
          </div>
        </form>

        <div className="hidden items-center gap-3 md:flex">
          {isPending && !error ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-[#292929]" />
          ) : session?.user ? (
            <>
              <Link href="/dashboard" className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-[#181818]">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C9A227] text-sm font-bold text-[#0D0D0D]">
                  {firstLetter}
                </div>
                <span className="hidden text-sm font-medium text-white xl:block">{userName}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-[#333] px-4 py-2 text-sm font-semibold transition hover:border-[#C9A227] hover:bg-[#C9A227] hover:text-[#0D0D0D]"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/Login" className="px-4 py-2 text-sm font-semibold hover:text-[#C9A227]">
                Login
              </Link>
              <Link
                href="/auth/Register"
                className="rounded-lg bg-[#C9A227] px-5 py-2.5 text-sm font-semibold text-[#0D0D0D] hover:bg-[#D9B43A]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="lg:hidden md:ml-2" aria-label="Menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="space-y-3 border-t border-[#292929] px-4 py-4 lg:hidden">
          <form onSubmit={handleSearch}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search lawyers"
              className="w-full rounded-lg border border-[#333] bg-[#181818] px-3 py-2 text-sm text-white outline-none focus:border-[#C9A227]"
            />
          </form>
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className={`block ${linkClass(l.href)}`}>
              {l.name}
            </Link>
          ))}
          {session?.user ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)} className="block text-sm">Dashboard</Link>
              <button onClick={handleLogout} className="text-sm text-red-400">Logout</button>
            </>
          ) : (
            <>
              <Link href="/auth/Login" onClick={() => setOpen(false)} className="block text-sm">Login</Link>
              <Link href="/auth/Register" onClick={() => setOpen(false)} className="block text-sm text-[#C9A227]">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;