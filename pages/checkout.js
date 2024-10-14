import React, { useState, useEffect } from "react";
import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";
import Head from "next/head";
import Script from "next/script";
import Link from "next/link";
import axios from "axios";
import classNames from "classnames";
import { ToastContainer, toast } from "react-toastify";

const Checkout = ({ cart, addToCart, removeFromCart, clearCart, subTotal }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [disabled, setDisabled] = useState(true);
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update the corresponding state variable
    switch (name) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "phone":
        setPhone(value);
        break;
      case "address":
        setAddress(value);
        break;
      case "pincode":
        setPincode(value);
        break;
      default:
        break;
    }
  };

  // Check if all fields are filled and valid whenever any field changes
  useEffect(() => {
    const isEmailValid = /\S+@\S+\.\S+/.test(email); // Basic email validation
    const isPhoneValid = phone.length >= 10; // Basic phone length validation
    const allFieldsFilled =
      name.trim() &&
      isEmailValid &&
      isPhoneValid &&
      address.trim() &&
      pincode.trim();

    setDisabled(!allFieldsFilled);
  }, [name, email, phone, address, pincode]);

  // useEffect(() => {
  //   fetchData();
  // }, []);

  // const fetchData = async () => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     console.error("No token found");
  //     return;
  //   }

  //   const data = { token };
  //   try {
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_HOST}/api/getuser`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(data),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const res = await response.json();

  //     if (res.success) {
  //       setName(res.name);
  //       setPhone(res.phone);
  //       setAddress(res.address);
  //       setPincode(res.pincode);
  //       setEmail(res.email);
  //     } else {
  //       console.error(
  //         "Failed to fetch user data:",
  //         res.error || "Unknown error"
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user data:", error.message);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalAmount = subTotal + subTotal * 0.1;
    let oid = Math.floor(Math.random() * Date.now());

    const orderData = {
      oid,
      name,
      email,
      phone,
      address,
      pincode,
      amount: totalAmount,
      cart,
    };
    try {
      const response = await axios.post("/api/bookService", orderData);

      if (response.status === 200) {
        toast.success("Booking successful!", {
          position: "bottom-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          color: "blue",
        });
      } else {
        toast.error("Booking failed. Please try again.", {
          position: "bottom-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          color: "blue",
        });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.", {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        color: "blue",
      });
      console.error("Error during booking:", error);
    }
  };

  return (
    <>
      <Head>
        <title>Checkout - fixkaput.com</title>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0"
        />
      </Head>
      <div className="min-h-screen rounded-lg border bg-white py-10">
        <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
          <div className="px-4 pt-6">
            <p className="text-3xl font-semibold text-gray-900 mb-6">
              Review Cart Items
            </p>
            <div className="mt-8 space-y-3 rounded-lg border bg-white shadow-lg">
              <div className="px-6 py-6 bg-gray-100 rounded-lg">
                {Object.keys(cart).length === 0 && (
                  <div className="text-base font-semibold text-gray-700">
                    Your cart is empty
                  </div>
                )}
                <ol className="text-lg font-semibold space-y-4">
                  {Object.keys(cart).map((k) => (
                    <li
                      key={k}
                      className="flex justify-between items-center py-3 border-b last:border-b-0"
                    >
                      <div className="flex-grow">{cart[k].name}</div>
                      <div className="flex items-center justify-center w-1/3">
                        <AiFillMinusCircle
                          onClick={() =>
                            removeFromCart(k, 1, cart[k].price, cart[k].name)
                          }
                          className="cursor-pointer text-blue-500"
                        />
                        <span className="mx-2">{cart[k].qty}</span>
                        <AiFillPlusCircle
                          onClick={() =>
                            addToCart(k, 1, cart[k].price, cart[k].name)
                          }
                          className="cursor-pointer text-blue-500"
                        />
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <div className="mt-8">
              <span className="font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 border-0 py-3 px-6 focus:outline-none hover:from-blue-600 hover:to-blue-700 rounded text-base block text-center">
                Subtotal: ${subTotal.toFixed(2)}
              </span>
            </div>
          </div>
          <div className=" bg-gray-50 px-6 pt-10 lg:mt-0 lg:px-8 lg:pt-6 rounded-lg shadow-md">
            <p className="text-3xl font-semibold text-gray-900 mb-6">
              Booking Details
            </p>

            <form onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="mt-4 mb-2 block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <div className="relative mb-4">
                  <input
                    onChange={handleChange}
                    value={name}
                    type="text"
                    id="name"
                    name="name"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Your name here"
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                </div>

                <label
                  htmlFor="email"
                  className="mt-4 mb-2 block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="relative mb-4">
                  <input
                    onChange={handleChange}
                    value={email}
                    type="email"
                    id="email"
                    name="email"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Your email here"
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                </div>

                <label
                  htmlFor="phone"
                  className="mt-4 mb-2 block text-sm font-medium text-gray-700"
                >
                  Phone
                </label>
                <div className="relative mb-4">
                  <input
                    onChange={handleChange}
                    value={phone}
                    type="text"
                    id="phone"
                    name="phone"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Your number here"
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                      />
                    </svg>
                  </div>
                </div>

                <label
                  htmlFor="address"
                  className="mt-4 mb-2 block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <div className="flex flex-col sm:flex-row">
                  <div className="relative sm:w-full mb-4 sm:mb-0 sm:mr-2">
                    <input
                      onChange={handleChange}
                      value={address}
                      type="text"
                      id="address"
                      name="address"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Street Address"
                      required
                    />
                  </div>
                  <div className="flex-shrink-0 sm:w-32">
                    <input
                      onChange={handleChange}
                      value={pincode}
                      type="text"
                      id="pincode"
                      name="pincode"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="ZIP"
                      required
                    />
                  </div>
                </div>

                <div className="mt-6 border-t border-b py-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900">
                      Subtotal
                    </p>
                    <p className="font-semibold text-gray-900">
                      {subTotal.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900">Taxes</p>
                    <p className="font-semibold text-gray-900">
                      {(subTotal * 0.05).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">Total</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {(subTotal + subTotal*0.05 ).toFixed(2)}
                  </p>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={disabled}
                  className={classNames(
                    "mt-8 w-full rounded-lg px-6 py-3 font-medium text-white",
                    {
                      "bg-pink-500  cursor-not-allowed": disabled,
                      "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700":
                        !disabled,
                    }
                  )}
                >
                  Book Services
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
