"use client";

import { X } from "lucide-react";

export default function ConfirmModal({
  open,
  title,
  message,
  confirmText = "Confirm",
  danger = false,
  loading = false,
  onConfirm,
  onClose,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4"
      onClick={() => !loading && onClose()}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold text-[#22333b]">{title}</h3>
          <button onClick={onClose} disabled={loading} aria-label="Close" className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <p className="mt-3 text-sm leading-6 text-gray-600">{message}</p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-60 ${
              danger ? "bg-red-600 hover:bg-red-700" : "bg-[#22333b] hover:bg-[#18272d]"
            }`}
          >
            {loading ? "Please wait..." : confirmText}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}