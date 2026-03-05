import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import {
  FaBars, FaTimes, FaUserTie, FaUsers, FaClipboardList, FaHome, FaRupeeSign,
  FaChartBar, FaRobot, FaCircle
} from "react-icons/fa";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";
import UserList from "../../components/UserList";
import OrderList from "../../components/OrderList";
import TechnicianList from "../../components/TechnicianList";

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);
  return matches;
}

const COLORS = ["#38bdf8", "#818cf8", "#34d399", "#fb923c", "#f472b6", "#a78bfa"];

// ── Animated number counter ───────────────────────────────────────────────────
function CountUp({ target, prefix = "" }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!target) return;
    const numeric = parseFloat(String(target).replace(/[^0-9.]/g, ""));
    if (isNaN(numeric)) { setValue(target); return; }
    let start = 0;
    const duration = 1200;
    const step = numeric / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= numeric) { setValue(numeric); clearInterval(timer); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <>{prefix}{typeof value === "number" ? value.toLocaleString() : value}</>;
}

// ── Custom tooltip for charts ─────────────────────────────────────────────────
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(15,23,42,0.95)",
      border: "1px solid rgba(56,189,248,0.3)",
      borderRadius: "10px",
      padding: "10px 16px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    }}>
      <p style={{ color: "#38bdf8", fontWeight: 700, margin: 0 }}>{payload[0].name || payload[0].payload?.name}</p>
      <p style={{ color: "#e2e8f0", margin: "4px 0 0", fontSize: 14 }}>
        {payload[0].value} bookings
      </p>
    </div>
  );
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({ orders: 0, technicians: 0, users: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [insight, setInsight] = useState("");
  const [insightError, setInsightError] = useState(false);
  const [fromCache, setFromCache] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isMobile = useMediaQuery("(max-width: 639px)");

  useEffect(() => {
    setMounted(true);
    const verifyAdmin = async () => {
      let user;
      try {
        const res = await axios.get("/api/me", { withCredentials: true });
        user = res.data.user;
      } catch {
        setUnauthorized(true);
        setLoading(false);
        return;
      }

      if (!user?.isAdmin) {
        setUnauthorized(true);
        setLoading(false);
        return;
      }

      try {
        const [ordersRes, techsRes, usersRes, revenueRes] = await Promise.all([
          axios.get("/api/admin/stats/orders", { withCredentials: true }),
          axios.get("/api/admin/stats/technicians", { withCredentials: true }),
          axios.get("/api/admin/stats/users", { withCredentials: true }),
          axios.get("/api/admin/stats/revenue", { withCredentials: true }),
        ]);
        setStats({
          orders: ordersRes.data.totalorders,
          technicians: techsRes.data.totaltechnicians,
          users: usersRes.data.totalusers,
          revenue: revenueRes.data.totalRevenue,
        });
      } catch (e) {
        console.error("Stats fetch error:", e);
      }

      try {
        const demandRes = await axios.get("/api/admin/insights/demandAreaService", { withCredentials: true });
        const grouped = {};
        demandRes.data.demand.forEach((d) => {
          const service = d._id.service;
          const area = d._id.area;
          if (!grouped[service]) grouped[service] = { value: 0, areas: new Set() };
          grouped[service].value += d.count;
          grouped[service].areas.add(area);
        });
        setChartData(Object.entries(grouped).map(([name, data]) => ({
          name, value: data.value, areas: Array.from(data.areas),
        })));
        setInsight(demandRes.data.insight || "");
        setFromCache(demandRes.data.fromCache || false);
      } catch {
        setInsightError(true);
      }

      setLoading(false);
    };
    verifyAdmin();
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (window.innerWidth < 640) setSidebarOpen(false);
  };

  if (loading) return (
    <div style={styles.loadingScreen}>
      <div style={styles.loadingSpinner} />
      <p style={{ color: "#38bdf8", marginTop: 20, fontFamily: "'DM Mono', monospace", letterSpacing: 4, fontSize: 13 }}>
        INITIALIZING...
      </p>
    </div>
  );

  if (unauthorized) return (
    <div style={styles.loadingScreen}>
      <div style={{ fontSize: 48 }}>🔒</div>
      <p style={{ color: "#f87171", marginTop: 16, fontFamily: "'DM Mono', monospace", letterSpacing: 2 }}>ACCESS DENIED</p>
    </div>
  );

  const navItems = [
    { tab: "dashboard", label: "Dashboard", icon: <FaHome /> },
    { tab: "orders", label: "Orders", icon: <FaClipboardList /> },
    { tab: "technicians", label: "Technicians", icon: <FaUserTie /> },
    { tab: "users", label: "Users", icon: <FaUsers /> },
  ];

  const statCards = [
    { icon: <FaClipboardList />, label: "Total Orders", value: stats.orders, color: "#38bdf8" },
    { icon: <FaUserTie />, label: "Technicians", value: stats.technicians, color: "#818cf8" },
    { icon: <FaUsers />, label: "Users", value: stats.users, color: "#34d399" },
    { icon: <FaRupeeSign />, label: "Revenue", value: stats.revenue, prefix: "₹", color: "#fb923c" },
  ];

  return (
    <>
      <Head>
        <title>fixKaput | Admin</title>
        <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@600;700;800&family=Inter:wght@400;500&display=swap" rel="stylesheet" />
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #020817; }
          ::-webkit-scrollbar { width: 6px; height: 6px; }
          ::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); }
          ::-webkit-scrollbar-thumb { background: rgba(56,189,248,0.3); border-radius: 3px; }
          @keyframes fadeSlideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse-ring {
            0% { box-shadow: 0 0 0 0 rgba(56,189,248,0.4); }
            70% { box-shadow: 0 0 0 10px rgba(56,189,248,0); }
            100% { box-shadow: 0 0 0 0 rgba(56,189,248,0); }
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          .stat-card:hover { transform: translateY(-4px) scale(1.02); }
          .nav-item:hover { background: rgba(56,189,248,0.1) !important; }
          .tab-content { animation: fadeSlideUp 0.4s ease both; }
        `}</style>
      </Head>

      <div style={styles.root}>
        {/* ── Sidebar ── */}
        <aside style={{ ...styles.sidebar, width: sidebarOpen ? 240 : 68 }}>
          {/* Logo */}
          <div style={styles.sidebarHeader}>
            <div style={styles.logoMark}>fK</div>
            {sidebarOpen && (
              <div>
                <div style={styles.logoText}>fixKaput</div>
                <div style={styles.logoSub}>Admin Console</div>
              </div>
            )}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={styles.toggleBtn}>
              {sidebarOpen ? <FaTimes size={14} /> : <FaBars size={14} />}
            </button>
          </div>

          {/* Status dot */}
          {sidebarOpen && (
            <div style={styles.statusBadge}>
              <FaCircle size={7} color="#34d399" style={{ animation: "pulse-ring 2s infinite" }} />
              <span style={{ color: "#34d399", fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: 1 }}>
                SYSTEM ONLINE
              </span>
            </div>
          )}

          {/* Nav */}
          <nav style={{ marginTop: 16, padding: "0 10px", flex: 1 }}>
            {navItems.map(({ tab, label, icon }) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  className="nav-item"
                  onClick={() => handleTabClick(tab)}
                  style={{
                    ...styles.navItem,
                    background: isActive ? "rgba(56,189,248,0.15)" : "transparent",
                    borderLeft: isActive ? "2px solid #38bdf8" : "2px solid transparent",
                    color: isActive ? "#38bdf8" : "#94a3b8",
                    justifyContent: sidebarOpen ? "flex-start" : "center",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span style={{ fontSize: 16, minWidth: 20, textAlign: "center" }}>{icon}</span>
                  {sidebarOpen && <span style={{ fontSize: 13, fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>{label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Bottom user pill */}
          {sidebarOpen && (
            <div style={styles.userPill}>
              <div style={styles.userAvatar}>A</div>
              <div>
                <div style={{ color: "#e2e8f0", fontSize: 12, fontWeight: 600 }}>Admin</div>
                <div style={{ color: "#475569", fontSize: 10, fontFamily: "'DM Mono', monospace" }}>SUPER USER</div>
              </div>
            </div>
          )}
        </aside>

        {/* ── Main ── */}
        <main style={styles.main}>
          {/* Top bar */}
          <header style={styles.topbar}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <button onClick={() => setSidebarOpen(!sidebarOpen)} style={styles.mobileMenuBtn} className="sm-only">
                <FaBars size={16} color="#94a3b8" />
              </button>
              <div>
                <div style={styles.pageTitle}>
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </div>
                <div style={styles.pageSub}>fixKaput Admin Panel</div>
              </div>
            </div>
            <div style={styles.topbarRight}>
              <div style={styles.topbarBadge}>
                <FaCircle size={6} color="#34d399" />
                <span>Live</span>
              </div>
            </div>
          </header>

          <div style={styles.content}>
            {activeTab === "dashboard" && (
              <div className="tab-content">
                {/* Stat cards */}
                <div style={styles.statGrid}>
                  {statCards.map(({ icon, label, value, color, prefix = "" }, i) => (
                    <div
                      key={label}
                      className="stat-card"
                      style={{
                        ...styles.statCard,
                        animationDelay: `${i * 80}ms`,
                        borderColor: `${color}22`,
                      }}
                    >
                      <div style={{ ...styles.statIcon, color, background: `${color}18` }}>{icon}</div>
                      <div style={styles.statValue} key={value}>
                        <CountUp target={value} prefix={prefix} />
                      </div>
                      <div style={styles.statLabel}>{label}</div>
                      <div style={{ ...styles.statGlow, background: `radial-gradient(ellipse at top left, ${color}15, transparent 70%)` }} />
                    </div>
                  ))}
                </div>

                {/* Chart section */}
                <div style={styles.chartCard}>
                  <div style={styles.chartHeader}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <FaChartBar color="#38bdf8" size={16} />
                      <span style={styles.sectionTitle}>Demand by Area & Service</span>
                    </div>
                    {fromCache && (
                      <span style={styles.cacheBadge}>⚡ CACHED</span>
                    )}
                  </div>

                  {chartData.length > 0 ? (
                    <div style={{ overflowX: "auto", marginTop: 8 }}>
                      {isMobile ? (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <PieChart width={280} height={280}>
                            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110}
                              label={({ name, percent }) => `${name.slice(0, 8)}… ${(percent * 100).toFixed(0)}%`}
                              labelLine={false}
                            >
                              {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                          </PieChart>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16, justifyContent: "center" }}>
                            {chartData.map((entry, i) => (
                              <div key={entry.name} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.04)", borderRadius: 6, padding: "4px 10px" }}>
                                <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS[i % COLORS.length] }} />
                                <span style={{ color: "#94a3b8", fontSize: 11 }}>{entry.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div style={{ minWidth: `${Math.max(chartData.length * 110, 500)}px`, height: 300 }}>
                          <BarChart
                            width={Math.max(chartData.length * 110, 500)}
                            height={300}
                            data={chartData}
                            margin={{ top: 10, right: 20, left: 0, bottom: 60 }}
                          >
                            <defs>
                              {COLORS.map((c, i) => (
                                <linearGradient key={i} id={`grad${i}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor={c} stopOpacity={0.9} />
                                  <stop offset="100%" stopColor={c} stopOpacity={0.3} />
                                </linearGradient>
                              ))}
                            </defs>
                            <XAxis dataKey="name" interval={0} angle={-30} textAnchor="end" height={70}
                              tick={{ fill: "#64748b", fontSize: 11, fontFamily: "'DM Mono', monospace" }}
                              axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                              tickLine={false}
                            />
                            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(56,189,248,0.05)" }} />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={42}>
                              {chartData.map((_, i) => (
                                <Cell key={i} fill={`url(#grad${i % COLORS.length})`} />
                              ))}
                            </Bar>
                          </BarChart>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={styles.emptyState}>
                      <FaChartBar size={32} color="#1e3a5f" />
                      <p style={{ color: "#334155", marginTop: 12, fontSize: 14 }}>No demand data available yet</p>
                    </div>
                  )}
                </div>

                {/* AI Insight card */}
                <div style={styles.insightCard}>
                  <div style={styles.insightHeader}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={styles.aiOrb}>
                        <FaRobot size={13} color="#020817" />
                      </div>
                      <span style={styles.sectionTitle}>AI Insight</span>
                      <span style={styles.poweredBy}>powered by Groq · Llama 3.3</span>
                    </div>
                  </div>

                  {insightError ? (
                    <div style={styles.insightError}>
                      <span style={{ fontSize: 18 }}>⚠️</span>
                      <p style={{ color: "#fbbf24", fontSize: 13, lineHeight: 1.6 }}>
                        AI insights are temporarily unavailable. Dashboard and charts are fully functional.
                      </p>
                    </div>
                  ) : insight ? (
                    <p style={styles.insightText}>{insight}</p>
                  ) : (
                    <p style={{ color: "#334155", fontStyle: "italic", fontSize: 13 }}>No insight generated yet.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "users" && <div className="tab-content"><UserList /></div>}
            {activeTab === "orders" && <div className="tab-content"><OrderList /></div>}
            {activeTab === "technicians" && <div className="tab-content"><TechnicianList /></div>}
          </div>
        </main>
      </div>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  root: {
    display: "flex",
    minHeight: "100vh",
    background: "#020817",
    fontFamily: "'Inter', sans-serif",
  },
  loadingScreen: {
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    minHeight: "100vh", background: "#020817",
  },
  loadingSpinner: {
    width: 36, height: 36,
    border: "2px solid rgba(56,189,248,0.15)",
    borderTop: "2px solid #38bdf8",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  sidebar: {
    background: "rgba(8,16,32,0.95)",
    borderRight: "1px solid rgba(56,189,248,0.08)",
    display: "flex",
    flexDirection: "column",
    transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
    overflow: "hidden",
    flexShrink: 0,
    backdropFilter: "blur(20px)",
    position: "sticky",
    top: 0,
    height: "100vh",
  },
  sidebarHeader: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "20px 14px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
  },
  logoMark: {
    width: 34, height: 34, borderRadius: 10, flexShrink: 0,
    background: "linear-gradient(135deg, #38bdf8, #818cf8)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#020817", fontWeight: 800, fontSize: 13,
    fontFamily: "'Syne', sans-serif",
  },
  logoText: {
    color: "#f1f5f9", fontWeight: 700, fontSize: 14,
    fontFamily: "'Syne', sans-serif", letterSpacing: 0.5,
    whiteSpace: "nowrap",
  },
  logoSub: {
    color: "#334155", fontSize: 9, fontFamily: "'DM Mono', monospace",
    letterSpacing: 1.5, whiteSpace: "nowrap", marginTop: 1,
  },
  toggleBtn: {
    marginLeft: "auto", background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 7, padding: "6px 8px", cursor: "pointer",
    color: "#475569", flexShrink: 0,
  },
  statusBadge: {
    display: "flex", alignItems: "center", gap: 6,
    margin: "10px 14px 0",
    padding: "6px 12px",
    background: "rgba(52,211,153,0.07)",
    border: "1px solid rgba(52,211,153,0.15)",
    borderRadius: 8,
  },
  navItem: {
    width: "100%", display: "flex", alignItems: "center", gap: 12,
    padding: "11px 12px", borderRadius: 9, marginBottom: 4,
    cursor: "pointer", border: "none", textAlign: "left",
    fontFamily: "'Inter', sans-serif",
  },
  userPill: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "12px 14px", margin: "8px 10px 16px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: 10,
  },
  userAvatar: {
    width: 28, height: 28, borderRadius: 8,
    background: "linear-gradient(135deg, #38bdf8, #818cf8)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#020817", fontWeight: 700, fontSize: 12,
    fontFamily: "'Syne', sans-serif",
  },
  main: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0 },
  topbar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px 28px",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    background: "rgba(8,16,32,0.6)",
    backdropFilter: "blur(12px)",
    position: "sticky", top: 0, zIndex: 10,
  },
  pageTitle: {
    color: "#f1f5f9", fontWeight: 700, fontSize: 18,
    fontFamily: "'Syne', sans-serif",
  },
  pageSub: {
    color: "#334155", fontSize: 11,
    fontFamily: "'DM Mono', monospace", letterSpacing: 1,
  },
  topbarRight: { display: "flex", alignItems: "center", gap: 12 },
  topbarBadge: {
    display: "flex", alignItems: "center", gap: 6,
    background: "rgba(52,211,153,0.08)",
    border: "1px solid rgba(52,211,153,0.2)",
    borderRadius: 20, padding: "5px 12px",
    color: "#34d399", fontSize: 11,
    fontFamily: "'DM Mono', monospace", letterSpacing: 1,
  },
  mobileMenuBtn: {
    background: "transparent", border: "none", cursor: "pointer", padding: 4,
  },
  content: { padding: "24px 28px", flex: 1 },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 16, marginBottom: 20,
  },
  statCard: {
    position: "relative", overflow: "hidden",
    background: "rgba(15,23,42,0.8)",
    border: "1px solid",
    borderRadius: 16, padding: "22px 20px",
    cursor: "default",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    animation: "fadeSlideUp 0.4s ease both",
    boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
  },
  statGlow: {
    position: "absolute", inset: 0, pointerEvents: "none",
  },
  statIcon: {
    width: 40, height: 40, borderRadius: 10,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 16, marginBottom: 14,
  },
  statValue: {
    color: "#f1f5f9", fontSize: 28, fontWeight: 700,
    fontFamily: "'Syne', sans-serif", lineHeight: 1,
  },
  statLabel: {
    color: "#475569", fontSize: 11, marginTop: 6,
    fontFamily: "'DM Mono', monospace", letterSpacing: 1,
    textTransform: "uppercase",
  },
  chartCard: {
    background: "rgba(15,23,42,0.8)",
    border: "1px solid rgba(56,189,248,0.08)",
    borderRadius: 16, padding: "22px 24px", marginBottom: 16,
    boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
  },
  chartHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#e2e8f0", fontWeight: 600, fontSize: 15,
    fontFamily: "'Syne', sans-serif",
  },
  cacheBadge: {
    background: "rgba(56,189,248,0.1)",
    border: "1px solid rgba(56,189,248,0.2)",
    color: "#38bdf8", fontSize: 10, borderRadius: 6, padding: "3px 8px",
    fontFamily: "'DM Mono', monospace", letterSpacing: 1,
  },
  emptyState: {
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "48px 0",
  },
  insightCard: {
    background: "linear-gradient(135deg, rgba(56,189,248,0.05) 0%, rgba(129,140,248,0.05) 100%)",
    border: "1px solid rgba(56,189,248,0.12)",
    borderRadius: 16, padding: "22px 24px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
  },
  insightHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginBottom: 16,
  },
  aiOrb: {
    width: 28, height: 28, borderRadius: 8,
    background: "linear-gradient(135deg, #38bdf8, #818cf8)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  poweredBy: {
    color: "#334155", fontSize: 10,
    fontFamily: "'DM Mono', monospace", letterSpacing: 0.5,
  },
  insightText: {
    color: "#94a3b8", fontSize: 14, lineHeight: 1.8,
    fontFamily: "'Inter', sans-serif",
    borderLeft: "2px solid rgba(56,189,248,0.3)",
    paddingLeft: 14,
  },
  insightError: {
    display: "flex", alignItems: "flex-start", gap: 12,
    background: "rgba(251,191,36,0.07)",
    border: "1px solid rgba(251,191,36,0.15)",
    borderRadius: 10, padding: "12px 16px",
  },
};

AdminDashboard.getLayout = function PageLayout(page) {
  return <>{page}</>;
};