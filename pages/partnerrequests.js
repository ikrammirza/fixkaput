import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import io from "socket.io-client";

let socket;

const PartnerRequests = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [processingOrderId, setProcessingOrderId] = useState(null);
  const [activeTab, setActiveTab] = useState("Pending");
  const router = useRouter();
  const tokenRef = useRef(null);

  useEffect(() => {
    fetch("/api/socketio"); // Ensure socket is initialized server-side

    const token = localStorage.getItem("technicianToken");
    const technicianId = localStorage.getItem("technicianId"); // Should be MongoDB _id

    if (!token || !technicianId) {
      toast.error("Please log in to access this page");
      router.push("/technicianLogin");
      return;
    }

    tokenRef.current = token;
    setIsAuthorized(true);
    fetchOrders(token);

    if (!socket) {
      socket = io({ path: "/api/socketio" });

      socket.on("connect", () => {
        console.log("✅ Socket connected:", socket.id);
      });

      socket.on("orderStatusChanged", () => {
        console.log("🔄 Order status changed via socket");
        fetchOrders(tokenRef.current);
      });

      const NEW_ORDER_TOAST_ID = "new-order-toast";
      socket.on("newOrder", (order) => {
        if (!order || !order._id) return;
        if (!toast.isActive(NEW_ORDER_TOAST_ID)) {
          toast.success("New service request received!", {
            toastId: NEW_ORDER_TOAST_ID,
          });
        }
        setTimeout(() => toast.dismiss(NEW_ORDER_TOAST_ID), 5000);
        fetchOrders(tokenRef.current);
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

  const fetchOrders = async (token) => {
    try {
      const technicianId = localStorage.getItem("technicianId");

      const res = await axios.get("/api/partnerrequest", {
        headers: {
          Authorization: `Bearer ${token}`,
          "technician-id": technicianId,
        },
      });

      setPendingOrders(res.data.pending || []);
      setAcceptedOrders(res.data.accepted || []);
      setCompletedOrders(res.data.completed || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      toast.error("Error fetching orders");
    }
  };

  const handleAction = async (orderId, action) => {
    if (!isAuthorized) {
      toast.error("You need to log in to perform this action");
      return;
    }

    const token = localStorage.getItem("technicianToken");
    const technicianId = localStorage.getItem("technicianId");
    setProcessingOrderId(orderId);

    try {
      await axios.patch(
        "/api/partnerrequest",
        { orderId, action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "technician-id": technicianId,
          },
        }
      );
      toast.success(`Order ${action.toLowerCase()} successfully`);
      fetchOrders(token);
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("This order was already accepted by another technician.");
      } else {
        toast.error("Error updating order status");
        console.error("Failed to update order:", error);
      }
    } finally {
      setProcessingOrderId(null);
    }
  };

  const renderOrders = (orders, type) => (
    <div className="grid gap-6">
      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white rounded-2xl shadow-md border border-blue-200 p-6 hover:shadow-xl transition-all"
        >
          <h3 className="text-xl font-bold text-blue-900">{order.name}</h3>
          <p className="text-gray-700 mt-1">
            <strong>Service:</strong>{" "}
            {order.cart
              ? Object.values(order.cart).map((s) => s.name).join(", ")
              : "No services listed"}
          </p>
          <p className="text-gray-700">
            <strong>Address:</strong> {order.address?.line1},{" "}
            {order.address?.area}, {order.address?.city} - {order.address?.pincode}
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
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => handleAction(order._id, "Accepted")}
                disabled={processingOrderId === order._id}
                className="bg-green-600 text-white px-5 py-2 rounded-lg shadow transition disabled:opacity-60"
              >
                {processingOrderId === order._id ? "Processing..." : "Accept"}
              </button>
              <button
                onClick={() => handleAction(order._id, "Rejected")}
                disabled={processingOrderId === order._id}
                className="bg-red-600 text-white px-5 py-2 rounded-lg shadow transition disabled:opacity-60"
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
                className="bg-purple-700 text-white px-5 py-2 rounded-lg shadow transition disabled:opacity-60"
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-8 px-4 md:px-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-center text-blue-800 mb-8">
          🛠 Partner Service Requests
        </h1>

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

        {activeTab === "Pending"
          ? renderOrders(pendingOrders, "Pending")
          : activeTab === "Accepted"
            ? renderOrders(acceptedOrders, "Accepted")
            : renderOrders(completedOrders, "Completed")}
      </div>
    </div>
  );
};

export default PartnerRequests;
