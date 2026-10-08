// src/app/dashboard/layout.jsx
"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Dashboardsidebar from "@/app/components/Dashboard/Dashboardsidebar";

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Dashboardsidebar open={open} onClose={() => setOpen(false)} />

      <div className="lg:ml-72">
        <header className="flex items-center gap-3 border-b bg-white px-4 py-3 lg:hidden">
          <button onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu size={24} />
          </button>
          <span className="font-bold">LegalEase</span>
        </header>
        <main className="min-h-screen p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}