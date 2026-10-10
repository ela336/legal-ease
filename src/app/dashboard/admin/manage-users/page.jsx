"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Search, Trash2, UserCog, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import ConfirmModal from "@/app/components/Dashboard/ConfirmModal";

const roleStyles = {
  admin: "bg-purple-100 text-purple-700",
  lawyer: "bg-blue-100 text-blue-700",
  user: "bg-gray-100 text-gray-700",
};

const roleOptions = [
  { value: "user", label: "Client", desc: "Can browse, hire and comment" },
  { value: "lawyer", label: "Lawyer", desc: "Can publish legal services" },
  { value: "admin", label: "Admin", desc: "Full access to the platform" },
];

export default function ManageUsers() {
  const { data: session, isPending } = authClient.useSession();
  const me = session?.user;
  const isAdmin = me?.role === "admin";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [roleTarget, setRoleTarget] = useState(null);
  const [newRole, setNewRole] = useState("user");
  const [roleLoading, setRoleLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = async () => {
    try {
      setUsers(await apiFetch("/api/users", { auth: true }));
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

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchesRole = roleFilter === "all" || (u.role || "user") === roleFilter;
      const matchesSearch =
        !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
      return matchesRole && matchesSearch;
    });
  }, [users, search, roleFilter]);

  const openRoleModal = (user) => {
    setRoleTarget(user);
    setNewRole(user.role || "user");
  };

  const saveRole = async () => {
    if (newRole === (roleTarget.role || "user")) return setRoleTarget(null);
    setRoleLoading(true);
    try {
      await apiFetch(`/api/users/${roleTarget._id}/role`, {
        method: "PATCH",
        auth: true,
        body: { role: newRole },
      });
      toast.success(`${roleTarget.name} is now ${newRole}`);
      setRoleTarget(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setRoleLoading(false);
    }
  };

  const confirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await apiFetch(`/api/users/${deleteTarget._id}`, { method: "DELETE", auth: true });
      toast.success("User deleted");
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
        <p className="text-gray-600">Only administrators can manage users.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#22333b]">Manage Users</h1>
        <p className="mt-1 text-sm text-gray-500">{users.length} registered accounts</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-black outline-none placeholder:text-gray-400 focus:border-[#7d7236] focus:ring-2 focus:ring-[#7d7236]/10"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-black outline-none focus:border-[#7d7236]"
        >
          <option value="all">All roles</option>
          <option value="user">Clients</option>
          <option value="lawyer">Lawyers</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {loading ? (
          <div className="space-y-3 p-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-gray-100" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <p className="p-12 text-center text-sm text-gray-500">No users match your search.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {visible.map((u) => {
                  const role = u.role || "user";
                  const isMe = u._id === me?.id;
                  return (
                    <tr key={u._id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {u.image ? (
                            <img src={u.image} alt={u.name} className="h-9 w-9 rounded-full object-cover" />
                          ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C9A227] text-sm font-bold text-[#0D0D0D]">
                              {u.name?.charAt(0)?.toUpperCase()}
                            </div>
                          )}
                          <span className="font-medium text-gray-800">
                            {u.name}
                            {isMe && <span className="ml-2 text-xs text-gray-400">(you)</span>}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${roleStyles[role]}`}>
                          {role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openRoleModal(u)}
                            disabled={isMe}
                            className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <UserCog size={14} /> Change role
                          </button>
                          <button
                            onClick={() => setDeleteTarget(u)}
                            disabled={isMe}
                            className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Change role modal */}
      {roleTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4" onClick={() => !roleLoading && setRoleTarget(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#22333b]">Change role</h3>
                <p className="mt-1 text-sm text-gray-500">{roleTarget.name} ({roleTarget.email})</p>
              </div>
              <button onClick={() => setRoleTarget(null)} aria-label="Close" className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="mt-5 space-y-2">
              {roleOptions.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setNewRole(o.value)}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                    newRole === o.value
                      ? "border-[#7d7236] bg-[#7d7236]/10 ring-2 ring-[#7d7236]/10"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <p className="text-sm font-semibold text-gray-800">{o.label}</p>
                  <p className="text-xs text-gray-500">{o.desc}</p>
                </button>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={saveRole}
                disabled={roleLoading}
                className="flex-1 rounded-xl bg-[#22333b] py-3 text-sm font-semibold text-white hover:bg-[#18272d] disabled:opacity-60"
              >
                {roleLoading ? "Saving..." : "Save role"}
              </button>
              <button
                onClick={() => setRoleTarget(null)}
                disabled={roleLoading}
                className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete this user?"
        message={`This will permanently delete ${deleteTarget?.name || "this account"} (${deleteTarget?.email || ""}) and sign them out everywhere. This cannot be undone.`}
        confirmText="Delete user"
        danger
        loading={deleteLoading}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}