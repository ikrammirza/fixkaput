// components/BottomCartBar.js
import React, { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";

const BottomCartBar = ({ cart, toggleCartSidebar }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // Ensure client-side rendering only
        setIsClient(true);
    }, []);

    if (!isClient || Object.keys(cart).length === 0) return null;

    return (
        <div className="fixed bottom-0 inset-x-0 z-[9999] bg-white border-t border-gray-200 shadow-lg p-3 flex items-center justify-between md:hidden">
            <span className="text-gray-700 font-semibold text-lg">View Your Cart</span>
            <button
                onClick={toggleCartSidebar}
                className="relative p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-md hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {Object.keys(cart).length}
                </span>
            </button>
        </div>
    );
};

export default BottomCartBar;
