import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // adjust path if needed

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
      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
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
const LockIcon = ({ className }) => (
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
      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
    />
  </svg>
);

const categories = [
  { icon: WrenchIcon, label: "Plumbing", desc: "Pipes, leaks & fixtures" },
  { icon: BoltIcon, label: "Electrical", desc: "Wiring, boards & fittings" },
  { icon: SparklesIcon, label: "Cleaning", desc: "Deep & regular cleaning" },
  { icon: CpuIcon, label: "Appliance", desc: "Repair & installation" },
  { icon: PaintIcon, label: "Painting", desc: "Interior & exterior" },
];

const steps = [
  {
    Icon: ClipboardIcon,
    title: "Post a Request",
    step: "01",
    desc: "Describe your problem and set a suggested budget. Takes less than 2 minutes.",
  },
  {
    Icon: CurrencyIcon,
    title: "Receive Bids",
    step: "02",
    desc: "Verified professionals nearby send you competitive offers within minutes.",
  },
  {
    Icon: ChatIcon,
    title: "Choose & Confirm",
    step: "03",
    desc: "Review ratings, chat with the pro, and accept the offer that suits you best.",
  },
];

const testimonials = [
  {
    stars: 5,
    text: "I love being able to see multiple bids. I saved Rs. 300 on my AC repair compared to going directly to local shops.",
    name: "Swagata Poudel",
    role: "Homeowner, Kathmandu",
  },
  {
    stars: 5,
    text: "The bidding process is incredibly fast. I posted about a leak at 10:00 AM and had someone fixing it by 10:45.",
    name: "Kalpa Jung Kunwar",
    role: "Homeowner, Pokhara",
  },
];

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";

async function fetchLiveRequests() {
  const res = await fetch(
    `${STRAPI_URL}/api/service-requests?populate=bids&fields[0]=title&fields[1]=category&fields[2]=service_status&fields[3]=suggested_budget&sort=createdAt:desc&pagination[limit]=3`,
    { headers: { "Content-Type": "application/json" } },
  );
  if (!res.ok) throw new Error("Failed to fetch");
  const json = await res.json();
  return json.data.map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    service_status: item.service_status,
    suggested_budget: item.suggested_budget,
    bids: Array.isArray(item.bids) ? item.bids : (item.bids?.data ?? []),
  }));
}

