import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
const MyAccount = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    const data = { token };
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/getuser`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const res = await response.json();

      if (res.success) {
        setName(res.name);
        setPhone(res.phone);
        setAddress(res.address);
        setPincode(res.pincode);
      } else {
        console.error(
          "Failed to fetch user data:",
          res.error || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };
  const handleUserSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const token = localStorage.getItem("token"); // Retrieve token from local storage
      if (!token) {
        throw new Error("No token found");
      }

      const data = {
        token,
        address,
        pincode,
        phone,
        name,
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/updateuser`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const res = await response.json();
      if (res.success) {
        toast.success("successfully Updated Details", {
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
        fetchData();
      }
    } catch (error) {
      toast.error("Error updateding user Details", {
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
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const token = localStorage.getItem("token"); // Retrieve token from local storage
      if (!token) {
        throw new Error("No token found");
      }

      const data = {
        token,
        currentPassword,
        newPassword,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/updatepassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const res = await response.json();
      if (res.success) {
        toast.success("Successfully updated password", {
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
      toast.error("Error updating password", {
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
    setCurrentPassword("");
    setNewPassword("");
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "name":
        setName(value);
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
      case "currentPassword":
        setCurrentPassword(value);
        break;
      case "newPassword":
        setNewPassword(value);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Head>
        <title>My account - fixkaput.com</title>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0"
        />
      </Head>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ToastContainer
          toastStyle={{ backgroundColor: "#1e88e5" }}
          position="bottom-center"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <h1 className="text-3xl text-center font-bold mb-6">
          Update Your Account
        </h1>
        <form className="space-y-8">
          {/* Delivery Details Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Delivery Details
            </h2>

            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
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
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Your name here"
              />
            </div>

            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email (cannot be updated)
            </label>
            <div className="relative mb-4">
              <input
                value={email}
                type="email"
                id="email"
                name="email"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm outline-none bg-gray-100 cursor-not-allowed"
                placeholder="Your email here"
                readOnly
              />
            </div>

            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
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
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Your number here"
              />
            </div>

            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Address
            </label>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1">
                <input
                  onChange={handleChange}
                  value={address}
                  type="text"
                  id="address"
                  name="address"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Street Address"
                />
              </div>
              <div className="flex-shrink-0">
                <input
                  onChange={handleChange}
                  value={pincode}
                  type="text"
                  id="pincode"
                  name="pincode"
                  className="w-32 rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="ZIP"
                />
              </div>
            </div>
            <div className="text-center">
              <button
                onClick={handleUserSubmit}
                type="submit"
                className="w-full rounded-lg bg-blue-500 px-4 py-3 text-white font-semibold shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save Changes
              </button>
            </div>
          </section>

          {/* Change Password Section */}
          <section className="hidden md:block">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Change Password
            </h2>

            <label
              htmlFor="current-password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Current Password
            </label>
            <div className="relative mb-4">
              <input
                onChange={handleChange}
                value={currentPassword}
                type="password"
                id="current-password"
                name="currentPassword"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Your current password"
              />
            </div>

            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              New Password
            </label>
            <div className="relative mb-4">
              <input
                onChange={handleChange}
                value={newPassword}
                type="password"
                id="new-password"
                name="newPassword"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Your new password"
              />
            </div>
          </section>

          {/* Submit Button */}
          <div className="text-center hidden md:block">
            <button
              onClick={handlePasswordSubmit}
              type="submit"
              className="w-full rounded-lg bg-blue-500 px-4 py-3 text-white font-semibold shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default MyAccount;
