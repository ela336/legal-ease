"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Upload } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { uploadImage } from "@/lib/imgbb";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-[#7d7236] focus:bg-white focus:ring-2 focus:ring-[#7d7236]/10";

export default function UpdateProfile() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setImage(user.image || "");
    }
  }, [user?.name, user?.image]);

  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setImage(url);
      toast.success("Photo uploaded. Remember to save your changes.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim().length < 2) return toast.error("Please enter your full name");

    setSaving(true);
    try {
      const { error } = await authClient.updateUser({ name: name.trim(), image: image || undefined });
      if (error) throw new Error(error.message || "Could not update profile");
      toast.success("Profile updated");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (isPending) return <div className="h-80 animate-pulse rounded-2xl bg-gray-200" />;
  if (!user) return null;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#22333b]">Update Profile</h1>
        <p className="mt-1 text-sm text-gray-500">Change your name and profile picture.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-5">
          {image ? (
            <img src={image} alt="Profile" className="h-24 w-24 rounded-full border-4 border-[#C9A227]/30 object-cover" />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#C9A227] text-3xl font-bold text-[#0D0D0D]">
              {name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}

          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-600 hover:bg-white">
            <Upload size={18} />
            {uploading ? "Uploading..." : "Change photo"}
            <input type="file" accept="image/*" onChange={handleImage} disabled={uploading} className="hidden" />
          </label>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Full name</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Email address</label>
          <input value={user.email} disabled className={`${inputClass} cursor-not-allowed opacity-60`} />
          <p className="mt-1 text-xs text-gray-400">Your email can't be changed.</p>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving || uploading}
            className="rounded-xl bg-[#22333b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#18272d] disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}