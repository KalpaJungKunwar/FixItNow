import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import ChatBox from "../components/ChatBox";

const API_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";

const HomeIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
    />
  </svg>
);
const SearchIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z"
    />
  </svg>
);
const ClipboardIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
    />
  </svg>
);
const UserIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
    />
  </svg>
);
const LogOutIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
    />
  </svg>
);
const WrenchIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l5.653-4.655m3.587-3.029a5.25 5.25 0 00-7.42 7.42"
    />
  </svg>
);
const BoltIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
    />
  </svg>
);
const SparklesIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
    />
  </svg>
);
const CpuIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z"
    />
  </svg>
);
const PaintIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
    />
  </svg>
);
const MapPinIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
    />
  </svg>
);
const ClockIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const CurrencyIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75"
    />
  </svg>
);
const StarIcon = ({ className, filled }) => (
  <svg
    className={className}
    fill={filled ? "currentColor" : "none"}
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.499z"
    />
  </svg>
);
const CheckIcon = ({ className }) => (
  <svg
    className={className}
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
);
const ChevronDownIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
    />
  </svg>
);
const ShieldCheckIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
    />
  </svg>
);

const SPECIALTIES = [
  { value: "plumbing", label: "Plumbing", Icon: WrenchIcon },
  { value: "electrical", label: "Electrical", Icon: BoltIcon },
  { value: "carpentry", label: "Carpentry", Icon: WrenchIcon },
  { value: "cleaning", label: "Cleaning", Icon: SparklesIcon },
  { value: "technical", label: "Technical", Icon: CpuIcon },
  { value: "painting", label: "Painting", Icon: PaintIcon },
  { value: "other", label: "Other", Icon: WrenchIcon },
];

const AVATAR_COLORS = [
  "from-amber-400 to-amber-600",
  "from-emerald-400 to-emerald-600",
  "from-blue-400 to-blue-600",
  "from-violet-400 to-violet-600",
  "from-rose-400 to-rose-600",
  "from-pink-400 to-pink-600",
];

const getToken = () => localStorage.getItem("token");
const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};
const a = (obj) => obj?.attributes ?? obj ?? {};

