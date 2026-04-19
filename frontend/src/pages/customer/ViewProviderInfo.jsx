import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";
const getToken = () => sessionStorage.getItem("token");

const AVATAR_COLORS = [
  "from-amber-400 to-amber-600",
  "from-emerald-400 to-emerald-600",
  "from-blue-400 to-blue-600",
  "from-violet-400 to-violet-600",
  "from-rose-400 to-rose-600",
];

function avatarColor(str) {
  if (!str) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < str.length; i++)
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function StarDisplay({ value, size = "w-4 h-4" }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`${size} ${star <= value ? "text-amber-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.499z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProviderProfilePage({
  providerDocumentId,
  providerUsername,
  onClose,
}) {
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!providerDocumentId) return;
    fetchProfile();
  }, [providerDocumentId]);

  const fetchProfile = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(
        `${API_URL}/api/provider-profiles/${providerDocumentId}?populate[reviews]=true`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await res.json();
      const raw = data?.data ?? data;
      if (!raw) return;

      const p = raw.attributes ?? raw;
      const profileDocumentId = raw.documentId ?? raw.id;
      setProfile(p);

      if (providerUsername) {
        const userRes = await fetch(
          `${API_URL}/api/users?filters[username][$eq]=${encodeURIComponent(providerUsername)}&populate=profilePicture`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (userRes.ok) {
          const users = await userRes.json();
          const userData = Array.isArray(users) ? users[0] : null;
          const pic = Array.isArray(userData?.profilePicture)
            ? (userData.profilePicture[0] ?? null)
            : (userData?.profilePicture ?? null);
          if (pic?.url) {
            setProfilePicture(
              pic.url.startsWith("http") ? pic.url : `${API_URL}${pic.url}`,
            );
          }
        }
      }

      const r2 = await fetch(
        `${API_URL}/api/reviews?filters[provider_profile][documentId][$eq]=${profileDocumentId}&populate[customer]=true&sort=createdAt:desc`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (r2.ok) {
        const rdata = await r2.json();
        const reviewList = (rdata?.data ?? []).map((r) => {
          const attrs = r.attributes ?? r;
          return {
            ...attrs,
            documentId: r.documentId ?? r.id,
            customer: attrs.customer?.data
              ? (attrs.customer.data.attributes ?? attrs.customer.data)
              : (attrs.customer ?? {}),
          };
        });
        setReviews(reviewList);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const username = providerUsername || "Provider";
  const colorClass = avatarColor(username);

  const servicesOffered = (() => {
    if (!profile?.services_offered) return [];
    if (Array.isArray(profile.services_offered))
      return profile.services_offered;
    try {
      return JSON.parse(profile.services_offered);
    } catch {
      return [];
    }
  })();

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
        ).toFixed(1)
      : profile?.rating
        ? Number(profile.rating).toFixed(1)
        : null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-6 pt-5 pb-0">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Provider Profile
          </p>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-lg transition-colors"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : !profile ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-4xl mb-3">👤</p>
            <p className="font-medium">Profile not found</p>
          </div>
        ) : (
          <div className="px-6 pb-8 mt-4 space-y-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-5">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt={username}
                    className="w-20 h-20 rounded-2xl object-cover flex-shrink-0 border border-gray-200"
                  />
                ) : (
                  <div
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-extrabold text-2xl flex-shrink-0`}
                  >
                    {username.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {username}
                    </h2>
                    {profile.verified && (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                        ✓ VERIFIED PRO
                      </span>
                    )}
                  </div>
                  {profile.specialty && (
                    <p className="text-sm text-gray-500 capitalize mb-3">
                      {profile.specialty.charAt(0).toUpperCase() +
                        profile.specialty.slice(1)}{" "}
                      Specialist
                    </p>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    {profile.location && (
                      <span className="flex items-center gap-1.5">
                        📍 {profile.location}
                      </span>
                    )}
                    {profile.experience && (
                      <span className="flex items-center gap-1.5">
                        🕐 {profile.experience}+ Years Exp.
                      </span>
                    )}
                    {avgRating && (
                      <span className="flex items-center gap-1.5 text-amber-500 font-semibold">
                        ⭐ {avgRating}
                        {reviews.length > 0 && (
                          <span className="text-gray-400 font-normal">
                            ({reviews.length} Reviews)
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {profile.bio && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">
                  About {username.split(" ")[0]}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {profile.bio}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Rating",
                  value: avgRating ? `${avgRating} / 5` : "New",
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100"
                >
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  <p className="text-sm font-bold text-gray-800">{value}</p>
                </div>
              ))}
            </div>

            {servicesOffered.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3">
                  Services Offered
                </h3>
                <div className="flex flex-wrap gap-2">
                  {servicesOffered.map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:border-blue-200 hover:bg-blue-50 transition-colors"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3">
                Customer Reviews{" "}
                {reviews.length > 0 && (
                  <span className="text-gray-400 font-normal">
                    ({reviews.length})
                  </span>
                )}
              </h3>
              {reviews.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
                  <p className="text-sm text-gray-400">No reviews yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reviews.map((review, i) => {
                    const customer = review.customer ?? {};
                    return (
                      <div
                        key={review.documentId || i}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-semibold text-gray-800">
                            {customer?.username || "Customer"}
                          </p>
                          <StarDisplay value={review.rating || 0} />
                        </div>
                        {review.comment && (
                          <p className="text-xs text-gray-500 leading-relaxed">
                            {review.comment}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
