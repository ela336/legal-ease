"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  MessageSquare,
  UserRound,
  Scale,
  Users,
  CreditCard,
  BarChart3,
  LogOut,
  Home,
} from "lucide-react";

const Dashboardsidebar = ({ open, onClose }) => {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session } = authClient.useSession();

  const role = session?.user?.role || "user";

  const userLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Hiring History", href: "/dashboard/user/hiring-history", icon: BriefcaseBusiness },
    { name: "Transactions", href: "/dashboard/user/transactions", icon: CreditCard },
    { name: "Update Profile", href: "/dashboard/user/update-profile", icon: UserRound },
    { name: "My Comments", href: "/dashboard/user/comments", icon: MessageSquare },
  ];

  const lawyerLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Hiring History", href: "/dashboard/lawyer/hiring-history", icon: BriefcaseBusiness },
    { name: "Manage Legal Profile", href: "/dashboard/lawyer/manage-legal-profile", icon: Scale },
    { name: "Earnings", href: "/dashboard/lawyer/transactions", icon: CreditCard },
    { name: "Update Profile", href: "/dashboard/user/update-profile", icon: UserRound },
  ];

  const adminLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Manage Users", href: "/dashboard/admin/manage-users", icon: Users },
    { name: "Lawyer Listings", href: "/dashboard/admin/lawyer-listings", icon: Scale },
    { name: "All Transactions", href: "/dashboard/admin/all-transactions", icon: CreditCard },
    { name: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
    { name: "Update Profile", href: "/dashboard/user/update-profile", icon: UserRound },
  ];

  let links = userLinks;
  if (role === "lawyer") links = lawyerLinks;
  if (role === "admin") links = adminLinks;

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/auth/Login");
    router.refresh();
  };

  return (
    <>
      {/* Dark background behind the sidebar on mobile. Tap it to close. */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-[#0d0d0d] text-white transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="border-b border-white/10 px-6 py-6">
          <Link href="/" onClick={onClose} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c9a227]">
              <Scale size={22} className="text-[#0d0d0d]" />
            </div>

            <div>
              <h1 className="text-xl font-bold">LegalEase</h1>
              <p className="text-xs text-gray-500">Legal Platform</p>
            </div>
          </Link>
        </div>

        {/* User */}
        <div className="border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#c9a227] font-bold text-[#0d0d0d]">
              {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {session?.user?.name || "User"}
              </p>
              <p className="text-xs capitalize text-gray-500">{role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Menu
          </p>

          <div className="space-y-2">
            {links.map((link) => {
              const Icon = link.icon;

              const active =
                pathname === link.href ||
                (link.href !== "/dashboard" && pathname?.startsWith(link.href));

              return (
                <Link
                  key={link.href + link.name}
                  href={link.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-[#c9a227] text-[#0d0d0d]"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={19} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/10 p-4">
          <Link
            href="/"
            onClick={onClose}
            className="mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
          >
            <Home size={19} />
            Back to Website
          </Link>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-300 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Dashboardsidebar;