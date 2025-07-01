import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Head from 'next/head';

const MyBookings = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookings using cookie-based session
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('/api/getUserOrders', {
          withCredentials: true // Important: sends cookies
        });

        if (res.status === 200 && res.data.orders) {
          setOrders(res.data.orders);
        } else {
          toast.error('Failed to fetch bookings', {
            toastId: 'fetch-fail',
            position: 'top-center',
            className: 'custom-toast-margin',
          });
        }
      } catch (err) {
        console.error(err);
        toast.error('You must be logged in to view bookings.', {
          toastId: 'auth-error',
          position: 'top-center',
          className: 'custom-toast-margin',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Cancel order
  const cancelBooking = async (orderId) => {
    const confirmDelete = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmDelete) return;

    try {
      const res = await axios.delete('/api/deleteOrder', {
        data: { orderId },
        withCredentials: true
      });

      if (res.status === 200) {
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
        toast.success('Booking cancelled successfully.', {
          toastId: 'cancel-success',
          position: 'top-center',
        });
      } else {
        throw new Error('Deletion failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to cancel the booking.', {
        toastId: 'cancel-error',
        position: 'top-center',
      });
    }
  };

  return (
    <>
      <Head>
        <title>My Bookings - fixkaput.com</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">My Bookings</h1>

        {loading ? (
          <div className="text-center text-gray-600 text-lg">Loading bookings...</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">You have no bookings yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Order ID: {order.oid}</h2>
                <p className="text-sm text-gray-600 mb-1"><strong>Phone:</strong> {order.phone}</p>
                <p className="text-sm text-gray-600 mb-1"><strong>Address:</strong> {order.address.line1}, {order.address.area}, {order.address.city}, {order.address.pincode}</p>
                <p className="text-sm text-gray-600 mb-1"><strong>Amount:</strong> ₹{order.amount}</p>
                <div className="text-sm text-gray-600 mb-1">
                  <strong>Services Booked:</strong>
                  {order.cart && typeof order.cart === "object" && (
                    <div className="ml-2 mt-1">
                      {Object.values(order.cart).map((item, idx) => (
                        <div key={idx} className="mb-2">
                          <p>🛠️ <strong>{item.name}</strong></p>
                          <p>Qty: {item.qty}</p>
                          <p>Price per unit: ₹{item.price}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1"><strong>Payment:</strong> {order.paymentStatus}</p>
                <p className="text-sm text-gray-500 mt-2"><strong>Booked on:</strong> {new Date(order.createdAt).toLocaleString()}</p>

                {/* Cancel Button Logic */}
                {!order.technicianId && (
                  <button
                    className="mt-4 bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded"
                    onClick={() => cancelBooking(order._id)}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyBookings;
