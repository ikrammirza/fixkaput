"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import debounce from "lodash.debounce";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("all"); // NEW: 'all' or 'pending'

  const fetchOrders = async (searchQuery = "", pageNumber = 1, currentTab = "all") => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/stats/orders", {
        params: {
          search: searchQuery,
          page: pageNumber,
          limit: 10,
          filter: currentTab === "pending" ? "pending" : "", // ✅ Correct usage
        },
      });
      setOrders(res.data.orders);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error fetching orders", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = debounce((value) => {
    setPage(1);
    setSearch(value);
  }, 500);

  useEffect(() => {
    fetchOrders(search, page, tab);
  }, [search, page, tab]);

  const renderCartItems = (cartObj) => {
    if (!cartObj || typeof cartObj !== "object") return "-";
    return Object.entries(cartObj)
      .map(([key, item]) => `${item.name || key} (x${item.qty || 1})`)
      .join(", ");
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Order List</h2>
        <div className="space-x-2">
          <button
            className={`px-3 py-1 rounded ${tab === "all" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => {
              setPage(1);
              setTab("all");
            }}
          >
            All Orders
          </button>
          <button
            className={`px-3 py-1 rounded ${tab === "pending" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => {
              setPage(1);
              setTab("pending");
            }}
          >
            Pending Orders
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search orders..."
        className="mb-4 px-3 py-2 border border-gray-300 rounded-md w-full"
        onChange={(e) => handleSearchChange(e.target.value)}
      />

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Services</th>
                <th className="px-4 py-2 text-left">Technician</th>
                <th className="px-4 py-2 text-left">Payment Status</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Address</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} className="border-b">
                    <td className="px-4 py-2">{order.name || "-"}</td>
                    <td className="px-4 py-2">{renderCartItems(order.cart)}</td>
                    <td className="px-4 py-2">
                      {order.technicianId ? (
                        <div>
                          <div className="font-semibold">{order.technicianId.name}</div>
                          <div className="text-sm text-gray-600">{order.technicianId.phone}</div>
                        </div>
                      ) : (
                        <span className="text-red-500">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-2">{order.paymentStatus || "-"}</td>
                    <td className="px-4 py-2">{order.phone || "-"}</td>
                    <td className="px-4 py-2">
  {order.address
    ? `${order.address.line1}, ${order.address.area}, ${order.address.city} - ${order.address.pincode || ""}`
    : "-"}
</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-4 space-x-4">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
