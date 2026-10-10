"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Trash2, Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import ConfirmModal from "@/app/components/Dashboard/ConfirmModal";

export default function LawyerListings() {
  const { data: session, isPending } = authClient.useSession();
  const isAdmin = session?.user?.role === "admin";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = async () => {
    try {
      setItems(await apiFetch("/api/lawyers/admin/all", { auth: true }));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) load();
    else if (!isPending) setLoading(false);
  }, [isAdmin, isPending]);

  const togglePublish = async (item) => {
    try {
      await apiFetch(`/api/lawyers/${item._id}`, {
        method: "PATCH",
        auth: true,
        body: { published: !item.published },
      });
      toast.success(item.published ? "Listing unpublished" : "Listing published");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const confirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await apiFetch(`/api/lawyers/${deleteTarget._id}`, { method: "DELETE", auth: true });
      toast.success("Listing deleted");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (isPending) return <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />;

  if (!isAdmin) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-gray-600">Only administrators can manage lawyer listings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#22333b]">Lawyer Listings</h1>
        <p className="mt-1 text-sm text-gray-500">Publish, unpublish or remove any lawyer profile on the platform.</p>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {loading ? (
          <div className="space-y-3 p-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-gray-100" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="p-12 text-center text-sm text-gray-500">No lawyer listings yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-3">Lawyer</th>
                  <th className="px-6 py-3">Owner email</th>
                  <th className="px-6 py-3">Specialization</th>
                  <th className="px-6 py-3">Fee</th>
                  <th className="px-6 py-3">Visibility</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {items.map((item) => (
                  <tr key={item._id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="h-10 w-10 rounded-full object-cover" />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A227] font-bold text-[#0D0D0D]">
                            {item.name?.charAt(0)}
                          </div>
                        )}
                        <Link href={`/lawyer/${item._id}`} className="font-medium text-gray-800 hover:text-[#7d7236] hover:underline">
                          {item.name}
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{item.ownerEmail}</td>
                    <td className="px-6 py-4 text-gray-600">{item.specialization}</td>
                    <td className="px-6 py-4 text-gray-600">${item.fee}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.published ? "Published" : "Unpublished"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => togglePublish(item)}
                          className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                        >
                          {item.published ? <><EyeOff size={14} /> Unpublish</> : <><Eye size={14} /> Publish</>}
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete this listing?"
        message={`This will permanently remove ${deleteTarget?.name || "this lawyer"} from the platform. This cannot be undone.`}
        confirmText="Delete listing"
        danger
        loading={deleteLoading}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}