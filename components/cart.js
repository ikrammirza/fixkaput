// import { BsCartX } from "react-icons/bs";
// import { IoMdCloseCircle } from "react-icons/io";
// import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";
// import { BsFillBagFill } from "react-icons/bs";
// import Link from "next/link"; // Make sure Link is imported

// const Cart = ({
//   cart,
//   addToCart,
//   removeFromCart,
//   clearCart,
//   subTotal,
//   toggleCartSidebar,
//   isCartSidebarOpen, // Ensure you receive this prop
// }) => {
//   return (
//     <div
//       className={`fixed top-0 right-0 w-80 bg-blue-50 h-screen shadow-lg rounded-l-lg transform ${
//         isCartSidebarOpen ? "translate-x-0" : "translate-x-full"
//       } transition-transform duration-300 ease-in-out`}
//     >
//       <div className="flex flex-col h-full">
//         {/* Header */}
//         <div className="p-6 flex items-center justify-between border-b border-gray-300">
//           <h2 className="text-3xl font-poppins font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00C9FF] via-[#2A2A72] to-[#4A00E0]">
//             Your Cart
//           </h2>
//           <button
//             className="text-2xl text-gray-500 hover:text-gray-800 transition-colors"
//             onClick={toggleCartSidebar}
//           >
//             <IoMdCloseCircle />
//           </button>
//         </div>

//         {/* Main Content Area */}
//         <div className="flex flex-col flex-1 overflow-hidden">
//           {/* Scrollable Cart Items */}
//           <div className="flex-1 overflow-y-auto p-4">
//             <ol className="list-none space-y-4">
//               {Object.keys(cart).length === 0 ? (
//                 <div className="text-center font-poppins font-bold text-gray-700 py-12">
//                   <div className="flex justify-center mb-4">
//                     <BsCartX className="text-5xl text-blue-400" />
//                   </div>
//                   <h3 className="text-2xl md:text-3xl leading-tight">
//                     Your cart is empty
//                   </h3>
//                   <p className="mt-2 text-lg text-gray-600">
//                     It looks like you haven’t added any items to your cart yet.
//                     Start shopping to fill it up!
//                   </p>
//                 </div>
//               ) : (
//                 Object.keys(cart).map((k) => (
//                   <li
//                     key={k}
//                     className="flex items-center justify-between p-4 bg-gradient-to-r from-[#007bff] via-[#0056b3] to-[#003d79] rounded-lg shadow-2xl text-white"
//                   >
//                     <div className="flex-1 font-medium">{cart[k].name}</div>
//                     <div className="flex items-center space-x-2">
//                       <AiFillMinusCircle
//                         onClick={() =>
//                           removeFromCart(k, 1, cart[k].price, cart[k].name)
//                         }
//                         className="cursor-pointer text-white hover:text-gray-300 transition-colors"
//                         size={20}
//                       />
//                       <span className="text-lg font-semibold">
//                         {cart[k].qty}
//                       </span>
//                       <AiFillPlusCircle
//                         onClick={() =>
//                           addToCart(k, 1, cart[k].price, cart[k].name)
//                         }
//                         className="cursor-pointer text-white hover:text-gray-300 transition-colors"
//                         size={20}
//                       />
//                     </div>
//                   </li>
//                 ))
//               )}
//             </ol>
//           </div>

//           {/* Subtotal and Checkout */}
//           <div className="p-6 border-t border-gray-200 flex-none">
//             <div className="flex items-center justify-between mb-4 px-4 py-2 border-t border-gray-200">
//               <span className="text-lg font-poppins font-bold text-gray-800">
//                 Subtotal :
//               </span>
//               <span className="text-lg font-bold text-blue-500">
//                 ₹{subTotal.toFixed(2)}
//               </span>
//             </div>
//             <div className="flex gap-4">
//               <Link href="/checkout" legacyBehavior>
//                 <button
//                   className={`flex items-center space-x-2 py-2 px-4 rounded-lg transition-shadow duration-300 ease-in-out ${
//                     Object.keys(cart).length === 0
//                       ? "bg-blue-100 cursor-not-allowed"
//                       : "bg-gradient-to-r from-[#0056b3] to-[#003d79] text-white hover:shadow-xl"
//                   }`}
//                   disabled={Object.keys(cart).length === 0}
//                 >
//                   <BsFillBagFill className="text-lg" />
//                   <span className="text-lg font-semibold">Checkout</span>
//                 </button>
//               </Link>

//               <button
//                 onClick={clearCart}
//                 className={`flex items-center space-x-2 py-2 px-4 rounded-lg transition-shadow duration-300 ease-in-out ${
//                   Object.keys(cart).length === 0
//                     ? "bg-blue-100 cursor-not-allowed"
//                     : "bg-gradient-to-r from-[#ff4d4d] to-[#cc0000] text-white hover:shadow-xl"
//                 }`}
//                 disabled={Object.keys(cart).length === 0}
//               >
//                 <span className="text-lg font-semibold">Clear Cart</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;
