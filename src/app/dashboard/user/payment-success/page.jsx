"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";

function PaymentResult() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const started = useRef(false);

  const [state, setState] = useState("loading"); // loading | success | error
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    if (!sessionId) {
      setState("error");
      setMessage("No payment session found.");
      return;
    }

    apiFetch("/api/payments/confirm", { method: "POST", auth: true, body: { sessionId } })
      .then((data) => {
        setResult(data);
        setState("success");
      })
      .catch((err) => {
        setMessage(err.message);
        setState("error");
      });
  }, [sessionId]);

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-10 text-center shadow-sm">
      {state === "loading" && (
        <>
          <Loader2 size={44} className="mx-auto animate-spin text-[#C9A227]" />
          <p className="mt-4 font-semibold text-[#22333b]">Confirming your payment...</p>
          <p className="mt-1 text-sm text-gray-500">Please don't close this page.</p>
        </>
      )}

      {state === "success" && (
        <>
          <CheckCircle2 size={52} className="mx-auto text-green-600" />
          <h1 className="mt-4 text-2xl font-bold text-[#22333b]">Payment successful</h1>
          <p className="mt-2 text-sm text-gray-600">
            You paid <b>${result?.amount}</b> to {result?.lawyerName}.
          </p>
          <p className="mt-3 break-all text-xs text-gray-400">Transaction ID: {result?.transactionId}</p>
        </>
      )}

      {state === "error" && (
        <>
          <XCircle size={52} className="mx-auto text-red-500" />
          <h1 className="mt-4 text-2xl font-bold text-[#22333b]">Payment not confirmed</h1>
          <p className="mt-2 text-sm text-gray-600">{message}</p>
        </>
      )}

      {state !== "loading" && (
        <Link
          href="/dashboard/user/hiring-history"
          className="mt-7 inline-block rounded-xl bg-[#22333b] px-6 py-3 text-sm font-semibold text-white hover:bg-[#18272d]"
        >
          Back to hiring history
        </Link>
      )}
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-gray-200" />}>
      <PaymentResult />
    </Suspense>
  );
}