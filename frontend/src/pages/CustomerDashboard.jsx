import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import ChatBox from "../components/ChatBox";
import ProviderProfilePage from "./ProviderProfile.";

const BASE_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";
const getToken = () => localStorage.getItem("token");
const getUser = () => JSON.parse(localStorage.getItem("user") || "{}");

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const providerIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const customerIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 14);
  }, [lat, lng]);
  return null;
};

// ─── Review Modal ─────────────────────────────────────────────────────────────
function ReviewModal({ request, onClose, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const acceptedBid = request.bids?.find((b) => b.bid_status === "accepted");
  const providerProfile = acceptedBid?.provider?.provider_profile;
  const providerProfileDocId = providerProfile?.documentId;

  const handleSubmit = async () => {
    if (!rating) {
      setError("Please select a rating.");
      return;
    }
    if (!comment.trim()) {
      setError("Please write a comment.");
      return;
    }
    if (!providerProfileDocId) {
      setError("Could not find provider profile.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const token = getToken();
      const user = getUser();

      const reviewRes = await fetch(`${BASE_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            rating,
            comment,
            customer: user?.id,
            provider_profile: providerProfileDocId,
            service_request: request.documentId,
          },
        }),
      });
      if (!reviewRes.ok) {
        const e = await reviewRes.json();
        throw new Error(e?.error?.message || "Failed to submit review");
      }

      // Recalculate average rating
      const allRevRes = await fetch(
        `${BASE_URL}/api/reviews?filters[provider_profile][documentId][$eq]=${providerProfileDocId}&fields[0]=rating`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const allRevData = await allRevRes.json();
      const allRatings = allRevData?.data ?? [];
      const newAvg =
        allRatings.reduce((sum, r) => sum + (r.rating || 0), 0) /
        allRatings.length;

      await fetch(`${BASE_URL}/api/provider-profiles/${providerProfileDocId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: { rating: parseFloat(newAvg.toFixed(1)) },
        }),
      });

      onSubmitted();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-7">
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Rate your experience
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          How was your service:{" "}
          <span className="font-medium text-gray-600">{request.title}</span>?
        </p>

        <div className="flex justify-center gap-3 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="transition-transform hover:scale-110"
            >
              <svg
                className={`w-10 h-10 transition-colors ${(hovered || rating) >= star ? "text-amber-400" : "text-gray-200"}`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.499z" />
              </svg>
            </button>
          ))}
        </div>

        {rating > 0 && (
          <p className="text-center text-sm font-semibold text-blue-600 mb-4">
            {ratingLabels[rating]}
          </p>
        )}

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 placeholder-gray-400 resize-none h-24"
          placeholder="Share your experience with this provider..."
        />

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 text-xs text-red-600 mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors"
          >
            Skip
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-[2] bg-blue-500 hover:bg-blue-600 disabled:opacity-70 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Status Steps ─────────────────────────────────────────────────────────────
const StatusSteps = ({ status }) => {
  const steps = [
    { key: "pending", label: "Booked", icon: "📋" },
    { key: "in_progress", label: "In Progress", icon: "🔧" },
    {
      key: "awaiting_confirmation",
      label: "Awaiting Confirmation",
      icon: "⏳",
    },
    { key: "completed", label: "Completed", icon: "✅" },
  ];
  const currentIndex = steps.findIndex((s) => s.key === status);

  return (
    <div className="px-6 py-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">
        Job Progress
      </p>
      <div className="flex items-start justify-between w-full">
        {steps.map((step, i) => (
          <div key={step.key} className="flex-1 flex items-start">
            <div className="flex flex-col items-center w-full">
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center text-base font-bold border-2 transition-all duration-300 shadow-sm ${
                  i < currentIndex
                    ? "bg-blue-500 border-blue-500 text-white"
                    : i === currentIndex
                      ? "bg-white border-blue-500 text-blue-500 ring-4 ring-blue-100"
                      : "bg-white border-gray-200 text-gray-300"
                }`}
              >
                {i < currentIndex ? "✓" : step.icon}
              </div>
              <span
                className={`text-xs mt-3 font-semibold text-center leading-tight px-1 ${
                  i === currentIndex
                    ? "text-blue-600"
                    : i < currentIndex
                      ? "text-gray-500"
                      : "text-gray-300"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-0.5 mt-5 mx-1 rounded-full overflow-hidden bg-gray-200">
                <div
                  className={`h-full bg-blue-500 transition-all duration-500 ${i < currentIndex ? "w-full" : "w-0"}`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Tracking Page ─────────────────────────────────────────────────────────────
const TrackingPage = ({ request, onBack }) => {
  const [liveRequest, setLiveRequest] = useState(request);
  const pollRef = useRef(null);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/service-requests/${request.documentId}?populate=*`,
          { headers: { Authorization: `Bearer ${getToken()}` } },
        );
        const data = await res.json();
        if (data.data) setLiveRequest(data.data);
      } catch (err) {
        console.error(err);
      }
    };
    poll();
    pollRef.current = setInterval(poll, 8000);
    return () => clearInterval(pollRef.current);
  }, [request.documentId]);

  const providerLat = liveRequest.provider_lat;
  const providerLng = liveRequest.provider_lng;
  const hasProviderLocation = providerLat && providerLng;
  const customerLat = liveRequest.customer_lat;
  const customerLng = liveRequest.customer_lng;
  const hasCustomerLocation = customerLat && customerLng;

  const mapCenter = hasProviderLocation
    ? { lat: providerLat, lng: providerLng }
    : hasCustomerLocation
      ? { lat: customerLat, lng: customerLng }
      : { lat: 27.7172, lng: 85.324 };

  const providerName =
    liveRequest.bids?.find((b) => b.bid_status === "accepted")?.provider
      ?.username ?? "Provider";

  const statusColors = {
    pending: "bg-amber-50 text-amber-600 border border-amber-200",
    in_progress: "bg-blue-50 text-blue-600 border border-blue-200",
    awaiting_confirmation:
      "bg-violet-50 text-violet-600 border border-violet-200",
    completed: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition font-medium"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Bookings
          </button>
          <div className="h-5 w-px bg-gray-200" />
          <div>
            <h1 className="text-sm font-semibold text-gray-800">
              {liveRequest.title}
            </h1>
            <p className="text-xs text-gray-400">Live Tracking</p>
          </div>
          <div className="ml-auto">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[liveRequest.service_status] ?? "bg-gray-100 text-gray-500"}`}
            >
              {liveRequest.service_status?.replace(/_/g, " ").toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <StatusSteps status={liveRequest.service_status} />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-800">
                Live Location
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Provider:{" "}
                <span className="font-medium text-gray-600">
                  {providerName}
                </span>
              </p>
            </div>
            {hasProviderLocation ? (
              <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />{" "}
                Live
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium bg-gray-50 border border-gray-200 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />{" "}
                Awaiting provider
              </span>
            )}
          </div>

          <div style={{ height: "380px" }}>
            <MapContainer
              center={[mapCenter.lat, mapCenter.lng]}
              zoom={14}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <RecenterMap lat={mapCenter.lat} lng={mapCenter.lng} />
              {hasCustomerLocation && (
                <Marker
                  position={[customerLat, customerLng]}
                  icon={customerIcon}
                >
                  <Popup>📍 Service Location</Popup>
                </Marker>
              )}
              {hasProviderLocation && (
                <Marker
                  position={[providerLat, providerLng]}
                  icon={providerIcon}
                >
                  <Popup>🔧 {providerName}</Popup>
                </Marker>
              )}
            </MapContainer>
          </div>

          <div className="px-6 py-3 border-t border-gray-100 flex gap-5 text-xs text-gray-500 bg-gray-50">
            {hasCustomerLocation && (
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />{" "}
                Service Location
              </span>
            )}
            {hasProviderLocation && (
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />{" "}
                Provider Location
              </span>
            )}
            {!hasCustomerLocation && !hasProviderLocation && (
              <span className="text-gray-400 italic">
                No location data available
              </span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-5 uppercase tracking-wide">
            Job Details
          </h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-5 text-sm">
            {[
              { label: "Service", value: liveRequest.title },
              { label: "Category", value: liveRequest.category },
              { label: "Location", value: liveRequest.location || "—" },
              {
                label: "Preferred Date",
                value: liveRequest.preferred_date
                  ? new Date(liveRequest.preferred_date).toLocaleDateString(
                      "en-US",
                      { dateStyle: "medium" },
                    )
                  : "—",
              },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                  {label}
                </p>
                <p className="font-medium text-gray-800 capitalize">{value}</p>
              </div>
            ))}
          </div>
        </div>
        <ChatBox requestId={liveRequest.documentId} currentUser={getUser()} />
      </div>
    </div>
  );
};

// ─── Booking Card ─────────────────────────────────────────────────────────────
const BookingCard = ({
  request,
  onTrack,
  onConfirmCompletion,
  onViewProfile,
}) => {
  const acceptedBid = request.bids?.find((b) => b.bid_status === "accepted");
  const provider = acceptedBid?.provider;
  const navigate = useNavigate();

  const statusBadgeColor = {
    pending: "text-yellow-600 bg-yellow-50 border-yellow-200",
    in_progress: "text-blue-600 bg-blue-50 border-blue-200",
    awaiting_confirmation: "text-purple-600 bg-purple-50 border-purple-200",
    completed: "text-green-600 bg-green-50 border-green-200",
  };

  const statusLabel = {
    pending: "Waiting for Bids",
    in_progress: "In Progress",
    awaiting_confirmation: "Awaiting Your Confirmation",
    completed: "Completed",
  };

  return (
    <div
      className={`bg-white rounded-2xl border shadow-sm p-5 transition-all ${
        request.service_status === "awaiting_confirmation"
          ? "border-purple-200 shadow-purple-100"
          : "border-gray-100"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
            🔧
          </div>
          <div>
            <p className="font-semibold text-gray-800">{request.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Provider:{" "}
              {provider ? (
                <button
                  onClick={() =>
                    onViewProfile &&
                    onViewProfile({
                      providerUserId: provider.id,
                      username: provider.username,
                    })
                  }
                  className="font-semibold text-blue-600 hover:underline"
                >
                  {provider.username}
                </button>
              ) : (
                <span className="font-medium text-gray-700">
                  Awaiting acceptance
                </span>
              )}
              {request.preferred_date && (
                <>
                  {" "}
                  —{" "}
                  {new Date(request.preferred_date).toLocaleDateString(
                    "en-US",
                    { dateStyle: "medium" },
                  )}
                </>
              )}
            </p>
            {request.location && (
              <p className="text-xs text-gray-400 mt-0.5">
                📍 {request.location}
              </p>
            )}
          </div>
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusBadgeColor[request.service_status] ?? "text-gray-500 bg-gray-50 border-gray-200"}`}
        >
          {statusLabel[request.service_status] ?? request.service_status}
        </span>
      </div>

      {request.service_status === "awaiting_confirmation" && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-3">
          <p className="text-sm font-semibold text-purple-800 mb-1">
            🔔 Provider has marked this job as complete
          </p>
          <p className="text-xs text-purple-600 mb-3">
            Please confirm the work is done to finalize the booking.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onConfirmCompletion(request)}
              className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition"
            >
              ✅ Confirm Completion
            </button>
            <button
              onClick={() => onTrack(request)}
              className="px-4 py-2 border border-purple-200 text-purple-700 text-sm font-medium rounded-xl hover:bg-purple-100 transition"
            >
              View Details
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {request.service_status === "in_progress" && (
          <button
            onClick={() => onTrack(request)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition"
          >
            Track Provider
          </button>
        )}
        {request.service_status === "pending" && (
          <button
            onClick={() => navigate("/services")}
            className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition"
          >
            View Bids
          </button>
        )}
        <button
          onClick={() => onTrack(request)}
          className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition"
        >
          Message
        </button>
      </div>
    </div>
  );
};

// ─── Main Customer Dashboard ──────────────────────────────────────────────────
export default function CustomerDashboard() {
  const [view, setView] = useState("dashboard");
  const [trackingRequest, setTrackingRequest] = useState(null);
  const [activeRequests, setActiveRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewRequest, setReviewRequest] = useState(null);
  const [showProfile, setShowProfile] = useState(null);
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [activeRes, completedRes, bidsRes] = await Promise.all([
        fetch(
          `${BASE_URL}/api/service-requests?filters[customer][id][$eq]=${user.id}&filters[service_status][$in][0]=pending&filters[service_status][$in][1]=in_progress&filters[service_status][$in][2]=awaiting_confirmation&populate=*&sort=createdAt:desc`,
          { headers: { Authorization: `Bearer ${getToken()}` } },
        ),
        fetch(
          `${BASE_URL}/api/service-requests?filters[customer][id][$eq]=${user.id}&filters[service_status][$eq]=completed&populate=*&sort=createdAt:desc`,
          { headers: { Authorization: `Bearer ${getToken()}` } },
        ),
        fetch(
          `${BASE_URL}/api/bids?filters[bid_status][$eq]=accepted&populate=*`,
          { headers: { Authorization: `Bearer ${getToken()}` } },
        ),
      ]);

      const activeData = await activeRes.json();
      const completedData = await completedRes.json();
      const bidsData = await bidsRes.json();
      const allBids = bidsData.data || [];

      // Get all provider user IDs from accepted bids
      const providerUserIds = [
        ...new Set(allBids.map((bid) => bid.provider?.id).filter(Boolean)),
      ];

      // Fetch provider profiles by user ID
      if (providerUserIds.length > 0) {
        const profilesRes = await fetch(
          `${BASE_URL}/api/provider-profiles?${providerUserIds.map((id) => `filters[user][id][$in]=${id}`).join("&")}&populate=*`,
          { headers: { Authorization: `Bearer ${getToken()}` } },
        );
        const profilesData = await profilesRes.json();
        const profiles = profilesData.data || [];

        // Attach profile to each bid's provider
        allBids.forEach((bid) => {
          if (bid.provider) {
            bid.provider.provider_profile = profiles.find(
              (p) => p.user?.id === bid.provider.id,
            );
          }
        });
      }

      const attachBids = (requests) =>
        requests.map((req) => ({
          ...req,
          bids: allBids.filter(
            (bid) => bid.service_request?.documentId === req.documentId,
          ),
        }));

      setActiveRequests(attachBids(activeData.data || []));
      setCompletedRequests(attachBids(completedData.data || []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const confirmCompletion = async (req) => {
    try {
      await fetch(`${BASE_URL}/api/service-requests/${req.documentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ data: { service_status: "completed" } }),
      });
      fetchData();
      setReviewRequest(req);
    } catch (err) {
      console.error(err);
    }
  };

  const totalSpent = completedRequests.reduce((sum, req) => {
    const acceptedBid = req.bids?.find((b) => b.bid_status === "accepted");
    return sum + (acceptedBid?.amount ?? 0);
  }, 0);

  const openTracking = (req) => {
    setTrackingRequest(req);
    setView("tracking");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );

  if (view === "tracking" && trackingRequest) {
    return (
      <TrackingPage
        request={trackingRequest}
        onBack={() => {
          setView("dashboard");
          fetchData();
        }}
      />
    );
  }

  const awaitingCount = activeRequests.filter(
    (r) => r.service_status === "awaiting_confirmation",
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">
              Active Bookings
            </p>
            <p className="text-3xl font-bold text-gray-800">
              {activeRequests.length}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">
              Total Spent
            </p>
            <p className="text-3xl font-bold text-gray-800">
              Rs. {totalSpent.toLocaleString()}
            </p>
            <p className="text-xs text-green-600 mt-1">
              {completedRequests.length} job
              {completedRequests.length !== 1 ? "s" : ""} completed
            </p>
          </div>
          <div
            className={`rounded-2xl shadow-sm border p-5 ${awaitingCount > 0 ? "bg-purple-50 border-purple-200" : "bg-white border-gray-100"}`}
          >
            <p
              className={`text-xs uppercase tracking-wide font-medium mb-1 ${awaitingCount > 0 ? "text-purple-500" : "text-gray-400"}`}
            >
              Awaiting Confirmation
            </p>
            <p
              className={`text-3xl font-bold ${awaitingCount > 0 ? "text-purple-700" : "text-gray-800"}`}
            >
              {awaitingCount}
            </p>
            {awaitingCount > 0 && (
              <p className="text-xs text-purple-500 mt-1">Action required</p>
            )}
          </div>
        </div>

        {/* Active Bookings */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              Current Bookings
            </h2>
            <button
              onClick={() => navigate("/services")}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition"
            >
              + New Booking
            </button>
          </div>

          {activeRequests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
              <p className="text-4xl mb-3">📋</p>
              <p className="font-medium">No active bookings</p>
              <p className="text-sm mt-1">
                Post a service request to get started
              </p>
              <button
                onClick={() => navigate("/services")}
                className="mt-4 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition"
              >
                Book a Service
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {activeRequests.map((req) => (
                <BookingCard
                  key={req.documentId}
                  request={req}
                  onTrack={openTracking}
                  onConfirmCompletion={confirmCompletion}
                  onViewProfile={setShowProfile}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-base font-bold text-gray-800 mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/services")}
              className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition"
            >
              Book New Service
            </button>
            <button
              onClick={() => navigate("/register?role=provider")}
              className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition"
            >
              Become a Provider
            </button>
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition"
            >
              Download Receipts
            </button>
          </div>
        </div>

        {/* Service History */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-5">
            Service History
          </h2>
          {completedRequests.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              No completed services yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                    <th className="pb-3 font-medium">Service</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Provider</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {completedRequests.map((req) => {
                    const acceptedBid = req.bids?.find(
                      (b) => b.bid_status === "accepted",
                    );
                    const provider = acceptedBid?.provider;
                    return (
                      <tr
                        key={req.documentId}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="py-4 font-medium text-gray-800">
                          {req.title}
                        </td>
                        <td className="py-4 text-gray-500">
                          {req.preferred_date
                            ? new Date(req.preferred_date).toLocaleDateString(
                                "en-US",
                                { dateStyle: "medium" },
                              )
                            : new Date(req.createdAt).toLocaleDateString(
                                "en-US",
                                { dateStyle: "medium" },
                              )}
                        </td>
                        <td className="py-4">
                          {provider ? (
                            <button
                              onClick={() =>
                                setShowProfile({
                                  providerUserId: provider.id,
                                  username: provider.username,
                                })
                              }
                              className="text-blue-600 hover:underline font-medium"
                            >
                              {provider.username}
                            </button>
                          ) : (
                            <span className="text-gray-500">—</span>
                          )}
                        </td>
                        <td className="py-4 text-gray-700 font-medium">
                          {acceptedBid
                            ? `Rs. ${acceptedBid.amount?.toLocaleString()}`
                            : "—"}
                        </td>
                        <td className="py-4">
                          <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                            COMPLETED
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => openTracking(req)}
                              className="text-blue-600 hover:text-blue-800 font-medium transition"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => setReviewRequest(req)}
                              className="text-amber-500 hover:text-amber-700 font-medium transition"
                            >
                              ⭐ Review
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
      </div>

      {/* Modals */}
      {reviewRequest && (
        <ReviewModal
          request={reviewRequest}
          onClose={() => setReviewRequest(null)}
          onSubmitted={() => {
            setReviewRequest(null);
            fetchData();
          }}
        />
      )}

      {showProfile && (
        <ProviderProfilePage
          providerUserId={showProfile.providerUserId}
          providerUsername={showProfile.username}
          onClose={() => setShowProfile(null)}
        />
      )}
    </div>
  );
}
