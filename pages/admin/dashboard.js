import { useEffect, useState } from "react";
import axios from "axios";
import { FaBars, FaTimes, FaUserTie, FaUsers, FaClipboardList,FaHome, FaMoneyBill } from "react-icons/fa";
import UserList from "../../components/UserList";
import OrderList from "../../components/OrderList";
// import dynamic from "next/dynamic";
// const DemandByAreaService = dynamic(() => import("../../components/DemandByAreaService"), {
//   ssr: false,
// });
import DemandByAreaService from "../../components/DemandByAreaService";
import TechnicianList from "../../components/TechnicianList";
export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const [stats, setStats] = useState({
    orders: 0,
    technicians: 0,
    users: 0,
    // revenue: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, techsRes, usersRes, ] = await Promise.all([
          axios.get('/api/admin/stats/orders'),
          axios.get('/api/admin/stats/technicians'),
          axios.get('/api/admin/stats/users')
          //axios.get('/api/admin/stats/revenue'),
        ]);
      
        setStats({
          orders: ordersRes.data.totalorders,
          technicians: techsRes.data.totaltechnicians,
          users: usersRes.data.totalusers,
          //revenue: revenueRes.data.total, // assuming revenue returns { total: 150000 }
        });
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      }
    };

    fetchStats();
  }, []);

  return (
    
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
        <button onClick={() => setActiveTab("dashboard")} className="flex items-center space-x-3 text-white hover:text-blue-300">
  <FaHome />
  {sidebarOpen && <span>Dashboard</span>}
</button>
  <button onClick={() => setActiveTab("orders")} className="flex items-center space-x-3 text-white hover:text-blue-300">
    <FaClipboardList />
    {sidebarOpen && <span>Orders</span>}
  </button>
  <button onClick={() => setActiveTab("technicians")} className="flex items-center space-x-3 text-white hover:text-blue-300">
    <FaUserTie />
    {sidebarOpen && <span>Technicians</span>}
  </button>
  <button onClick={() => setActiveTab("users")} className="flex items-center space-x-3 text-white hover:text-blue-300">
    <FaUsers />
    {sidebarOpen && <span>Users</span>}
  </button>
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

  {activeTab === "orders" && <OrderList/>}

  {activeTab === "technicians" && <TechnicianList/>}
</main>
      
    </div>
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
