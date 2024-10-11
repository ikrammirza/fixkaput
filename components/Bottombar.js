import Link from "next/link";
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import { TiHome } from "react-icons/ti";
import { useState } from "react"; // Corrected import of useState

const Bottombar = ({
  cart = {},
  addToCart,
  removeFromCart,
  clearCart,
  subTotal,
}) => {
  const [isCartSidebarOpen, setCartSidebarOpen] = useState(false);

  const toggleCartSidebar = () => {
    setCartSidebarOpen(!isCartSidebarOpen);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white shadow-lg border-t border-gray-200 flex justify-around py-2 z-50">
      {/* Home */}
      <Link href="/" className="flex flex-col items-center">
        <TiHome className="text-blue-600 text-2xl" />
        <span className="text-xs">Home</span>
      </Link>

      {/* Search */}
      <Link href="/search" className="flex flex-col items-center">
        <FaSearch className="text-blue-600 text-2xl" />
        <span className="text-xs">Search</span>
      </Link>

      {/* Cart */}
      <button
        className="flex flex-col items-center"
        onClick={toggleCartSidebar}
      >
        <FaShoppingCart className="text-blue-600 text-2xl" />
        <span className="text-xs">Cart</span>
      </button>

      {/* Cart Sidebar */}
      <div
        className={`fixed top-0 right-0 w-full h-full bg-blue-50 shadow-lg transform ${
          isCartSidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
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
              <span className="sr-only">Close</span>{" "}
              {/* Accessibility improvement */}
              &#x2715; {/* Close icon */}
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
                      <span className="text-5xl text-blue-400">&#128722;</span>{" "}
                      {/* Empty cart icon */}
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
                        <button
                          onClick={() =>
                            removeFromCart(k, 1, cart[k].price, cart[k].name)
                          }
                        >
                          &#8722; {/* Minus icon */}
                        </button>
                        <span className="text-lg font-semibold">
                          {cart[k].qty}
                        </span>
                        <button
                          onClick={() =>
                            addToCart(k, 1, cart[k].price, cart[k].name)
                          }
                        >
                          &#43; {/* Plus icon */}
                        </button>
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
                  ₹
                  {typeof subTotal === "number" && !isNaN(subTotal)
                    ? subTotal.toFixed(2)
                    : "0.00"}
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
                    &#128722; {/* Bag icon */}
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

      {/* Account */}
      <Link href="/myaccountmobile" className="flex flex-col items-center">
        <FaUser className="text-blue-600 text-2xl" />
        <span className="text-xs">Account</span>
      </Link>
    </div>
  );
};

export default Bottombar;