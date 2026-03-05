import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import debounce from "lodash.debounce";

function Avatar({ name }) {
  const initials = name ? name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "?";
  const colors = ["#38bdf8","#818cf8","#34d399","#fb923c","#f472b6","#a78bfa"];
  const color = colors[name?.charCodeAt(0) % colors.length] || colors[0];
  return (
    <div style={{
      width: 34, height: 34, borderRadius: 10, flexShrink: 0,
      background: `${color}18`, border: `1px solid ${color}35`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color, fontSize: 12, fontWeight: 700, fontFamily: "'Syne', sans-serif",
    }}>
      {initials}
    </div>
  );
}

function OrderCountBadge({ count }) {
  const level = count >= 20 ? "high" : count >= 10 ? "mid" : "low";
  const styles = {
    high: { bg: "rgba(52,211,153,0.12)", color: "#34d399", border: "rgba(52,211,153,0.25)" },
    mid:  { bg: "rgba(251,191,36,0.12)",  color: "#fbbf24", border: "rgba(251,191,36,0.25)" },
    low:  { bg: "rgba(148,163,184,0.1)",  color: "#94a3b8", border: "rgba(148,163,184,0.2)" },
  };
  const st = styles[level];
  return (
    <span style={{
      background: st.bg, color: st.color,
      border: `1px solid ${st.border}`,
      borderRadius: 6, padding: "3px 10px",
      fontSize: 12, fontFamily: "'DM Mono', monospace", fontWeight: 500,
    }}>
      {count ?? 0}
    </span>
  );
}