function timeSince(iso) {
  if (!iso) return "";
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
function avatarColor(str) {
  if (!str) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < str.length; i++)
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// ─── Location Map Modal ───────────────────────────────────────────────────────
function LocationMapModal({ lat, lng, title, onClose }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href =
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(link);
    }
    const initMap = () => {
      if (mapInstanceRef.current || !mapRef.current) return;
      const L = window.L;
      const map = L.map(mapRef.current).setView([lat, lng], 15);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });
      const greenIcon = new L.Icon({
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });
      L.marker([lat, lng], { icon: greenIcon })
        .addTo(map)
        .bindPopup(`📍 ${title || "Service Location"}`)
        .openPopup();
      mapInstanceRef.current = map;
    };
    if (window.L) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
      script.onload = initMap;
      document.head.appendChild(script);
    }
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <p className="font-bold text-gray-900 text-sm">Service Location</p>
            {title && (
              <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">
                {title}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-lg transition-colors"
          >
            ×
          </button>
        </div>
        <div ref={mapRef} style={{ height: "360px", width: "100%" }} />
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />{" "}
            Customer's pinned location
          </span>
          <a
            href={`https://www.google.com/maps?q=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-blue-500 hover:text-blue-600 transition-colors"
          >
            Open in Google Maps →
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ active, setActive, user, profile }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const username = user?.username || "Provider";
  const colorClass = avatarColor(username);
  const navItems = [
    { id: "dashboard", Icon: HomeIcon, label: "Dashboard" },
    { id: "requests", Icon: SearchIcon, label: "Find Requests" },
    { id: "bids", Icon: ClipboardIcon, label: "My Bids" },
    { id: "profile", Icon: UserIcon, label: "My Profile" },
  ];
  return (
    <div className="w-56 min-h-screen bg-gray-900 flex flex-col flex-shrink-0 border-r border-white/5">
      <div className="px-5 py-6 border-b border-white/5">
        <p className="text-lg font-extrabold text-white tracking-tight">
          FixItNow
        </p>
        <p className="text-[10px] font-semibold text-white/30 tracking-widest mt-0.5">
          PROVIDER PANEL
        </p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        <div className="h-px bg-white/5 my-2" />
        {navItems.map(({ id, Icon, label }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${active === id ? "bg-blue-500/15 text-blue-400 border-l-2 border-blue-500" : "text-white/40 hover:text-white/70 hover:bg-white/5 border-l-2 border-transparent"}`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </button>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-white/5 space-y-3">
        {profile?.rating && (
          <div className="flex items-center gap-2 bg-amber-500/10 rounded-lg px-3 py-2">
            <StarIcon className="w-3.5 h-3.5 text-amber-400" filled />
            <span className="text-xs font-bold text-amber-400">
              {Number(profile.rating).toFixed(1)} Rating
            </span>
          </div>
        )}
        <div className="flex items-center gap-2.5 px-1">
          <div
            className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}
          >
            {username.slice(0, 2).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">
              {username}
            </p>
            <p className="text-[10px] text-white/30">Provider</p>
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/8 hover:bg-red-500/15 border border-red-500/20 text-red-400 text-xs font-semibold transition-colors"
        >
          <LogOutIcon className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 flex-1 min-w-0">
      <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">
        {label}
      </p>
      <p
        className={`text-2xl font-extrabold tracking-tight ${accent || "text-gray-900"}`}
      >
        {value}
      </p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function EmptyState({ Icon, title, sub }) {
  return (
    <div className="text-center py-14 border-2 border-dashed border-gray-200 rounded-2xl">
      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
        <Icon className="w-6 h-6 text-gray-400" />
      </div>
      <p className="text-sm font-semibold text-gray-500">{title}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

// ─── Request Card ─────────────────────────────────────────────────────────────
function RequestCard({ request, myBids, onBid, compact }) {
  const attrs = a(request);
  const customer = attrs.customer?.data
    ? a(attrs.customer.data)
    : (attrs.customer ?? {});
  const username = customer?.username || "Customer";
  const colorClass = avatarColor(username);
  const specialty = SPECIALTIES.find((s) => s.value === attrs.category);
  const alreadyBid = myBids.some((b) => {
    const sreq = a(b).service_request;
    const rid = sreq?.data?.id ?? sreq?.id;
    return rid === request.id;
  });

  const [bidAmount, setBidAmount] = useState(
    attrs.suggested_budget ? Math.round(attrs.suggested_budget * 0.92) : "",
  );
  const [bidMsg, setBidMsg] = useState("");
  const [bidAvail, setBidAvail] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(alreadyBid);
  const [error, setError] = useState("");
  const [showMap, setShowMap] = useState(false);

  const handleBid = async () => {
    if (!bidAmount) {
      setError("Bid amount is required.");
      return;
    }
    if (!bidAvail) {
      setError("Availability is required.");
      return;
    }
    if (!bidMsg) {
      setError("Message is required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      const user = getUser();
      const res = await fetch(`${API_URL}/api/bids`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            amount: Number(bidAmount),
            message: bidMsg,
            availability: bidAvail,
            bid_status: "pending",
            service_request: attrs.documentId || request.documentId,
            provider: user?.id,
          },
        }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e?.error?.message || "Failed");
      }
      setSent(true);
      setExpanded(false);
      if (onBid) onBid();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showMap && attrs.customer_lat && attrs.customer_lng && (
        <LocationMapModal
          lat={attrs.customer_lat}
          lng={attrs.customer_lng}
          title={attrs.title}
          onClose={() => setShowMap(false)}
        />
      )}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md hover:border-gray-300 transition-all duration-200">
        <div className="p-5">
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
            >
              {username.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-bold text-sm text-gray-900">
                  {username}
                </span>
                {specialty && (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                    <specialty.Icon className="w-2.5 h-2.5" />
                    {specialty.label}
                  </span>
                )}
              </div>
              <p className="font-semibold text-sm text-gray-800 mb-2">
                {attrs.title}
              </p>
              <div className="flex flex-wrap gap-3">
                {attrs.location && (
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <MapPinIcon className="w-3 h-3" />
                    {attrs.location}
                  </span>
                )}
                {attrs.customer_lat && attrs.customer_lng && (
                  <button
                    onClick={() => setShowMap(true)}
                    className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors cursor-pointer"
                  >
                    📍 Location pinned on map
                  </button>
                )}
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <ClockIcon className="w-3 h-3" />
                  {timeSince(attrs.createdAt)}
                </span>
                {attrs.suggested_budget && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                    <CurrencyIcon className="w-3 h-3" />
                    Rs. {Number(attrs.suggested_budget).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            <div className="flex-shrink-0">
              {sent ? (
                <span className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <CheckIcon className="w-3 h-3" /> Bid Sent
                </span>
              ) : compact ? (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 transition-colors flex items-center gap-1"
                >
                  Place Bid{" "}
                  <ChevronDownIcon
                    className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`}
                  />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold">
                      Rs.
                    </span>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      onClick={() => setExpanded(true)}
                      className="w-28 pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                      placeholder="Amount"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setExpanded(true);
                      handleBid();
                    }}
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-600 disabled:opacity-70 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                  >
                    {loading ? "..." : "Bid"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {expanded && !sent && (
          <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Amount (Rs.) *
                </label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                  placeholder="e.g. 2500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Availability *
                </label>
                <input
                  value={bidAvail}
                  onChange={(e) => setBidAvail(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                  placeholder="e.g. Today 2PM"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Message *
                </label>
                <input
                  value={bidMsg}
                  onChange={(e) => setBidMsg(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                  placeholder="Brief note"
                />
              </div>
            </div>
            {attrs.suggested_budget && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mb-3 text-xs text-blue-700">
                Customer's budget is{" "}
                <strong>
                  Rs. {Number(attrs.suggested_budget).toLocaleString()}
                </strong>
                . Competitive bids win more jobs.
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-3 text-xs text-red-600">
                {error}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setExpanded(false)}
                className="border border-gray-200 text-gray-600 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBid}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 disabled:opacity-70 text-white text-xs font-bold px-5 py-2 rounded-lg transition-colors"
              >
                {loading ? "Sending..." : "Send Bid"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Dashboard Tab ────────────────────────────────────────────────────────────
function DashboardTab({ profile, myBids, nearbyRequests, user, onNavigate }) {
  const earnings = myBids
    .filter((b) => a(b).bid_status === "accepted")
    .reduce((s, b) => s + (a(b).amount || 0), 0);
  const activeBids = myBids.filter((b) => a(b).bid_status === "pending").length;
  const username = user?.username || "Provider";
  return (
    <div>
      <div className="flex items-start justify-between mb-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-1">
            Overview
          </p>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Welcome back, {username.split(" ")[0]}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {nearbyRequests.length > 0
              ? `${nearbyRequests.length} new requests match your specialty.`
              : "No new requests in your area right now."}
          </p>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
          Online
        </span>
      </div>
      <div className="flex gap-4 mb-8 flex-wrap">
        <StatCard
          label="Total Earnings"
          value={`Rs. ${earnings.toLocaleString()}`}
        />

        <StatCard label="Active Bids" value={activeBids} />
        <StatCard
          label="Your Rating"
          value={
            profile?.rating > 0
              ? `${Number(profile.rating).toFixed(1)} `
              : "—"
          }
          accent="text-amber-500"
        />
      </div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-0.5">
            Nearby
          </p>
          <h2 className="text-lg font-bold text-gray-900">
            New Service Requests
          </h2>
        </div>
        <button
          onClick={() => onNavigate("requests")}
          className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors"
        >
          View all →
        </button>
      </div>
      {nearbyRequests.length === 0 ? (
        <EmptyState
          Icon={SearchIcon}
          title="No matching requests"
          sub="New requests will appear here when customers post in your specialty."
        />
      ) : (
        <div className="space-y-3">
          {nearbyRequests.slice(0, 5).map((req) => (
            <RequestCard
              key={req.id}
              request={req}
              myBids={myBids}
              onNavigate={() => onNavigate("requests")}
              compact
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Find Requests Tab ────────────────────────────────────────────────────────
function FindRequestsTab({ requests, myBids, profile, onBidSent }) {
  const [filter, setFilter] = useState("all");
  const specialty = profile?.specialty;
  const filtered = requests.filter((req) => {
    if (filter === "mine") return a(req).category === specialty;
    if (filter === "no_bids") {
      const bids = a(req).bids;
      return (
        (Array.isArray(bids) ? bids.length : (bids?.data?.length ?? 0)) === 0
      );
    }
    return true;
  });
  const filters = [
    { val: "all", label: "All Requests" },
    {
      val: "mine",
      label: specialty ? `My Specialty (${specialty})` : "My Specialty",
    },
    { val: "no_bids", label: "No Bids Yet" },
  ];
  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-1">
            Marketplace
          </p>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Find Requests
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {filtered.length} requests available
          </p>
        </div>
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f.val}
              onClick={() => setFilter(f.val)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${filter === f.val ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      {filtered.length === 0 ? (
        <EmptyState
          Icon={SearchIcon}
          title="No requests found"
          sub="Try a different filter or check back soon."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((req) => (
            <RequestCard
              key={req.id}
              request={req}
              myBids={myBids}
              onBid={onBidSent}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── My Bids Tab ──────────────────────────────────────────────────────────────
const BIDS_PER_PAGE = 3;

function MyBidsTab({ providerId }) {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapModal, setMapModal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [openChatId, setOpenChatId] = useState(null);
  const watchIds = useRef({});

  useEffect(() => {
    fetchMyBids();
    return () => {
      Object.values(watchIds.current).forEach((id) =>
        navigator.geolocation.clearWatch(id),
      );
    };
  }, []);

  const fetchMyBids = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/bids?filters[provider][id][$eq]=${providerId}&populate[service_request]=true&sort=createdAt:desc`,
        { headers: { Authorization: `Bearer ${getToken()}` } },
      );
      const data = await res.json();
      setBids(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startSharingLocation = (requestDocumentId) => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    if (watchIds.current[requestDocumentId]) return;
    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        await fetch(`${API_URL}/api/service-requests/${requestDocumentId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            data: { provider_lat: latitude, provider_lng: longitude },
          }),
        });
      },
      (err) => console.error("Location error:", err),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 },
    );
    watchIds.current[requestDocumentId] = watchId;
    setBids((prev) => [...prev]);
  };

  const stopSharingLocation = (requestDocumentId) => {
    if (watchIds.current[requestDocumentId]) {
      navigator.geolocation.clearWatch(watchIds.current[requestDocumentId]);
      delete watchIds.current[requestDocumentId];
      setBids((prev) => [...prev]);
    }
  };

  const markCompleted = async (requestDocumentId) => {
    if (
      !window.confirm(
        "Mark this job as done? The customer will need to confirm.",
      )
    )
      return;
    try {
      await fetch(`${API_URL}/api/service-requests/${requestDocumentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          data: { service_status: "awaiting_confirmation" },
        }),
      });
      stopSharingLocation(requestDocumentId);
      fetchMyBids();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );

  return (
    <div className="space-y-4">
      {mapModal && (
        <LocationMapModal
          lat={mapModal.lat}
          lng={mapModal.lng}
          title={mapModal.title}
          onClose={() => setMapModal(null)}
        />
      )}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-1">
          Jobs
        </p>
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          My Bids
        </h2>
      </div>
      {bids.length === 0 ? (
        <EmptyState
          Icon={ClipboardIcon}
          title="No bids yet"
          sub="Bids you submit will appear here."
        />
      ) : (
        <>
          {(() => {
            const totalPages = Math.ceil(bids.length / BIDS_PER_PAGE);
            const paginated = bids.slice(
              (currentPage - 1) * BIDS_PER_PAGE,
              currentPage * BIDS_PER_PAGE,
            );
            return (
              <>
                {paginated.map((bid) => {
                  const reqDocumentId = bid.service_request?.documentId ?? null;
                  const sr = bid.service_request ?? {};
                  const isInProgress = sr.service_status === "in_progress";
                  const isCompleted = sr.service_status === "completed";
                  const isSharing = !!watchIds.current[reqDocumentId];
                  const isChatOpen = openChatId === reqDocumentId;

                  const bidStatusStyle = {
                    pending: "bg-yellow-100 text-yellow-700",
                    accepted: "bg-emerald-100 text-emerald-700",
                    rejected: "bg-red-100 text-red-600",
                  };
                  const jobStatusStyle = {
                    pending: "bg-gray-100 text-gray-600",
                    in_progress: "bg-blue-100 text-blue-700",
                    awaiting_confirmation: "bg-purple-100 text-purple-700",
                    completed: "bg-emerald-100 text-emerald-700",
                    cancelled: "bg-red-100 text-red-600",
                  };

                  return (
                    <div
                      key={bid.documentId}
                      className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-gray-900">
                            {sr.title ?? "Service Request"}
                          </h3>
                          <p className="text-sm text-gray-500 capitalize mt-0.5">
                            {sr.category ?? ""}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full ${bidStatusStyle[bid.bid_status] ?? "bg-gray-100 text-gray-600"}`}
                          >
                            Bid: {bid.bid_status?.toUpperCase()}
                          </span>
                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full ${jobStatusStyle[sr.service_status] ?? "bg-gray-100 text-gray-600"}`}
                          >
                            Job:{" "}
                            {sr.service_status?.replace("_", " ").toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mb-3 bg-gray-50 rounded-xl px-4 py-3">
                        <span>
                          Your bid:{" "}
                          <strong className="text-gray-900">
                            Rs. {bid.amount?.toLocaleString()}
                          </strong>
                        </span>
                        <span>
                          Available:{" "}
                          <strong className="text-gray-900">
                            {bid.availability ?? "—"}
                          </strong>
                        </span>
                      </div>
                      {sr.customer_lat && sr.customer_lng && (
                        <button
                          onClick={() =>
                            setMapModal({
                              lat: sr.customer_lat,
                              lng: sr.customer_lng,
                              title: sr.title,
                            })
                          }
                          className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors mb-3"
                        >
                          📍 View customer location on map
                        </button>
                      )}
                      {isInProgress && reqDocumentId && (
                        <div className="flex flex-wrap gap-3 mt-2">
                          {!isSharing ? (
                            <button
                              onClick={() =>
                                startSharingLocation(reqDocumentId)
                              }
                              className="flex items-center gap-2 px-4 py-2 bg-blue-400 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition"
                            >
                              Share My Location
                            </button>
                          ) : (
                            <button
                              onClick={() => stopSharingLocation(reqDocumentId)}
                              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white text-sm font-semibold rounded-xl hover:bg-gray-600 transition"
                            >
                              ⏹ Stop Sharing
                            </button>
                          )}
                          <button
                            onClick={() => markCompleted(reqDocumentId)}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-400 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition"
                          >
                            Mark Completed
                          </button>
                          {/* Message Button */}
                          <button
                            onClick={() =>
                              setOpenChatId(isChatOpen ? null : reqDocumentId)
                            }
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition ${isChatOpen ? "bg-gray-200 text-gray-700 hover:bg-gray-300" : "bg-violet-400 text-white hover:bg-violet-500"}`}
                          >
                            {isChatOpen ? "Close Chat" : "Message Customer"}
                          </button>
                        </div>
                      )}
                      {isInProgress && isSharing && (
                        <p className="text-xs text-blue-500 mt-3 flex items-center gap-1.5">
                          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse" />{" "}
                          Sharing your live location with the customer
                        </p>
                      )}
                      {isCompleted && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                          <CheckIcon className="w-3.5 h-3.5" /> Job completed
                        </div>
                      )}
                      {/* Collapsible Chat Box */}
                      {(isInProgress ||
                        sr.service_status === "awaiting_confirmation") &&
                        reqDocumentId &&
                        isChatOpen && (
                          <div className="mt-4 border-t border-gray-100 pt-4">
                            <ChatBox
                              requestId={reqDocumentId}
                              currentUser={getUser()}
                            />
                          </div>
                        )}
                    </div>
                  );
                })}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-blue-300 hover:text-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center text-sm font-bold"
                    >
                      ‹
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 rounded-lg border text-xs font-bold transition-all ${
                            currentPage === page
                              ? "bg-blue-500 border-blue-500 text-white shadow-sm"
                              : "bg-white border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-500"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    )}
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-blue-300 hover:text-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center text-sm font-bold"
                    >
                      ›
                    </button>
                  </div>
                )}
              </>
            );
          })()}
        </>
      )}
    </div>
  );
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────
function ProfileTab({ profile, user, onProfileSaved }) {
  const [form, setForm] = useState({
    specialty: profile?.specialty || "",
    location: profile?.location || "",
    experience: profile?.experience || "",
    avg_hourly_rate: profile?.avg_hourly_rate || "",
    bio: profile?.bio || "",
    services_offered_text: (() => {
      const s = profile?.services_offered;
      if (!s) return "";
      if (Array.isArray(s)) return s.join(", ");
      try {
        return JSON.parse(s).join(", ");
      } catch {
        return String(s);
      }
    })(),
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const token = getToken();
      const profileId = profile?.documentId || profile?.id;
      if (!profileId) throw new Error("Profile not found.");
      const res = await fetch(`${API_URL}/api/provider-profiles/${profileId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            specialty: form.specialty,
            location: form.location,
            experience: form.experience ? Number(form.experience) : null,
            avg_hourly_rate: form.avg_hourly_rate
              ? Number(form.avg_hourly_rate)
              : null,
            bio: form.bio || null,
            services_offered: form.services_offered_text
              ? form.services_offered_text
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              : [],
          },
        }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e?.error?.message || "Update failed");
      }
      const updated = await res.json();
      setSuccess(true);
      if (onProfileSaved) onProfileSaved(updated.data);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const username = user?.username || "Provider";
  const colorClass = avatarColor(username);

  return (
    <div className="max-w-7xl">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-1">
          Account
        </p>
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          My Profile
        </h2>
      </div>
      <div className="bg-gray-900 rounded-2xl p-6 mb-5 flex items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/[0.03] -translate-y-1/2 translate-x-1/2" />
        <div
          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-extrabold text-xl flex-shrink-0`}
        >
          {username.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1">
          <p className="text-lg font-bold text-white">{username}</p>
          <p className="text-xs text-white/40 mt-0.5">{user?.email}</p>
          <div className="flex gap-4 mt-2">
            {profile?.rating > 0 && (
              <div className="flex items-center gap-2 bg-amber-500/10 rounded-lg px-3 py-2">
                <StarIcon className="w-3.5 h-3.5 text-amber-400" filled />
                <span className="text-xs font-bold text-amber-400">
                  {Number(profile.rating).toFixed(1)} Rating
                </span>
              </div>
            )}
          </div>
        </div>
        {profile?.verified && (
          <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/20">
            <ShieldCheckIcon className="w-3.5 h-3.5" /> Verified
          </span>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-5 text-xs text-amber-700">
        <span className="font-semibold">Note:</span> Your rating is
        automatically updated based on customer reviews and cannot be edited
        manually.
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-gray-900 mb-5">
          Edit Information
        </h3>

        <label className="block text-xs font-semibold text-gray-600 mb-2">
          Specialty *
        </label>
        <div className="grid grid-cols-4 gap-2 mb-5">
          {SPECIALTIES.map((s) => (
            <button
              key={s.value}
              onClick={() => set("specialty", s.value)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${form.specialty === s.value ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${form.specialty === s.value ? "bg-blue-100" : "bg-gray-100"}`}
              >
                <s.Icon
                  className={`w-4 h-4 ${form.specialty === s.value ? "text-blue-500" : "text-gray-500"}`}
                />
              </div>
              <span
                className={`text-[11px] font-semibold ${form.specialty === s.value ? "text-blue-600" : "text-gray-600"}`}
              >
                {s.label}
              </span>
            </button>
          ))}
        </div>

        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
          Location *
        </label>
        <input
          value={form.location}
          onChange={(e) => set("location", e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 placeholder-gray-400"
          placeholder="e.g. Kathmandu, Baneshwor"
        />

        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
          Bio
        </label>
        <textarea
          value={form.bio}
          onChange={(e) => set("bio", e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 placeholder-gray-400 resize-none h-24"
          placeholder="Describe your experience and expertise..."
        />

        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
          Services Offered{" "}
          <span className="text-gray-400 font-normal">(comma separated)</span>
        </label>
        <input
          value={form.services_offered_text}
          onChange={(e) => set("services_offered_text", e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 placeholder-gray-400"
          placeholder="e.g. Leak Repair, Pipe Installation, Drain Cleaning"
        />

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Years of Experience
            </label>
            <input
              type="number"
              value={form.experience}
              onChange={(e) => set("experience", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 placeholder-gray-400"
              placeholder="e.g. 5"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Avg. Hourly Rate (Rs.)
            </label>
            <input
              type="number"
              value={form.avg_hourly_rate}
              onChange={(e) => set("avg_hourly_rate", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 placeholder-gray-400"
              placeholder="e.g. 500"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 text-xs text-red-600 mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5 text-xs text-emerald-600 font-semibold mb-4 flex items-center gap-1.5">
            <CheckIcon className="w-3.5 h-3.5" /> Profile updated successfully!
          </div>
        )}
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 disabled:opacity-70 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ProviderDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [allRequests, setAllRequests] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getUser();
    setUser(u);
    if (u)
      Promise.all([fetchProfile(u), fetchRequests(), fetchMyBids(u)]).finally(
        () => setLoading(false),
      );
    else setLoading(false);
  }, []);

  const fetchProfile = async (u) => {
  try {
    const res = await fetch(
      `${API_URL}/api/provider-profiles?filters[user][id][$eq]=${u.id}&populate=*`,
      { headers: { Authorization: `Bearer ${getToken()}` } },
    );
    const data = await res.json();
    const raw = data?.data?.[0];
    console.log("RAW PROFILE:", JSON.stringify(raw, null, 2));
    if (raw) {
      const p = raw.attributes ?? raw;
      p.id = raw.id;
      p.documentId = raw.documentId ?? raw.id;
      console.log("FLATTENED PROFILE:", JSON.stringify(p, null, 2));
      setProfile(p);
    }
  } catch (e) {
    console.error(e);
  }
};

  const fetchRequests = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/service-requests?filters[service_status][$eq]=pending&populate[customer]=true&populate[bids][fields][0]=id&sort=createdAt:desc&pagination[limit]=50`,
        { headers: { Authorization: `Bearer ${getToken()}` } },
      );
      const data = await res.json();
      setAllRequests(data?.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMyBids = async (u) => {
    try {
      const res = await fetch(
        `${API_URL}/api/bids?filters[provider][id][$eq]=${u.id}&populate[service_request]=true&sort=createdAt:desc`,
        { headers: { Authorization: `Bearer ${getToken()}` } },
      );
      const data = await res.json();
      setMyBids(data?.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const nearbyRequests = profile?.specialty
    ? allRequests.filter((req) => a(req).category === profile.specialty)
    : allRequests;

  const refreshBids = () => {
    if (user) fetchMyBids(user);
    fetchRequests();
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <div className="w-9 h-9 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Loading dashboard...</p>
      </div>
    );

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-7 h-7 text-gray-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            Not logged in
          </h2>
          <p className="text-sm text-gray-400">
            Please log in to access the provider dashboard.
          </p>
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans antialiased">
      <Sidebar
        active={activeTab}
        setActive={setActiveTab}
        user={user}
        profile={profile}
      />
      <main className="flex-1 px-8 py-8 overflow-y-auto">
        {activeTab === "dashboard" && (
          <DashboardTab
            profile={profile}
            myBids={myBids}
            nearbyRequests={nearbyRequests}
            user={user}
            onNavigate={setActiveTab}
          />
        )}
        {activeTab === "requests" && (
          <FindRequestsTab
            requests={allRequests}
            myBids={myBids}
            profile={profile}
            onBidSent={refreshBids}
          />
        )}
        {activeTab === "bids" && <MyBidsTab providerId={user?.id} />}
        {activeTab === "profile" && (
          <ProfileTab
            profile={profile}
            user={user}
            onProfileSaved={(updated) => setProfile(updated)}
          />
        )}
      </main>
    </div>
  );
}
