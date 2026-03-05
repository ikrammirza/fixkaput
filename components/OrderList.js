"use client";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import debounce from "lodash.debounce";

const STATUS_STYLES = {
  paid:    { bg: "rgba(52,211,153,0.12)",  color: "#34d399", border: "rgba(52,211,153,0.25)" },
  pending: { bg: "rgba(251,191,36,0.12)",  color: "#fbbf24", border: "rgba(251,191,36,0.25)" },
  failed:  { bg: "rgba(248,113,113,0.12)", color: "#f87171", border: "rgba(248,113,113,0.25)" },
  default: { bg: "rgba(148,163,184,0.1)",  color: "#94a3b8", border: "rgba(148,163,184,0.2)" },
};

function StatusBadge({ status }) {
  const st = STATUS_STYLES[status?.toLowerCase()] || STATUS_STYLES.default;
  return (
    <span style={{
      background: st.bg, color: st.color,
      border: `1px solid ${st.border}`,
      borderRadius: 6, padding: "3px 10px",
      fontSize: 11, fontFamily: "'DM Mono', monospace",
      letterSpacing: 0.8, textTransform: "uppercase", whiteSpace: "nowrap",
    }}>
      {status || "—"}
    </span>
  );
}

function Avatar({ name }) {
  const initials = name ? name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "?";
  const colors = ["#38bdf8","#818cf8","#34d399","#fb923c","#f472b6","#a78bfa"];
  const color = colors[name?.charCodeAt(0) % colors.length] || colors[0];
  return (
    <div style={{
      width: 30, height: 30, borderRadius: 8, flexShrink: 0,
      background: `${color}22`, border: `1px solid ${color}44`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color, fontSize: 11, fontWeight: 700, fontFamily: "'Syne', sans-serif",
    }}>
      {initials}
    </div>
  );
}

// Tab config — each tab maps to a filter value sent to the API
const TABS = [
  { key: "all",     label: "All Orders", filter: "",        color: "#38bdf8" },
  { key: "pending", label: "Pending",    filter: "pending", color: "#fbbf24" },
  { key: "today",   label: "Today",      filter: "today",   color: "#34d399" },
];

