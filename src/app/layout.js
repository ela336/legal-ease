import { Geist, Geist_Mono } from "next/font/google";
import ThemeScript from "@/app/components/ThemeScript";
import "./globals.css";

import { Toaster } from "react-hot-toast";
import SiteChrome from "@/app/components/SiteChrome";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LegalEase | Find & Hire Expert Legal Counsel",
  description:
    "Browse verified lawyers, compare fees and hire legal experts online.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col">
        <SiteChrome>{children}</SiteChrome>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}