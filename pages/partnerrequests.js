import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import io from "socket.io-client";
import { Loader2, Inbox, LogOut } from "lucide-react";

let socket;

const PartnerRequests = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [processingOrderId, setProcessingOrderId] = useState(null);
  const [activeTab, setActiveTab] = useState("Pending");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/socketio");

    fetchOrders();

    if (!socket) {
      socket = io({ path: "/api/socketio" });

      socket.on("connect", () => {
        console.log("✅ Socket connected:", socket.id);
      });

      socket.on("orderStatusChanged", () => {
        fetchOrders();
      });

      socket.on("newOrder", () => {
        toast.success("New service request received!");
        fetchOrders();
      });

      socket.on("disconnect", () => {
        console.log("❌ Socket disconnected");
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/partnerrequest", {
        withCredentials: true,
      });

      setPendingOrders(res.data.pending || []);
      setAcceptedOrders(res.data.accepted || []);
      setCompletedOrders(res.data.completed || []);
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Please log in to view requests");
        router.push("/technicianLogin");
      } else {
        toast.error("Something went wrong while fetching orders");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (orderId, action) => {
    setProcessingOrderId(orderId);

    try {
      await axios.patch(
        "/api/partnerrequest",
        { orderId, action },
        { withCredentials: true }
      );

      toast.success(`Order ${action.toLowerCase()} successfully`);
      fetchOrders();
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error("Order already accepted by another technician.");
      } else if (err.response?.status === 403) {
        toast.error("You're not authorized for this action.");
      } else if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        router.push("/technicianLogin");
      } else {
        toast.error("Failed to update order.");
      }
    } finally {
      setProcessingOrderId(null);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.delete("/api/technician/logout", { withCredentials: true });
      toast.success("Technician logged out successfully!", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
      router.push("/technicianLogin");
    } catch (error) {
      console.error('Technician logout failed:', error);
      toast.error("Logout failed. Please try again.", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  const renderOrders = (orders, type) => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center text-blue-700 mt-12 animate-pulse">
          <Loader2 className="w-10 h-10 animate-spin mb-2" />
          <p className="text-lg font-semibold">Loading service requests...</p>
        </div>
      );
    }

    if (!orders.length) {
      return (
        <div className="flex flex-col items-center justify-center text-gray-600 mt-12">
          <Inbox className="w-14 h-14 text-blue-400 mb-3" />
          <p className="text-lg font-medium">No {type.toLowerCase()} orders at the moment</p>
        </div>
      );
    }

    return (
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-2xl shadow-md border border-blue-200 p-6 hover:shadow-xl transition-all"
          >
            <h3 className="text-xl font-bold text-blue-900">{order.name}</h3>
            <p className="text-gray-700 mt-1 break-words">
              <strong>Service:</strong>{" "}
              {order.cart
                ? Object.values(order.cart).map((s) => s.name).join(", ")
                : "No services listed"}
            </p>
            <p className="text-gray-700">
              <strong>Address:</strong> {order.address?.line1},{" "}
              {order.address?.area}, {order.address?.city} -{" "}
              {order.address?.pincode}
            </p>
            <p className="text-gray-700">
              <strong>Phone:</strong> {order.phone}
            </p>
            <p className="text-gray-600">
              <strong>Status:</strong>{" "}
              <span
                className={
                  order.status === "Pending"
                    ? "text-yellow-500"
                    : order.status === "Accepted"
                      ? "text-green-600"
                      : "text-purple-600"
                }
              >
                {order.status}
              </span>
            </p>

            {type === "Pending" && (
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleAction(order._id, "Accepted")}
                  disabled={processingOrderId === order._id}
                  className="w-full sm:w-auto bg-green-600 text-white px-5 py-2 rounded-lg shadow transition disabled:opacity-60"
                >
                  {processingOrderId === order._id ? "Processing..." : "Accept"}
                </button>
                <button
                  onClick={() => handleAction(order._id, "Rejected")}
                  disabled={processingOrderId === order._id}
                  className="w-full sm:w-auto bg-red-600 text-white px-5 py-2 rounded-lg shadow transition disabled:opacity-60"
                >
                  {processingOrderId === order._id ? "Processing..." : "Reject"}
                </button>
              </div>
            )}

            {type === "Accepted" && (
              <div className="mt-4">
                <button
                  onClick={() => handleAction(order._id, "Completed")}
                  disabled={processingOrderId === order._id}
                  className="w-full sm:w-auto bg-purple-700 text-white px-5 py-2 rounded-lg shadow transition disabled:opacity-60"
                >
                  {processingOrderId === order._id
                    ? "Processing..."
                    : "Mark as Completed"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>fixKaput | Partner Requests</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-8 px-4 md:px-12">
        <div className="max-w-5xl mx-auto">
          {/* Header with logout */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-800 text-center sm:text-left">
              🛠 Partner Service Requests
            </h1>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition w-full sm:w-auto"
            >
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>


          {/* Tabs */}
          <div className="flex justify-center mb-6 flex-wrap gap-2">
            {["Pending", "Accepted", "Completed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 font-medium rounded-full transition ${activeTab === tab
                  ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white"
                  : "bg-white text-blue-700 border border-blue-300"
                  }`}
              >
                {tab} Orders
              </button>
            ))}
          </div>

          {/* Orders */}
          {activeTab === "Pending"
            ? renderOrders(pendingOrders, "Pending")
            : activeTab === "Accepted"
              ? renderOrders(acceptedOrders, "Accepted")
              : renderOrders(completedOrders, "Completed")}
        </div>
      </div>
    </>
  );
};
PartnerRequests.getLayout = function PageLayout(page) {
  return <>{page}</>; // no Layout, no Navbar
};

export default PartnerRequests;
