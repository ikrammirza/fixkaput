import React, { useState, useEffect } from "react";

import { Link as ScrollLink } from "react-scroll";
import Link from "next/link";
import Image from "next/legacy/image";
import { FaShoppingCart } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { AiFillPlusCircle } from "react-icons/ai";
import { AiFillMinusCircle } from "react-icons/ai";
import { BsFillBagFill } from "react-icons/bs";
import { MdAccountCircle } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BsCartX } from "react-icons/bs";
import { useRouter } from "next/router";

const Navbar = ({
  user,
  cart,
  addToCart,
  removeFromCart,
  clearCart,
  subTotal,
  logout,
  isSearchVisible,
}) => {
  
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartSidebarOpen, setCartSidebarOpen] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(false);
  const [dropdown, setdropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleDropdownn = () => {
    setdropdown(!dropdown);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMediumScreen(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    // Initial check
    handleResize();

    // Listen to window resize events
    window.addEventListener("resize", handleResize);

    // Clean up event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Toggle search bar visibility
  const toggleSearchBar = () => {
    setisSearchVisible(!isSearchVisible);
  };
  console.log("isSearchVisible in Navbar:", isSearchVisible);
  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const searchQuery = e.target.search.value;
    router.push(`/search?query=${searchQuery}`); // Redirect with search query
  };
  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const closeDropdown = () => {
    setDropdownVisible(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleCartSidebar = () => {
    setCartSidebarOpen(!isCartSidebarOpen);
  };

  const handleLogoutClick = () => {
    toast.success("You are successfully logged out", {
      position: "bottom-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
    setTimeout(() => {
      logout();
    }, 2000);
  };
  const router = useRouter();

  return (
    <div className="mx-4 md:mx-20  flex flex-wrap flex-col md:flex-row items-center top-0 bg-white pt-4  shadow-md sticky z-10">
      <div className="flex title-font font-medium items-center text-gray-900 mb-1 md:mb-0">
        <div className="md:pl-2">
          <Image src="/fklogo.png" alt="Logo" width={50} height={44} />
        </div>
        <div className="brandName font-bold">fixKaput</div>

        {/* Search bar (hidden by default on mobile) */}
        {/* Search bar (hidden by default on mobile) */}
        {isSearchVisible && (
          <form
            onSubmit={handleSearchSubmit}
            className="w-full md:w-auto mt-2 md:mt-0"
          >
            <input
              type="text"
              name="search"
              placeholder="Search for services..."
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-80"
            />
            <button
              type="submit"
              className="hidden md:inline-block ml-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Search
            </button>
          </form>
        )}
        <div className="md:pl-0">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden ml-7 cursor-pointer focus:outline-none"
            onClick={toggleMobileMenu}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-6"
              fill="none"
              viewBox="0 0 24 20"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 8h16M4 16h16M4 24h16"
              />
            </svg>
          </button>
        </div>
      </div>
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
      {/* Search Bar - Desktop */}
      <form
        onSubmit={handleSearchSubmit}
        className="hidden md:flex items-center mx-4"
      >
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search services..."
          className="px-4 py-2 border border-gray-300 rounded-l-lg"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-r-lg"
        >
          Search
        </button>
      </form>
      {/* Navigation Links - Desktop */}
      <nav className="hidden md:flex text-xl md:ml-auto pb-2 md:mr-auto">
        <Link
          href="/"
          className="mr-6 font-poppins font-bold text-2xl pt-7 px-3 hover:border-[#4267b2] text-transparent bg-clip-text bg-gradient-to-r from-[#00C9FF] via-[#2A2A72] to-[#4A00E0] hover:from-[#4A00E0] hover:to-[#00C9FF]"
        >
          Home
        </Link>
        <Link
          href="/services"
          className="mr-6 font-poppins font-bold text-2xl pt-7 px-3 hover:border-[#4267b2] text-transparent bg-clip-text bg-gradient-to-r from-[#00C9FF] via-[#2A2A72] to-[#4A00E0] hover:from-[#4A00E0] hover:to-[#00C9FF]"
        >
          Services
        </Link>
        <Link
          href="/about"
          className="mr-6 font-poppins font-bold text-2xl pt-7 px-3 hover:border-[#4267b2] text-transparent bg-clip-text bg-gradient-to-r from-[#00C9FF] via-[#2A2A72] to-[#4A00E0] hover:from-[#4A00E0] hover:to-[#00C9FF]"
        >
          About Us
        </Link>
        <Link
          href="/contact"
          className="mr-6 font-poppins font-bold text-2xl pt-7 px-3 hover:border-[#4267b2] text-transparent bg-clip-text bg-gradient-to-r from-[#00C9FF] via-[#2A2A72] to-[#4A00E0] hover:from-[#4A00E0] hover:to-[#00C9FF]"
        >
          Contact Us
        </Link>
      </nav>

      {/* Mobile Menu - Conditional Rendering */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-blue-100 bg-opacity-90 z-50 p-4 transition-transform transform translate-x-0 duration-300 ease-in-out ">
          <div className="relative bg-blue-50 rounded-lg shadow-lg p-4 h-full ">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-800 text-2xl"
              onClick={toggleMobileMenu}
              aria-label="Close menu"
            >
              &times;
            </button>

            <nav className="flex flex-col h-full justify-between ">
              {/* Mobile Search Bar */}

              <div>
                <Link
                  href="/"
                  className="text-2xl block py-3 border-b border-gray-200 font-serif text-gray-800 hover:text-blue-600 transition-colors duration-300"
                  onClick={toggleMobileMenu}
                >
                  Home
                </Link>

                <Link
                  href="/services"
                  className="text-2xl block py-3 border-b border-gray-200 font-serif text-gray-800 hover:text-blue-600 transition-colors duration-300"
                  onClick={toggleMobileMenu}
                >
                  Services
                </Link>

                <Link
                  href="/about"
                  className="text-2xl block py-3 border-b border-gray-200 font-serif text-gray-800 hover:text-blue-600 transition-colors duration-300"
                  onClick={toggleMobileMenu}
                >
                  About Us
                </Link>

                <Link
                  href="/contact"
                  className="text-2xl block py-3 border-b border-gray-200 font-serif text-gray-800 hover:text-blue-600 transition-colors duration-300"
                  onClick={toggleMobileMenu}
                >
                  Contact Us
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
      {/*account*/}
      <div className="flex items-center">
        {/* Account */}
        <div className="relative text-[#4267b2] cursor-pointer mx-2">
          <a
            onMouseOver={() => setdropdown(true)}
            onMouseLeave={() => setdropdown(false)}
          >
            {dropdown && (
              <div
                onMouseOver={() => setdropdown(true)}
                onMouseLeave={() => setdropdown(false)}
                className="absolute right-0 top-11 w-48 bg-white border border-gray-200 shadow-lg rounded-lg"
              >
                <ul className="text-sm">
                  <li className="py-2 px-4 hover:bg-blue-100 transition-colors">
                    <Link
                      href="/myaccount"
                      className="block text-lg font-poppins font-bold px-3 py-2 text-transparent bg-clip-text bg-gradient-to-r from-[#00C9FF] via-[#2A2A72] to-[#4A00E0] hover:from-[#4A00E0] hover:to-[#00C9FF]"
                    >
                      {" "}
                      My Account
                    </Link>
                  </li>
                  <li className="py-2 px-4 hover:bg-blue-100 transition-colors">
                    <Link
                      href="/orders"
                      className="block text-lg font-poppins font-bold px-3 py-2 text-transparent bg-clip-text bg-gradient-to-r from-[#00C9FF] via-[#2A2A72] to-[#4A00E0] hover:from-[#4A00E0] hover:to-[#00C9FF] transition-colors"
                    >
                      Orders
                    </Link>
                  </li>
                  <div className="py-2 px-4 hover:bg-blue-100 transition-colors">
                    <li
                      onClick={handleLogoutClick}
                      className="block text-lg font-poppins font-bold px-3 py-2 text-transparent bg-clip-text bg-gradient-to-r from-[#00C9FF] via-[#2A2A72] to-[#4A00E0] hover:from-[#4A00E0] hover:to-[#00C9FF] transition-colors"
                    >
                      Logout
                    </li>
                  </div>
                </ul>
              </div>
            )}
            <div className="mt-3">
              {user.value && <MdAccountCircle size={34} />}
            </div>
          </a>
          {!user.value && (
            <Link href={"/login"}>
              <button className="hidden md:block bg-[#4267b2] text-white rounded-md px-4 py-2 text-base hover:bg-[#365899] transition-colors">
                Login
              </button>
            </Link>
          )}
        </div>
        {/* Cart Button */}
        <button
          className="hidden md:block rounded-full ml-1 mr-2 mt-3"
          onClick={toggleCartSidebar}
        >
          <div className="text-[#4267b2]">
            <FaShoppingCart size={34} />
          </div>
        </button>
      </div>

      {/* Cart Sidebar */}
      <div
        className={`fixed top-0 right-0 w-80 bg-blue-50 h-screen shadow-lg rounded-l-lg transform ${
          isCartSidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 flex items-center justify-between border-b border-gray-300">
            <h2 className="text-3xl font-poppins font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00C9FF] via-[#2A2A72] to-[#4A00E0]">
              Your Cart
            </h2>
            <button
              className="text-2xl text-gray-500 hover:text-gray-800 transition-colors"
              onClick={toggleCartSidebar}
            >
              <IoMdCloseCircle />
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Scrollable Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              <ol className="list-none space-y-4">
                {Object.keys(cart).length === 0 ? (
                  <div className="text-center font-poppins font-bold text-gray-700 py-12">
                    <div className="flex justify-center mb-4">
                      <BsCartX className="text-5xl text-blue-400" />
                    </div>
                    <h3 className="text-2xl md:text-3xl leading-tight">
                      Your cart is empty
                    </h3>
                    <p className="mt-2 text-lg text-gray-600">
                      It looks like you haven’t added any items to your cart
                      yet. Start shopping to fill it up!
                    </p>
                  </div>
                ) : (
                  Object.keys(cart).map((k) => (
                    <li
                      key={k}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-[#007bff] via-[#0056b3] to-[#003d79] rounded-lg shadow-2xl text-white"
                    >
                      <div className="flex-1 font-medium">{cart[k].name}</div>
                      <div className="flex items-center space-x-2">
                        <AiFillMinusCircle
                          onClick={() =>
                            removeFromCart(k, 1, cart[k].price, cart[k].name)
                          }
                          className="cursor-pointer text-white hover:text-gray-300 transition-colors"
                          size={20}
                        />
                        <span className="text-lg font-semibold">
                          {cart[k].qty}
                        </span>
                        <AiFillPlusCircle
                          onClick={() =>
                            addToCart(k, 1, cart[k].price, cart[k].name)
                          }
                          className="cursor-pointer text-white hover:text-gray-300 transition-colors"
                          size={20}
                        />
                      </div>
                    </li>
                  ))
                )}
              </ol>
            </div>

            {/* Subtotal and Checkout */}
            <div className="p-6 border-t border-gray-200 flex-none">
              <div className="flex items-center justify-between mb-4 px-4 py-2 border-t border-gray-200">
                <span className="text-lg font-poppins font-bold text-gray-800">
                  Subtotal :
                </span>
                <span className="text-lg font-bold text-blue-500">
                  ₹{subTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex gap-4">
                <Link href="/checkout" legacyBehavior>
                  <button
                    className={`flex items-center space-x-2 py-2 px-4 rounded-lg transition-shadow duration-300 ease-in-out ${
                      Object.keys(cart).length === 0
                        ? "bg-blue-100 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#0056b3] to-[#003d79] text-white hover:shadow-xl"
                    }`}
                    disabled={Object.keys(cart).length === 0}
                  >
                    <BsFillBagFill className="text-lg" />
                    <span className="text-lg font-semibold">Checkout</span>
                  </button>
                </Link>

                <button
                  onClick={clearCart}
                  className={`flex items-center space-x-2 py-2 px-4 rounded-lg transition-shadow duration-300 ease-in-out ${
                    Object.keys(cart).length === 0
                      ? "bg-blue-100 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#ff4d4d] to-[#cc0000] text-white hover:shadow-xl"
                  }`}
                  disabled={Object.keys(cart).length === 0}
                >
                  <span className="text-lg font-semibold">Clear Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
