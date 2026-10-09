import { Suspense } from "react";
import BrowseLawyers from "./BrowseLawyers";

export const metadata = { title: "Browse Lawyers | LegalEase" };

export default function LawyersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8f5ef]" />}>
      <BrowseLawyers />
    </Suspense>
  );
}