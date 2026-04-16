import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import StatCard from "../../components/admin/StatCard";
import DonutChart from "../../components/admin/DonutChart";
import RecentTable from "../../components/admin/RecentTable";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:1337/api";
const MEDIA_URL = BASE_URL.replace("/api", "");

const CATEGORIES = [
  "plumbing",
  "electrical",
  "carpentry",
  "cleaning",
  "technical",
  "painting",
  "other",
];
const SERVICE_STATUSES = [
  "pending",
  "in_progress",
  "awaiting_confirmation",
  "completed",
  "cancelled",
];
const BID_STATUSES = ["pending", "accepted", "rejected"];
const SPECIALTIES = [
  "plumbing",
  "electrical",
  "carpentry",
  "cleaning",
  "technical",
  "painting",
  "other",
];
const SUB_STATUSES = ["active", "expired", "cancelled"];
const SUB_PLANS = ["monthly", "yearly"];

const STATUS_COLORS = {
  open: "bg-indigo-500/10 text-indigo-400 ring-1 ring-inset ring-indigo-500/20",
  in_progress:
    "bg-amber-500/10 text-amber-400 ring-1 ring-inset ring-amber-500/20",
  completed:
    "bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20",
  awaiting_confirmation:
    "bg-purple-500/10 text-purple-400 ring-1 ring-inset ring-purple-500/20",
  cancelled: "bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20",
  pending: "bg-amber-500/10 text-amber-400 ring-1 ring-inset ring-amber-500/20",
  accepted:
    "bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20",
  rejected: "bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20",
  approved:
    "bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20",
  blocked: "bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20",
  active:
    "bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20",
  expired: "bg-zinc-500/10 text-zinc-400 ring-1 ring-inset ring-zinc-500/20",
  failed: "bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20",
  monthly: "bg-blue-500/10 text-blue-400 ring-1 ring-inset ring-blue-500/20",
  yearly:
    "bg-violet-500/10 text-violet-400 ring-1 ring-inset ring-violet-500/20",
  customer:
    "bg-indigo-500/10 text-indigo-400 ring-1 ring-inset ring-indigo-500/20",
  provider:
    "bg-violet-500/10 text-violet-400 ring-1 ring-inset ring-violet-500/20",
  admin: "bg-amber-500/10 text-amber-400 ring-1 ring-inset ring-amber-500/20",
};