export default function OrderList() {
  const [orders,     setOrders]     = useState([]);
  const [search,     setSearch]     = useState("");
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total,      setTotal]      = useState(0);
  const [loading,    setLoading]    = useState(false);
  const [tab,        setTab]        = useState("all");

  const fetchOrders = async (searchQuery = "", pageNumber = 1, currentTab = "all") => {
    try {
      setLoading(true);
      const activeTab = TABS.find(t => t.key === currentTab);
      const res = await axios.get("/api/admin/stats/orders", {
        params: {
          search: searchQuery,
          page: pageNumber,
          limit: 10,
          filter: activeTab?.filter || "",
        },
        withCredentials: true,
      });
      setOrders(res.data.orders);
      setTotalPages(res.data.totalPages);
      setTotal(res.data.total ?? 0);
    } catch (err) {
      console.error("Error fetching orders", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = useMemo(() => debounce((value) => {
    setPage(1);
    setSearch(value);
  }, 500), []);

  useEffect(() => { fetchOrders(search, page, tab); }, [search, page, tab]);

  const renderCartItems = (cartObj) => {
    if (!cartObj || typeof cartObj !== "object") return "—";
    return Object.entries(cartObj)
      .map(([key, item]) => `${item.name || key} ×${item.qty || 1}`)
      .join(", ");
  };

  const renderAddress = (address) => {
    if (!address || typeof address !== "object" || Array.isArray(address)) return "—";
    const { line1 = "", area = "", city = "", pincode = "" } = address;
    const parts = [line1, area, city].filter(Boolean).join(", ");
    return parts + (pincode ? ` — ${pincode}` : "");
  };

  const cols = ["Customer", "Services", "Technician", "Status", "Payment", "Phone", "Address"];
  const activeTabConfig = TABS.find(t => t.key === tab);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@600;700&family=Inter:wght@400;500&display=swap');
        .order-row { transition: background 0.15s ease; }
        .order-row:hover { background: rgba(56,189,248,0.04) !important; }
        .tab-btn { transition: all 0.2s ease; cursor: pointer; }
        .pg-btn:not(:disabled):hover { background: rgba(56,189,248,0.15) !important; color: #38bdf8 !important; }
        .search-input:focus { outline: none; border-color: rgba(56,189,248,0.5) !important; box-shadow: 0 0 0 3px rgba(56,189,248,0.08); }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin   { to { transform: rotate(360deg); } }
        .fade-in { animation: fadeIn 0.3s ease both; }
      `}</style>

      <div style={s.card} className="fade-in">

        {/* ── Header ── */}
        <div style={s.header}>
          <div>
            <h2 style={s.title}>Order List</h2>
            <p style={s.subtitle}>Manage and track all service orders</p>
          </div>
          <div style={s.countPill(activeTabConfig?.color || "#38bdf8")}>
            <span style={{ color: activeTabConfig?.color, fontWeight: 700, fontFamily: "'Syne', sans-serif", fontSize: 15 }}>
              {total}
            </span>
            <span style={{ color: "#334155", fontSize: 10, fontFamily: "'DM Mono', monospace" }}>
              {tab === "today" ? "TODAY" : "TOTAL"}
            </span>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={s.tabRow}>
          {TABS.map(({ key, label, color }) => {
            const isActive = tab === key;
            return (
              <button key={key} className="tab-btn"
                onClick={() => { setPage(1); setTab(key); }}
                style={{
                  padding: "7px 18px", borderRadius: 8,
                  fontSize: 12, fontWeight: 500, fontFamily: "'Inter', sans-serif",
                  background: isActive ? `${color}18` : "rgba(255,255,255,0.03)",
                  color: isActive ? color : "#64748b",
                  border: `1px solid ${isActive ? `${color}40` : "rgba(255,255,255,0.06)"}`,
                  position: "relative",
                }}
              >
                {label}
                {isActive && (
                  <span style={{
                    position: "absolute", bottom: -1, left: "20%", right: "20%",
                    height: 2, background: color, borderRadius: 2,
                  }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Today date hint */}
        {tab === "today" && (
          <div style={s.todayHint}>
            <span>📅</span>
            <span style={{ color: "#34d399", fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 0.5 }}>
              {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
        )}

        {/* ── Search ── */}
        <div style={s.searchWrap}>
          <span style={s.searchIcon}>⌕</span>
          <input
            className="search-input"
            type="text"
            placeholder="Search by name or phone..."
            style={s.searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        {/* ── Table ── */}
        {loading ? (
          <div style={s.loadingWrap}>
            <div style={s.spinner} />
            <span style={s.loadingText}>Loading orders...</span>
          </div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table style={s.table}>
                <thead>
                  <tr>{cols.map(col => <th key={col} style={s.th}>{col}</th>)}</tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? orders.map((order) => (
                    <tr key={order._id} className="order-row"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td style={s.td}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Avatar name={order.name} />
                          <span style={{ color: "#e2e8f0", fontWeight: 500, fontSize: 13 }}>{order.name || "—"}</span>
                        </div>
                      </td>
                      <td style={{ ...s.td, maxWidth: 180 }}>
                        <span style={s.serviceTag}>{renderCartItems(order.cart)}</span>
                      </td>
                      <td style={s.td}>
                        {order.technicianId ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Avatar name={order.technicianId.name} />
                            <div>
                              <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 500 }}>{order.technicianId.name}</div>
                              <div style={{ color: "#475569", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>{order.technicianId.phone}</div>
                            </div>
                          </div>
                        ) : (
                          <span style={s.unassigned}>⚠ Unassigned</span>
                        )}
                      </td>
                      <td style={s.td}><StatusBadge status={order.status} /></td>
                      <td style={s.td}><StatusBadge status={order.paymentStatus} /></td>
                      <td style={s.td}><span style={s.mono}>{order.phone || "—"}</span></td>
                      <td style={{ ...s.td, maxWidth: 200 }}>
                        <span style={{ color: "#64748b", fontSize: 12, lineHeight: 1.5 }}>{renderAddress(order.address)}</span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={cols.length} style={{ padding: "48px 0" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 36 }}>
                            {tab === "today" ? "🌅" : tab === "pending" ? "⏳" : "📋"}
                          </span>
                          <p style={{ color: "#334155", fontSize: 13 }}>
                            {tab === "today" ? "No orders placed today yet" : "No orders found"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div style={s.pagination}>
                <button className="pg-btn"
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  style={{ ...s.pgBtn, opacity: page === 1 ? 0.35 : 1, cursor: page === 1 ? "not-allowed" : "pointer" }}>
                  ← Prev
                </button>
                <div style={{ display: "flex", gap: 4 }}>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const p = totalPages <= 5 ? i + 1 : page <= 3 ? i + 1 : page + i - 2;
                    if (p < 1 || p > totalPages) return null;
                    return (
                      <button key={p} onClick={() => setPage(p)} style={{
                        width: 30, height: 30, borderRadius: 7, border: "none",
                        cursor: "pointer", fontSize: 12, fontFamily: "'DM Mono', monospace",
                        background: page === p ? "rgba(56,189,248,0.2)" : "rgba(255,255,255,0.04)",
                        color: page === p ? "#38bdf8" : "#64748b",
                        fontWeight: page === p ? 700 : 400,
                        transition: "all 0.15s",
                      }}>{p}</button>
                    );
                  })}
                </div>
                <button className="pg-btn"
                  onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  style={{ ...s.pgBtn, opacity: page === totalPages ? 0.35 : 1, cursor: page === totalPages ? "not-allowed" : "pointer" }}>
                  Next →
                </button>
              </div>
            )}
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
    flexWrap: "wrap", gap: 12, marginBottom: 16,
  },
  title: { color: "#f1f5f9", fontWeight: 700, fontSize: 18, fontFamily: "'Syne', sans-serif" },
  subtitle: { color: "#334155", fontSize: 12, marginTop: 3, fontFamily: "'DM Mono', monospace", letterSpacing: 0.5 },
  countPill: (color) => ({
    display: "flex", flexDirection: "column", alignItems: "center",
    background: `${color}10`, border: `1px solid ${color}25`,
    borderRadius: 10, padding: "8px 16px", gap: 2,
  }),
  tabRow: { display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" },
  todayHint: {
    display: "flex", alignItems: "center", gap: 8,
    background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.15)",
    borderRadius: 8, padding: "8px 14px", marginBottom: 16, fontSize: 12,
  },
  searchWrap: { position: "relative", marginBottom: 20 },
  searchIcon: {
    position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
    color: "#334155", fontSize: 20, pointerEvents: "none",
  },
  searchInput: {
    width: "100%", padding: "10px 14px 10px 40px",
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 10, color: "#e2e8f0", fontSize: 13,
    fontFamily: "'Inter', sans-serif", transition: "border-color 0.2s, box-shadow 0.2s",
  },
  loadingWrap: { display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 0", gap: 12 },
  spinner: {
    width: 28, height: 28, border: "2px solid rgba(56,189,248,0.15)",
    borderTop: "2px solid #38bdf8", borderRadius: "50%", animation: "spin 0.8s linear infinite",
  },
  loadingText: { color: "#334155", fontSize: 12, fontFamily: "'DM Mono', monospace", letterSpacing: 1 },
  table: { width: "100%", borderCollapse: "collapse", minWidth: 800 },
  th: {
    padding: "10px 14px", textAlign: "left", color: "#334155", fontSize: 10,
    fontFamily: "'DM Mono', monospace", letterSpacing: 1.2, textTransform: "uppercase",
    borderBottom: "1px solid rgba(255,255,255,0.06)", whiteSpace: "nowrap",
  },
  td: { padding: "13px 14px", verticalAlign: "middle", fontSize: 13 },
  serviceTag: {
    color: "#94a3b8", fontSize: 12, display: "-webkit-box",
    WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
  },
  unassigned: {
    color: "#f87171", fontSize: 12, fontFamily: "'DM Mono', monospace",
    background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)",
    borderRadius: 6, padding: "3px 8px",
  },
  mono: { color: "#94a3b8", fontFamily: "'DM Mono', monospace", fontSize: 12 },
  pagination: {
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: 10, marginTop: 20, paddingTop: 16,
    borderTop: "1px solid rgba(255,255,255,0.04)",
  },
  pgBtn: {
    padding: "8px 16px", background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8,
    color: "#94a3b8", fontSize: 12, fontFamily: "'DM Mono', monospace", transition: "all 0.2s",
  },
};