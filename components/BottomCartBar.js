// components/BottomCartBar.js
import React, { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";

const BottomCartBar = ({ cart, toggleCartSidebar }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true); // Ensure client-side only
    }, []);

    if (!isClient || Object.keys(cart).length === 0) return null;

    return (
        <button
            onClick={toggleCartSidebar}
            className="fixed bottom-5 right-5 z-[9999] bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 md:hidden"
            aria-label="Open Cart"
        >
            <div className="relative">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-4 -right-4 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
                    {Object.keys(cart).length}
                </span>
            </div>
        </button>
    );
};

export default BottomCartBar;
