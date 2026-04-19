import { useState, useEffect, useRef } from "react";
import ProviderProfilePage from "./ViewProviderInfo";

const API_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";

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
const HammerIcon = ({ className }) => (
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
const CodeIcon = ({ className }) => (
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
      d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
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
const ChatIcon = ({ className }) => (
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
      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
    />
  </svg>
);
const ShieldIcon = ({ className }) => (
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
const TrashIcon = ({ className }) => (
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
      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
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
const ArrowRightIcon = ({ className }) => (
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
      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
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
const PhotoIcon = ({ className }) => (
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
      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
    />
  </svg>
);

const CATEGORIES = [
  { value: "plumbing", label: "Plumbing", Icon: WrenchIcon },
  { value: "electrical", label: "Electrical", Icon: BoltIcon },
  { value: "carpentry", label: "Carpentry", Icon: HammerIcon },
  { value: "cleaning", label: "Cleaning", Icon: SparklesIcon },
  { value: "technical", label: "Technical", Icon: CodeIcon },
  { value: "painting", label: "Painting", Icon: PaintIcon },
  { value: "other", label: "Other", Icon: WrenchIcon },
];

const STATUS_CONFIG = {
  pending: {
    label: "Waiting for Bids",
    cls: "bg-blue-50 text-blue-600 border-blue-100",
  },
  in_progress: {
    label: "In Progress",
    cls: "bg-amber-50 text-amber-600 border-amber-100",
  },
  completed: {
    label: "Completed",
    cls: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  cancelled: {
    label: "Cancelled",
    cls: "bg-red-50 text-red-500 border-red-100",
  },
};

const BID_STATUS_CONFIG = {
  pending: {
    label: "Pending",
    cls: "bg-orange-50 text-orange-600 border-orange-100",
  },
  accepted: {
    label: "Accepted",
    cls: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  rejected: { label: "Rejected", cls: "bg-red-50 text-red-500 border-red-100" },
};

const AVATAR_COLORS = [
  "from-amber-400 to-amber-600",
  "from-emerald-400 to-emerald-600",
  "from-blue-400 to-blue-600",
  "from-violet-400 to-violet-600",
  "from-rose-400 to-rose-600",
  "from-pink-400 to-pink-600",
];

const getToken = () => sessionStorage.getItem("token");
const getUser = () => {
  try {
    return JSON.parse(sessionStorage.getItem("user"));
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

function MapPicker({ lat, lng, onLocationSelect }) {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (leafletMap.current) return;

    const initMap = () => {
      const L = window.L;
      if (!L) return;

      const initialLat = lat;
      const initialLng = lng;

      const map = L.map(mapRef.current, {
        center: [initialLat, initialLng],
        zoom: 14,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      const pinIcon = L.divIcon({
        className: "",
        html: `
          <div style="
            width: 36px; height: 36px;
            background: #3b82f6;
            border: 3px solid white;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 4px 12px rgba(59,130,246,0.5);
            cursor: grab;
          "></div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      });

      const marker = L.marker([initialLat, initialLng], {
        icon: pinIcon,
        draggable: true,
      }).addTo(map);

      marker.on("dragend", (e) => {
        const { lat, lng } = e.target.getLatLng();
        onLocationSelect(lat, lng);
      });

      map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        onLocationSelect(lat, lng);
      });

      leafletMap.current = map;
      markerRef.current = marker;
    };

    if (window.L) {
      initMap();
    } else {
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = initMap;
      document.head.appendChild(script);
    }

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (lat && lng && leafletMap.current && markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      leafletMap.current.flyTo([lat, lng], 16, { duration: 1.2 });
    }
  }, [lat, lng]);

  return (
    <div className="relative rounded-xl overflow-hidden border-2 border-blue-200 mb-1">
      <div ref={mapRef} style={{ height: "220px", width: "100%" }} />
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
        <span className="bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-600 px-3 py-1 rounded-full shadow-sm border border-gray-200">
          Click or drag the pin to set location
        </span>
      </div>
    </div>
  );
}

function RequestFormModal({ onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    category: "",
    title: "",
    description: "",
    location: "",
    preferred_date: "",
    suggested_budget: "",
    customer_lat: null,
    customer_lng: null,
  });
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [locStatus, setLocStatus] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [error, setError] = useState("");
  const [locSource, setLocSource] = useState("");
  const fileRef = useRef();
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocStatus("error");
      return;
    }
    setLocLoading(true);
    setLocStatus("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          customer_lat: pos.coords.latitude,
          customer_lng: pos.coords.longitude,
        }));
        setLocLoading(false);
        setLocStatus("success");
        setShowMap(true);
      },
      () => {
        setLocLoading(false);
        setLocStatus("error");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const handleMapSelect = (lat, lng) => {
    setForm((f) => ({ ...f, customer_lat: lat, customer_lng: lng }));
    setLocStatus("success");
    setLocSource("map");
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.category || !form.title || !form.description || !form.location) {
      setError("Please fill all required fields.");
      return;
    }
    if (form.suggested_budget && Number(form.suggested_budget) < 0) {
      setError("Suggested budget cannot be negative.");
      return;
    }
    setLoading(true);
    try {
      const token = getToken();
      const user = getUser();
      let photoIds = [];
      if (photos.length > 0) {
        const fd = new FormData();
        photos.forEach((f) => fd.append("files", f));
        const upRes = await fetch(`${API_URL}/api/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
        if (!upRes.ok) {
          const err = await upRes.json().catch(() => ({}));
          throw new Error(
            err?.error?.message ||
              `Photo upload failed (${upRes.status}). Try posting without photos.`,
          );
        }
        const upData = await upRes.json();
        if (!Array.isArray(upData)) {
          throw new Error(
            "Photo upload returned unexpected data. Try again or skip photos.",
          );
        }
        photoIds = upData.map((f) => f.id);
      }

      const res = await fetch(`${API_URL}/api/service-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            title: form.title,
            description: form.description,
            category: form.category,
            location: form.location,
            preferred_date: form.preferred_date || null,
            suggested_budget: form.suggested_budget
              ? Number(form.suggested_budget)
              : null,
            customer_lat: form.customer_lat,
            customer_lng: form.customer_lng,
            service_status: "pending",
            customer: user?.id,
            ...(photoIds.length > 0 && { photos: photoIds }),
          },
        }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e?.error?.message || "Failed");
      }
      onSuccess((await res.json()).data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="px-7 pt-6 pb-0 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">
              Step {step} of 2
            </p>
            <h2 className="text-xl font-bold text-gray-900 mt-0.5">
              {step === 1 ? "Describe your Problem" : "Schedule & Budget"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-lg transition-colors"
          >
            ×
          </button>
        </div>

        <div className="px-7 mt-4">
          <div className="h-1 bg-gray-100 rounded-full">
            <div
              className="h-1 bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: step === 1 ? "50%" : "100%" }}
            />
          </div>
        </div>

        <div className="px-7 py-6">
          {step === 1 && (
            <>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Select Category *
              </label>
              <div className="grid grid-cols-4 gap-2 mb-5">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => set("category", c.value)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                      form.category === c.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${form.category === c.value ? "bg-blue-100" : "bg-gray-100"}`}
                    >
                      <c.Icon
                        className={`w-4 h-4 ${form.category === c.value ? "text-blue-500" : "text-gray-500"}`}
                      />
                    </div>
                    <span
                      className={`text-[11px] font-semibold ${form.category === c.value ? "text-blue-600" : "text-gray-600"}`}
                    >
                      {c.label}
                    </span>
                  </button>
                ))}
              </div>

              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Task Title *
              </label>
              <input
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 placeholder-gray-400"
                placeholder="e.g. Kitchen tap is leaking"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
              />

              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Describe the issue *
              </label>
              <textarea
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 placeholder-gray-400 resize-none h-24"
                placeholder="Mention specific details..."
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />

              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Add Photos (Optional)
              </label>
              <div
                onClick={() => fileRef.current.click()}
                className="border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-xl p-5 text-center cursor-pointer bg-gray-50 transition-colors mb-5"
              >
                <PhotoIcon className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                <p className="text-xs text-gray-400">
                  {photos.length > 0
                    ? `${photos.length} file(s) selected`
                    : "Click to upload (max 3)"}
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    setPhotos(Array.from(e.target.files).slice(0, 3))
                  }
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 text-xs text-red-600 mb-4">
                  {error}
                </div>
              )}
              <button
                onClick={() => {
                  if (!form.category || !form.title || !form.description) {
                    setError("Please fill category, title and description.");
                    return;
                  }
                  setError("");
                  setStep(2);
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
              >
                Next: Schedule & Budget <ArrowRightIcon className="w-4 h-4" />
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Service Location *
              </label>
              <input
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 placeholder-gray-400"
                placeholder="e.g. Kathmandu, Baneshwor"
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
              />

              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => {
                    if (!navigator.geolocation) {
                      setLocStatus("error");
                      return;
                    }
                    setLocLoading(true);
                    setLocStatus("");
                    navigator.geolocation.getCurrentPosition(
                      (pos) => {
                        setForm((f) => ({
                          ...f,
                          customer_lat: pos.coords.latitude,
                          customer_lng: pos.coords.longitude,
                        }));
                        setLocLoading(false);
                        setLocStatus("success");
                        setLocSource("gps");
                        setShowMap(true);
                      },
                      () => {
                        setLocLoading(false);
                        setLocStatus("error");
                      },
                      { enableHighAccuracy: true, timeout: 10000 },
                    );
                  }}
                  disabled={locLoading}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold border-2 transition-all ${
                    locStatus === "success" && locSource === "gps"
                      ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                      : locStatus === "error"
                        ? "border-red-300 bg-red-50 text-red-600"
                        : "border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  {locLoading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />{" "}
                      Detecting...
                    </>
                  ) : locStatus === "error" ? (
                    <>⚠ Allow location access</>
                  ) : (
                    <>
                      <MapPinIcon className="w-3.5 h-3.5" /> Use GPS Location
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowMap((v) => !v)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold border-2 transition-all ${
                    showMap
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : locSource === "map" && form.customer_lat
                        ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                        : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50"
                  }`}
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
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  {showMap ? "Hide Map" : "Pick on Map"}
                </button>
              </div>

              {showMap && (
                <div className="mb-3">
                  <MapPicker
                    lat={form.customer_lat ?? 27.7172}
                    lng={form.customer_lng ?? 85.324}
                    onLocationSelect={handleMapSelect}
                  />
                  {form.customer_lat ? (
                    <div className="flex items-center justify-between mt-1.5 px-1">
                      <p className="text-xs text-emerald-600">
                        📍 {form.customer_lat.toFixed(5)},{" "}
                        {form.customer_lng.toFixed(5)}
                      </p>
                      <button
                        onClick={() => {
                          setForm((f) => ({
                            ...f,
                            customer_lat: null,
                            customer_lng: null,
                          }));
                          setLocStatus("");
                          setLocSource("");
                        }}
                        className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 text-center mt-1.5">
                      Click the map or drag the pin to set your location
                    </p>
                  )}
                </div>
              )}

              {!showMap && form.customer_lat && (
                <p className="text-xs text-emerald-600 mb-3 flex items-center gap-1">
                  <CheckIcon className="w-3 h-3" />
                  {form.customer_lat.toFixed(5)}, {form.customer_lng.toFixed(5)}{" "}
                  — tap "Pick on Map" to adjust
                </p>
              )}
              {!showMap && !form.customer_lat && (
                <p className="text-xs text-gray-400 mb-3 text-center">
                  Optional — helps the provider navigate to you
                </p>
              )}

              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Preferred Date & Time
              </label>
              <input
                type="datetime-local"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                value={form.preferred_date}
                min={new Date(
                  Date.now() - new Date().getTimezoneOffset() * 60000,
                )
                  .toISOString()
                  .slice(0, 16)}
                onChange={(e) => set("preferred_date", e.target.value)}
              />

              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Suggested Budget (Rs.)
              </label>
              <div className="relative mb-5">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
                  Rs.
                </span>
                <input
                  type="number"
                  className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 placeholder-gray-400"
                  placeholder="0"
                  value={form.suggested_budget}
                  onChange={(e) => set("suggested_budget", e.target.value)}
                />
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-5">
                <p className="text-xs text-blue-700">
                  <span className="font-semibold">Tip:</span> Providers will
                  offer competitive prices. Check ratings before accepting.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 text-xs text-red-600 mb-4">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-semibold py-3 rounded-xl text-sm transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-[2] bg-blue-500 hover:bg-blue-600 disabled:opacity-70 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
                >
                  {loading ? "Posting..." : "Post Request"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
function DeleteConfirmModal({ onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-7 shadow-2xl text-center">
        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrashIcon className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Delete Request?
        </h3>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          This will permanently delete the request and all associated bids. This
          cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-semibold py-2.5 rounded-xl text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-70 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function BidCard({ bid, hasAcceptedBid, onAccept, onReject, onViewProfile }) {
  const attrs = a(bid);
  const provider = attrs.provider?.data
    ? a(attrs.provider.data)
    : (attrs.provider ?? {});
  const profile = provider.provider_profile?.data
    ? a(provider.provider_profile.data)
    : (provider.provider_profile ?? null);
  const status = attrs.bid_status;
  const bidStatus = BID_STATUS_CONFIG[status] || BID_STATUS_CONFIG.pending;
  const username = provider?.username || "Provider";
  const colorClass = avatarColor(username);
  const isTopRated = profile?.rating >= 4.5 && profile?.jobs_count > 50;

  return (
    <div className="flex items-start gap-4 p-5 bg-white border border-gray-200 rounded-2xl hover:shadow-md hover:border-gray-300 transition-all duration-200">
      <div className="relative flex-shrink-0">
        <div
          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-bold text-sm`}
        >
          {username.slice(0, 2).toUpperCase()}
        </div>
        {profile && (
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <p className="font-bold text-gray-900 text-sm">{username}</p>
          {isTopRated && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
              Top Rated
            </span>
          )}
          {profile?.verified && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center gap-1">
              <CheckIcon className="w-2.5 h-2.5" /> Verified
            </span>
          )}
        </div>
        {attrs.message && (
          <p className="text-xs text-gray-500 leading-relaxed mb-2 italic">
            "{attrs.message}"
          </p>
        )}
        <div className="flex items-center gap-3 flex-wrap">
          {profile?.rating > 0 && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <StarIcon className="w-3 h-3 text-amber-400" filled />{" "}
              {profile.rating.toFixed(1)}
              {profile.jobs_count ? ` (${profile.jobs_count}+ jobs)` : ""}
            </span>
          )}
          {attrs.availability && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <ClockIcon className="w-3 h-3" />
              {new Date(attrs.availability).toLocaleString("en-NP", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase mb-0.5">
          Bid
        </p>
        <p className="text-xl font-extrabold text-gray-900 mb-2">
          Rs. {attrs.amount?.toLocaleString()}
        </p>
        {status === "pending" ? (
          <div className="flex gap-2 justify-end flex-wrap">
            <button
              onClick={() =>
                onViewProfile &&
                onViewProfile({
                  providerDocumentId:
                    profile?.documentId ??
                    provider?.provider_profile?.documentId,
                  username,
                })
              }
              className="bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors border border-gray-200"
            >
              View Profile
            </button>
            {!hasAcceptedBid && (
              <button
                onClick={() => onReject(bid.id)}
                className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border border-red-200 flex items-center gap-1"
              >
                <span>✕</span> Reject
              </button>
            )}
            {!hasAcceptedBid && (
              <button
                onClick={() => onAccept(bid.id)}
                className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
              >
                <CheckIcon className="w-3 h-3" /> Accept
              </button>
            )}
          </div>
        ) : (
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${bidStatus.cls}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {bidStatus.label}
          </span>
        )}
      </div>
    </div>
  );
}

function ActiveRequestPanel({
  request,
  bids,
  onAcceptBid,
  onRejectBid,
  onDelete,
}) {
  const attrs = a(request);
  const catObj = CATEGORIES.find((c) => c.value === attrs.category);
  const [sortBy, setSortBy] = useState("amount");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(null);
  const status = STATUS_CONFIG[attrs.service_status] || STATUS_CONFIG.pending;
  const hasAcceptedBid = bids.some((b) => a(b).bid_status === "accepted");

  const sortedBids = [...bids]
    .filter((b) => a(b).bid_status !== "rejected")
    .sort((x, y) => {
      const ax = a(x);
      const ay = a(y);
      if (sortBy === "amount") return (ax.amount || 0) - (ay.amount || 0);
      if (sortBy === "rating") {
        const rx =
          a(ax.provider?.data || ax.provider)?.provider_profile?.rating || 0;
        const ry =
          a(ay.provider?.data || ay.provider)?.provider_profile?.rating || 0;
        return ry - rx;
      }
      return 0;
    });

  const avgPrice =
    bids.length > 0
      ? Math.round(
          bids.reduce((sum, b) => sum + (a(b).amount || 0), 0) / bids.length,
        )
      : 0;

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const identifier = attrs.documentId || request.id;
      const res = await fetch(`${API_URL}/api/service-requests/${identifier}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(`Delete failed: ${err?.error?.message || res.status}`);
        return;
      }
      onDelete(request.id);
    } catch (e) {
      alert(`Error: ${e.message}`);
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
      {showProfile && (
        <ProviderProfilePage
          providerDocumentId={showProfile.providerDocumentId}
          providerUsername={showProfile.username}
          onClose={() => setShowProfile(null)}
        />
      )}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          loading={deleteLoading}
        />
      )}

      <div className="mb-8">
        <div className="bg-blue-900 rounded-2xl p-6 mb-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/[0.03] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full bg-white/[0.03] translate-y-1/2" />
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex-1">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border mb-3 ${status.cls}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {status.label}
              </span>
              <h2 className="text-xl font-bold text-white mb-2 leading-tight">
                {attrs.title}
              </h2>
              <p className="text-sm text-white/60 leading-relaxed mb-4 max-w-xl">
                {attrs.description}
              </p>
              <div className="flex flex-wrap gap-4">
                {attrs.location && (
                  <span className="flex items-center gap-1.5 text-xs text-white/50">
                    <MapPinIcon className="w-3.5 h-3.5" />
                    {attrs.location}
                  </span>
                )}
                {attrs.createdAt && (
                  <span className="flex items-center gap-1.5 text-xs text-white/50">
                    <ClockIcon className="w-3.5 h-3.5" />
                    Posted {timeSince(attrs.createdAt)}
                  </span>
                )}
                {catObj && (
                  <span className="flex items-center gap-1.5 text-xs text-white/50">
                    <catObj.Icon className="w-3.5 h-3.5" />
                    {catObj.label}
                  </span>
                )}
                {attrs.suggested_budget && (
                  <span className="flex items-center gap-1.5 text-xs text-white/50">
                    <CurrencyIcon className="w-3.5 h-3.5" />
                    Rs. {Number(attrs.suggested_budget).toLocaleString()}
                  </span>
                )}
                {attrs.customer_lat && attrs.customer_lng && (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <MapPinIcon className="w-3.5 h-3.5" />
                    📍 Location shared
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors flex-shrink-0"
            >
              <TrashIcon className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-5 items-start">
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <p className="text-xs font-bold text-gray-700 mb-3">
                Request Summary
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400">Total Bids</span>
                  <span className="text-xs font-bold text-gray-800">
                    {bids.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400">Avg. Price</span>
                  <span className="text-xs font-bold text-gray-800">
                    {avgPrice > 0 ? `Rs. ${avgPrice.toLocaleString()}` : "—"}
                  </span>
                </div>
                {attrs.suggested_budget && (
                  <div className="flex justify-between pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-400">Your Budget</span>
                    <span className="text-xs font-bold text-blue-500">
                      Rs. {Number(attrs.suggested_budget).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <p className="text-xs font-bold text-gray-700 mb-2">
                Sort Bids By
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              >
                <option value="amount">Lowest Price First</option>
                <option value="rating">Highest Rated First</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-base font-bold text-gray-900">
                Incoming Bids
              </h3>
              {bids.length > 0 && (
                <span className="text-xs text-gray-400">
                  · sorted by {sortBy === "amount" ? "price" : "rating"}
                </span>
              )}
            </div>
            {bids.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
                <ClockIcon className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-gray-500">
                  Waiting for bids...
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Providers will send offers shortly.
                </p>
              </div>
            ) : (
              <div className="relative">
                <div className="overflow-y-auto max-h-[420px] space-y-3 pr-1 scrollbar-thin">
                  {sortedBids.map((bid) => (
                    <BidCard
                      key={bid.id}
                      bid={bid}
                      hasAcceptedBid={hasAcceptedBid}
                      onAccept={onAcceptBid}
                      onReject={onRejectBid}
                      onViewProfile={setShowProfile}
                    />
                  ))}
                </div>
                {sortedBids.length > 3 && (
                  <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none rounded-b-2xl" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function ServiceHero({ onOpenForm }) {
  return (
    <div className="max-w-6xl mx-auto px-6 pb-16">
      <div className="bg-blue-500 rounded-2xl p-12 text-center text-white mb-12 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/5" />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 text-xs bg-white/10 border border-white/20 font-medium px-3 py-1 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-white" /> Competitive
            bidding — you set the price
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3 leading-tight tracking-tight">
            Expert home services,
            <br />
            on your terms.
          </h1>
          <p className="text-blue-100 text-sm mb-8 max-w-md mx-auto leading-relaxed">
            Post your task, receive competitive bids from verified
            professionals, and choose the offer that fits your budget.
          </p>
          <button
            onClick={onOpenForm}
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm shadow-lg"
          >
            Post a Request <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="text-center mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-1">
          Simple Process
        </p>
        <h2 className="text-2xl font-bold text-gray-900">How FixItNow works</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14 relative">
        <div className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-gray-100 via-blue-200 to-gray-100" />
        {[
          {
            Icon: ClipboardIcon,
            step: "01",
            title: "Post a Request",
            desc: "Describe your problem and set a suggested budget. Takes less than 2 minutes.",
          },
          {
            Icon: CurrencyIcon,
            step: "02",
            title: "Receive Bids",
            desc: "Verified professionals nearby send you competitive offers within minutes.",
          },
          {
            Icon: ChatIcon,
            step: "03",
            title: "Choose & Confirm",
            desc: "Review ratings, chat with the pro, and accept the offer that suits you best.",
          },
        ].map(({ Icon, step, title, desc }) => (
          <div
            key={step}
            className="relative bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm group hover:shadow-md hover:border-blue-100 transition-all"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-full px-2.5 py-0.5 text-xs font-bold text-gray-400 group-hover:text-blue-500 group-hover:border-blue-200 transition-colors">
              {step}
            </div>
            <div className="w-12 h-12 bg-blue-50 group-hover:bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3 mt-2 transition-colors">
              <Icon className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="font-bold text-gray-800 text-sm mb-1">{title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <div className="mb-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-1">
          Services
        </p>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Browse by category
        </h2>
      </div>
      <div className="flex flex-wrap gap-3 mb-14">
        {CATEGORIES.map(({ Icon, label, value }) => (
          <button
            key={value}
            onClick={onOpenForm}
            className="group flex items-center gap-3 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-xl px-5 py-4 transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 group-hover:border-blue-200 group-hover:bg-blue-50 flex items-center justify-center shadow-sm transition-colors">
              <Icon className="w-[18px] h-[18px] text-gray-500 group-hover:text-blue-500 transition-colors" />
            </div>
            <span className="font-semibold text-sm text-gray-700 group-hover:text-blue-700 transition-colors">
              {label}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-8">
        {[
          {
            Icon: ShieldIcon,
            label: "Verified Pros",
            sub: "Background checked",
          },
          {
            Icon: CurrencyIcon,
            label: "Bidding System",
            sub: "You choose the best offer",
          },
          {
            Icon: ChatIcon,
            label: "Real-time Chat",
            sub: "Negotiate directly",
          },
        ].map(({ Icon, label, sub }) => (
          <div key={label} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Icon className="w-[18px] h-[18px] text-blue-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-700">{label}</p>
              <p className="text-xs text-gray-400">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const REQUESTS_PER_PAGE = 5;

export default function ServicePage() {
  const [showForm, setShowForm] = useState(false);
  const [activeRequests, setActiveRequests] = useState([]);
  const [bidsMap, setBidsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pollRef = useRef({});

  useEffect(() => {
    fetchActiveRequests();
    return () => Object.values(pollRef.current).forEach(clearInterval);
  }, []);

  const fetchActiveRequests = async () => {
    const user = getUser();
    const token = getToken();
    if (!user || !token) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(
        `${API_URL}/api/service-requests?filters[customer][id][$eq]=${user.id}&filters[service_status][$in][0]=pending&filters[service_status][$in][1]=in_progress&populate=*&sort=createdAt:desc`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await res.json();
      const requests = data?.data || [];
      setActiveRequests(requests);
      requests.forEach((req) => {
        fetchBidsForRequest(req.id);
        startPolling(req.id);
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchBidsForRequest = async (requestId) => {
    try {
      const res = await fetch(
        `${API_URL}/api/bids?filters[service_request][id][$eq]=${requestId}&populate[provider][populate][provider_profile]=true&sort=amount:asc`,
        { headers: { Authorization: `Bearer ${getToken()}` } },
      );
      const data = await res.json();
      setBidsMap((prev) => ({ ...prev, [requestId]: data?.data || [] }));
    } catch (e) {
      console.error(e);
    }
  };

  const startPolling = (requestId) => {
    if (pollRef.current[requestId]) clearInterval(pollRef.current[requestId]);
    pollRef.current[requestId] = setInterval(
      () => fetchBidsForRequest(requestId),
      10000,
    );
  };

  const handleRequestSuccess = (newRequest) => {
    setShowForm(false);
    setActiveRequests((prev) => [newRequest, ...prev]);
    setBidsMap((prev) => ({ ...prev, [newRequest.id]: [] }));
    startPolling(newRequest.id);
  };

  const handleDeleteRequest = (requestId) => {
    clearInterval(pollRef.current[requestId]);
    delete pollRef.current[requestId];
    setActiveRequests((prev) => {
      const updated = prev.filter((r) => r.id !== requestId);
      const totalPages = Math.ceil(updated.length / REQUESTS_PER_PAGE);
      setCurrentPage((p) => Math.min(p, Math.max(1, totalPages)));
      return updated;
    });
    setBidsMap((prev) => {
      const next = { ...prev };
      delete next[requestId];
      return next;
    });
  };

  const handleRejectBid = async (bidId) => {
    const token = getToken();
    const requestId = Object.keys(bidsMap).find((rid) =>
      bidsMap[rid].some((b) => b.id === bidId),
    );
    if (!requestId) return;
    const bid = bidsMap[requestId].find((b) => b.id === bidId);
    const bidDocId = a(bid).documentId;
    try {
      await fetch(`${API_URL}/api/bids/${bidDocId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: { bid_status: "rejected" } }),
      });
      fetchBidsForRequest(requestId);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAcceptBid = async (bidId) => {
    const token = getToken();
    const requestId = Object.keys(bidsMap).find((rid) =>
      bidsMap[rid].some((b) => b.id === bidId),
    );
    if (!requestId) return;
    const bid = bidsMap[requestId].find((b) => b.id === bidId);
    const bidDocId = a(bid).documentId;
    const requestDocId = a(
      activeRequests.find((r) => r.id == requestId),
    ).documentId;
    try {
      await fetch(`${API_URL}/api/bids/${bidDocId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: { bid_status: "accepted" } }),
      });

      const otherPendingBids = bidsMap[requestId].filter(
        (b) => b.id !== bidId && a(b).bid_status === "pending",
      );
      await Promise.all(
        otherPendingBids.map((b) =>
          fetch(`${API_URL}/api/bids/${a(b).documentId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ data: { bid_status: "rejected" } }),
          }),
        ),
      );

      await fetch(`${API_URL}/api/service-requests/${requestDocId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: { service_status: "in_progress" } }),
      });

      fetchBidsForRequest(requestId);
      fetchActiveRequests();
    } catch (e) {
      console.error(e);
    }
  };
  if (loading)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-9 h-9 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pt-8 font-sans antialiased">
      {activeRequests.length > 0 ? (
        <div className="max-w-6xl mx-auto px-6 pb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                My Requests
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                {activeRequests.length} active request
                {activeRequests.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              + New Request
            </button>
          </div>
          {(() => {
            const totalPages = Math.ceil(
              activeRequests.length / REQUESTS_PER_PAGE,
            );
            const paginated = activeRequests.slice(
              (currentPage - 1) * REQUESTS_PER_PAGE,
              currentPage * REQUESTS_PER_PAGE,
            );
            return (
              <>
                {paginated.map((req) => (
                  <ActiveRequestPanel
                    key={req.id}
                    request={req}
                    bids={bidsMap[req.id] || []}
                    onAcceptBid={handleAcceptBid}
                    onRejectBid={handleRejectBid}
                    onDelete={handleDeleteRequest}
                  />
                ))}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6 mb-4">
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
        </div>
      ) : (
        <ServiceHero onOpenForm={() => setShowForm(true)} />
      )}
      {activeRequests.length > 0 && (
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-6 right-6 z-40 bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3.5 rounded-full shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 transition-all text-sm"
        >
          + New Request
        </button>
      )}
      {showForm && (
        <RequestFormModal
          onClose={() => setShowForm(false)}
          onSuccess={handleRequestSuccess}
        />
      )}
    </div>
  );
}