const statusConfig = {
  pending: {
    label: "Open for Bids",
    cls: "bg-blue-50 text-blue-600 border-blue-100",
  },
  in_progress: {
    label: "In Progress",
    cls: "bg-amber-50 text-amber-600 border-amber-100",
  },
  accepted: {
    label: "Accepted",
    cls: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  rejected: { label: "Rejected", cls: "bg-red-50 text-red-500 border-red-100" },
};

const categoryIcons = {
  Plumbing: WrenchIcon,
  Electrical: BoltIcon,
  Cleaning: SparklesIcon,
  Appliance: CpuIcon,
  Painting: PaintIcon,
};

function LiveMarketplace({ isLoggedIn }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setRefreshing(true);
      try {
        const data = await fetchLiveRequests();
        if (!cancelled && data.length > 0) setRequests(data);
      } catch {
        // silently fail
      } finally {
        if (!cancelled) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    };
    load();
    const interval = setInterval(load, 15_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const avgBid = (bids) =>
    bids.length
      ? Math.round(bids.reduce((s, b) => s + (b.amount || 0), 0) / bids.length)
      : null;

  return (
    <div className="w-full md:w-80 bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex-shrink-0">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold text-gray-900 text-sm tracking-tight">
          Live Marketplace
        </h3>
        <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
          <span
            className={`w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block ${refreshing ? "animate-ping" : "animate-pulse"}`}
          />
          {refreshing ? "Updating..." : "Live"}
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-4">Recent requests &amp; bids</p>

      <div className="relative min-h-[170px]">
        <div
          className={`space-y-3 transition-all duration-200 ${!isLoggedIn ? "blur-sm pointer-events-none select-none" : ""}`}
        >
          {loading
            ? [1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-1" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              ))
            : requests.map((r) => {
                const Icon = categoryIcons[r.category] || WrenchIcon;
                const avg = avgBid(r.bids);
                const hasAcceptedBid = r.bids.some(
                  (b) => b.bid_status === "accepted",
                );
                const status = hasAcceptedBid
                  ? statusConfig.accepted
                  : statusConfig[r.service_status] || statusConfig.pending;
                return (
                  <div
                    key={r.id}
                    className="flex items-start justify-between gap-3 border-b border-gray-50 pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 leading-tight">
                          {r.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {hasAcceptedBid
                            ? `Won at Rs. ${Math.min(...r.bids.filter((b) => b.bid_status === "accepted").map((b) => b.amount))}`
                            : r.bids.length > 0
                              ? `${r.bids.length} bid${r.bids.length > 1 ? "s" : ""} · Avg Rs. ${avg}`
                              : `Budget Rs. ${r.suggested_budget}`}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full border whitespace-nowrap flex-shrink-0 ${status.cls}`}
                    >
                      {status.label}
                    </span>
                  </div>
                );
              })}
        </div>

        {!isLoggedIn && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
              <LockIcon className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-800 leading-tight">
                Sign in to view live bids
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                See real-time requests from your area
              </p>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Log in
            </button>
          </div>
        )}
      </div>

      {isLoggedIn && (
        <Link
          to="/services"
          className="block mt-4 text-center bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-medium py-2 rounded-lg transition"
        >
          Explore Marketplace →
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const isLoggedIn = !!user;

  // Redirect admins and providers to their own dashboards
  useEffect(() => {
    if (user?.roleType === "admin") navigate("/admin", { replace: true });
    else if (user?.roleType === "provider")
      navigate("/providerdashboard", { replace: true });
  }, [user, navigate]);

  const authNavigate = (path, options) => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: path } });
    } else {
      navigate(path, options);
    }
  };

  const handlePost = () => {
    authNavigate("/services", query.trim() ? { state: { query } } : undefined);
  };

  return (
    <div className="bg-gray-50 font-sans antialiased">
      {/* ── Hero ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-1.5 text-xs bg-blue-50 text-blue-600 font-medium px-3 py-1 rounded-full mb-5 border border-blue-100">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Competitive bidding — you set the price
            </span>

            <h1 className="text-4xl md:text-[2.85rem] font-extrabold text-gray-900 leading-[1.15] tracking-tight mb-4">
              Expert home services,{" "}
              <span className="text-blue-500">on your terms.</span>
            </h1>
            <p className="text-gray-500 text-base mb-7 max-w-md leading-relaxed">
              Post your task, receive competitive bids from verified
              professionals, and choose the offer that fits your budget — no
              haggling needed.
            </p>

            <div className="flex gap-2 max-w-lg">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePost()}
                placeholder="What do you need help with? e.g. Broken pipe"
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-50 placeholder-gray-400"
              />
              <button
                onClick={handlePost}
                className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-colors whitespace-nowrap"
              >
                Post Request
              </button>
            </div>

            <div className="flex flex-wrap gap-5 mt-7">
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
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700 leading-tight">
                      {label}
                    </p>
                    <p className="text-xs text-gray-400">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <LiveMarketplace isLoggedIn={isLoggedIn} />
        </div>
      </section>

      {/* ── How it Works ── */}
      <section className="py-16 max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-2">
            Simple Process
          </p>
          <h2 className="text-2xl font-bold text-gray-900">
            How FixItNow works
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-gray-100 via-blue-200 to-gray-100" />
          {steps.map(({ Icon, title, step, desc }) => (
            <div
              key={step}
              className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center group hover:shadow-md hover:border-blue-100 transition-all duration-200"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-full px-2.5 py-0.5 text-xs font-bold text-gray-400 group-hover:text-blue-500 group-hover:border-blue-200 transition-colors">
                {step}
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors mt-2">
                <Icon className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2 text-sm">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="bg-white border-y border-gray-100 py-14">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-1">
                Services
              </p>
              <h2 className="text-2xl font-bold text-gray-900">
                Browse by category
              </h2>
            </div>
            <button
              onClick={() => authNavigate("/services")}
              className="hidden md:flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors"
            >
              View all <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map(({ icon: Icon, label, desc }) => (
              <button
                key={label}
                onClick={() =>
                  authNavigate("/services", { state: { category: label } })
                }
                className="group flex items-center gap-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-xl px-5 py-4 transition-all duration-150"
              >
                <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 group-hover:border-blue-200 group-hover:bg-blue-50 flex items-center justify-center transition-colors shadow-sm">
                  <Icon className="w-[18px] h-[18px] text-gray-500 group-hover:text-blue-500 transition-colors" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm text-gray-700 group-hover:text-blue-700 transition-colors leading-tight">
                    {label}
                  </p>
                  <p className="text-xs text-gray-400 group-hover:text-blue-400 transition-colors">
                    {desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-14 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "2,400+", label: "Jobs completed" },
            { value: "380+", label: "Verified professionals" },
            { value: "4.8/5", label: "Average rating" },
            { value: "< 15 min", label: "First bid received" },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm text-center"
            >
              <p className="text-2xl font-extrabold text-gray-900 tracking-tight">
                {value}
              </p>
              <p className="text-xs text-gray-400 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="bg-white border-y border-gray-100 py-14">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-1">
              Reviews
            </p>
            <h2 className="text-2xl font-bold text-gray-900">
              What our customers say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-sm transition-shadow"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <StarIcon
                        key={i}
                        filled={i < t.stars}
                        className="w-4 h-4 text-amber-400"
                      />
                    ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-gray-800 font-semibold text-sm leading-tight">
                      {t.name}
                    </p>
                    <p className="text-gray-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-blue-500 py-14">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">
            Ready to get started?
          </h2>
          <p className="text-blue-100 text-sm mb-7 max-w-md mx-auto leading-relaxed">
            Post your first request for free and receive competitive bids from
            verified professionals within minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => authNavigate("/services")}
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 font-bold px-7 py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm"
            >
              Post a Request
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
