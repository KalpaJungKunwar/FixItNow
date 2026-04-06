import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";
const getToken = () => localStorage.getItem("token");
const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
};

const AVATAR_COLORS = [
  "from-amber-400 to-amber-600",
  "from-emerald-400 to-emerald-600",
  "from-blue-400 to-blue-600",
  "from-violet-400 to-violet-600",
  "from-rose-400 to-rose-600",
  "from-pink-400 to-pink-600",
];

function avatarColor(str) {
  if (!str) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < str.length; i++)
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function CustomerProfile() {
  const navigate = useNavigate();
  const user = getUser();
  const colorClass = avatarColor(user?.username);

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState("");

  const setPw = (k, v) => setPwForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    setSaveSuccess(false);
    try {
      const res = await fetch(`${BASE_URL}/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ username, email }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e?.error?.message || "Update failed");
      }
      const updated = await res.json();
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          username: updated.username,
          email: updated.email,
        }),
      );
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      setSaveError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    setPwError("");
    setPwSuccess(false);
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) {
      setPwError("All fields are required.");
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwError("New passwords do not match.");
      return;
    }
    if (pwForm.next.length < 6) {
      setPwError("Password must be at least 6 characters.");
      return;
    }
    setPwSaving(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          currentPassword: pwForm.current,
          password: pwForm.next,
          passwordConfirmation: pwForm.confirm,
        }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e?.error?.message || "Password change failed");
      }
      setPwSuccess(true);
      setPwForm({ current: "", next: "", confirm: "" });
      setTimeout(() => setPwSuccess(false), 3000);
    } catch (e) {
      setPwError(e.message);
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Avatar Banner */}
        <div className="bg-gray-900 rounded-2xl p-6 flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/[0.03] -translate-y-1/2 translate-x-1/2" />
          <div
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-extrabold text-2xl flex-shrink-0`}
          >
            {(user?.username || "U").slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-bold text-white">{user?.username}</p>
            <p className="text-xs text-white/40 mt-0.5">{user?.email}</p>
            <span className="inline-block mt-2 text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/20 uppercase tracking-wide">
              Customer
            </span>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-gray-900 mb-5">
            Account Information
          </h2>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
              placeholder="Your username"
            />
          </div>

          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
              placeholder="name@example.com"
            />
          </div>

          {saveError && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 text-xs text-red-600 mb-4">
              {saveError}
            </div>
          )}
          {saveSuccess && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5 text-xs text-emerald-600 font-semibold mb-4 flex items-center gap-1.5">
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
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
              Profile updated successfully!
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-70 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Change Password */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-gray-900 mb-1">
            Change Password
          </h2>
          <p className="text-xs text-gray-400 mb-5">
            Make sure your account is using a strong password.
          </p>

          <div className="space-y-4 mb-5">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                value={pwForm.current}
                onChange={(e) => setPw("current", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                placeholder="password"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  value={pwForm.next}
                  onChange={(e) => setPw("next", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                  placeholder="password"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={pwForm.confirm}
                  onChange={(e) => setPw("confirm", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                  placeholder="password"
                />
              </div>
            </div>
          </div>

          {pwError && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 text-xs text-red-600 mb-4">
              {pwError}
            </div>
          )}
          {pwSuccess && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5 text-xs text-emerald-600 font-semibold mb-4 flex items-center gap-1.5">
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
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
              Password changed successfully!
            </div>
          )}

          <button
            onClick={handlePasswordChange}
            disabled={pwSaving}
            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-70 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
          >
            {pwSaving ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
