import { ShoppingCart, ShoppingBag, Plus, Minus, X } from "lucide-react";
import Link from "next/link";

export default function CartSidebar({
    isOpen,
    toggleCartSidebar,
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    subTotal,
}) {
    return (
        <div
            className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[99999] transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
                }`}
        >
            <div className="flex flex-col h-full">

                {/* Header */}
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <div className="flex items-center space-x-3">
                        <ShoppingCart className="w-6 h-6" />
                        <h2 className="text-xl font-bold">Your Cart</h2>
                    </div>
                    <button
                        onClick={toggleCartSidebar}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6">
                    {Object.keys(cart).length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <ShoppingCart className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                            <p className="text-gray-600 mb-6">Add some services to get started</p>
                            <Link href="/services">
                                <button
                                    onClick={toggleCartSidebar}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                                >
                                    Browse Services
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {Object.keys(cart).map((k) => (
                                <div key={k} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-semibold text-gray-900">{cart[k].name}</h4>
                                        <span className="text-lg font-bold text-blue-600">
                                            ₹{(cart[k].price * cart[k].qty).toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">₹{cart[k].price} each</span>
                                        <div className="flex items-center space-x-3">
                                            <button onClick={() => removeFromCart(k, 1)} className="p-1 hover:bg-red-100 rounded-lg">
                                                <Minus className="w-4 h-4 text-red-600" />
                                            </button>
                                            <span className="w-8 text-center font-semibold">{cart[k].qty}</span>
                                            <button
                                                onClick={() => addToCart(k, 1, cart[k].price, cart[k].name)}
                                                className="p-1 hover:bg-green-100 rounded-lg"
                                            >
                                                <Plus className="w-4 h-4 text-green-600" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {Object.keys(cart).length > 0 && (
                    <div className="p-6 bg-gray-50 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-lg font-semibold text-gray-900">Total:</span>
                            <span className="text-2xl font-bold text-blue-600">₹{subTotal.toFixed(2)}</span>
                        </div>

                        <div className="space-y-3">
                            <Link href="/checkout">
                                <button
                                    onClick={toggleCartSidebar}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2"
                                >
                                    <ShoppingBag className="w-5 h-5" />
                                    <span>Proceed to Checkout</span>
                                </button>
                            </Link>

                            <button
                                onClick={clearCart}
                                className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300"
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
