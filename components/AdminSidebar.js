import Link from "next/link";
import { useRouter } from "next/router";

const AdminSidebar = () => {
  const router = useRouter();

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: "📊" },
    { name: "Orders", path: "/admin/orders", icon: "📦" },
    { name: "Services", path: "/admin/services", icon: "🛠️" },
    { name: "Messages", path: "/admin/messages", icon: "📬" },
    { name: "Settings", path: "/admin/settings", icon: "⚙️" },
  ];

  return (
    <div className="h-screen bg-gradient-to-b from-blue-800 to-blue-900 text-white w-64 fixed top-0 left-0 shadow-lg p-4">
      <h2 className="text-2xl font-bold mb-8">FixKaput Admin</h2>
      <ul className="space-y-4">
        {menuItems.map((item) => (
          <li key={item.name}>
            <Link href={item.path}>
              <span className={`flex items-center space-x-2 p-2 rounded-md hover:bg-blue-700 cursor-pointer ${router.pathname === item.path ? 'bg-blue-700' : ''}`}>
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default AdminSidebar;