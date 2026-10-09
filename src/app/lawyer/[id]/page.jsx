"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { CalendarDays, DollarSign, Briefcase, X, MessageSquare, ArrowLeft } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

function DetailsSkeleton() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse px-4 py-10">
      <div className="grid gap-8 rounded-2xl bg-white p-6 shadow-sm md:grid-cols-[280px_1fr]">
        <div className="h-72 rounded-2xl bg-gray-200" />
        <div className="space-y-4">
          <div className="h-8 w-2/3 rounded bg-gray-200" />
          <div className="h-5 w-24 rounded-full bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-3/4 rounded bg-gray-200" />
          <div className="h-12 w-40 rounded-xl bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export default function LawyerDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [hire, setHire] = useState(null); // this user's active hire with this lawyer
  const [showModal, setShowModal] = useState(false);
  const [hiring, setHiring] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);

  const user = session?.user;
  const isClient = user?.role === "user";

  // Lawyer details
  useEffect(() => {
    setLoading(true);
    apiFetch(`/api/lawyers/${id}`)
      .then(setLawyer)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const loadComments = () =>
    apiFetch(`/api/comments/lawyer/${id}`)
      .then(setComments)
      .catch(() => setComments([]));

  useEffect(() => {
    loadComments();
  }, [id]);

  // This user's hire status for this lawyer
  const loadHire = async () => {
    try {
      const mine = await apiFetch("/api/hires/mine", { auth: true });
      const match = mine.find(
        (h) => h.lawyerId === id && ["pending", "accepted"].includes(h.status)
      );
      setHire(match || null);
    } catch {
      setHire(null);
    }
  };

  useEffect(() => {
    if (isClient) loadHire();
    else setHire(null);
  }, [isClient, id]);

  const handleHireClick = () => {
    if (!user) {
      toast("Please log in to hire a lawyer");
      return router.push("/auth/Login");
    }
    if (!isClient) return toast.error("Only client accounts can hire lawyers");
    setShowModal(true);
  };

  const confirmHire = async () => {
    setHiring(true);
    try {
      await apiFetch("/api/hires", { method: "POST", auth: true, body: { lawyerId: id } });
      toast.success("Hiring request sent! Track it in your dashboard.");
      setShowModal(false);
      loadHire();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setHiring(false);
    }
  };

  const postComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setPosting(true);
    try {
      await apiFetch("/api/comments", {
        method: "POST",
        auth: true,
        body: { lawyerId: id, text: commentText },
      });
      setCommentText("");
      toast.success("Comment posted");
      loadComments();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#f8f5ef]"><DetailsSkeleton /></div>;

  if (error || !lawyer) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#f8f5ef] px-4 text-center">
        <p className="text-xl font-semibold text-[#22333b]">Lawyer not found</p>
        <p className="mt-2 text-sm text-gray-500">{error || "This profile may have been removed."}</p>
        <Link href="/lawyer" className="mt-6 rounded-xl bg-[#22333b] px-6 py-3 text-sm font-semibold text-white hover:bg-[#18272d]">
          Back to Browse Lawyers
        </Link>
      </div>
    );
  }

  const busy = lawyer.status === "busy";
  const canComment = isClient && hire?.status === "accepted";

  // Decide what the main button shows
  let buttonLabel = "Hire this lawyer";
  let buttonDisabled = false;
  if (hire?.status === "pending") {
    buttonLabel = "Request pending";
    buttonDisabled = true;
  } else if (hire?.status === "accepted") {
    buttonLabel = "Request accepted";
    buttonDisabled = true;
  } else if (busy) {
    buttonLabel = "Currently busy";
    buttonDisabled = true;
  }

  return (
    <div className="min-h-screen bg-[#f8f5ef]">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <Link href="/lawyer" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#7d7236] hover:underline">
          <ArrowLeft size={16} /> Back to all lawyers
        </Link>

        {/* Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-8 rounded-2xl bg-white p-6 shadow-sm md:grid-cols-[280px_1fr] md:p-8"
        >
          <div>
            {lawyer.image ? (
              <img src={lawyer.image} alt={lawyer.name} className="h-72 w-full rounded-2xl object-cover" />
            ) : (
              <div className="flex h-72 w-full items-center justify-center rounded-2xl bg-[#C9A227] text-7xl font-bold text-[#0D0D0D]">
                {lawyer.name?.charAt(0)}
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-[#22333b]">{lawyer.name}</h1>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  busy ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"
                }`}
              >
                {busy ? "Busy" : "Available"}
              </span>
            </div>

            <span className="mt-3 inline-block rounded-full bg-[#7d7236]/10 px-3 py-1 text-sm font-medium text-[#7d7236]">
              {lawyer.specialization}
            </span>

            <div className="mt-6 grid gap-3 text-sm text-gray-600 sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <DollarSign size={18} className="text-[#C9A227]" />
                <span><b className="text-[#22333b]">${lawyer.fee}</b> fee</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase size={18} className="text-[#C9A227]" />
                <span>{lawyer.hireCount || 0} {lawyer.hireCount === 1 ? "hire" : "hires"}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays size={18} className="text-[#C9A227]" />
                <span>Joined {formatDate(lawyer.createdAt)}</span>
              </div>
            </div>

            <h2 className="mt-8 text-lg font-semibold text-[#22333b]">About</h2>
            <p className="mt-2 whitespace-pre-line leading-7 text-gray-600">{lawyer.bio}</p>

            <button
              onClick={handleHireClick}
              disabled={buttonDisabled || isPending}
              className="mt-8 rounded-xl bg-[#C9A227] px-8 py-3.5 font-semibold text-[#0D0D0D] transition hover:bg-[#D9B43A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {buttonLabel}
            </button>

            {!user && !isPending && (
              <p className="mt-3 text-xs text-gray-500">You need to log in to hire this lawyer.</p>
            )}
          </div>
        </motion.div>

        {/* Comments */}
        <div className="mt-10 rounded-2xl bg-white p-6 shadow-sm md:p-8">
          <h2 className="flex items-center gap-2 text-xl font-bold text-[#22333b]">
            <MessageSquare size={20} className="text-[#C9A227]" />
            Client comments ({comments.length})
          </h2>

          {canComment ? (
            <form onSubmit={postComment} className="mt-5">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={3}
                required
                placeholder="Share your experience working with this lawyer..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-black outline-none placeholder:text-gray-400 focus:border-[#7d7236] focus:bg-white focus:ring-2 focus:ring-[#7d7236]/10"
              />
              <button
                type="submit"
                disabled={posting}
                className="mt-3 rounded-xl bg-[#22333b] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#18272d] disabled:opacity-60"
              >
                {posting ? "Posting..." : "Post comment"}
              </button>
            </form>
          ) : (
            <p className="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-500">
              {!user
                ? "Log in as a client who has hired this lawyer to leave a comment."
                : !isClient
                ? "Only clients can comment on lawyer profiles."
                : "You can comment once this lawyer accepts your hiring request."}
            </p>
          )}

          <div className="mt-6 space-y-4">
            {comments.length === 0 ? (
              <p className="text-sm text-gray-500">No comments yet.</p>
            ) : (
              comments.map((c) => (
                <div key={c._id} className="flex gap-3 border-t border-gray-100 pt-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C9A227] text-sm font-bold text-[#0D0D0D]">
                    {c.userName?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#22333b]">
                      {c.userName}
                      <span className="ml-2 text-xs font-normal text-gray-400">{formatDate(c.createdAt)}</span>
                    </p>
                    <p className="mt-1 text-sm leading-6 text-gray-600">{c.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Hire confirmation modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={() => !hiring && setShowModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-bold text-[#22333b]">Confirm hiring request</h3>
              <button onClick={() => setShowModal(false)} disabled={hiring} aria-label="Close" className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="mt-5 flex items-center gap-4 rounded-xl bg-gray-50 p-4">
              {lawyer.image ? (
                <img src={lawyer.image} alt={lawyer.name} className="h-14 w-14 rounded-full object-cover" />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#C9A227] text-xl font-bold text-[#0D0D0D]">
                  {lawyer.name?.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-semibold text-[#22333b]">{lawyer.name}</p>
                <p className="text-sm text-gray-500">{lawyer.specialization} · ${lawyer.fee}</p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-gray-600">
              Your request will be sent to the lawyer. You pay the fee only after they accept it.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={confirmHire}
                disabled={hiring}
                className="flex-1 rounded-xl bg-[#22333b] py-3 text-sm font-semibold text-white hover:bg-[#18272d] disabled:opacity-60"
              >
                {hiring ? "Sending..." : "Confirm request"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                disabled={hiring}
                className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}