import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  FaBars, FaTimes, FaUserTie, FaUsers, FaClipboardList, FaHome, FaRupeeSign
} from "react-icons/fa";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

import UserList from "../../components/UserList";
import OrderList from "../../components/OrderList";
import TechnicianList from "../../components/TechnicianList";

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query, matches]);

  return matches;
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({ orders: 0, technicians: 0, users: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [insight, setInsight] = useState("");

  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 639px)");
  const COLORS = ["#3B82F6", "#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const res = await axios.get("/api/me", { withCredentials: true });
        const user = res.data.user;

        if (!user.isAdmin) {
          setUnauthorized(true);
          return;
        }

        const [
          ordersRes,
          techsRes,
          usersRes,
          revenueRes,
          demandRes,
        ] = await Promise.all([
          axios.get('/api/admin/stats/orders', { withCredentials: true }),
          axios.get('/api/admin/stats/technicians', { withCredentials: true }),
          axios.get('/api/admin/stats/users', { withCredentials: true }),
          axios.get('/api/admin/stats/revenue', { withCredentials: true }),
          axios.get('/api/admin/insights/demandAreaService', { withCredentials: true }),
        ]);

        setStats({
          orders: ordersRes.data.totalorders,
          technicians: techsRes.data.totaltechnicians,
          users: usersRes.data.totalusers,
          revenue: revenueRes.data.totalRevenue,
        });

        const grouped = {};
        demandRes.data.demand.forEach((d) => {
          const service = d._id.service;
          const area = d._id.area;
          if (!grouped[service]) {
            grouped[service] = { value: 0, areas: new Set() };
          }
          grouped[service].value += d.count;
          grouped[service].areas.add(area);
        });

        const formattedData = Object.entries(grouped).map(([name, data]) => ({
          name,
          value: data.value,
          areas: Array.from(data.areas),
        }));

        setChartData(formattedData);
        setInsight(demandRes.data.insight);
      } catch (error) {
        console.error("❌ Access denied or fetch error:", error);
        setUnauthorized(true);
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (window.innerWidth < 640) {
      setSidebarOpen(false);
    }
  };

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (unauthorized) return <p className="p-6 text-center text-red-500">Unauthorized Access</p>;

  return (
    <>
      <Head>
        <title>fixKaput | Dashboard</title>
        <meta name="description" content="Admin panel for managing FixKaput orders, users, and technicians." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-100 flex">
        <aside className={`bg-gradient-to-b from-blue-600 to-blue-900 text-white transition-all duration-300 ease-in-out
          ${sidebarOpen ? "w-64" : "w-16"} hidden sm:flex flex-col`}>
          <div className="flex justify-between items-center p-4 border-b border-blue-500">
            <h2 className={`text-xl font-bold ${sidebarOpen ? "block" : "hidden"}`}>fixKaput Admin</h2>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white text-2xl p-2 hover:bg-blue-700 rounded transition-colors">
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          <nav className="space-y-4 px-2 mt-4">
            <SidebarButton tab="dashboard" label="Dashboard" icon={<FaHome />} activeTab={activeTab} setActiveTab={handleTabClick} sidebarOpen={sidebarOpen} />
            <SidebarButton tab="orders" label="Orders" icon={<FaClipboardList />} activeTab={activeTab} setActiveTab={handleTabClick} sidebarOpen={sidebarOpen} />
            <SidebarButton tab="technicians" label="Technicians" icon={<FaUserTie />} activeTab={activeTab} setActiveTab={handleTabClick} sidebarOpen={sidebarOpen} />
            <SidebarButton tab="users" label="Users" icon={<FaUsers />} activeTab={activeTab} setActiveTab={handleTabClick} sidebarOpen={sidebarOpen} />
          </nav>
        </aside>

        <main className="flex-1">
          <header className="bg-white shadow-sm border-b border-gray-200 sm:hidden">
            <div className="flex items-center justify-between px-4 py-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <FaBars className="text-gray-600" />
              </button>
              <h1 className="text-lg font-semibold text-gray-800">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h1>
            </div>
          </header>

          <div className="px-4 py-6 sm:px-6 space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Admin Dashboard</h1>

            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard icon={<FaClipboardList />} title="Total Orders" value={stats.orders} />
                  <StatCard icon={<FaUserTie />} title="Technicians" value={stats.technicians} />
                  <StatCard icon={<FaUsers />} title="Users" value={stats.users} />
                  <StatCard icon={<FaRupeeSign />} title="Total Revenue" value={`₹${stats.revenue}`} />
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-lg shadow mt-4">
                  <h2 className="text-xl font-bold mb-4">Demand by Area & Service</h2>

                  <div className="overflow-x-auto">
                    {isMobile ? (
                      <div className="flex flex-col items-center">
                        <PieChart width={300} height={300}>
                          <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label={({ name, percent }) =>
                              `${name.length > 8 ? name.slice(0, 8) + "…" : name} (${(percent * 100).toFixed(0)}%)`
                            }
                          >
                            {chartData.map((_, index) => (
                              <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value, name, props) => [`${value}`, props.payload.name]}
                            contentStyle={{ fontSize: "14px" }}
                            labelStyle={{ fontWeight: "bold", color: "#374151" }}
                          />
                        </PieChart>


                        <div className="mt-4 flex flex-wrap justify-center gap-2 max-w-xs">
                          {chartData.map((entry, index) =>
                            entry.areas.map((area, i) => (
                              <div
                                key={`${entry.name}-${area}-${i}`}
                                className="text-xs flex items-center px-2 py-1 bg-white border rounded shadow-sm"
                              >
                                <div
                                  className="w-3 h-3 mr-2 rounded-sm"
                                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                ></div>
                                <span className="text-gray-700">{area}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ) : (
                      <div style={{ minWidth: `${chartData.length * 100}px`, height: "320px" }}>
                        <BarChart
                          width={chartData.length * 100}
                          height={320}
                          data={chartData}
                          margin={{ top: 20, right: 30, left: 0, bottom: 70 }}
                        >
                          <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.9} />
                              <stop offset="95%" stopColor="#60A5FA" stopOpacity={0.8} />
                            </linearGradient>
                          </defs>
                          <XAxis
                            dataKey="name"
                            interval={0}
                            angle={-30}
                            textAnchor="end"
                            height={80}
                            tick={{ fontSize: 11 }}
                            stroke="#6B7280"
                          />
                          <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" />
                          <Tooltip contentStyle={{ fontSize: "14px" }} labelStyle={{ fontWeight: "bold", color: "#374151" }} />
                          <Legend verticalAlign="top" height={36} />
                          <Bar dataKey="value" fill="url(#colorUv)" barSize={40} radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 p-4 bg-gray-50 rounded">
                    <h3 className="font-semibold mb-1">AI Insight</h3>
                    {insight ? (
                      <p className="text-sm text-gray-700">{insight}</p>
                    ) : (
                      <div className="mt-4 p-4 bg-yellow-50 rounded">
                        <h3 className="font-semibold mb-1 text-yellow-800">Insight unavailable</h3>
                        <p className="text-sm text-yellow-700">
                          We're currently experiencing high traffic. Insights will return shortly.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "users" && <UserList />}
            {activeTab === "orders" && <OrderList />}
            {activeTab === "technicians" && <TechnicianList />}
          </div>
        </main>
      </div>
    </>
  );
}

function SidebarButton({ tab, label, icon, activeTab, setActiveTab, sidebarOpen }) {
  const isActive = activeTab === tab;
  return (
    <button
      onClick={() => setActiveTab(tab)}
      className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200 
        ${isActive ? "bg-blue-700 text-white" : "text-blue-100 hover:bg-blue-700 hover:text-white"}`}
    >
      <span className="text-xl">{icon}</span>
      {sidebarOpen && <span className="font-medium">{label}</span>}
    </button>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 text-center hover:shadow-lg transition-shadow duration-200">
      <div className="text-blue-600 text-3xl mx-auto mb-2">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold text-blue-700">{value}</p>
    </div>
  );
}

AdminDashboard.getLayout = function PageLayout(page) {
  return <>{page}</>;
};
