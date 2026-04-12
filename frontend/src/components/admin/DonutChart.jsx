export default function DonutChart({ title, data, colors }) {
  const total = data.reduce((s, d) => s + d.value, 0);

  if (total === 0) return (
    <div style={{
      background: "#1e1e2e", borderRadius: 14,
      padding: 24, minWidth: 240, flex: 1,
    }}>
      <div style={{ color: "#a0a0b8", fontSize: 14, marginBottom: 12 }}>{title}</div>
      <div style={{ color: "#555", fontSize: 13 }}>No data yet</div>
    </div>
  );

  const radius = 60;
  const cx = 80, cy = 80;
  const strokeW = 22;
  const circumference = 2 * Math.PI * radius;

  let cumulative = 0;
  const segments = data.map((d, i) => {
    const pct = d.value / total;
    const dash = pct * circumference;
    const offset = circumference - cumulative * circumference;
    cumulative += pct;
    return { ...d, dash, offset, color: colors[i % colors.length] };
  });

  return (
    <div style={{
      background: "#1e1e2e", borderRadius: 14,
      padding: 24, minWidth: 240, flex: 1,
    }}>
      <div style={{ color: "#a0a0b8", fontSize: 14, marginBottom: 16 }}>{title}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <svg width={160} height={160} viewBox="0 0 160 160" style={{ flexShrink: 0 }}>
          <circle cx={cx} cy={cy} r={radius}
            fill="none" stroke="#2a2a3e" strokeWidth={strokeW} />
          {segments.map((s, i) => (
            <circle key={i} cx={cx} cy={cy} r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth={strokeW}
              strokeDasharray={`${s.dash} ${circumference - s.dash}`}
              strokeDashoffset={s.offset}
              style={{
                transform: "rotate(-90deg)",
                transformOrigin: `${cx}px ${cy}px`,
                transition: "stroke-dasharray 0.6s ease",
              }}
            />
          ))}
          <text x={cx} y={cy - 8} textAnchor="middle"
            fill="#fff" fontSize={22} fontWeight={700}>{total}</text>
          <text x={cx} y={cy + 12} textAnchor="middle"
            fill="#6b6b8a" fontSize={11}>total</text>
        </svg>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
          {segments.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 10, height: 10, borderRadius: "50%",
                background: s.color, flexShrink: 0,
              }} />
              <span style={{ color: "#a0a0b8", fontSize: 12, flex: 1 }}>{s.label}</span>
              <span style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}