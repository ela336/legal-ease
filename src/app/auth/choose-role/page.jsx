"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function ChooseRole() {
  const router = useRouter();
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    await authClient.updateUser({ role });
    router.push("/");
    router.refresh();
  };

  const options = [
    { value: "user", title: "User", desc: "Find & hire " },
    { value: "lawyer", title: "Lawyer", desc: "Offer legal services" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f5ef] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-[#22333b]">One last step</h1>
        <p className="mt-2 text-sm text-gray-500">How do you want to use LegalEase?</p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => setRole(o.value)}
              className={`rounded-xl border px-4 py-4 text-center transition ${
                role === o.value
                  ? "border-[#7d7236] bg-[#7d7236]/10 ring-2 ring-[#7d7236]/10"
                  : "border-gray-200 bg-gray-50 hover:bg-white"
              }`}
            >
              <p className="font-semibold text-gray-800">{o.title}</p>
              <p className="mt-1 text-xs text-gray-500">{o.desc}</p>
            </button>
          ))}
        </div>

        <button
          onClick={save}
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-[#22333b] py-3.5 font-semibold text-white hover:bg-[#18272d] disabled:opacity-60"
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
}