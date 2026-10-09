"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Trash2, Upload } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { uploadImage } from "@/lib/imgbb";
import { CATEGORIES } from "@/lib/constants";

const emptyForm = { name: "", specialization: CATEGORIES[0], fee: "", bio: "", image: "" };

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-[#7d7236] focus:bg-white focus:ring-2 focus:ring-[#7d7236]/10";

export default function ManageLegalProfile() {
  const { data: session, isPending } = authClient.useSession();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const isLawyer = session?.user?.role === "lawyer";

  const load = async () => {
    try {
      setItems(await apiFetch("/api/lawyers/mine", { auth: true }));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLawyer) load();
    else if (!isPending) setLoading(false);
  }, [isLawyer, isPending]);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm((f) => ({ ...f, image: url }));
      toast.success("Photo uploaded");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) return toast.error("Please upload a professional photo");
    if (Number(form.fee) <= 0) return toast.error("Enter a valid consultation fee");

    setSaving(true);
    try {
      if (editingId) {
        await apiFetch(`/api/lawyers/${editingId}`, { method: "PATCH", auth: true, body: form });
        toast.success("Profile updated");
      } else {
        await apiFetch("/api/lawyers", { method: "POST", auth: true, body: form });
        toast.success("Profile published");
      }
      resetForm();
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name,
      specialization: item.specialization,
      fee: item.fee,
      bio: item.bio,
      image: item.image,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const patch = async (id, body, message) => {
    try {
      await apiFetch(`/api/lawyers/${id}`, { method: "PATCH", auth: true, body });
      toast.success(message);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this legal profile? This cannot be undone.")) return;
    try {
      await apiFetch(`/api/lawyers/${id}`, { method: "DELETE", auth: true });
      toast.success("Profile deleted");
      if (editingId === id) resetForm();
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (isPending) return <div className="h-40 animate-pulse rounded-2xl bg-gray-200" />;

  if (!isLawyer) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-gray-600">Only lawyer accounts can manage legal profiles.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#22333b]">Manage Legal Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          Add the services you offer. Published profiles appear on the Browse Lawyers page.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#22333b]">
          {editingId ? "Edit profile" : "Add new profile"}
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Full name</label>
            <input required value={form.name} onChange={update("name")} placeholder="Adv. Rafiq Ahmed" className={inputClass} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Specialization</label>
            <select value={form.specialization} onChange={update("specialization")} className={inputClass}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Consultation fee (USD)</label>
            <input required type="number" min="1" value={form.fee} onChange={update("fee")} placeholder="50" className={inputClass} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Professional photo</label>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-600 hover:bg-white">
              <Upload size={18} />
              {uploading ? "Uploading..." : form.image ? "Change photo" : "Choose a photo"}
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" disabled={uploading} />
            </label>
          </div>
        </div>

        {form.image && (
          <img src={form.image} alt="Preview" className="h-24 w-24 rounded-xl object-cover" />
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Bio / professional summary</label>
          <textarea required rows={4} value={form.bio} onChange={update("bio")} placeholder="Describe your experience, practice areas and approach..." className={inputClass} />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving || uploading}
            className="rounded-xl bg-[#22333b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#18272d] disabled:opacity-60"
          >
            {saving ? "Saving..." : editingId ? "Update profile" : "Publish profile"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-[#22333b]">My legal profiles</h2>
        </div>

        {loading ? (
          <div className="space-y-3 p-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-gray-100" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="p-8 text-center text-sm text-gray-500">
            You haven't added any profile yet. Fill in the form above to get started.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-3">Lawyer</th>
                  <th className="px-6 py-3">Specialization</th>
                  <th className="px-6 py-3">Fee</th>
                  <th className="px-6 py-3">Availability</th>
                  <th className="px-6 py-3">Visibility</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {items.map((item) => (
                  <tr key={item._id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="h-10 w-10 rounded-full object-cover" />
                        <span className="font-medium text-gray-800">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{item.specialization}</td>
                    <td className="px-6 py-4 text-gray-600">${item.fee}</td>
                    <td className="px-6 py-4">
                      <select
                      
                        value={item.status}
                        onChange={(e) => patch(item._id, { status: e.target.value }, "Availability updated")}
                        className="text-gray-800 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs"
                      >
                        <option value="available">Available</option>
                        <option value="busy">Busy</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          patch(item._id, { published: !item.published }, item.published ? "Unpublished" : "Published")
                        }
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.published ? "Published" : "Unpublished"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => startEdit(item)} className="rounded-lg p-2 text-gray-600 hover:bg-gray-100" aria-label="Edit">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => remove(item._id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50" aria-label="Delete">
                          <Trash2 size={16} />
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
    </div>
  );
}