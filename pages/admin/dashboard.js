import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  FaBars, FaTimes, FaUserTie, FaUsers, FaClipboardList, FaHome
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import UserList from "../../components/UserList";
import OrderList from "../../components/OrderList";
import TechnicianList from "../../components/TechnicianList";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({ orders: 0, technicians: 0, users: 0 });
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [insight, setInsight] = useState("");

  const router = useRouter();

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const res = await axios.get("/api/me");
        const user = res.data.user;
        if (!user.isAdmin) {
          setUnauthorized(true);
          return;
        }

        const [ordersRes, techsRes, usersRes, demandRes] = await Promise.all([
          axios.get('/api/admin/stats/orders'),
          axios.get('/api/admin/stats/technicians'),
          axios.get('/api/admin/stats/users'),
          axios.get('/api/admin/insights/demandAreaService'),
        ]);

        setStats({
          orders: ordersRes.data.totalorders,
          technicians: techsRes.data.totaltechnicians,
          users: usersRes.data.totalusers,
        });

        setChartData(
          demandRes.data.demand.map((d) => ({
            name: `${d._id.area} — ${d._id.service}`,
            value: d.count,
          }))
        );
        setInsight(demandRes.data.insight);
      } catch (error) {
        console.error("Access denied or fetch error", error);
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

  const chartWidth = Math.max(chartData.length * 100, 600);

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
        {/* Sidebarr */}
        <aside className={`bg-gradient-to-b from-blue-600 to-blue-900 text-white transition-all duration-300 ease-in-out
          ${sidebarOpen ? "w-64" : "w-16"} hidden sm:flex flex-col`}>

          <div className="flex justify-between items-center p-4 border-b border-blue-500">
            <h2 className={`text-xl font-bold ${sidebarOpen ? "block" : "hidden"}`}>fixKaput Admin</h2>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white text-2xl p-2 hover:bg-blue-700 rounded transition-colors"
            >
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

        {/* Main Content */}
        <main className="flex-1">
          {/* Mobile header */}
          <header className="bg-white shadow-sm border-b border-gray-200 sm:hidden">
            <div className="flex items-center justify-between px-4 py-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FaBars className="text-gray-600" />
              </button>
              <h1 className="text-lg font-semibold text-gray-800">
                {activeTab === "dashboard" && "Dashboard"}
                {activeTab === "orders" && "Orders"}
                {activeTab === "technicians" && "Technicians"}
                {activeTab === "users" && "Users"}
              </h1>
            </div>
          </header>

          <div className="px-4 py-6 sm:px-6 space-y-6">
            {/* Page Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Admin Dashboard
            </h1>

            {/* Dashboard Stats */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <StatCard icon={<FaClipboardList />} title="Total Orders" value={stats.orders} />
                  <StatCard icon={<FaUserTie />} title="Technicians" value={stats.technicians} />
                  <StatCard icon={<FaUsers />} title="Users" value={stats.users} />
                </div>

                {/* Chart Inside Dashboard */}
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow mt-4">
                  <h2 className="text-xl font-bold mb-4">Demand by Area & Service</h2>
                  <div className="overflow-x-auto sm:overflow-visible">
                    <div className="min-w-[600px] max-w-full" style={{ width: chartWidth }}>
                      <BarChart
                        width={chartWidth}
                        height={300}
                        data={chartData}
                        className="transition-transform duration-500 ease-in-out"
                      >
                        <XAxis
                          dataKey="name"
                          interval={0}
                          tick={({ x, y, payload }) => {
                            const lines = payload.value.split(" — ");
                            return (
                              <g transform={`translate(${x},${y + 10})`}>
                                {lines.map((line, index) => (
                                  <text
                                    key={index}
                                    x={0}
                                    y={index * 12}
                                    textAnchor="middle"
                                    fill="#666"
                                    fontSize="10"
                                  >
                                    {line}
                                  </text>
                                ))}
                              </g>
                            );
                          }}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="value"
                          fill="#2563EB"
                          animationDuration={800}
                          animationEasing="ease-in-out"
                        />
                      </BarChart>
                    </div>
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

            {/* Tab Components */}
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