const badge = (label) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold tracking-wide ${STATUS_COLORS[label] || "bg-zinc-500/10 text-zinc-400 ring-1 ring-inset ring-zinc-500/20"}`}
  >
    {label?.replace(/_/g, " ")}
  </span>
);

function fmt(date) {
  return date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";
}

function ConfirmModal({ message, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-5">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <p className="text-white text-sm font-medium mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg py-2 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-lg py-2 text-xs font-semibold transition-colors"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditModal({
  title,
  fields,
  values,
  onChange,
  onSave,
  onClose,
  saving,
  error,
}) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-5">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h3 className="text-white font-semibold text-sm">{title}</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 flex items-center justify-center text-sm transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-1.5">
                {f.label}
              </label>
              {f.type === "select" ? (
                <select
                  value={values[f.key] ?? ""}
                  onChange={(e) => onChange(f.key, e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 text-sm outline-none focus:border-zinc-600 transition-colors"
                >
                  {f.options.map((o) => (
                    <option key={o} value={o}>
                      {o.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              ) : f.type === "textarea" ? (
                <textarea
                  value={values[f.key] ?? ""}
                  onChange={(e) => onChange(f.key, e.target.value)}
                  rows={3}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 text-sm outline-none focus:border-zinc-600 transition-colors resize-none"
                />
              ) : (
                <input
                  type={f.type || "text"}
                  value={values[f.key] ?? ""}
                  onChange={(e) => onChange(f.key, e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 text-sm outline-none focus:border-zinc-600 transition-colors"
                />
              )}
            </div>
          ))}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-red-400 text-xs">
              {error}
            </div>
          )}
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg py-2 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg py-2 text-xs font-semibold transition-colors"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z"
        />
      </svg>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search..."}
        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-zinc-200 text-xs outline-none focus:border-zinc-600 transition-colors placeholder-zinc-600"
      />
    </div>
  );
}

function Pagination({ page, total, perPage, onChange }) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-300 text-xs font-bold transition-colors"
      >
        ‹
      </button>
      <span className="text-zinc-500 text-xs">
        {page} / {totalPages}
      </span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-300 text-xs font-bold transition-colors"
      >
        ›
      </button>
    </div>
  );
}

function ServiceRequestsTab({ token }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [editItem, setEditItem] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const PER_PAGE = 8;

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}/service-requests?populate[customer]=true&populate[bids][fields][0]=id&sort=createdAt:desc&pagination[limit]=200`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await res.json();
      setRequests(data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (req) => {
    const a = req.attributes ?? req;
    setEditValues({
      title: a.title || "",
      description: a.description || "",
      category: a.category || "",
      location: a.location || "",
      suggested_budget: a.suggested_budget || "",
      service_status: a.service_status || "pending",
    });
    setEditItem(req);
    setSaveError("");
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const id = editItem.documentId ?? editItem.id;
      const res = await fetch(`${BASE_URL}/service-requests/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            ...editValues,
            suggested_budget: Number(editValues.suggested_budget),
          },
        }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e?.error?.message || "Failed");
      }
      await fetchRequests();
      setEditItem(null);
    } catch (e) {
      setSaveError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const id = deleteItem.documentId ?? deleteItem.id;
      await fetch(`${BASE_URL}/service-requests/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchRequests();
      setDeleteItem(null);
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
    }
  };

  const filtered = requests.filter((r) => {
    const a = r.attributes ?? r;
    const matchSearch =
      !search ||
      a.title?.toLowerCase().includes(search.toLowerCase()) ||
      a.location?.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "all" || a.service_status === filterStatus;
    const matchCat = filterCategory === "all" || a.category === filterCategory;
    return matchSearch && matchStatus && matchCat;
  });

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="flex flex-col gap-4">
      {editItem && (
        <EditModal
          title="Edit Service Request"
          fields={[
            { key: "title", label: "Title" },
            { key: "description", label: "Description", type: "textarea" },
            {
              key: "category",
              label: "Category",
              type: "select",
              options: CATEGORIES,
            },
            { key: "location", label: "Location" },
            { key: "suggested_budget", label: "Budget (Rs.)", type: "number" },
            {
              key: "service_status",
              label: "Status",
              type: "select",
              options: SERVICE_STATUSES,
            },
          ]}
          values={editValues}
          onChange={(k, v) => setEditValues((p) => ({ ...p, [k]: v }))}
          onSave={handleSave}
          onClose={() => setEditItem(null)}
          saving={saving}
          error={saveError}
        />
      )}
      {deleteItem && (
        <ConfirmModal
          message={`Delete "${(deleteItem.attributes ?? deleteItem).title}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteItem(null)}
          loading={deleting}
        />
      )}

      <div className="flex items-center gap-3 flex-wrap bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4">
        <div className="text-white font-semibold text-sm">Service Requests</div>
        <div className="bg-indigo-500/10 text-indigo-400 ring-1 ring-inset ring-indigo-500/20 rounded-full px-3 py-0.5 text-xs font-semibold">
          {filtered.length} total
        </div>
        <div className="flex-1 min-w-48">
          <SearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Search by title or location..."
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => {
            setFilterCategory(e.target.value);
            setPage(1);
          }}
          className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 text-xs outline-none"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPage(1);
          }}
          className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 text-xs outline-none"
        >
          <option value="all">All Statuses</option>
          {SERVICE_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        <button
          onClick={fetchRequests}
          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-lg px-3 py-2 text-xs transition-colors"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-7 h-7 border-2 border-zinc-700 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : paginated.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center text-zinc-500 text-sm">
          No service requests found.
        </div>
      ) : (
        paginated.map((req) => {
          const a = req.attributes ?? req;
          return (
            <div
              key={req.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 flex items-start gap-4 flex-wrap hover:border-zinc-700 transition-colors"
            >
              <div className="flex-1 min-w-56">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-white font-semibold text-sm">
                    {a.title || "—"}
                  </span>
                  {badge(a.category)}
                  {badge(a.service_status)}
                </div>
                <div className="text-zinc-500 text-xs mb-2 line-clamp-2">
                  {a.description || "—"}
                </div>
                <div className="flex gap-4 flex-wrap text-xs text-zinc-500">
                  <span>📍 {a.location || "—"}</span>
                  {a.suggested_budget && (
                    <span>
                      Rs. {Number(a.suggested_budget).toLocaleString()}
                    </span>
                  )}
                  <span>
                    👤{" "}
                    {a.customer?.data?.attributes?.username ??
                      a.customer?.username ??
                      "—"}
                  </span>
                  <span>{fmt(a.createdAt)}</span>
                  <span>
                    {a.bids?.data?.length ?? a.bids?.length ?? 0} bids
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(req)}
                  className="bg-indigo-500/10 text-indigo-400 ring-1 ring-inset ring-indigo-500/20 rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-indigo-500/20 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteItem(req)}
                  className="bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20 rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-red-500/20 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })
      )}
      <Pagination
        page={page}
        total={filtered.length}
        perPage={PER_PAGE}
        onChange={setPage}
      />
    </div>
  );
}

function ProviderProfilesTab({ token }) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("all");
  const [page, setPage] = useState(1);
  const [editItem, setEditItem] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const PER_PAGE = 8;

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/admin-approval/provider-profiles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProfiles(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (profile) => {
    const a = profile.attributes ?? profile;
    setEditValues({
      specialty: a.specialty || "",
      location: a.location || "",
      experience: a.experience || "",
      bio: a.bio || "",
      rating: a.rating || "",
    });
    setEditItem(profile);
    setSaveError("");
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const id = editItem.documentId ?? editItem.id;
      const res = await fetch(`${BASE_URL}/provider-profiles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            specialty: editValues.specialty,
            location: editValues.location,
            experience: Number(editValues.experience),
            bio: editValues.bio,
            rating: Number(editValues.rating),
          },
        }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e?.error?.message || "Failed");
      }
      await fetchProfiles();
      setEditItem(null);
    } catch (e) {
      setSaveError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const filtered = profiles.filter((p) => {
    const a = p.attributes ?? p;
    const username = a.user?.username ?? "—";
    const email = a.user?.email ?? "—";
    const matchSearch =
      !search ||
      username.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      a.location?.toLowerCase().includes(search.toLowerCase());
    const matchSpec =
      filterSpecialty === "all" || a.specialty === filterSpecialty;
    return matchSearch && matchSpec;
  });

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="flex flex-col gap-4">
      {editItem && (
        <EditModal
          title="Edit Provider Profile"
          fields={[
            {
              key: "specialty",
              label: "Specialty",
              type: "select",
              options: SPECIALTIES,
            },
            { key: "location", label: "Location" },
            { key: "experience", label: "Years of Experience", type: "number" },
            { key: "bio", label: "Bio", type: "textarea" },
            { key: "rating", label: "Rating (0–5)", type: "number" },
            
          ]}
          values={editValues}
          onChange={(k, v) => setEditValues((p) => ({ ...p, [k]: v }))}
          onSave={handleSave}
          onClose={() => setEditItem(null)}
          saving={saving}
          error={saveError}
        />
      )}

      <div className="flex items-center gap-3 flex-wrap bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4">
        <div className="text-white font-semibold text-sm">
          Provider Profiles
        </div>
        <div className="bg-violet-500/10 text-violet-400 ring-1 ring-inset ring-violet-500/20 rounded-full px-3 py-0.5 text-xs font-semibold">
          {filtered.length} providers
        </div>
        <div className="flex-1 min-w-48">
          <SearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Search by username or location..."
          />
        </div>
        <select
          value={filterSpecialty}
          onChange={(e) => {
            setFilterSpecialty(e.target.value);
            setPage(1);
          }}
          className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 text-xs outline-none"
        >
          <option value="all">All Specialties</option>
          {SPECIALTIES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          onClick={fetchProfiles}
          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-lg px-3 py-2 text-xs transition-colors"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-7 h-7 border-2 border-zinc-700 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : paginated.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center text-zinc-500 text-sm">
          No provider profiles found.
        </div>
      ) : (
        paginated.map((profile) => {
          const a = profile.attributes ?? profile;
          const username = a.user?.username ?? "—";
          const email = a.user?.email ?? "—";
          return (
            <div
              key={profile.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 flex items-start gap-4 flex-wrap hover:border-zinc-700 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                {username[0]?.toUpperCase() || "P"}
              </div>
              <div className="flex-1 min-w-56">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-white font-semibold text-sm">
                    {username}
                  </span>
                  <span className="text-zinc-500 text-xs">{email}</span>
                  {badge(a.specialty)}
                 
                </div>
                <div className="flex gap-4 flex-wrap text-xs text-zinc-500">
                  <span>📍 {a.location || "—"}</span>
                  <span>⭐ {a.rating ? Number(a.rating).toFixed(1) : "—"}</span>
                  <span>{a.experience || "—"} yrs exp</span>
                </div>
                {a.bio && (
                  <p className="text-zinc-600 text-xs mt-1 line-clamp-1">
                    {a.bio}
                  </p>
                )}
              </div>
              <button
                onClick={() => openEdit(profile)}
                className="bg-indigo-500/10 text-indigo-400 ring-1 ring-inset ring-indigo-500/20 rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-indigo-500/20 transition-colors"
              >
                Edit
              </button>
            </div>
          );
        })
      )}
      <Pagination
        page={page}
        total={filtered.length}
        perPage={PER_PAGE}
        onChange={setPage}
      />
    </div>
  );
}

