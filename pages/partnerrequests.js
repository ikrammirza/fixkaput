import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import io from "socket.io-client";

let socket;

const PartnerRequests = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [processingOrderId, setProcessingOrderId] = useState(null);
  const [activeTab, setActiveTab] = useState("Pending");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/socketio");

    const token = localStorage.getItem("technicianToken");
    const technicianId = localStorage.getItem("technicianId");

    if (token && technicianId) {
      setIsAuthorized(true);
      fetchOrders(token);

      if (!socket) {
        socket = io({ path: "/api/socketio" });

        socket.on("connect", () => {
          console.log("Socket connected:", socket.id);
        });

        socket.on("orderStatusChanged", (order) => {
          toast.info(`Order ${order._id} status updated to ${order.status}`);
          fetchOrders(token);
        });

        socket.on("disconnect", () => {
          console.log("Socket disconnected");
        });
      }
    } else {
      toast.error("Please log in to access this page");
      router.push("/technicianLogin");
    }
  }, []);

  const fetchOrders = async (token) => {
    try {
      const technicianId = localStorage.getItem("technicianId");

      const response = await axios.get("/api/partnerrequest", {
        headers: {
          Authorization: `Bearer ${token}`,
          "technician-id": technicianId,
        },
      });

      const pending = response.data.filter((order) => order.status === "Pending");
      const accepted = response.data.filter((order) => order.status === "Accepted");

      setPendingOrders(pending);
      setAcceptedOrders(accepted);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
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

  const renderOrders = (orders, isPending) => (
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
              ? Object.values(order.cart)
                  .map((s) => s.name)
                  .join(", ")
              : "No services listed"}
          </p>
          <p className="text-gray-700">
            <strong>Address:</strong> {order.address}
          </p>
          <p className="text-gray-700">
            <strong>Phone:</strong> {order.phone}
          </p>
          <p className="text-gray-600">
            <strong>Status:</strong>{" "}
            <span className={isPending ? "text-yellow-500" : "text-green-600"}>
              {order.status}
            </span>
          </p>
          {isPending && (
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => handleAction(order._id, "Accepted")}
                disabled={processingOrderId === order._id}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-5 py-2 rounded-lg shadow transition disabled:opacity-60"
              >
                {processingOrderId === order._id ? "Processing..." : "Accept"}
              </button>
              <button
                onClick={() => handleAction(order._id, "Rejected")}
                disabled={processingOrderId === order._id}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-5 py-2 rounded-lg shadow transition disabled:opacity-60"
              >
                {processingOrderId === order._id ? "Processing..." : "Reject"}
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

        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setActiveTab("Pending")}
            className={`px-5 py-2 font-medium rounded-l-full border-r ${
              activeTab === "Pending"
                ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white"
                : "bg-white text-blue-700 border border-blue-300"
            }`}
          >
            Pending Orders
          </button>
          <button
            onClick={() => setActiveTab("Accepted")}
            className={`px-5 py-2 font-medium rounded-r-full ${
              activeTab === "Accepted"
                ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white"
                : "bg-white text-blue-700 border border-blue-300"
            }`}
          >
            Accepted Orders
          </button>
        </div>

        {/* Orders Content */}
        {activeTab === "Pending" ? (
          pendingOrders.length === 0 ? (
            <p className="text-gray-600 text-center">No pending requests at the moment.</p>
          ) : (
            renderOrders(pendingOrders, true)
          )
        ) : acceptedOrders.length === 0 ? (
          <p className="text-gray-600 text-center">No accepted orders yet.</p>
        ) : (
          renderOrders(acceptedOrders, false)
        )}
      </div>
    </div>
  );
};

export default PartnerRequests;
