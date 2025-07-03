import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Head from 'next/head';
import { FaRupeeSign } from 'react-icons/fa';
import { HiOutlinePhone, HiOutlineLocationMarker, HiOutlineCalendar } from 'react-icons/hi';

const MyBookings = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('/api/getUserOrders', { withCredentials: true });
        if (res.status === 200 && res.data.orders) {
          setOrders(res.data.orders);
        } else {
          toast.error('Failed to fetch bookings', {
            toastId: 'fetch-fail',
            position: 'top-center',
          });
        }
      } catch (err) {
        console.error(err);
        toast.error('You must be logged in to view bookings.', {
          toastId: 'auth-error',
          position: 'top-center',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const cancelBooking = async (orderId) => {
    const confirmDelete = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmDelete) return;

    try {
      const res = await axios.post('/api/deleteOrder', { orderId }, {
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
        <title>fixKaput | MyBookings</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 sm:px-6 lg:px-20 py-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-blue-800 mb-12 tracking-tight leading-tight drop-shadow-sm">
            My Bookings
          </h1>
        </div>

        {loading ? (
          <div className="text-center text-gray-600 text-lg">Loading bookings...</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">You have no bookings yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition"
              >
                <h2 className="text-lg font-semibold text-blue-800 mb-3">
                  Order #{order.oid}
                </h2>

                <div className="text-sm text-gray-700 space-y-1">
                  <p className="flex items-center gap-2">
                    <HiOutlinePhone className="text-blue-500" /> <strong>Phone:</strong> {order.phone}
                  </p>

                  <p className="flex items-start gap-2">
                    <HiOutlineLocationMarker className="text-green-600 mt-1" />
                    <span>
                      <strong>Address:</strong> {order.address.line1}, {order.address.area}, {order.address.city}, {order.address.pincode}
                    </span>
                  </p>

                  <p className="flex items-center gap-2">
                    <FaRupeeSign className="text-yellow-600" /> <strong>Amount:</strong> ₹{order.amount}
                  </p>

                  <p>
                    <strong>Payment:</strong>{' '}
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${order.paymentStatus === 'Paid'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide ${order.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'assigned'
                          ? 'bg-blue-100 text-blue-700'
                          : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                    >
                      {order.status || 'Pending'}
                    </span>
                  </p>
                  <div className="pt-2">
                    <strong>Services:</strong>
                    {order.cart && typeof order.cart === 'object' && (
                      <ul className="list-disc ml-5 mt-1 space-y-1">
                        {Object.values(order.cart).map((item, idx) => (
                          <li key={idx}>
                            <span className="font-medium">{item.name}</span> (Qty: {item.qty}, ₹{item.price}/unit)
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <p className="flex items-center gap-2 mt-3 text-gray-500">
                    <HiOutlineCalendar className="text-gray-400" />
                    <strong>Booked on:</strong>{' '}
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                {!order.technicianId && (
                  <button
                    className="mt-5 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition"
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
