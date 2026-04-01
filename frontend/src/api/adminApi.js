const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:1337/api";

export async function fetchAdminStats(token) {
  const res = await fetch(`${BASE_URL}/admin-stats`, {  // ✅ no extra /api
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Error ${res.status}`);
  }
  return res.json();
}