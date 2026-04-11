import { useState, useRef, useEffect } from "react";
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
  const [user, setUser] = useState(getUser);
  const colorClass = avatarColor(user?.username);
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  const justUploadedRef = useRef(false);
  const [picFile, setPicFile] = useState(null);
  const [picPreview, setPicPreview] = useState(
    user?.profilePicture?.url
      ? user.profilePicture.url.startsWith("http")
        ? user.profilePicture.url
        : `${BASE_URL}${user.profilePicture.url}`
      : null,
  );
  const [picLoading, setPicLoading] = useState(false);
  const [picError, setPicError] = useState("");
  const [picSuccess, setPicSuccess] = useState(false);
  const picInputRef = useRef(null);

  useEffect(() => {
    if (justUploadedRef.current) {
      justUploadedRef.current = false;
      return;
    }
    if (user?.profilePicture?.url) {
      const url = user.profilePicture.url;
      setPicPreview(url.startsWith("http") ? url : `${BASE_URL}${url}`);
    }
  }, [user?.profilePicture?.url]);
  

  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState("");

  const setPw = (k, v) => setPwForm((f) => ({ ...f, [k]: v }));

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setPicError("Image must be under 5MB.");
      return;
    }
    setPicFile(file);
    setPicPreview(URL.createObjectURL(file));
    setPicError("");
  };

  const handlePicUpload = async () => {
    if (!picFile) return;
    setPicLoading(true);
    setPicError("");
    setPicSuccess(false);
    try {
      const meRes = await fetch(
        `${BASE_URL}/api/users/${user.id}?populate=profilePicture`,
        { headers: { Authorization: `Bearer ${getToken()}` } },
      );
      const meData = await meRes.json();
      const picData = Array.isArray(meData.profilePicture)
        ? (meData.profilePicture[0] ?? null)
        : (meData.profilePicture ?? null);
      const existingId = picData?.id ?? null;

      const formData = new FormData();
      formData.append("files", picFile);
      formData.append("ref", "plugin::users-permissions.user");
      formData.append("refId", user.id);
      formData.append("field", "profilePicture");

      const res = await fetch(`${BASE_URL}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e?.error?.message || "Upload failed");
      }
      const uploaded = await res.json();
      const newUrl = uploaded[0]?.url;

      if (existingId) {
        await fetch(`${BASE_URL}/api/upload/files/${existingId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${getToken()}` },
        }).catch(() => {});
      }

      if (newUrl) {
        const fullUrl = newUrl.startsWith("http")
          ? newUrl
          : `${BASE_URL}${newUrl}`;
        justUploadedRef.current = true;
        setPicPreview(fullUrl);

        const stored = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUser = { ...stored, profilePicture: { ...uploaded[0] } };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      }

      setPicSuccess(true);
      setPicFile(null);
      setTimeout(() => setPicSuccess(false), 3000);
    } catch (e) {
      setPicError(e.message);
    } finally {
      setPicLoading(false);
    }
  };

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
      const updatedUser = {
        ...user,
        username: updated.username,
        email: updated.email,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
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

          {/* Avatar / profile picture */}
          <div className="relative flex-shrink-0 group">
            {picPreview ? (
              <img
                src={picPreview}
                alt="Profile"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white/10"
              />
            ) : (
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-extrabold text-2xl`}
              >
                {(user?.username || "U").slice(0, 2).toUpperCase()}
              </div>
            )}
            {/* Camera overlay on hover */}
            <button
              onClick={() => picInputRef.current?.click()}
              className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              title="Change photo"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                />
              </svg>
            </button>
            <input
              ref={picInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePicChange}
            />
          </div>

          <div className="flex-1">
            <p className="text-lg font-bold text-white">{user?.username}</p>
            <p className="text-xs text-white/40 mt-0.5">{user?.email}</p>
            <div className="flex gap-3 mt-2 flex-wrap items-center">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/20 uppercase tracking-wide">
                Customer
              </span>
              {picFile && (
                <button
                  onClick={handlePicUpload}
                  disabled={picLoading}
                  className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-70 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                >
                  {picLoading ? "Uploading..." : "Save Photo"}
                </button>
              )}
              {picSuccess && (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg">
                  <svg
                    className="w-3 h-3"
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
                  Photo saved!
                </span>
              )}
            </div>
            {picError && (
              <p className="text-xs text-red-400 mt-1">{picError}</p>
            )}
            {picFile && !picLoading && (
              <p className="text-[10px] text-white/30 mt-1">
                Click "Save Photo" to upload your new picture
              </p>
            )}
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
