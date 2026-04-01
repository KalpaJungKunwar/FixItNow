export default function StatCard({ title, value, sub, icon, color = "#6366f1" }) {
  return (
    <div style={{
      background: "#1e1e2e",
      borderRadius: 14,
      padding: "20px 24px",
      display: "flex",
      alignItems: "center",
      gap: 18,
      boxShadow: "0 2px 16px rgba(0,0,0,0.25)",
      flex: 1,
      minWidth: 180,
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 12,
        background: color + "22",
        display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 26, flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ color: "#a0a0b8", fontSize: 13, marginBottom: 4 }}>{title}</div>
        <div style={{ color: "#fff", fontSize: 28, fontWeight: 700, lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ color: "#6b6b8a", fontSize: 12, marginTop: 4 }}>{sub}</div>}
      </div>
    </div>
  );
}