import Link from "next/link";
import { Scale } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-1 items-center justify-center bg-[#f8f5ef] px-4 text-center">
      <div>
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#0D0D0D] text-[#C9A227]">
          <Scale size={40} />
        </div>
        <p className="mt-6 text-6xl font-bold text-[#C9A227]">404</p>
        <h1 className="mt-2 text-2xl font-bold text-[#22333b]">Page not found</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-xl bg-[#C9A227] px-6 py-3 text-sm font-semibold text-[#0D0D0D] hover:bg-[#D9B43A]">
            Go home
          </Link>
          <Link href="/lawyer" className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-white">
            Browse lawyers
          </Link>
        </div>
      </div>
    </main>
  );
}