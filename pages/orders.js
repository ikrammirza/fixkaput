import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Redirect to home if no token is found
    if (!localStorage.getItem("token")) {
      router.push("/");
    } else {
      // Fetch orders if token is present
      const fetchOrders = async () => {
        try {
          // Replace with your API endpoint
          const response = await fetch('/api/bookings', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
          });
          if (!response.ok) throw new Error('Failed to fetch orders');
          const data = await response.json();
          setOrders(data.orders);
        } catch (error) {
          console.error(error);
        }
      };

      fetchOrders();
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>Orders - fixkaput.com</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
      </Head>
      <div>
        <h1 className="font-semibold text-center p-8 text-2xl">My Orders</h1>
        <div className="container mx-auto">
          <div className="flex flex-col">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div className="overflow-hidden">
                  <table className="min-w-full text-left text-sm font-light text-surface dark:text-white">
                    <thead className="border-b border-neutral-200 font-medium dark:border-white/10">
                      <tr>
                        <th scope="col" className="px-6 py-4">#</th>
                        <th scope="col" className="px-6 py-4">First</th>
                        <th scope="col" className="px-6 py-4">Last</th>
                        <th scope="col" className="px-6 py-4">Handle</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="px-6 py-4 text-center">No orders found</td>
                        </tr>
                      ) : (
                        orders.map((order, index) => (
                          <tr key={index} className="border-b border-neutral-200 transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-white/10 dark:hover:bg-neutral-600">
                            <td className="whitespace-nowrap px-6 py-4 font-medium">{index + 1}</td>
                            <td className="whitespace-nowrap px-6 py-4">{order.firstName}</td>
                            <td className="whitespace-nowrap px-6 py-4">{order.lastName}</td>
                            <td className="whitespace-nowrap px-6 py-4">{order.handle}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Orders;
{/*
export async function getServerSideProps(context) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI);
  }
  let orders = await Order.find({});
  return {
    props: { orders: orders },
  };
} */}

