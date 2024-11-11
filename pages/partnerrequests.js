import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const PartnerRequests = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("technicianToken");
    if (token) {
      setIsAuthorized(true);
      fetchOrders(token); // Fetch both pending and accepted orders
    } else {
      toast.error("Please log in to access this page");
      router.push("/technicianLogin"); // Redirect to login if not authorized
    }
  }, []);

  const fetchOrders = async (token) => {
    try {
      const technicianId = localStorage.getItem("technicianId"); // Retrieve technicianId if stored separately
      // Fetch both pending and accepted orders for the technician
      const response = await axios.get("/api/partnerrequest", {
        headers: {
          Authorization: `Bearer ${token}`,
          "technician-id": technicianId,
        },
      });

      const pending = response.data.filter(
        (order) => order.status === "Pending"
      );
      const accepted = response.data.filter(
        (order) => order.status === "Accepted"
      );

      setPendingOrders(pending); // Set pending orders in state
      setAcceptedOrders(accepted); // Set accepted orders in state
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
    console.log("technicianId:", technicianId);
    try {
      const response = await axios.patch(
        "/api/partnerrequest",
        { orderId, action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "technician-id": technicianId,
          },
        }
      );

      // Refresh the orders list to reflect updated statuses
      toast.success(`Order ${action.toLowerCase()} successfully`);
      fetchOrders(token); // Fetch the updated list of orders
    } catch (error) {
      console.error("Failed to update order:", error);
      toast.error("Error updating order status");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Service Requests</h1>

      {/* Pending Orders Section */}
      <h2 className="text-xl font-semibold mb-2">Pending Orders</h2>
      {pendingOrders.length === 0 ? (
        <p>No pending requests at the moment.</p>
      ) : (
        <ul>
          {pendingOrders.map((order) => (
            <li key={order._id} className="p-4 mb-4 border rounded shadow">
              <h3 className="text-lg font-semibold">{order.name}</h3>
              <p>
                <strong>Service:</strong>{" "}
                {order.cart
                  ? Object.values(order.cart)
                      .map((service) => service.name)
                      .join(", ")
                  : "No services listed"}
              </p>
              <p>
                <strong>Address:</strong> {order.address}
              </p>
              <p>
                <strong>Phone:</strong> {order.phone}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <div className="mt-2">
                <button
                  onClick={() => handleAction(order._id, "Accepted")}
                  className="px-4 py-2 bg-green-500 text-white rounded mr-2"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleAction(order._id, "Rejected")}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Accepted Orders Section */}
      <h2 className="text-xl font-semibold mb-2 mt-8">Accepted Orders</h2>
      {acceptedOrders.length === 0 ? (
        <p>No accepted orders yet.</p>
      ) : (
        <ul>
          {acceptedOrders.map((order) => (
            <li key={order._id} className="p-4 mb-4 border rounded shadow">
              <h3 className="text-lg font-semibold">{order.name}</h3>
              <p>
                <strong>Service:</strong>{" "}
                {order.cart
                  ? Object.values(order.cart)
                      .map((service) => service.name)
                      .join(", ")
                  : "No services listed"}
              </p>
              <p>
                <strong>Address:</strong> {order.address}
              </p>
              <p>
                <strong>Phone:</strong> {order.phone}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PartnerRequests;