function ReviewsTab({ token }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [page, setPage] = useState(1);
  const [editItem, setEditItem] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const PER_PAGE = 8;

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}/reviews?populate[customer]=true&populate[provider_profile][populate][user]=true&populate[service_request][fields][0]=title&sort=createdAt:desc&pagination[limit]=200`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await res.json();
      setReviews(data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (review) => {
    const a = review.attributes ?? review;
    setEditValues({ rating: a.rating || "", comment: a.comment || "" });
    setEditItem(review);
    setSaveError("");
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const id = editItem.documentId ?? editItem.id;
      const res = await fetch(`${BASE_URL}/reviews/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            rating: Number(editValues.rating),
            comment: editValues.comment,
          },
        }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e?.error?.message || "Failed");
      }
      await fetchReviews();
      setEditItem(null);
    } catch (e) {
      setSaveError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const id = deleteItem.documentId ?? deleteItem.id;
      await fetch(`${BASE_URL}/reviews/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchReviews();
      setDeleteItem(null);
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
    }
  };

  const filtered = reviews.filter((r) => {
    const a = r.attributes ?? r;
    const customer =
      a.customer?.data?.attributes?.username ?? a.customer?.username ?? "";
    const comment = a.comment ?? "";
    const matchSearch =
      !search ||
      customer.toLowerCase().includes(search.toLowerCase()) ||
      comment.toLowerCase().includes(search.toLowerCase());
    const matchRating =
      filterRating === "all" || Math.round(a.rating) === Number(filterRating);
    return matchSearch && matchRating;
  });

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="flex flex-col gap-4">
      {editItem && (
        <EditModal
          title="Edit Review"
          fields={[
            { key: "rating", label: "Rating (1–5)", type: "number" },
            { key: "comment", label: "Comment", type: "textarea" },
          ]}
          values={editValues}
          onChange={(k, v) => setEditValues((p) => ({ ...p, [k]: v }))}
          onSave={handleSave}
          onClose={() => setEditItem(null)}
          saving={saving}
          error={saveError}
        />
      )}
      {deleteItem && (
        <ConfirmModal
          message="Delete this review? This cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteItem(null)}
          loading={deleting}
        />
      )}

      <div className="flex items-center gap-3 flex-wrap bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4">
        <div className="text-white font-semibold text-sm">Reviews</div>
        <div className="bg-amber-500/10 text-amber-400 ring-1 ring-inset ring-amber-500/20 rounded-full px-3 py-0.5 text-xs font-semibold">
          {filtered.length} reviews
        </div>
        <div className="flex-1 min-w-48">
          <SearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Search by customer or comment..."
          />
        </div>
        <select
          value={filterRating}
          onChange={(e) => {
            setFilterRating(e.target.value);
            setPage(1);
          }}
          className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 text-xs outline-none"
        >
          <option value="all">All Ratings</option>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {"★".repeat(r)} ({r})
            </option>
          ))}
        </select>
        <button
          onClick={fetchReviews}
          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-lg px-3 py-2 text-xs transition-colors"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-7 h-7 border-2 border-zinc-700 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : paginated.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center text-zinc-500 text-sm">
          No reviews found.
        </div>
      ) : (
        paginated.map((review) => {
          const a = review.attributes ?? review;
          const customer =
            a.customer?.data?.attributes?.username ??
            a.customer?.username ??
            "—";
          const providerUser =
            a.provider_profile?.data?.attributes?.user?.data?.attributes
              ?.username ??
            a.provider_profile?.user?.username ??
            "—";
          const srTitle =
            a.service_request?.data?.attributes?.title ??
            a.service_request?.title ??
            "—";
          return (
            <div
              key={review.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 flex items-start gap-4 flex-wrap hover:border-zinc-700 transition-colors"
            >
              <div className="flex-1 min-w-56">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-amber-400 font-semibold text-sm">
                    {"★".repeat(Math.round(a.rating || 0))}
                  </span>
                  <span className="text-zinc-500 text-xs font-mono">
                    ({a.rating}/5)
                  </span>
                  <span className="text-zinc-500 text-xs">by {customer}</span>
                  <span className="text-zinc-600 text-xs">
                    → {providerUser}
                  </span>
                </div>
                {a.comment && (
                  <p className="text-zinc-300 text-sm mb-2 line-clamp-2">
                    {a.comment}
                  </p>
                )}
                <div className="flex gap-4 flex-wrap text-xs text-zinc-600">
                  <span>Job: {srTitle}</span>
                  <span>{fmt(a.createdAt)}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(review)}
                  className="bg-indigo-500/10 text-indigo-400 ring-1 ring-inset ring-indigo-500/20 rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-indigo-500/20 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteItem(review)}
                  className="bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20 rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-red-500/20 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })
      )}
      <Pagination
        page={page}
        total={filtered.length}
        perPage={PER_PAGE}
        onChange={setPage}
      />
    </div>
  );
}

function BidsManageTab({ token }) {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [editItem, setEditItem] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const PER_PAGE = 8;

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}/bids?populate[provider]=true&populate[service_request][fields][0]=title&sort=createdAt:desc&pagination[limit]=200`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await res.json();
      setBids(data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (bid) => {
    const a = bid.attributes ?? bid;
    setEditValues({
      amount: a.amount || "",
      message: a.message || "",
      availability: a.availability || "",
      bid_status: a.bid_status || "pending",
    });
    setEditItem(bid);
    setSaveError("");
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const id = editItem.documentId ?? editItem.id;
      const res = await fetch(`${BASE_URL}/bids/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: { ...editValues, amount: Number(editValues.amount) },
        }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e?.error?.message || "Failed");
      }
      await fetchBids();
      setEditItem(null);
    } catch (e) {
      setSaveError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const id = deleteItem.documentId ?? deleteItem.id;
      await fetch(`${BASE_URL}/bids/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchBids();
      setDeleteItem(null);
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
    }
  };

  const filtered = bids.filter((b) => {
    const a = b.attributes ?? b;
    const provider =
      a.provider?.data?.attributes?.username ?? a.provider?.username ?? "";
    const srTitle =
      a.service_request?.data?.attributes?.title ??
      a.service_request?.title ??
      "";
    const matchSearch =
      !search ||
      provider.toLowerCase().includes(search.toLowerCase()) ||
      srTitle.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || a.bid_status === filterStatus;
    return matchSearch && matchStatus;
  });

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="flex flex-col gap-4">
      {editItem && (
        <EditModal
          title="Edit Bid"
          fields={[
            { key: "amount", label: "Amount (Rs.)", type: "number" },
            { key: "message", label: "Message", type: "textarea" },
            { key: "availability", label: "Availability" },
            {
              key: "bid_status",
              label: "Status",
              type: "select",
              options: BID_STATUSES,
            },
          ]}
          values={editValues}
          onChange={(k, v) => setEditValues((p) => ({ ...p, [k]: v }))}
          onSave={handleSave}
          onClose={() => setEditItem(null)}
          saving={saving}
          error={saveError}
        />
      )}
      {deleteItem && (
        <ConfirmModal
          message="Delete this bid? This cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteItem(null)}
          loading={deleting}
        />
      )}

      <div className="flex items-center gap-3 flex-wrap bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4">
        <div className="text-white font-semibold text-sm">Bids</div>
        <div className="bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20 rounded-full px-3 py-0.5 text-xs font-semibold">
          {filtered.length} bids
        </div>
        <div className="flex-1 min-w-48">
          <SearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Search by provider or request..."
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPage(1);
          }}
          className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 text-xs outline-none"
        >
          <option value="all">All Statuses</option>
          {BID_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          onClick={fetchBids}
          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-lg px-3 py-2 text-xs transition-colors"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-7 h-7 border-2 border-zinc-700 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : paginated.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center text-zinc-500 text-sm">
          No bids found.
        </div>
      ) : (
        paginated.map((bid) => {
          const a = bid.attributes ?? bid;
          const provider =
            a.provider?.data?.attributes?.username ??
            a.provider?.username ??
            "—";
          const srTitle =
            a.service_request?.data?.attributes?.title ??
            a.service_request?.title ??
            "—";
          return (
            <div
              key={bid.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 flex items-start gap-4 flex-wrap hover:border-zinc-700 transition-colors"
            >
              <div className="flex-1 min-w-56">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-white font-semibold text-sm">
                    Rs. {Number(a.amount || 0).toLocaleString()}
                  </span>
                  {badge(a.bid_status)}
                  <span className="text-zinc-500 text-xs">by {provider}</span>
                </div>
                <div className="text-zinc-500 text-xs mb-1">Job: {srTitle}</div>
                {a.message && (
                  <p className="text-zinc-600 text-xs line-clamp-1">
                    {a.message}
                  </p>
                )}
                <div className="flex gap-4 flex-wrap text-xs text-zinc-600 mt-1">
                  <span>Available: {a.availability || "—"}</span>
                  <span>{fmt(a.createdAt)}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(bid)}
                  className="bg-indigo-500/10 text-indigo-400 ring-1 ring-inset ring-indigo-500/20 rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-indigo-500/20 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteItem(bid)}
                  className="bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20 rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-red-500/20 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })
      )}
      <Pagination
        page={page}
        total={filtered.length}
        perPage={PER_PAGE}
        onChange={setPage}
      />
    </div>
  );
}

function SubscriptionsTab({ token }) {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPlan, setFilterPlan] = useState("all");
  const [page, setPage] = useState(1);
  const [editItem, setEditItem] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const PER_PAGE = 8;

  useEffect(() => {
    fetchSubs();
  }, []);

  const fetchSubs = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}/provider-subscriptions?populate[provider]=true&sort=createdAt:desc&pagination[limit]=200`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await res.json();
      setSubs(data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (sub) => {
    const a = sub.attributes ?? sub;
    setEditValues({
      subscriptionStatus: a.subscriptionStatus || "active",
      plan: a.plan || "monthly",
      amount: a.amount || "",
      expires_at: a.expires_at ? a.expires_at.slice(0, 10) : "",
    });
    setEditItem(sub);
    setSaveError("");
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const id = editItem.documentId ?? editItem.id;
      const res = await fetch(`${BASE_URL}/provider-subscriptions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: { ...editValues, amount: Number(editValues.amount) },
        }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e?.error?.message || "Failed");
      }
      await fetchSubs();
      setEditItem(null);
    } catch (e) {
      setSaveError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const id = deleteItem.documentId ?? deleteItem.id;
      await fetch(`${BASE_URL}/provider-subscriptions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchSubs();
      setDeleteItem(null);
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
    }
  };

  const filtered = subs.filter((s) => {
    const a = s.attributes ?? s;
    const provider =
      a.provider?.data?.attributes?.username ?? a.provider?.username ?? "";
    const matchSearch =
      !search || provider.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "all" || a.subscriptionStatus === filterStatus;
    const matchPlan = filterPlan === "all" || a.plan === filterPlan;
    return matchSearch && matchStatus && matchPlan;
  });

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="flex flex-col gap-4">
      {editItem && (
        <EditModal
          title="Edit Subscription"
          fields={[
            {
              key: "subscriptionStatus",
              label: "Status",
              type: "select",
              options: SUB_STATUSES,
            },
            { key: "plan", label: "Plan", type: "select", options: SUB_PLANS },
            { key: "amount", label: "Amount (Rs.)", type: "number" },
            { key: "expires_at", label: "Expires At", type: "date" },
          ]}
          values={editValues}
          onChange={(k, v) => setEditValues((p) => ({ ...p, [k]: v }))}
          onSave={handleSave}
          onClose={() => setEditItem(null)}
          saving={saving}
          error={saveError}
        />
      )}
      {deleteItem && (
        <ConfirmModal
          message="Delete this subscription? The provider will lose access."
          onConfirm={handleDelete}
          onCancel={() => setDeleteItem(null)}
          loading={deleting}
        />
      )}

      <div className="flex items-center gap-3 flex-wrap bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4">
        <div className="text-white font-semibold text-sm">Subscriptions</div>
        <div className="bg-blue-500/10 text-blue-400 ring-1 ring-inset ring-blue-500/20 rounded-full px-3 py-0.5 text-xs font-semibold">
          {filtered.length} subscriptions
        </div>
        <div className="flex-1 min-w-48">
          <SearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Search by provider..."
          />
        </div>
        <select
          value={filterPlan}
          onChange={(e) => {
            setFilterPlan(e.target.value);
            setPage(1);
          }}
          className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 text-xs outline-none"
        >
          <option value="all">All Plans</option>
          {SUB_PLANS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPage(1);
          }}
          className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 text-xs outline-none"
        >
          <option value="all">All Statuses</option>
          {SUB_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          onClick={fetchSubs}
          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-lg px-3 py-2 text-xs transition-colors"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-7 h-7 border-2 border-zinc-700 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : paginated.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center text-zinc-500 text-sm">
          No subscriptions found.
        </div>
      ) : (
        paginated.map((sub) => {
          const a = sub.attributes ?? sub;
          const provider =
            a.provider?.data?.attributes?.username ??
            a.provider?.username ??
            "—";
          const isExpired = a.expires_at && new Date(a.expires_at) < new Date();
          return (
            <div
              key={sub.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 flex items-start gap-4 flex-wrap hover:border-zinc-700 transition-colors"
            >
              <div className="flex-1 min-w-56">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-white font-semibold text-sm">
                    {provider}
                  </span>
                  {badge(a.plan)}
                  {badge(a.subscriptionStatus)}
                  {isExpired && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20">
                      Expired
                    </span>
                  )}
                </div>
                <div className="flex gap-4 flex-wrap text-xs text-zinc-500">
                  <span>Rs. {Number(a.amount || 0).toLocaleString()}</span>
                  <span>Expires: {fmt(a.expires_at)}</span>
                  <span>Started: {fmt(a.starts_at)}</span>
                  {a.transaction_id && (
                    <span className="font-mono text-zinc-600">
                      TXN: {a.transaction_id}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(sub)}
                  className="bg-indigo-500/10 text-indigo-400 ring-1 ring-inset ring-indigo-500/20 rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-indigo-500/20 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteItem(sub)}
                  className="bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20 rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-red-500/20 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })
      )}
      <Pagination
        page={page}
        total={filtered.length}
        perPage={PER_PAGE}
        onChange={setPage}
      />
    </div>
  );
}

function UserDetailModal({ user, token, onClose, onBlock, onUnblock }) {
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [localBlocked, setLocalBlocked] = useState(user?.blocked || false);

  useEffect(() => {
    if (!user) return;
    setDetailLoading(true);
    fetch(`${BASE_URL}/admin-approval/user-detail/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setDetail)
      .catch(console.error)
      .finally(() => setDetailLoading(false));
  }, [user]);

  if (!user) return null;

  const tabs = [
    { id: "profile", label: "Profile & Docs" },
    { id: "requests", label: "Service Requests" },
    { id: "bids", label: "Bids" },
    { id: "reviews", label: "Reviews" },
    { id: "messages", label: "Messages" },
  ];

  const handleBlock = async () => {
    await onBlock(user.id);
    setLocalBlocked(true);
  };
  const handleUnblock = async () => {
    await onUnblock(user.id);
    setLocalBlocked(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-5">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
        <div className="px-7 pt-6 pb-0 border-b border-zinc-800 flex-shrink-0">
          <div className="flex items-center gap-4 mb-5 flex-wrap">
            <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-bold flex-shrink-0">
              {user.username?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-semibold text-base truncate">
                {user.username}
              </div>
              <div className="text-zinc-500 text-sm truncate">{user.email}</div>
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              {badge(user.roleType)}
              {localBlocked ? badge("blocked") : badge("active")}
              {localBlocked ? (
                <button
                  onClick={handleUnblock}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                >
                  Unblock
                </button>
              ) : (
                <button
                  onClick={handleBlock}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 ring-1 ring-inset ring-amber-500/20 hover:bg-amber-500/20 transition-colors cursor-pointer"
                >
                  Block
                </button>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 flex items-center justify-center text-sm flex-shrink-0 transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors cursor-pointer ${activeTab === t.id ? "border-indigo-500 text-indigo-400" : "border-transparent text-zinc-500 hover:text-zinc-300"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          {detailLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
              <div className="w-8 h-8 border-2 border-zinc-700 border-t-indigo-500 rounded-full animate-spin mb-3" />
              <span className="text-sm">Loading user details...</span>
            </div>
          ) : !detail ? (
            <div className="text-center py-16 text-red-400 text-sm">
              Failed to load user details.
            </div>
          ) : (
            <>
              {activeTab === "profile" && (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-zinc-950 rounded-xl p-4">
                    {[
                      ["Role", detail.user.roleType],
                      ["Approval", detail.user.approvalStatus],
                      ["Confirmed", detail.user.confirmed ? "Yes" : "No"],
                      ["Blocked", localBlocked ? "Yes" : "No"],
                      ["Joined", fmt(detail.user.createdAt)],
                      ["Rejection Reason", detail.user.rejectionReason || "—"],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <div className="text-zinc-500 text-[10px] font-semibold uppercase tracking-widest mb-1">
                          {label}
                        </div>
                        <div className="text-zinc-200 text-sm">{value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="text-zinc-300 font-semibold text-sm">
                    Uploaded Documents (
                    {detail.user.documentations?.length || 0})
                  </div>
                  {!detail.user.documentations?.length ? (
                    <div className="bg-zinc-950 rounded-xl p-6 text-center text-red-400 text-sm">
                      No documents uploaded
                    </div>
                  ) : (
                    detail.user.documentations.map((doc) => {
                      const fileUrl = doc.file?.url
                        ? `${MEDIA_URL}${doc.file.url}`
                        : null;
                      const isImage = doc.file?.mime?.startsWith("image/");
                      const isPdf = doc.file?.mime === "application/pdf";
                      return (
                        <div
                          key={doc.id}
                          className="bg-zinc-950 rounded-xl p-4 border border-zinc-800"
                        >
                          <div className="flex justify-between items-center mb-3">
                            <div>
                              <div className="text-zinc-200 font-semibold text-sm">
                                {doc.documentType === "citizenship" &&
                                  "Citizenship Certificate"}
                                {doc.documentType === "passport" && "Passport"}
                                {doc.documentType === "certificate" &&
                                  "Professional Certificate"}
                              </div>
                              <div className="text-zinc-600 text-xs mt-0.5">
                                {doc.file?.name || "Unknown file"}
                              </div>
                            </div>
                            {badge(doc.approvalStatus || "pending")}
                          </div>
                          {isImage && fileUrl && (
                            <img
                              src={fileUrl}
                              alt={doc.documentType}
                              className="w-full max-h-64 object-cover rounded-lg mb-3 border border-zinc-800"
                            />
                          )}
                          {isPdf && (
                            <div className="bg-zinc-800 rounded-lg p-3 flex items-center gap-3 mb-3">
                              <div className="text-zinc-200 text-sm">
                                PDF Document
                              </div>
                            </div>
                          )}
                          {fileUrl && (
                            <div className="flex gap-2">
                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 bg-indigo-500/10 text-indigo-400 ring-1 ring-inset ring-indigo-500/20 rounded-lg px-3 py-2 text-center text-xs font-semibold hover:bg-indigo-500/20 transition-colors"
                              >
                                View Document
                              </a>
                              <a
                                href={fileUrl}
                                download
                                className="bg-zinc-800 text-zinc-300 ring-1 ring-inset ring-zinc-700 rounded-lg px-3 py-2 text-center text-xs font-semibold hover:bg-zinc-700 transition-colors"
                              >
                                Download
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
              {activeTab === "requests" && (
                <div className="flex flex-col gap-3">
                  {!detail.serviceRequests?.length ? (
                    <div className="bg-zinc-950 rounded-xl p-12 text-center text-zinc-500 text-sm">
                      No service requests found.
                    </div>
                  ) : (
                    detail.serviceRequests.map((r) => (
                      <div
                        key={r.id}
                        className="bg-zinc-950 rounded-xl p-4 border border-zinc-800"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-zinc-200 font-semibold text-sm">
                            {r.title || "—"}
                          </div>
                          {badge(r.service_status)}
                        </div>
                        <div className="flex gap-5 flex-wrap mb-2">
                          {[
                            ["Category", r.category],
                            [
                              "Budget",
                              r.suggested_budget
                                ? `Rs. ${r.suggested_budget}`
                                : "—",
                            ],
                            ["Location", r.location],
                            ["Date", fmt(r.createdAt)],
                          ].map(([label, val]) => (
                            <div key={label}>
                              <span className="text-zinc-500 text-xs">
                                {label}:{" "}
                              </span>
                              <span className="text-zinc-300 text-xs">
                                {val || "—"}
                              </span>
                            </div>
                          ))}
                        </div>
                        {r.description && (
                          <div className="text-zinc-500 text-xs">
                            {r.description.slice(0, 140)}
                            {r.description.length > 140 ? "…" : ""}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
              {activeTab === "bids" && (
                <div className="flex flex-col gap-3">
                  {!detail.bids?.length ? (
                    <div className="bg-zinc-950 rounded-xl p-12 text-center text-zinc-500 text-sm">
                      No bids found.
                    </div>
                  ) : (
                    detail.bids.map((b) => (
                      <div
                        key={b.id}
                        className="bg-zinc-950 rounded-xl p-4 border border-zinc-800"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-zinc-200 font-semibold text-sm">
                            {b.service_request?.title || "Unknown Request"}
                          </div>
                          {badge(b.bid_status)}
                        </div>
                        <div className="flex gap-5 flex-wrap">
                          {[
                            ["Amount", b.amount ? `Rs. ${b.amount}` : "—"],
                            ["Availability", b.availability],
                            ["Date", fmt(b.createdAt)],
                          ].map(([label, val]) => (
                            <div key={label}>
                              <span className="text-zinc-500 text-xs">
                                {label}:{" "}
                              </span>
                              <span className="text-zinc-300 text-xs">
                                {val || "—"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
              {activeTab === "reviews" && (
                <div className="flex flex-col gap-4">
                  {detail.reviewsReceived?.length > 0 && (
                    <div>
                      <div className="text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-2">
                        Reviews Received
                      </div>
                      <div className="flex flex-col gap-3">
                        {detail.reviewsReceived.map((r) => (
                          <div
                            key={r.id}
                            className="bg-zinc-950 rounded-xl p-4 border border-zinc-800"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <div className="text-amber-400 font-semibold text-sm">
                                {"★".repeat(
                                  Math.min(Math.round(r.rating || 0), 5),
                                )}
                                <span className="text-zinc-500 text-xs ml-2 font-mono">
                                  ({r.rating})
                                </span>
                              </div>
                              <div className="text-zinc-500 text-xs">
                                {fmt(r.createdAt)}
                              </div>
                            </div>
                            {r.comment && (
                              <div className="text-zinc-300 text-sm mb-1">
                                {r.comment}
                              </div>
                            )}
                            <div className="text-zinc-500 text-xs">
                              From: {r.customer?.username || "—"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-2">
                      Reviews Given
                    </div>
                    {!detail.reviews?.length ? (
                      <div className="bg-zinc-950 rounded-xl p-12 text-center text-zinc-500 text-sm">
                        No reviews given.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {detail.reviews.map((r) => (
                          <div
                            key={r.id}
                            className="bg-zinc-950 rounded-xl p-4 border border-zinc-800"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <div className="text-amber-400 font-semibold text-sm">
                                {"★".repeat(
                                  Math.min(Math.round(r.rating || 0), 5),
                                )}
                                <span className="text-zinc-500 text-xs ml-2 font-mono">
                                  ({r.rating})
                                </span>
                              </div>
                              <div className="text-zinc-500 text-xs">
                                {fmt(r.createdAt)}
                              </div>
                            </div>
                            {r.comment && (
                              <div className="text-zinc-300 text-sm mb-1">
                                {r.comment}
                              </div>
                            )}
                            {r.provider_profile?.specialty && (
                              <div className="text-zinc-500 text-xs">
                                Provider specialty:{" "}
                                {r.provider_profile.specialty}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {activeTab === "messages" && (
                <div className="flex flex-col gap-2">
                  {!detail.messages?.length ? (
                    <div className="bg-zinc-950 rounded-xl p-12 text-center text-zinc-500 text-sm">
                      No messages found.
                    </div>
                  ) : (
                    detail.messages.map((m) => (
                      <div
                        key={m.id}
                        className="bg-zinc-950 rounded-xl p-4 border border-zinc-800"
                      >
                        <div className="flex justify-between mb-1.5">
                          <span className="text-indigo-400 text-xs font-semibold uppercase tracking-widest">
                            Sent
                          </span>
                          <span className="text-zinc-500 text-xs">
                            {fmt(m.createdAt)}
                          </span>
                        </div>
                        <div className="text-zinc-300 text-sm">
                          {m.content || m.text || m.message || "—"}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, token, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [rejectReasons, setRejectReasons] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const [allUsers, setAllUsers] = useState([]);
  const [allUsersLoading, setAllUsersLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user) return navigate("/login");
      if (user.roleType !== "admin") return navigate("/");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch(`${BASE_URL}/admin-stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  const fetchPendingUsers = async () => {
    setPendingLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/admin-approval/pending-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPendingUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setPendingLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    setAllUsersLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/admin-approval/all-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAllUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setAllUsersLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "approvals" && token) fetchPendingUsers();
    if (activeTab === "users" && token) fetchAllUsers();
  }, [activeTab, token]);

  const handleApprove = async (userId) => {
    setActionLoading(userId + "_approve");
    try {
      await fetch(`${BASE_URL}/admin-approval/approve/${userId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchPendingUsers();
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (userId) => {
    setActionLoading(userId + "_reject");
    try {
      await fetch(`${BASE_URL}/admin-approval/reject/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason: rejectReasons[userId] || "Does not meet requirements.",
        }),
      });
      await fetchPendingUsers();
    } finally {
      setActionLoading(null);
    }
  };

  const handleBlockUser = async (userId) => {
    setActionLoading(userId + "_block");
    try {
      await fetch(`${BASE_URL}/admin-approval/block/${userId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, blocked: true } : u)),
      );
      setPendingUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, blocked: true } : u)),
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnblockUser = async (userId) => {
    setActionLoading(userId + "_unblock");
    try {
      await fetch(`${BASE_URL}/admin-approval/unblock/${userId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, blocked: false } : u)),
      );
      setPendingUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, blocked: false } : u)),
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    setActionLoading(userId + "_delete");
    try {
      await fetch(`${BASE_URL}/admin-approval/delete/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteConfirm(null);
      await fetchAllUsers();
    } finally {
      setActionLoading(null);
    }
  };

  if (authLoading || loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950">
        <div className="w-10 h-10 border-2 border-zinc-800 border-t-indigo-500 rounded-full animate-spin" />
        <div className="text-zinc-500 mt-4 text-sm">Loading dashboard...</div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950">
        <div className="text-red-400 text-sm mt-3">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-5 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-500 transition-colors cursor-pointer"
        >
          Retry
        </button>
      </div>
    );

  if (!stats) return null;

  const { users, serviceRequests, bids, messages, reviews, providers, recent } =
    stats;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "requests", label: "Service Requests" },
    { id: "bids", label: "Bids" },
    { id: "activity", label: "Recent Activity" },
    { id: "approvals", label: "Pending Approvals" },
    { id: "users", label: "All Users" },
    { id: "payments", label: "Payments" },
    { id: "crud_requests", label: "Manage Requests" },
    { id: "crud_providers", label: "Manage Providers" },
    { id: "crud_reviews", label: "Manage Reviews" },
    { id: "crud_bids", label: "Manage Bids" },
    { id: "crud_subscriptions", label: "Manage Subscriptions" },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-950 font-sans">
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          token={token}
          onClose={() => setSelectedUser(null)}
          onBlock={handleBlockUser}
          onUnblock={handleUnblockUser}
        />
      )}

      <aside className="w-56 bg-zinc-900 border-r border-zinc-800 flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div className="p-5">
          <div className="flex items-center gap-2.5 mb-7">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="text-white font-semibold text-sm tracking-tight">
              Admin Panel
            </span>
          </div>
          <div className="flex items-center gap-2.5 bg-zinc-950 rounded-xl p-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
              {user?.username?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="min-w-0">
              <div className="text-white text-xs font-semibold truncate">
                {user?.username || "Admin"}
              </div>
              <div className="text-indigo-400 text-[10px]">Administrator</div>
            </div>
          </div>

          <div className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest px-1 mb-1">
            Analytics
          </div>
          <nav className="flex flex-col gap-0.5 mb-4">
            {tabs.slice(0, 7).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${activeTab === tab.id ? "bg-indigo-500/10 text-indigo-400" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"}`}
              >
                <span>{tab.label}</span>
                {tab.id === "approvals" && pendingUsers.length > 0 && (
                  <span className="ml-auto bg-red-500 text-white rounded-full px-1.5 py-0.5 text-[10px] font-bold">
                    {pendingUsers.length}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest px-1 mb-1">
            Manage Data
          </div>
          <nav className="flex flex-col gap-0.5 mb-4">
            {tabs.slice(7).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${activeTab === tab.id ? "bg-indigo-500/10 text-indigo-400" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"}`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors mt-2 cursor-pointer"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-white font-semibold text-xl tracking-tight">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h1>
            <div className="text-zinc-500 text-xs mt-1">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20 rounded-full px-3 py-1 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </div>
        </div>

        {activeTab === "crud_requests" && <ServiceRequestsTab token={token} />}
        {activeTab === "crud_providers" && (
          <ProviderProfilesTab token={token} />
        )}
        {activeTab === "crud_reviews" && <ReviewsTab token={token} />}
        {activeTab === "crud_bids" && <BidsManageTab token={token} />}
        {activeTab === "crud_subscriptions" && (
          <SubscriptionsTab token={token} />
        )}

        {activeTab === "overview" && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Users"
                value={users.total}
                icon="users"
                color="#6366f1"
                sub={`${users.customers} customers · ${users.providers} providers`}
              />
              <StatCard
                title="Service Requests"
                value={serviceRequests.total}
                icon="clipboard"
                color="#f59e0b"
                sub={`${serviceRequests.open} open · ${serviceRequests.completed} completed`}
              />
              <StatCard
                title="Total Bids"
                value={bids.total}
                icon="currency"
                color="#22c55e"
                sub={`${bids.accepted} accepted · ${bids.pending} pending`}
              />
              <StatCard
                title="Messages"
                value={messages.total}
                icon="chat"
                color="#3b82f6"
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
             
              <StatCard
                title="Avg Provider Rating"
                value={providers.avgRating}
                icon="medal"
                color="#ec4899"
              />
              <StatCard
                title="Platform Revenue"
                value={`Rs. ${(stats.payments?.subscriptions?.revenue ?? 0).toLocaleString()}`}
                icon="currency"
                color="#22c55e"
                sub="From provider subscriptions"
              />
              <StatCard
                title="Provider Earnings"
                value={`Rs. ${(stats.payments?.servicePayments ?? [])
                  .filter((p) => p.paymentStatus === "completed")
                  .reduce((sum, p) => sum + (p.amount || 0), 0)
                  .toLocaleString()}`}
                icon="currency"
                color="#f59e0b"
                sub="Paid via service requests"
              />
            </div>
            <div className="flex gap-5 flex-wrap">
              <DonutChart
                title="Users by Role"
                data={[
                  { label: "Customers", value: users.customers },
                  { label: "Providers", value: users.providers },
                  { label: "Admins", value: users.admins },
                ]}
                colors={["#6366f1", "#22c55e", "#f59e0b"]}
              />
              <DonutChart
                title="Service Request Status"
                data={[
                  { label: "Open", value: serviceRequests.open },
                  { label: "In Progress", value: serviceRequests.inProgress },
                  { label: "Completed", value: serviceRequests.completed },
                  { label: "Cancelled", value: serviceRequests.cancelled },
                ]}
                colors={["#6366f1", "#f59e0b", "#22c55e", "#ef4444"]}
              />
              <DonutChart
                title="Bid Status"
                data={[
                  { label: "Pending", value: bids.pending },
                  { label: "Accepted", value: bids.accepted },
                  { label: "Rejected", value: bids.rejected },
                ]}
                colors={["#f59e0b", "#22c55e", "#ef4444"]}
              />
            </div>
          </div>
        )}

        {activeTab === "requests" && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <StatCard
                title="Total"
                value={serviceRequests.total}
                icon="clipboard"
                color="#6366f1"
              />
              <StatCard
                title="Open"
                value={serviceRequests.open}
                icon="clipboard"
                color="#6366f1"
              />
              <StatCard
                title="In Progress"
                value={serviceRequests.inProgress}
                icon="clock"
                color="#f59e0b"
              />
              <StatCard
                title="Completed"
                value={serviceRequests.completed}
                icon="check"
                color="#22c55e"
              />
              <StatCard
                title="Cancelled"
                value={serviceRequests.cancelled}
                icon="x"
                color="#ef4444"
              />
            </div>
            <RecentTable
              title="Recent Service Requests"
              columns={[
                "Title",
                "Category",
                "Status",
                "Budget",
                "Location",
                "Customer",
                "Date",
              ]}
              rows={recent.serviceRequests.map((r) => [
                r.title || "—",
                r.category || "—",
                badge(r.service_status),
                r.suggested_budget ? `Rs. ${r.suggested_budget}` : "—",
                r.location || "—",
                r.customer?.username || "—",
                fmt(r.createdAt),
              ])}
            />
          </div>
        )}

        {activeTab === "bids" && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Bids"
                value={bids.total}
                icon="currency"
                color="#22c55e"
              />
              <StatCard
                title="Pending"
                value={bids.pending}
                icon="clock"
                color="#f59e0b"
              />
              <StatCard
                title="Accepted"
                value={bids.accepted}
                icon="check"
                color="#22c55e"
              />
              <StatCard
                title="Rejected"
                value={bids.rejected}
                icon="x"
                color="#ef4444"
              />
            </div>
            <RecentTable
              title="Recent Bids"
              columns={[
                "Provider",
                "Amount",
                "Status",
                "Service Request",
                "Availability",
                "Date",
              ]}
              rows={recent.bids.map((b) => [
                b.provider?.username || "—",
                b.amount ? `Rs. ${b.amount}` : "—",
                badge(b.bid_status),
                b.service_request?.title || "—",
                b.availability || "—",
                fmt(b.createdAt),
              ])}
            />
          </div>
        )}

        {activeTab === "activity" && (
          <div className="flex flex-col gap-6">
            <RecentTable
              title="Recent Users"
              columns={["Username", "Email", "Role", "Confirmed", "Joined"]}
              rows={recent.users.map((u) => [
                u.username || "—",
                u.email || "—",
                badge(u.roleType),
                u.confirmed ? badge("active") : badge("blocked"),
                fmt(u.createdAt),
              ])}
            />
            <RecentTable
              title="Recent Reviews"
              columns={["Customer", "Rating", "Comment", "Specialty", "Date"]}
              rows={recent.reviews.map((r) => [
                r.customer?.username || "—",
                "★".repeat(Math.min(Math.round(r.rating || 0), 5)),
                r.comment
                  ? r.comment.slice(0, 60) + (r.comment.length > 60 ? "…" : "")
                  : "—",
                r.provider_profile?.specialty || "—",
                fmt(r.createdAt),
              ])}
            />
            <RecentTable
              title="Recent Bids"
              columns={[
                "Provider",
                "Amount",
                "Status",
                "Service Request",
                "Date",
              ]}
              rows={recent.bids.map((b) => [
                b.provider?.username || "—",
                b.amount ? `Rs. ${b.amount}` : "—",
                badge(b.bid_status),
                b.service_request?.title || "—",
                fmt(b.createdAt),
              ])}
            />
          </div>
        )}

        {activeTab === "approvals" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl px-6 py-4">
              <div className="text-white font-semibold text-sm">
                Pending Registrations
              </div>
              <div className="bg-amber-500/10 text-amber-400 ring-1 ring-inset ring-amber-500/20 rounded-full px-3 py-0.5 text-xs font-semibold">
                {pendingUsers.length} pending
              </div>
              <button
                onClick={fetchPendingUsers}
                className="ml-auto bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-lg px-3 py-1.5 text-xs transition-colors cursor-pointer"
              >
                Refresh
              </button>
            </div>
            {pendingLoading && (
              <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                <div className="w-8 h-8 border-2 border-zinc-700 border-t-indigo-500 rounded-full animate-spin mb-3" />
                <span className="text-sm">Loading...</span>
              </div>
            )}
            {!pendingLoading && pendingUsers.length === 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
                <div className="text-white font-semibold text-base">
                  All caught up
                </div>
                <div className="text-zinc-500 text-sm mt-1">
                  No pending registrations at the moment.
                </div>
              </div>
            )}
            {pendingUsers.map((u) => (
              <div
                key={u.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
              >
                <div className="flex gap-6 flex-wrap items-start">
                  <div className="flex-1 min-w-56">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-lg text-white flex-shrink-0 ${u.roleType === "provider" ? "bg-violet-600" : "bg-indigo-600"}`}
                      >
                        {u.username?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <div className="text-white font-semibold text-sm">
                          {u.username}
                        </div>
                        <div className="text-zinc-500 text-xs">{u.email}</div>
                      </div>
                      {badge(u.roleType)}
                    </div>
                    <div className="bg-zinc-950 rounded-xl p-4 mb-4">
                      <div className="text-zinc-500 text-[10px] font-semibold uppercase tracking-widest mb-3">
                        Uploaded Documents ({u.documentations?.length || 0})
                      </div>
                      {!u.documentations?.length ? (
                        <div className="text-red-400 text-xs">
                          No documents uploaded
                        </div>
                      ) : (
                        u.documentations.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center gap-2 mb-1.5"
                          >
                            <span className="text-zinc-300 text-xs capitalize">
                              {doc.documentType}
                            </span>
                            <span className="text-zinc-600 text-xs">
                              · {doc.file?.ext?.toUpperCase() || "FILE"}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedUser(u)}
                      className="w-full bg-indigo-500/10 text-indigo-400 ring-1 ring-inset ring-indigo-500/20 rounded-lg py-2.5 text-xs font-semibold hover:bg-indigo-500/20 transition-colors cursor-pointer"
                    >
                      View Full Details
                    </button>
                  </div>
                  <div className="flex flex-col gap-3 min-w-52">
                    <div className="text-zinc-500 text-[10px] font-semibold uppercase tracking-widest">
                      Actions
                    </div>
                    <button
                      onClick={() => handleApprove(u.id)}
                      disabled={actionLoading === u.id + "_approve"}
                      className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg py-2.5 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {actionLoading === u.id + "_approve"
                        ? "Approving..."
                        : "Approve Account"}
                    </button>
                    <div className="border-t border-zinc-800 pt-3">
                      <div className="text-zinc-500 text-xs mb-2">
                        Rejection reason (optional)
                      </div>
                      <textarea
                        placeholder="e.g. Documents are unclear..."
                        value={rejectReasons[u.id] || ""}
                        onChange={(e) =>
                          setRejectReasons({
                            ...rejectReasons,
                            [u.id]: e.target.value,
                          })
                        }
                        rows={3}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 text-xs outline-none resize-vertical focus:border-zinc-600 transition-colors"
                      />
                      <button
                        onClick={() => handleReject(u.id)}
                        disabled={actionLoading === u.id + "_reject"}
                        className="w-full mt-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-lg py-2.5 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        {actionLoading === u.id + "_reject"
                          ? "Rejecting..."
                          : "Reject Account"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "users" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl px-6 py-4">
              <div className="text-white font-semibold text-sm">All Users</div>
              <div className="bg-indigo-500/10 text-indigo-400 ring-1 ring-inset ring-indigo-500/20 rounded-full px-3 py-0.5 text-xs font-semibold">
                {allUsers.length} users
              </div>
              <button
                onClick={fetchAllUsers}
                className="ml-auto bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-lg px-3 py-1.5 text-xs transition-colors cursor-pointer"
              >
                Refresh
              </button>
            </div>
            {allUsersLoading && (
              <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                <div className="w-8 h-8 border-2 border-zinc-700 border-t-indigo-500 rounded-full animate-spin mb-3" />
                <span className="text-sm">Loading users...</span>
              </div>
            )}
            {!allUsersLoading && allUsers.length === 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
                <div className="text-white font-semibold text-base">
                  No users found
                </div>
              </div>
            )}
            {!allUsersLoading &&
              allUsers.map((u) => (
                <div
                  key={u.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-6 py-4 flex items-center gap-4 flex-wrap"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0 ${u.roleType === "provider" ? "bg-violet-600" : "bg-indigo-600"}`}
                  >
                    {u.username?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-40">
                    <div className="text-white font-medium text-sm">
                      {u.username}
                    </div>
                    <div className="text-zinc-500 text-xs">{u.email}</div>
                  </div>
                  <div className="flex gap-2 items-center flex-wrap">
                    {badge(u.roleType)}
                    {badge(u.approvalStatus)}
                    {u.blocked && badge("blocked")}
                  </div>
                  <div className="text-zinc-500 text-xs min-w-20">
                    {fmt(u.createdAt)}
                  </div>
                  <div className="flex gap-2 items-center flex-wrap">
                    <button
                      onClick={() => setSelectedUser(u)}
                      className="bg-indigo-500/10 text-indigo-400 ring-1 ring-inset ring-indigo-500/20 rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-indigo-500/20 transition-colors cursor-pointer"
                    >
                      Details
                    </button>
                    {u.blocked ? (
                      <button
                        onClick={() => handleUnblockUser(u.id)}
                        disabled={actionLoading === u.id + "_unblock"}
                        className="bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20 rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-emerald-500/20 disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        {actionLoading === u.id + "_unblock"
                          ? "..."
                          : "Unblock"}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBlockUser(u.id)}
                        disabled={actionLoading === u.id + "_block"}
                        className="bg-amber-500/10 text-amber-400 ring-1 ring-inset ring-amber-500/20 rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-amber-500/20 disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        {actionLoading === u.id + "_block" ? "..." : "Block"}
                      </button>
                    )}
                    {deleteConfirm === u.id ? (
                      <div className="flex gap-2 items-center">
                        <span className="text-amber-400 text-xs">Confirm?</span>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          disabled={actionLoading === u.id + "_delete"}
                          className="bg-red-600 hover:bg-red-500 text-white rounded-lg px-3 py-1.5 text-xs font-semibold disabled:opacity-50 transition-colors cursor-pointer"
                        >
                          {actionLoading === u.id + "_delete"
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg px-3 py-1.5 text-xs transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(u.id)}
                        className="bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20 rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-red-500/20 transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}

        {activeTab === "payments" && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard
                title="Active Subscriptions"
                value={stats.payments?.subscriptions?.active ?? 0}
                icon="shield"
                color="#6366f1"
                sub={`${stats.payments?.subscriptions?.total ?? 0} total`}
              />
              <StatCard
                title="Subscription Revenue"
                value={`Rs. ${(stats.payments?.subscriptions?.revenue ?? 0).toLocaleString()}`}
                icon="currency"
                color="#22c55e"
                sub="From active plans"
              />
              <StatCard
                title="Service Payments"
                value={stats.payments?.servicePayments?.length ?? 0}
                icon="clipboard"
                color="#f59e0b"
                sub="Total transactions"
              />
            </div>
            <RecentTable
              title="Recent Subscriptions"
              columns={[
                "Provider",
                "Plan",
                "Amount",
                "Status",
                "Expires",
                "Date",
              ]}
              rows={(stats.payments?.recentSubscriptions || []).map((s) => [
                s.provider?.username || "—",
                badge(s.plan),
                `Rs. ${s.amount}`,
                badge(s.subscriptionStatus),
                fmt(s.expires_at),
                fmt(s.createdAt),
              ])}
            />
            <RecentTable
              title="Service Payments"
              columns={[
                "Customer",
                "Amount",
                "Status",
                "Service Request",
                "Date",
              ]}
              rows={(stats.payments?.servicePayments || []).map((p) => [
                p.user?.username || "—",
                `Rs. ${p.amount}`,
                badge(p.paymentStatus),
                p.service_request?.title || "—",
                fmt(p.createdAt),
              ])}
            />
          </div>
        )}
      </main>
    </div>
  );
}
