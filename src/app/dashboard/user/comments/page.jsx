"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { MessageSquare, Pencil, Trash2, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import ConfirmModal from "@/app/components/Dashboard/ConfirmModal";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

export default function MyComments() {
  const { data: session, isPending } = authClient.useSession();
  const isClient = session?.user?.role === "user";

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(null); // the comment being edited
  const [editText, setEditText] = useState("");
  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState(null); // the comment pending deletion
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = async () => {
    try {
      setComments(await apiFetch("/api/comments/mine", { auth: true }));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isClient) load();
    else if (!isPending) setLoading(false);
  }, [isClient, isPending]);

  const openEdit = (comment) => {
    setEditing(comment);
    setEditText(comment.text);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editText.trim()) return toast.error("Comment can't be empty");
    setSaving(true);
    try {
      await apiFetch(`/api/comments/${editing._id}`, {
        method: "PATCH",
        auth: true,
        body: { text: editText },
      });
      toast.success("Comment updated");
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await apiFetch(`/api/comments/${deleting._id}`, { method: "DELETE", auth: true });
      toast.success("Comment deleted");
      setDeleting(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (isPending) return <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />;

  if (!isClient) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-gray-600">Comments are available for client accounts.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#22333b]">My Comments</h1>
        <p className="mt-1 text-sm text-gray-500">Comments you have left on lawyer profiles.</p>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 animate-pulse rounded-2xl bg-gray-200" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
          <MessageSquare size={40} className="mx-auto text-gray-300" />
          <p className="mt-3 text-sm text-gray-500">
            You haven't commented yet. Once a lawyer accepts your request, you can leave a comment on their profile.
          </p>
          <Link
            href="/dashboard/user/hiring-history"
            className="mt-5 inline-block rounded-xl bg-[#22333b] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#18272d]"
          >
            View hiring history
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {comments.map((c) => (
            <div key={c._id} className="flex flex-col rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link href={`/lawyer/${c.lawyerId}`} className="font-semibold text-[#22333b] hover:text-[#7d7236] hover:underline">
                    {c.lawyerName || "Lawyer"}
                  </Link>
                  <p className="text-xs text-gray-400">
                    {formatDate(c.createdAt)}
                    {c.updatedAt && " (edited)"}
                  </p>
                </div>

                <div className="flex gap-1">
                  <button onClick={() => openEdit(c)} className="rounded-lg p-2 text-gray-600 hover:bg-gray-100" aria-label="Edit comment">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => setDeleting(c)} className="rounded-lg p-2 text-red-500 hover:bg-red-50" aria-label="Delete comment">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <p className="mt-3 flex-1 text-sm leading-6 text-gray-600">{c.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4" onClick={() => !saving && setEditing(null)}>
          <form
            onSubmit={saveEdit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-bold text-[#22333b]">Edit comment</h3>
              <button type="button" onClick={() => setEditing(null)} aria-label="Close" className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={4}
              required
              className="mt-4 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-black outline-none focus:border-[#7d7236] focus:bg-white focus:ring-2 focus:ring-[#7d7236]/10"
            />

            <div className="mt-5 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-xl bg-[#22333b] py-3 text-sm font-semibold text-white hover:bg-[#18272d] disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmModal
        open={!!deleting}
        title="Delete this comment?"
        message="This will permanently remove your comment from the lawyer's profile."
        confirmText="Delete comment"
        danger
        loading={deleteLoading}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}