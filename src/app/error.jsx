"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] flex-1 items-center justify-center bg-[#f8f5ef] px-4 text-center">
      <div>
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-red-100 text-red-600">
          <TriangleAlert size={40} />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-[#22333b]">Something went wrong</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
          An unexpected error occurred. You can try again, or head back to the home page.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => reset()}
            className="rounded-xl bg-[#22333b] px-6 py-3 text-sm font-semibold text-white hover:bg-[#18272d]"
          >
            Try again
          </button>
          <Link href="/" className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-white">
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}