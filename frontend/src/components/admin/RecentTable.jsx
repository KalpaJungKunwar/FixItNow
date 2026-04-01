export default function RecentTable({ title, columns, rows, emptyMsg = "No data yet" }) {
  return (
    <div style={{
      background: "#1e1e2e", borderRadius: 14,
      padding: 24, overflow: "hidden",
    }}>
      <div style={{
        color: "#e0e0f0", fontSize: 15,
        fontWeight: 600, marginBottom: 16,
      }}>
        {title}
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col} style={{
                  textAlign: "left",
                  color: "#6b6b8a",
                  fontWeight: 500,
                  padding: "0 12px 12px",
                  borderBottom: "1px solid #2a2a3e",
                  whiteSpace: "nowrap",
                }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{
                  color: "#555", padding: "20px 12px", fontSize: 13,
                }}>
                  {emptyMsg}
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr key={i} style={{
                  borderBottom: "1px solid #1a1a2e",
                  transition: "background 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#2a2a3e"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {row.map((cell, j) => (
                    <td key={j} style={{
                      padding: "11px 12px",
                      color: "#c0c0d8",
                      whiteSpace: "nowrap",
                    }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}