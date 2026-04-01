import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/admin/StatCard";
import DonutChart from "../components/admin/DonutChart";
import RecentTable from "../components/admin/RecentTable";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:1337/api";
const MEDIA_URL = BASE_URL.replace("/api", "");

const badge = (label, color) => (
  <span
    style={{
      background: color + "22",
      color,
      borderRadius: 6,
      padding: "2px 8px",
      fontSize: 11,
      fontWeight: 600,
    }}
  >
    {label}
  </span>
);

const statusColor = {
  open: "#6366f1",
  in_progress: "#f59e0b",
  completed: "#22c55e",
  cancelled: "#ef4444",
  pending: "#f59e0b",
  accepted: "#22c55e",
  rejected: "#ef4444",
};

const roleColor = {
  customer: "#6366f1",
  provider: "#22c55e",
  admin: "#f59e0b",
};

function fmt(date) {
  return date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";
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
    { id: "profile", label: "Profile & Docs", icon: "👤" },
    { id: "requests", label: "Service Requests", icon: "📋" },
    { id: "bids", label: "Bids", icon: "💰" },
    { id: "reviews", label: "Reviews", icon: "⭐" },
    { id: "messages", label: "Messages", icon: "💬" },
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
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000000cc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#1e1e2e",
          borderRadius: 16,
          width: "100%",
          maxWidth: 760,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          boxShadow: "0 24px 80px #00000088",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px 28px 0",
            borderBottom: "1px solid #2a2a3e",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 20,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                background: "#6366f1",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {user.username?.[0]?.toUpperCase() || "U"}
            </div>
            <div style={{ flex: 1, minWidth: 140 }}>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 17 }}>
                {user.username}
              </div>
              <div style={{ color: "#6b6b8a", fontSize: 13 }}>{user.email}</div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {badge(user.roleType, roleColor[user.roleType] || "#6366f1")}
              {localBlocked
                ? badge("blocked", "#ef4444")
                : badge("active", "#22c55e")}
              {localBlocked ? (
                <button
                  onClick={handleUnblock}
                  style={{
                    background: "#22c55e22",
                    color: "#22c55e",
                    border: "1px solid #22c55e44",
                    borderRadius: 8,
                    padding: "6px 14px",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  🔓 Unblock
                </button>
              ) : (
                <button
                  onClick={handleBlock}
                  style={{
                    background: "#f59e0b22",
                    color: "#f59e0b",
                    border: "1px solid #f59e0b44",
                    borderRadius: 8,
                    padding: "6px 14px",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  🔒 Block
                </button>
              )}
            </div>
            <button
              onClick={onClose}
              style={{
                background: "#2a2a3e",
                border: "none",
                color: "#fff",
                width: 32,
                height: 32,
                borderRadius: "50%",
                cursor: "pointer",
                fontSize: 16,
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 2, overflowX: "auto" }}>
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  padding: "9px 16px",
                  border: "none",
                  cursor: "pointer",
                  background: "transparent",
                  fontSize: 13,
                  fontWeight: 600,
                  color: activeTab === t.id ? "#6366f1" : "#6b6b8a",
                  borderBottom:
                    activeTab === t.id
                      ? "2px solid #6366f1"
                      : "2px solid transparent",
                  borderRadius: "4px 4px 0 0",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
          {detailLoading ? (
            <div style={{ textAlign: "center", padding: 60, color: "#6b6b8a" }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  border: "3px solid #2a2a3e",
                  borderTop: "3px solid #6366f1",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  margin: "0 auto 12px",
                }}
              />
              Loading user details...
            </div>
          ) : !detail ? (
            <div style={{ textAlign: "center", padding: 60, color: "#ef4444" }}>
              Failed to load user details.
            </div>
          ) : (
            <>
              {/* PROFILE TAB */}
              {activeTab === "profile" && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(160px, 1fr))",
                      gap: 12,
                      background: "#13131f",
                      borderRadius: 12,
                      padding: 16,
                    }}
                  >
                    {[
                      ["Role", detail.user.roleType],
                      ["Approval", detail.user.approvalStatus],
                      ["Confirmed", detail.user.confirmed ? "Yes" : "No"],
                      ["Blocked", localBlocked ? "Yes" : "No"],
                      ["Joined", fmt(detail.user.createdAt)],
                      ["Rejection Reason", detail.user.rejectionReason || "—"],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <div
                          style={{
                            color: "#6b6b8a",
                            fontSize: 11,
                            marginBottom: 4,
                            fontWeight: 600,
                          }}
                        >
                          {label.toUpperCase()}
                        </div>
                        <div style={{ color: "#e0e0f0", fontSize: 13 }}>
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      color: "#e0e0f0",
                      fontWeight: 600,
                      fontSize: 14,
                      marginBottom: 4,
                    }}
                  >
                    Uploaded Documents (
                    {detail.user.documentations?.length || 0})
                  </div>

                  {!detail.user.documentations?.length ? (
                    <div
                      style={{
                        background: "#13131f",
                        borderRadius: 12,
                        padding: 24,
                        textAlign: "center",
                        color: "#ef4444",
                        fontSize: 13,
                      }}
                    >
                      ⚠️ No documents uploaded
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
                          style={{
                            background: "#13131f",
                            borderRadius: 12,
                            padding: 16,
                            border: "1px solid #2a2a3e",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: 12,
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  color: "#e0e0f0",
                                  fontWeight: 600,
                                  fontSize: 14,
                                }}
                              >
                                {doc.documentType === "citizenship" &&
                                  "🪪 Citizenship Certificate"}
                                {doc.documentType === "passport" &&
                                  "📘 Passport"}
                                {doc.documentType === "certificate" &&
                                  "📜 Professional Certificate"}
                              </div>
                              <div
                                style={{
                                  color: "#6b6b8a",
                                  fontSize: 11,
                                  marginTop: 2,
                                }}
                              >
                                {doc.file?.name || "Unknown file"}
                              </div>
                            </div>
                            {badge(
                              doc.approvalStatus || "pending",
                              statusColor[doc.approvalStatus] || "#f59e0b",
                            )}
                          </div>
                          {isImage && fileUrl && (
                            <img
                              src={fileUrl}
                              alt={doc.documentType}
                              style={{
                                width: "100%",
                                maxHeight: 260,
                                objectFit: "cover",
                                borderRadius: 8,
                                marginBottom: 12,
                                border: "1px solid #2a2a3e",
                              }}
                            />
                          )}
                          {isPdf && (
                            <div
                              style={{
                                background: "#2a2a3e",
                                borderRadius: 8,
                                padding: "12px 16px",
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                marginBottom: 12,
                              }}
                            >
                              <span style={{ fontSize: 24 }}>📄</span>
                              <div>
                                <div style={{ color: "#e0e0f0", fontSize: 13 }}>
                                  PDF Document
                                </div>
                                <div style={{ color: "#6b6b8a", fontSize: 11 }}>
                                  Click below to open
                                </div>
                              </div>
                            </div>
                          )}
                          {fileUrl && (
                            <div style={{ display: "flex", gap: 8 }}>
                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  flex: 1,
                                  background: "#6366f122",
                                  color: "#6366f1",
                                  border: "1px solid #6366f144",
                                  borderRadius: 8,
                                  padding: "8px 12px",
                                  textAlign: "center",
                                  fontSize: 13,
                                  fontWeight: 600,
                                  textDecoration: "none",
                                }}
                              >
                                🔍 View Full Document
                              </a>

                              <a
                                href={fileUrl}
                                download
                                style={{
                                  background: "#2a2a3e",
                                  color: "#e0e0f0",
                                  border: "1px solid #3a3a4e",
                                  borderRadius: 8,
                                  padding: "8px 12px",
                                  textAlign: "center",
                                  fontSize: 13,
                                  fontWeight: 600,
                                  textDecoration: "none",
                                }}
                              >
                                ⬇️
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* SERVICE REQUESTS TAB */}
              {activeTab === "requests" && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {!detail.serviceRequests?.length ? (
                    <div
                      style={{
                        background: "#13131f",
                        borderRadius: 12,
                        padding: 48,
                        textAlign: "center",
                        color: "#6b6b8a",
                        fontSize: 13,
                      }}
                    >
                      No service requests found.
                    </div>
                  ) : (
                    detail.serviceRequests.map((r) => (
                      <div
                        key={r.id}
                        style={{
                          background: "#13131f",
                          borderRadius: 12,
                          padding: 16,
                          border: "1px solid #2a2a3e",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 8,
                          }}
                        >
                          <div
                            style={{
                              color: "#e0e0f0",
                              fontWeight: 600,
                              fontSize: 14,
                            }}
                          >
                            {r.title || "—"}
                          </div>
                          {badge(
                            r.service_status,
                            statusColor[r.service_status] || "#6366f1",
                          )}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: 20,
                            flexWrap: "wrap",
                            marginBottom: r.description ? 8 : 0,
                          }}
                        >
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
                              <span style={{ color: "#6b6b8a", fontSize: 11 }}>
                                {label}:{" "}
                              </span>
                              <span style={{ color: "#c0c0d8", fontSize: 12 }}>
                                {val || "—"}
                              </span>
                            </div>
                          ))}
                        </div>
                        {r.description && (
                          <div style={{ color: "#6b6b8a", fontSize: 12 }}>
                            {r.description.slice(0, 140)}
                            {r.description.length > 140 ? "…" : ""}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* BIDS TAB */}
              {activeTab === "bids" && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {!detail.bids?.length ? (
                    <div
                      style={{
                        background: "#13131f",
                        borderRadius: 12,
                        padding: 48,
                        textAlign: "center",
                        color: "#6b6b8a",
                        fontSize: 13,
                      }}
                    >
                      No bids found.
                    </div>
                  ) : (
                    detail.bids.map((b) => (
                      <div
                        key={b.id}
                        style={{
                          background: "#13131f",
                          borderRadius: 12,
                          padding: 16,
                          border: "1px solid #2a2a3e",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 8,
                          }}
                        >
                          <div
                            style={{
                              color: "#e0e0f0",
                              fontWeight: 600,
                              fontSize: 14,
                            }}
                          >
                            {b.service_request?.title || "Unknown Request"}
                          </div>
                          {badge(
                            b.bid_status,
                            statusColor[b.bid_status] || "#6b6b8a",
                          )}
                        </div>
                        <div
                          style={{ display: "flex", gap: 20, flexWrap: "wrap" }}
                        >
                          {[
                            ["Amount", b.amount ? `Rs. ${b.amount}` : "—"],
                            ["Availability", b.availability],
                            ["Date", fmt(b.createdAt)],
                          ].map(([label, val]) => (
                            <div key={label}>
                              <span style={{ color: "#6b6b8a", fontSize: 11 }}>
                                {label}:{" "}
                              </span>
                              <span style={{ color: "#c0c0d8", fontSize: 12 }}>
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

              {/* REVIEWS TAB */}
              {activeTab === "reviews" && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {!detail.reviews?.length ? (
                    <div
                      style={{
                        background: "#13131f",
                        borderRadius: 12,
                        padding: 48,
                        textAlign: "center",
                        color: "#6b6b8a",
                        fontSize: 13,
                      }}
                    >
                      No reviews found.
                    </div>
                  ) : (
                    detail.reviews.map((r) => (
                      <div
                        key={r.id}
                        style={{
                          background: "#13131f",
                          borderRadius: 12,
                          padding: 16,
                          border: "1px solid #2a2a3e",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 8,
                          }}
                        >
                          <div style={{ color: "#f59e0b", fontSize: 18 }}>
                            {"⭐".repeat(
                              Math.min(Math.round(r.rating || 0), 5),
                            )}
                            <span
                              style={{
                                color: "#6b6b8a",
                                fontSize: 12,
                                marginLeft: 8,
                                fontFamily: "monospace",
                              }}
                            >
                              ({r.rating})
                            </span>
                          </div>
                          <div style={{ color: "#6b6b8a", fontSize: 12 }}>
                            {fmt(r.createdAt)}
                          </div>
                        </div>
                        {r.comment && (
                          <div
                            style={{
                              color: "#c0c0d8",
                              fontSize: 13,
                              marginBottom: 6,
                            }}
                          >
                            {r.comment}
                          </div>
                        )}
                        {r.provider_profile?.specialty && (
                          <div style={{ color: "#6b6b8a", fontSize: 11 }}>
                            Provider specialty: {r.provider_profile.specialty}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* MESSAGES TAB */}
              {activeTab === "messages" && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {!detail.messages?.length ? (
                    <div
                      style={{
                        background: "#13131f",
                        borderRadius: 12,
                        padding: 48,
                        textAlign: "center",
                        color: "#6b6b8a",
                        fontSize: 13,
                      }}
                    >
                      No messages found.
                    </div>
                  ) : (
                    detail.messages.map((m) => (
                      <div
                        key={m.id}
                        style={{
                          background: "#13131f",
                          borderRadius: 10,
                          padding: "12px 16px",
                          border: "1px solid #2a2a3e",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 6,
                          }}
                        >
                          <span
                            style={{
                              color: "#6366f1",
                              fontSize: 11,
                              fontWeight: 600,
                              textTransform: "uppercase",
                            }}
                          >
                            Sent
                          </span>
                          <span style={{ color: "#6b6b8a", fontSize: 11 }}>
                            {fmt(m.createdAt)}
                          </span>
                        </div>
                        <div style={{ color: "#c0c0d8", fontSize: 13 }}>
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
      console.error("Failed to fetch pending users", err);
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
      console.error("Failed to fetch users", err);
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
      // Update in allUsers list
      setAllUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, blocked: true } : u)),
      );
      // Update in pendingUsers list
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
      <div style={styles.centered}>
        <div style={styles.spinner} />
        <div
          style={{
            color: "#6b6b8a",
            marginTop: 16,
            fontFamily: "Inter, sans-serif",
          }}
        >
          Loading dashboard...
        </div>
      </div>
    );

  if (error)
    return (
      <div style={styles.centered}>
        <div style={{ fontSize: 40 }}>⚠️</div>
        <div
          style={{
            color: "#ef4444",
            marginTop: 12,
            fontFamily: "Inter, sans-serif",
          }}
        >
          {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          style={styles.retryBtn}
        >
          Retry
        </button>
      </div>
    );

  if (!stats) return null;

  const { users, serviceRequests, bids, messages, reviews, providers, recent } =
    stats;

  const tabs = [
    { id: "overview", label: "Overview", icon: "🏠" },
    { id: "requests", label: "Service Requests", icon: "📋" },
    { id: "bids", label: "Bids", icon: "💰" },
    { id: "activity", label: "Recent Activity", icon: "🕐" },
    { id: "approvals", label: "Pending Approvals", icon: "⏳" },
    { id: "users", label: "All Users", icon: "👥" },
  ];

  return (
    <div style={styles.page}>
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          token={token}
          onClose={() => setSelectedUser(null)}
          onBlock={handleBlockUser}
          onUnblock={handleUnblockUser}
        />
      )}

      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={{ padding: "28px 16px 20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 32,
            }}
          >
            <div style={styles.logo}>⚡</div>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>
              Admin Panel
            </span>
          </div>

          <div style={styles.adminBadge}>
            <div style={styles.adminAvatar}>
              {user?.username?.[0]?.toUpperCase() || "A"}
            </div>
            <div>
              <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>
                {user?.username || "Admin"}
              </div>
              <div style={{ color: "#6366f1", fontSize: 11 }}>
                Administrator
              </div>
            </div>
          </div>

          <nav style={{ marginTop: 24 }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  ...styles.navBtn,
                  background:
                    activeTab === tab.id ? "#6366f122" : "transparent",
                  color: activeTab === tab.id ? "#6366f1" : "#6b6b8a",
                  borderLeft:
                    activeTab === tab.id
                      ? "3px solid #6366f1"
                      : "3px solid transparent",
                }}
              >
                <span style={{ fontSize: 16 }}>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.id === "approvals" && pendingUsers.length > 0 && (
                  <span
                    style={{
                      marginLeft: "auto",
                      background: "#ef4444",
                      color: "#fff",
                      borderRadius: 10,
                      padding: "1px 7px",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {pendingUsers.length}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              textAlign: "left",
              padding: "10px 14px",
              border: "none",
              cursor: "pointer",
              borderRadius: 8,
              marginTop: 8,
              fontSize: 13,
              fontWeight: 500,
              background: "#ef444422",
              color: "#ef4444",
              borderLeft: "3px solid #ef4444",
            }}
          >
            <span style={{ fontSize: 16 }}>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={styles.main}>
        <div style={styles.header}>
          <div>
            <h1
              style={{
                color: "#fff",
                fontSize: 22,
                fontWeight: 700,
                margin: 0,
              }}
            >
              {tabs.find((t) => t.id === activeTab)?.label}
            </h1>
            <div style={{ color: "#6b6b8a", fontSize: 13, marginTop: 4 }}>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
          <div style={styles.liveBadge}>● Live</div>
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div style={styles.section}>
            <div style={styles.cardRow}>
              <StatCard
                title="Total Users"
                value={users.total}
                icon="👥"
                color="#6366f1"
                sub={`${users.customers} customers · ${users.providers} providers`}
              />
              <StatCard
                title="Service Requests"
                value={serviceRequests.total}
                icon="📋"
                color="#f59e0b"
                sub={`${serviceRequests.open} open · ${serviceRequests.completed} completed`}
              />
              <StatCard
                title="Total Bids"
                value={bids.total}
                icon="💰"
                color="#22c55e"
                sub={`${bids.accepted} accepted · ${bids.pending} pending`}
              />
              <StatCard
                title="Messages"
                value={messages.total}
                icon="💬"
                color="#3b82f6"
              />
            </div>
            <div style={styles.cardRow}>
              <StatCard
                title="Reviews"
                value={reviews.total}
                icon="⭐"
                color="#eab308"
                sub={`Avg rating: ${reviews.avgRating}`}
              />
              <StatCard
                title="Avg Provider Rating"
                value={providers.avgRating}
                icon="🏅"
                color="#ec4899"
              />
              <StatCard
                title="Admins"
                value={users.admins}
                icon="🛡️"
                color="#14b8a6"
              />
            </div>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
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

        {/* SERVICE REQUESTS */}
        {activeTab === "requests" && (
          <div style={styles.section}>
            <div style={styles.cardRow}>
              <StatCard
                title="Total"
                value={serviceRequests.total}
                icon="📋"
                color="#6366f1"
              />
              <StatCard
                title="Open"
                value={serviceRequests.open}
                icon="🟣"
                color="#6366f1"
              />
              <StatCard
                title="In Progress"
                value={serviceRequests.inProgress}
                icon="🟡"
                color="#f59e0b"
              />
              <StatCard
                title="Completed"
                value={serviceRequests.completed}
                icon="🟢"
                color="#22c55e"
              />
              <StatCard
                title="Cancelled"
                value={serviceRequests.cancelled}
                icon="🔴"
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
                badge(
                  r.service_status,
                  statusColor[r.service_status] || "#6366f1",
                ),
                r.suggested_budget ? `Rs. ${r.suggested_budget}` : "—",
                r.location || "—",
                r.customer?.username || "—",
                fmt(r.createdAt),
              ])}
            />
          </div>
        )}

        {/* BIDS */}
        {activeTab === "bids" && (
          <div style={styles.section}>
            <div style={styles.cardRow}>
              <StatCard
                title="Total Bids"
                value={bids.total}
                icon="💰"
                color="#22c55e"
              />
              <StatCard
                title="Pending"
                value={bids.pending}
                icon="⏳"
                color="#f59e0b"
              />
              <StatCard
                title="Accepted"
                value={bids.accepted}
                icon="✅"
                color="#22c55e"
              />
              <StatCard
                title="Rejected"
                value={bids.rejected}
                icon="❌"
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
                badge(b.bid_status, statusColor[b.bid_status] || "#6b6b8a"),
                b.service_request?.title || "—",
                b.availability || "—",
                fmt(b.createdAt),
              ])}
            />
          </div>
        )}

        {/* RECENT ACTIVITY */}
        {activeTab === "activity" && (
          <div style={styles.section}>
            <RecentTable
              title="Recent Users"
              columns={["Username", "Email", "Role", "Confirmed", "Joined"]}
              rows={recent.users.map((u) => [
                u.username || "—",
                u.email || "—",
                badge(u.roleType, roleColor[u.roleType] || "#6b6b8a"),
                u.confirmed ? badge("Yes", "#22c55e") : badge("No", "#ef4444"),
                fmt(u.createdAt),
              ])}
            />
            <RecentTable
              title="Recent Reviews"
              columns={["Customer", "Rating", "Comment", "Specialty", "Date"]}
              rows={recent.reviews.map((r) => [
                r.customer?.username || "—",
                "⭐".repeat(Math.min(Math.round(r.rating || 0), 5)),
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
                badge(b.bid_status, statusColor[b.bid_status] || "#6b6b8a"),
                b.service_request?.title || "—",
                fmt(b.createdAt),
              ])}
            />
          </div>
        )}

        {/* PENDING APPROVALS */}
        {activeTab === "approvals" && (
          <div style={styles.section}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                background: "#1e1e2e",
                borderRadius: 14,
                padding: "16px 24px",
              }}
            >
              <div style={{ color: "#e0e0f0", fontWeight: 700, fontSize: 16 }}>
                Pending Registrations
              </div>
              <div
                style={{
                  background: "#f59e0b22",
                  color: "#f59e0b",
                  borderRadius: 20,
                  padding: "3px 14px",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {pendingUsers.length} pending
              </div>
              <button
                onClick={fetchPendingUsers}
                style={{
                  marginLeft: "auto",
                  background: "#2a2a3e",
                  border: "none",
                  color: "#6b6b8a",
                  borderRadius: 8,
                  padding: "6px 14px",
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                🔄 Refresh
              </button>
            </div>

            {pendingLoading && (
              <div
                style={{ textAlign: "center", color: "#6b6b8a", padding: 40 }}
              >
                <div style={{ ...styles.spinner, margin: "0 auto 12px" }} />
                Loading pending users...
              </div>
            )}

            {!pendingLoading && pendingUsers.length === 0 && (
              <div
                style={{
                  background: "#1e1e2e",
                  borderRadius: 14,
                  padding: 48,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                <div
                  style={{ color: "#e0e0f0", fontWeight: 600, fontSize: 16 }}
                >
                  All caught up!
                </div>
                <div style={{ color: "#6b6b8a", fontSize: 13, marginTop: 6 }}>
                  No pending registrations at the moment.
                </div>
              </div>
            )}

            {pendingUsers.map((u) => (
              <div
                key={u.id}
                style={{
                  background: "#1e1e2e",
                  borderRadius: 14,
                  padding: 24,
                  border: "1px solid #2a2a3e",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 20,
                    flexWrap: "wrap",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 14,
                      }}
                    >
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: "50%",
                          background:
                            u.roleType === "provider" ? "#8b5cf6" : "#6366f1",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: 18,
                          flexShrink: 0,
                        }}
                      >
                        {u.username?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <div
                          style={{
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: 15,
                          }}
                        >
                          {u.username}
                        </div>
                        <div style={{ color: "#6b6b8a", fontSize: 12 }}>
                          {u.email}
                        </div>
                      </div>
                      {badge(u.roleType, roleColor[u.roleType] || "#6366f1")}
                    </div>

                    <div
                      style={{
                        background: "#13131f",
                        borderRadius: 10,
                        padding: 14,
                        marginBottom: 14,
                      }}
                    >
                      <div
                        style={{
                          color: "#6b6b8a",
                          fontSize: 11,
                          marginBottom: 8,
                          fontWeight: 600,
                        }}
                      >
                        UPLOADED DOCUMENTS ({u.documentations?.length || 0})
                      </div>
                      {!u.documentations || u.documentations.length === 0 ? (
                        <div style={{ color: "#ef4444", fontSize: 12 }}>
                          ⚠️ No documents uploaded
                        </div>
                      ) : (
                        u.documentations.map((doc) => (
                          <div
                            key={doc.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              marginBottom: 6,
                            }}
                          >
                            <span style={{ fontSize: 14 }}>
                              {doc.documentType === "citizenship" && "🪪"}
                              {doc.documentType === "passport" && "📘"}
                              {doc.documentType === "certificate" && "📜"}
                            </span>
                            <span
                              style={{
                                color: "#c0c0d8",
                                fontSize: 13,
                                textTransform: "capitalize",
                              }}
                            >
                              {doc.documentType}
                            </span>
                            <span style={{ color: "#6b6b8a", fontSize: 11 }}>
                              · {doc.file?.ext?.toUpperCase() || "FILE"}
                            </span>
                          </div>
                        ))
                      )}
                    </div>

                    <button
                      onClick={() => setSelectedUser(u)}
                      style={{
                        width: "100%",
                        background: "#6366f122",
                        color: "#6366f1",
                        border: "1px solid #6366f144",
                        borderRadius: 8,
                        padding: "9px 16px",
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      🔍 View Full Details & Documents
                    </button>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      minWidth: 200,
                    }}
                  >
                    <div
                      style={{
                        color: "#6b6b8a",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      ACTIONS
                    </div>
                    <button
                      onClick={() => handleApprove(u.id)}
                      disabled={actionLoading === u.id + "_approve"}
                      style={{
                        background: "#22c55e",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "11px 20px",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: 13,
                        opacity: actionLoading === u.id + "_approve" ? 0.6 : 1,
                      }}
                    >
                      {actionLoading === u.id + "_approve"
                        ? "Approving..."
                        : "✓ Approve Account"}
                    </button>

                    <div
                      style={{ borderTop: "1px solid #2a2a3e", paddingTop: 10 }}
                    >
                      <div
                        style={{
                          color: "#6b6b8a",
                          fontSize: 11,
                          marginBottom: 6,
                        }}
                      >
                        Rejection reason (optional)
                      </div>
                      <textarea
                        placeholder="e.g. Documents are unclear or expired..."
                        value={rejectReasons[u.id] || ""}
                        onChange={(e) =>
                          setRejectReasons({
                            ...rejectReasons,
                            [u.id]: e.target.value,
                          })
                        }
                        rows={3}
                        style={{
                          width: "100%",
                          background: "#13131f",
                          border: "1px solid #2a2a3e",
                          borderRadius: 8,
                          padding: "8px 12px",
                          color: "#e0e0f0",
                          fontSize: 12,
                          outline: "none",
                          resize: "vertical",
                          boxSizing: "border-box",
                        }}
                      />
                      <button
                        onClick={() => handleReject(u.id)}
                        disabled={actionLoading === u.id + "_reject"}
                        style={{
                          width: "100%",
                          background: "#ef4444",
                          color: "#fff",
                          border: "none",
                          borderRadius: 8,
                          padding: "11px 20px",
                          fontWeight: 600,
                          cursor: "pointer",
                          fontSize: 13,
                          marginTop: 8,
                          opacity: actionLoading === u.id + "_reject" ? 0.6 : 1,
                        }}
                      >
                        {actionLoading === u.id + "_reject"
                          ? "Rejecting..."
                          : "✗ Reject Account"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ALL USERS */}
        {activeTab === "users" && (
          <div style={styles.section}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                background: "#1e1e2e",
                borderRadius: 14,
                padding: "16px 24px",
              }}
            >
              <div style={{ color: "#e0e0f0", fontWeight: 700, fontSize: 16 }}>
                All Users
              </div>
              <div
                style={{
                  background: "#6366f122",
                  color: "#6366f1",
                  borderRadius: 20,
                  padding: "3px 14px",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {allUsers.length} users
              </div>
              <button
                onClick={fetchAllUsers}
                style={{
                  marginLeft: "auto",
                  background: "#2a2a3e",
                  border: "none",
                  color: "#6b6b8a",
                  borderRadius: 8,
                  padding: "6px 14px",
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                🔄 Refresh
              </button>
            </div>

            {allUsersLoading && (
              <div
                style={{ textAlign: "center", color: "#6b6b8a", padding: 40 }}
              >
                <div style={{ ...styles.spinner, margin: "0 auto 12px" }} />
                Loading users...
              </div>
            )}

            {!allUsersLoading && allUsers.length === 0 && (
              <div
                style={{
                  background: "#1e1e2e",
                  borderRadius: 14,
                  padding: 48,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
                <div
                  style={{ color: "#e0e0f0", fontWeight: 600, fontSize: 16 }}
                >
                  No users found
                </div>
              </div>
            )}

            {!allUsersLoading &&
              allUsers.map((u) => (
                <div
                  key={u.id}
                  style={{
                    background: "#1e1e2e",
                    borderRadius: 14,
                    padding: "16px 24px",
                    border: "1px solid #2a2a3e",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background:
                        u.roleType === "provider" ? "#8b5cf6" : "#6366f1",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 16,
                      flexShrink: 0,
                    }}
                  >
                    {u.username?.[0]?.toUpperCase() || "U"}
                  </div>

                  <div style={{ flex: 1, minWidth: 160 }}>
                    <div
                      style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}
                    >
                      {u.username}
                    </div>
                    <div style={{ color: "#6b6b8a", fontSize: 12 }}>
                      {u.email}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    {badge(u.roleType, roleColor[u.roleType] || "#6366f1")}
                    {badge(
                      u.approvalStatus,
                      u.approvalStatus === "approved"
                        ? "#22c55e"
                        : u.approvalStatus === "rejected"
                          ? "#ef4444"
                          : "#f59e0b",
                    )}
                    {u.blocked && badge("blocked", "#ef4444")}
                  </div>

                  <div style={{ color: "#6b6b8a", fontSize: 12, minWidth: 90 }}>
                    {fmt(u.createdAt)}
                  </div>

                  {/* Action buttons */}
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    {/* Details */}
                    <button
                      onClick={() => setSelectedUser(u)}
                      style={{
                        background: "#6366f122",
                        color: "#6366f1",
                        border: "1px solid #6366f144",
                        borderRadius: 8,
                        padding: "7px 14px",
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      🔍 Details
                    </button>

                    {/* Block / Unblock */}
                    {u.blocked ? (
                      <button
                        onClick={() => handleUnblockUser(u.id)}
                        disabled={actionLoading === u.id + "_unblock"}
                        style={{
                          background: "#22c55e22",
                          color: "#22c55e",
                          border: "1px solid #22c55e44",
                          borderRadius: 8,
                          padding: "7px 14px",
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 600,
                          opacity:
                            actionLoading === u.id + "_unblock" ? 0.6 : 1,
                        }}
                      >
                        {actionLoading === u.id + "_unblock"
                          ? "..."
                          : "🔓 Unblock"}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBlockUser(u.id)}
                        disabled={actionLoading === u.id + "_block"}
                        style={{
                          background: "#f59e0b22",
                          color: "#f59e0b",
                          border: "1px solid #f59e0b44",
                          borderRadius: 8,
                          padding: "7px 14px",
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 600,
                          opacity: actionLoading === u.id + "_block" ? 0.6 : 1,
                        }}
                      >
                        {actionLoading === u.id + "_block" ? "..." : "🔒 Block"}
                      </button>
                    )}

                    {/* Delete */}
                    {deleteConfirm === u.id ? (
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          alignItems: "center",
                        }}
                      >
                        <span style={{ color: "#f59e0b", fontSize: 12 }}>
                          Sure?
                        </span>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          disabled={actionLoading === u.id + "_delete"}
                          style={{
                            background: "#ef4444",
                            color: "#fff",
                            border: "none",
                            borderRadius: 6,
                            padding: "6px 14px",
                            cursor: "pointer",
                            fontSize: 12,
                            fontWeight: 600,
                            opacity:
                              actionLoading === u.id + "_delete" ? 0.6 : 1,
                          }}
                        >
                          {actionLoading === u.id + "_delete"
                            ? "Deleting..."
                            : "Yes, delete"}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          style={{
                            background: "#2a2a3e",
                            color: "#e0e0f0",
                            border: "none",
                            borderRadius: 6,
                            padding: "6px 14px",
                            cursor: "pointer",
                            fontSize: 12,
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(u.id)}
                        style={{
                          background: "#ef444422",
                          color: "#ef4444",
                          border: "1px solid #ef444444",
                          borderRadius: 8,
                          padding: "7px 14px",
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        🗑 Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    background: "#13131f",
    fontFamily: "'Inter', sans-serif",
  },
  sidebar: {
    width: 230,
    background: "#1a1a2e",
    borderRight: "1px solid #2a2a3e",
    flexShrink: 0,
    position: "sticky",
    top: 0,
    height: "100vh",
    overflowY: "auto",
  },
  logo: {
    width: 36,
    height: 36,
    background: "#6366f1",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
  },
  adminBadge: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#13131f",
    borderRadius: 10,
    padding: "10px 12px",
  },
  adminAvatar: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "#6366f1",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 14,
    flexShrink: 0,
  },
  navBtn: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    textAlign: "left",
    padding: "10px 14px",
    border: "none",
    cursor: "pointer",
    borderRadius: 8,
    marginBottom: 4,
    fontSize: 13,
    fontWeight: 500,
    transition: "all 0.2s",
  },
  main: { flex: 1, padding: "28px 32px", overflowY: "auto" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  liveBadge: {
    background: "#22c55e22",
    color: "#22c55e",
    borderRadius: 20,
    padding: "6px 16px",
    fontSize: 13,
    fontWeight: 600,
  },
  section: { display: "flex", flexDirection: "column", gap: 20 },
  cardRow: { display: "flex", gap: 16, flexWrap: "wrap" },
  centered: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#13131f",
  },
  spinner: {
    width: 40,
    height: 40,
    border: "3px solid #2a2a3e",
    borderTop: "3px solid #6366f1",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  retryBtn: {
    marginTop: 16,
    padding: "8px 20px",
    background: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
  },
};
