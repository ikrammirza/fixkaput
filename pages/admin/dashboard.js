import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  FaBars, FaTimes, FaUserTie, FaUsers, FaClipboardList, FaHome
} from "react-icons/fa";
import UserList from "../../components/UserList";
import OrderList from "../../components/OrderList";
import DemandByAreaService from "../../components/DemandByAreaService";
import TechnicianList from "../../components/TechnicianList";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({ orders: 0, technicians: 0, users: 0 });
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
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

        const [ordersRes, techsRes, usersRes] = await Promise.all([
          axios.get('/api/admin/stats/orders'),
          axios.get('/api/admin/stats/technicians'),
          axios.get('/api/admin/stats/users'),
        ]);

        setStats({
          orders: ordersRes.data.totalorders,
          technicians: techsRes.data.totaltechnicians,
          users: usersRes.data.totalusers,
        });
      } catch (error) {
        console.error("Access denied or fetch error", error);
        setUnauthorized(true);
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
  }, []);

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (unauthorized) return <p className="p-6 text-center text-red-500">Unauthorized Access</p>;

  return (
    <>
      <Head>
        <title>fixKaput | Dashboard</title>
        <meta name="description" content="Admin panel for managing FixKaput orders, users, and technicians." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen flex bg-gray-100">
        {/* Sidebar */}
        <div className={`transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"} bg-gradient-to-b from-blue-600 to-blue-900 text-white p-4`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl font-bold ${sidebarOpen ? "block" : "hidden"}`}>Admin</h2>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white text-2xl">
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
          <nav className="space-y-4">
            <SidebarButton tab="dashboard" label="Dashboard" icon={<FaHome />} activeTab={activeTab} setActiveTab={setActiveTab} sidebarOpen={sidebarOpen} />
            <SidebarButton tab="orders" label="Orders" icon={<FaClipboardList />} activeTab={activeTab} setActiveTab={setActiveTab} sidebarOpen={sidebarOpen} />
            <SidebarButton tab="technicians" label="Technicians" icon={<FaUserTie />} activeTab={activeTab} setActiveTab={setActiveTab} sidebarOpen={sidebarOpen} />
            <SidebarButton tab="users" label="Users" icon={<FaUsers />} activeTab={activeTab} setActiveTab={setActiveTab} sidebarOpen={sidebarOpen} />
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

          {activeTab === "dashboard" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<FaClipboardList />} title="Total Orders" value={stats.orders} />
                <StatCard icon={<FaUserTie />} title="Technicians" value={stats.technicians} />
                <StatCard icon={<FaUsers />} title="Users" value={stats.users} />
              </div>
              <DemandByAreaService />
            </>
          )}
          {activeTab === "users" && <UserList />}
          {activeTab === "orders" && <OrderList />}
          {activeTab === "technicians" && <TechnicianList />}
        </main>
      </div>
    </>
  );
}

function SidebarButton({ tab, label, icon, activeTab, setActiveTab, sidebarOpen }) {
  return (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center space-x-3 text-white hover:text-blue-300`}
    >
      {icon}
      {sidebarOpen && <span>{label}</span>}
    </button>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 text-center">
      <div className="text-blue-600 text-3xl mx-auto mb-2">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold text-blue-700">{value}</p>
    </div>
  );
}

AdminDashboard.getLayout = function PageLayout(page) {
  return <>{page}</>;
};
