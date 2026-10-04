
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Dropdown,
  Button,
  InputGroup,
  Label,
  Avatar,
} from "@heroui/react";

import {
  Magnifier,
  Person,
  ChevronDown,
  Gear,
  Briefcase,
  LayoutHeader,
  House,
  LogOut,
  Bars,
  Xmark,
} from "@gravity-ui/icons";

const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Replace this later with your actual auth/session user
  const user = null;

  const isActive = (path) => {
    if (path === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(path);
  };

  const navLinks = [
    {
      name: "Home",
      href: "/",
      icon: House,
    },
    {
      name: "Browse Lawyers",
      href: "/lawyers",
      icon: Briefcase,
    },
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutHeader,
    },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-[#292929] bg-[#0D0D0D]">
      <div className="textenter mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C9A227] ">
            <Briefcase
              width={20}
              height={20}
              className="text-[#0D0D0D]"
            />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Legal<span className="text-[#C9A227]">Ease</span>
            </h1>

            <p className="hidden text-[9px] uppercase tracking-[3px] text-gray-500 sm:block">
              Legal Marketplace
            </p>
          </div>
        </Link>

        {/* ================= DESKTOP NAV ================= */}
        <div className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-2 py-5 text-md font-medium transition ${
                  isActive(link.href)
                    ? "text-[#C9A227]"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <Icon width={17} height={17} />

                {link.name}

                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-[#C9A227]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex items-center gap-3">

          {/* ================= DESKTOP SEARCH ================= */}
          <div className="hidden md:block">
            <InputGroup className="w-[200px]">
              <InputGroup.Prefix>
                <Magnifier
                  width={17}
                  height={17}
                  className="text-gray-500"
                />
              </InputGroup.Prefix>

              <InputGroup.Input
                placeholder="Search lawyers..."
                className="h-9 bg-[#181818] text-sm text-white placeholder:text-gray-500"
              />
            </InputGroup>
          </div>

          {/* ================= LOGGED OUT ================= */}
          {!user ? (
            <>
              <Link
                href="/login"
                className="hidden text-sm font-medium text-gray-300 transition hover:text-white sm:block"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="hidden rounded-md bg-[#C9A227] px-5 py-2 text-sm font-semibold text-[#0D0D0D] transition hover:bg-[#D9B43A] sm:block"
              >
                Get Started
              </Link>
            </>
          ) : (
            /* ================= LOGGED IN ================= */
            <Dropdown>
              <Dropdown.Trigger>
                <button
                  type="button"
                  className="flex items-center gap-2 outline-none"
                >
                  <Avatar
                    src={user.image}
                    name={user.name}
                    size="sm"
                    className="cursor-pointer"
                  />

                  <div className="hidden text-left md:block">
                    <p className="text-xs font-semibold text-white">
                      {user.name}
                    </p>

                    <p className="text-[10px] capitalize text-gray-500">
                      {user.role}
                    </p>
                  </div>

                  <ChevronDown
                    width={15}
                    height={15}
                    className="hidden text-gray-400 md:block"
                  />
                </button>
              </Dropdown.Trigger>

              <Dropdown.Popover placement="bottom end">
                <Dropdown.Menu>

                  <Dropdown.Item
                    id="dashboard"
                    textValue="Dashboard"
                  >
                    <Gear width={17} height={17} />
                    <Label>Dashboard</Label>
                  </Dropdown.Item>

                  {user.role === "client" && (
                    <Dropdown.Item
                      id="bookings"
                      textValue="My Bookings"
                    >
                      <Briefcase width={17} height={17} />
                      <Label>My Bookings</Label>
                    </Dropdown.Item>
                  )}

                  {user.role === "lawyer" && (
                    <Dropdown.Item
                      id="listings"
                      textValue="My Listings"
                    >
                      <Briefcase width={17} height={17} />
                      <Label>My Listings</Label>
                    </Dropdown.Item>
                  )}

                  {user.role === "admin" && (
                    <Dropdown.Item
                      id="users"
                      textValue="Manage Users"
                    >
                      <Person width={17} height={17} />
                      <Label>Manage Users</Label>
                    </Dropdown.Item>
                  )}

                  <Dropdown.Item
                    id="profile"
                    textValue="Profile"
                  >
                    <Person width={17} height={17} />
                    <Label>Profile</Label>
                  </Dropdown.Item>

                  <Dropdown.Item
                    id="logout"
                    textValue="Logout"
                    variant="danger"
                  >
                    <LogOut width={17} height={17} />
                    <Label>Logout</Label>
                  </Dropdown.Item>

                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          )}

          {/* ================= MOBILE BUTTON ================= */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#333] text-gray-300 hover:text-white lg:hidden"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <Xmark width={21} height={21} />
            ) : (
              <Bars width={21} height={21} />
            )}
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {isMenuOpen && (
        <div className="border-t border-[#292929] bg-[#0D0D0D] lg:hidden">
          <div className="mx-auto max-w-7xl space-y-2 px-4 py-5 sm:px-6">

            {/* Mobile Search */}
            <InputGroup className="w-full">
              <InputGroup.Prefix>
                <Magnifier
                  width={18}
                  height={18}
                  className="text-gray-500"
                />
              </InputGroup.Prefix>

              <InputGroup.Input
                placeholder="Search lawyers by name or specialization..."
                className="h-10 bg-[#181818] text-white placeholder:text-gray-500"
              />
            </InputGroup>

            {/* ================= MOBILE LINKS ================= */}
            <div className="pt-3">
              {navLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium ${
                      isActive(link.href)
                        ? "bg-[#C9A227]/10 text-[#C9A227]"
                        : "text-gray-300 hover:bg-[#181818] hover:text-white"
                    }`}
                  >
                    <Icon width={18} height={18} />

                    {link.name}
                  </Link>
                );
              })}

              {user && (
                <Link
                  href="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-300 hover:bg-[#181818] hover:text-white"
                >
                  <Gear width={18} height={18} />
                  Dashboard
                </Link>
              )}
            </div>

            {/* ================= MOBILE AUTH ================= */}
            {!user ? (
              <div className="grid grid-cols-2 gap-3 pt-3">

                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center rounded-lg border border-[#333] py-3 text-sm font-medium text-white"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center rounded-lg bg-[#C9A227] py-3 text-sm font-semibold text-[#0D0D0D]"
                >
                  Get Started
                </Link>

              </div>
            ) : (
              <button
                type="button"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-red-900/50 py-3 text-sm font-medium text-red-400"
                onClick={() => {
                  // Add logout function here
                  setIsMenuOpen(false);
                }}
              >
                <LogOut width={18} height={18} />
                Logout
              </button>
            )}

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