export default function TechnicianList() {
  const [technicians, setTechnicians] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchTechnicians = async (searchQuery = "", pageNumber = 1) => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/stats/technicians", {
        params: { search: searchQuery, page: pageNumber, limit: 10 },
        withCredentials: true,
      });
      setTechnicians(res.data.technicians);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error fetching technicians", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = useMemo(() => debounce((value) => {
    setPage(1);
    setSearch(value);
  }, 500), []);

  useEffect(() => { fetchTechnicians(search, page); }, [search, page]);

  const cols = ["Technician", "Phone", "Aadhar No.", "Orders", "Address"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@600;700&family=Inter:wght@400;500&display=swap');
        .tech-row { transition: background 0.15s ease; }
        .tech-row:hover { background: rgba(56,189,248,0.04) !important; }
        .pg-btn-t:not(:disabled):hover { background: rgba(56,189,248,0.2) !important; }
        .search-t:focus { outline: none; border-color: rgba(56,189,248,0.5) !important; box-shadow: 0 0 0 3px rgba(56,189,248,0.08); }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .fade-in { animation: fadeIn 0.3s ease both; }
      `}</style>

      <div style={s.card} className="fade-in">
        {/* Header */}
        <div style={s.header}>
          <div>
            <h2 style={s.title}>Technicians</h2>
            <p style={s.subtitle}>Field workforce management</p>
          </div>
          <div style={s.countPill}>
            <span style={{ color: "#38bdf8", fontWeight: 700, fontFamily: "'Syne', sans-serif", fontSize: 15 }}>
              {technicians.length}
            </span>
            <span style={{ color: "#334155", fontSize: 10, fontFamily: "'DM Mono', monospace" }}>ON PAGE</span>
          </div>
        </div>

        {/* Search */}
        <div style={s.searchWrap}>
          <span style={s.searchIcon}>⌕</span>
          <input
            className="search-t"
            type="text"
            placeholder="Search by name, phone, area..."
            style={s.searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        {loading ? (
          <div style={s.loadingWrap}>
            <div style={s.spinner} />
            <span style={s.loadingText}>Loading technicians...</span>
          </div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table style={s.table}>
                <thead>
                  <tr>
                    {cols.map((col) => (
                      <th key={col} style={s.th}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {technicians.length > 0 ? technicians.map((tech, i) => (
                    <tr key={tech._id} className="tech-row"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", animationDelay: `${i * 30}ms` }}>
                      <td style={s.td}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Avatar name={tech.name} />
                          <span style={{ color: "#e2e8f0", fontWeight: 500, fontSize: 13 }}>{tech.name || "—"}</span>
                        </div>
                      </td>
                      <td style={s.td}>
                        <span style={s.mono}>{tech.phone || "—"}</span>
                      </td>
                      <td style={s.td}>
                        <span style={{ ...s.mono, color: "#475569" }}>{tech.aadhar || "—"}</span>
                      </td>
                      <td style={s.td}>
                        <OrderCountBadge count={tech.acceptedOrderCount} />
                      </td>
                      <td style={s.td}>
                        <span style={{ color: "#64748b", fontSize: 12, lineHeight: 1.5 }}>{tech.address || "—"}</span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} style={{ padding: "40px 0" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 32 }}>🔧</span>
                          <p style={{ color: "#334155", fontSize: 13 }}>No technicians found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div style={s.pagination}>
              <button className="pg-btn-t" onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}
                style={{ ...s.pgBtn, opacity: page === 1 ? 0.35 : 1 }}>
                ← Prev
              </button>
              <span style={s.pageInfo}>
                <span style={{ color: "#38bdf8", fontWeight: 600 }}>{page}</span>
                <span style={{ color: "#334155" }}> / {totalPages}</span>
              </span>
              <button className="pg-btn-t" onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}
                style={{ ...s.pgBtn, opacity: page === totalPages ? 0.35 : 1 }}>
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

const s = {
  card: {
    background: "rgba(15,23,42,0.8)",
    border: "1px solid rgba(56,189,248,0.08)",
    borderRadius: 16, padding: "24px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
    marginTop: 8,
  },
  header: {
    display: "flex", alignItems: "flex-start", justifyContent: "space-between",
    flexWrap: "wrap", gap: 12, marginBottom: 20,
  },
  title: { color: "#f1f5f9", fontWeight: 700, fontSize: 18, fontFamily: "'Syne', sans-serif" },
  subtitle: { color: "#334155", fontSize: 12, marginTop: 3, fontFamily: "'DM Mono', monospace", letterSpacing: 0.5 },
  countPill: {
    display: "flex", flexDirection: "column", alignItems: "center",
    background: "rgba(56,189,248,0.07)",
    border: "1px solid rgba(56,189,248,0.15)",
    borderRadius: 10, padding: "8px 16px", gap: 2,
  },
  searchWrap: { position: "relative", marginBottom: 20 },
  searchIcon: {
    position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
    color: "#334155", fontSize: 20, pointerEvents: "none",
  },
  searchInput: {
    width: "100%", padding: "10px 14px 10px 40px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 10, color: "#e2e8f0", fontSize: 13,
    fontFamily: "'Inter', sans-serif",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  loadingWrap: { display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 0", gap: 12 },
  spinner: {
    width: 28, height: 28,
    border: "2px solid rgba(56,189,248,0.15)",
    borderTop: "2px solid #38bdf8",
    borderRadius: "50%", animation: "spin 0.8s linear infinite",
  },
  loadingText: { color: "#334155", fontSize: 12, fontFamily: "'DM Mono', monospace", letterSpacing: 1 },
  table: { width: "100%", borderCollapse: "collapse", minWidth: 600 },
  th: {
    padding: "10px 14px", textAlign: "left",
    color: "#334155", fontSize: 10, fontFamily: "'DM Mono', monospace",
    letterSpacing: 1.2, textTransform: "uppercase",
    borderBottom: "1px solid rgba(255,255,255,0.06)", whiteSpace: "nowrap",
  },
  td: { padding: "13px 14px", verticalAlign: "middle", fontSize: 13 },
  mono: { color: "#94a3b8", fontFamily: "'DM Mono', monospace", fontSize: 12 },
  pagination: {
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: 16, marginTop: 20, paddingTop: 16,
    borderTop: "1px solid rgba(255,255,255,0.04)",
  },
  pgBtn: {
    padding: "8px 18px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 8, color: "#94a3b8", cursor: "pointer",
    fontSize: 12, fontFamily: "'DM Mono', monospace",
    transition: "background 0.2s",
  },
  pageInfo: { fontSize: 13, fontFamily: "'DM Mono', monospace" },
};