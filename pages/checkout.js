import React, { useState, useEffect } from "react";
import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";
import Head from "next/head";
import Script from "next/script";
import Link from "next/link";
import axios from "axios";
import classNames from "classnames";
import { ToastContainer, toast } from "react-toastify";

const Checkout = ({ cart, addToCart, removeFromCart, clearCart, subTotal }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({ name: '', phone: '' });
  const [name, setName] = useState("");

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [isPhoneEditable, setIsPhoneEditable] = useState(true);
  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "name":
        setName(value);
        break;
      case "phone":
        setPhone(value);
        break;
      case "area":
        setArea(value);
        break;
      case "line1":
        setLine1(value);
        break;
      case "city":
        setCity(value);
        break;
      case "pincode":
        setPincode(value);
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me', {
          credentials: 'include',
        });

        const data = await res.json();
        console.log("User fetch response:", data); // 🔍 Check this

        if (data.success) {
          setIsLoggedIn(true);
          setUserData(data.user);
          setPhone(data.user.phone);     // ✅ Should be a string
          setName(data.user.name);       // ✅ Should be a string
          setIsPhoneEditable(false);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setIsLoggedIn(false);
      }
    };

    fetchUser();
  }, []);



  // Check if all fields are filled and valid whenever any field changes
  useEffect(() => {
    const isPhoneValid = /^\d{10}$/.test(phone); // Basic phone validation
    const allFieldsFilled =
      (name || '').trim() &&
      isPhoneValid &&
      (area || '').trim() &&
      (line1 || '').trim() &&
      (city || '').trim() &&
      (pincode || '').trim();
    setDisabled(!allFieldsFilled);
  }, [name, phone, area, line1, city, pincode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted, handleSubmit triggered");

    const totalAmount = subTotal + subTotal * 0.05;
    let oid = Math.floor(Math.random() * Date.now());

    const orderData = {
      oid,
      name,
      phone,
      address: {
        area,
        line1,
        city,
        pincode,
      },
      amount: totalAmount,
      cart,
    };

    console.log("Order Data:", orderData);

    try {
      console.log("Sending POST request to /api/bookService");
      const response = await axios.post("/api/bookService", orderData);
      console.log("Response from /api/bookService:", response);

      if (response.status === 200) {
        toast.success("Booking successful!", {
          toastId: "booking-error",
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
          toastClassName: "custom-toast-margin",
        });

        // Optional profile update
        try {
          const sessionRes = await fetch("/api/me", { credentials: "include" });
          const sessionData = await sessionRes.json();

          if (sessionData.success && sessionData.user) {
            await axios.post(
              "/api/updateuser",
              {
                phone,
                name,
                address: { area, line1, city, pincode },
              },
              { withCredentials: true }
            );

            console.log("User profile updated.");
          } else {
            console.warn("Session not valid or user not found during update.");
          }
        } catch (saveErr) {
          console.error("Error verifying session or updating user:", saveErr);
        }

        setName("");
        setArea("");
        setLine1("");
        setCity("");
        setPincode("");
        if (isPhoneEditable) setPhone("");

        clearCart();
      } else {
        toast.error("Booking failed. Please try again.", {
          toastId: "booking-error",
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
          toastClassName: "custom-toast-margin",
        });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.", {
        toastId: "booking-error",
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
        toastClassName: "custom-toast-margin",
      });
      console.error("Error during booking:", error);
    }
  };

  return (
    <>
      <Head>
        <title>fixKaput | Checkout</title>
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
                Subtotal: ₹{subTotal.toFixed(2)}
              </span>
            </div>
          </div>
          <div className=" bg-gray-50 px-6 pt-10 lg:mt-0 lg:px-8 lg:pt-6 rounded-lg shadow-md">
            {isLoggedIn && (
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Booking Details</h2>
            )}
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
                  htmlFor="phone"
                  className="mt-4 mb-1 block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <div className="flex items-center mb-4 rounded-lg border border-gray-300 bg-white shadow-sm focus-within:ring-1 focus-within:ring-blue-500">
                  <span className="flex items-center justify-center px-4 py-3 text-sm text-gray-600 bg-gray-100 rounded-l-lg border-r border-gray-300">
                    +91
                  </span>
                  <input
                    onChange={handleChange}
                    value={phone}
                    type="text"
                    id="phone"
                    name="phone"
                    maxLength="10"
                    className="w-full rounded-r-lg px-4 py-3 text-sm text-gray-800 outline-none focus:ring-0"
                    placeholder="Enter 10-digit number"
                    disabled={!isPhoneEditable}
                  />
                </div>

                {/* Optional: Phone validation error */}
                {phone && !/^\d{10}$/.test(phone) && (
                  <p className="text-red-500 text-xs mt-1">
                    Please enter a valid 10-digit phone number.
                  </p>
                )}
                <label className="mt-4 mb-2 block text-sm font-medium text-gray-700">Address</label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="area"
                    value={area}
                    onChange={handleChange}
                    placeholder="Area"
                    className="rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500"
                    required
                  />
                  <input
                    type="text"
                    name="line1"
                    value={line1}
                    onChange={handleChange}
                    placeholder="Street / Line 1"
                    className="rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500"
                    required
                  />
                  <input
                    type="text"
                    name="city"
                    value={city}
                    onChange={handleChange}
                    placeholder="City"
                    className="rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500"
                    required
                  />
                  <input
                    type="text"
                    name="pincode"
                    value={pincode}
                    onChange={handleChange}
                    placeholder="Pincode"
                    className="rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500"
                    required
                  />
                </div>


                <div className="mt-6 border-t border-b py-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900">
                      Subtotal
                    </p>
                    <p className="font-semibold text-gray-900">
                      ₹{subTotal.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900">Taxes</p>
                    <p className="font-semibold text-gray-900">
                      ₹{(subTotal * 0.05).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">Total</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    ₹{(subTotal + subTotal * 0.05).toFixed(2)}
                  </p>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={disabled || !isLoggedIn || subTotal === 0}
                  className={classNames(
                    "mt-8 w-full rounded-lg px-6 py-3 font-medium text-white",
                    {
                      "bg-blue-300 cursor-not-allowed": disabled || !isLoggedIn || subTotal === 0,
                      "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700":
                        !disabled && isLoggedIn && subTotal > 0,
                    }
                  )}
                >
                  {!isLoggedIn
                    ? "Login to Book"
                    : subTotal === 0
                      ? "Select Services to Book"
                      : "Book Services"}
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




