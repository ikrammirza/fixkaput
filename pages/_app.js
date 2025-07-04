import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useRef, useState, useEffect } from "react";
import LoadingBar from "react-top-loading-bar";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import BottomCartBar from "../components/BottomCartBar";
import CartSidebar from "../components/CartSidebar"; // ✅ Correct import

function MyApp({ Component, pageProps }) {
  const [cart, setCart] = useState({});
  const [progress, setProgress] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [user, setUser] = useState({ value: null });
  const router = useRouter();
  const socketRef = useRef(null);
  const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false);

  // ✅ Prevent scroll behind sidebar
  useEffect(() => {
    document.body.style.overflow = isCartSidebarOpen ? "hidden" : "";
  }, [isCartSidebarOpen]);

  useEffect(() => {
    router.events.on("routeChangeStart", () => setProgress(40));
    router.events.on("routeChangeComplete", () => setProgress(100));

    if (typeof window !== "undefined") {
      try {
        const savedCart = JSON.parse(localStorage.getItem("cart") || "{}");
        const cleanedCart = {};

        for (const key in savedCart) {
          const item = savedCart[key];
          if (
            item &&
            typeof item.qty === "number" &&
            typeof item.price === "number" &&
            typeof item.name === "string"
          ) {
            cleanedCart[key] = item;
          }
        }

        setCart(cleanedCart);
        saveCart(cleanedCart);
      } catch (error) {
        console.error("Error loading cart:", error);
        localStorage.clear();
      }
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        const data = await res.json();
        setUser({ value: data.success ? data.user : null });
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUser({ value: null });
      }
    };

    fetchUser();
  }, [router.query]);

  const saveCart = (myCart) => {
    localStorage.setItem("cart", JSON.stringify(myCart));
    let subt = 0;

    for (const key in myCart) {
      const item = myCart[key];
      if (item && typeof item.price === "number" && typeof item.qty === "number") {
        subt += item.price * item.qty;
      }
    }

    setSubTotal(subt);
  };

  const addToCart = (itemCode, qty, price, name) => {
    if (!itemCode || typeof price !== "number" || !name) {
      console.warn("⚠️ Incomplete item data:", { itemCode, price, name });
      return;
    }

    setCart((prevCart) => {
      const newCart = { ...prevCart };

      if (itemCode in newCart) {
        newCart[itemCode].qty += qty;
      } else {
        newCart[itemCode] = { qty, price, name };
      }

      saveCart(newCart);
      return newCart;
    });
  };

  const removeFromCart = (itemCode, qty) => {
    const newCart = { ...cart };
    if (itemCode in newCart) {
      newCart[itemCode].qty -= qty;
      if (newCart[itemCode].qty <= 0) {
        delete newCart[itemCode];
      }
    }

    setCart(newCart);
    saveCart(newCart);
  };

  const clearCart = () => {
    setCart({});
    saveCart({});
  };

  const toggleCartSidebar = () => {
    setIsCartSidebarOpen((prev) => !prev);
  };

  const getLayout = Component.getLayout || ((page) => (
    <>
      <Navbar
        user={user}
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        subTotal={subTotal}
        toggleCartSidebar={toggleCartSidebar}
      />
      {page}
      <Footer />
    </>
  ));

  return (
    <>
      <LoadingBar
        color="#4267b2"
        progress={progress}
        waitingTime={400}
        onLoaderFinished={() => setProgress(0)}
      />
      <ToastContainer position="bottom-center" />

      {getLayout(
        <Component
          cart={cart}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
          subTotal={subTotal}
          toggleCartSidebar={toggleCartSidebar}
          isCartSidebarOpen={isCartSidebarOpen}
          {...pageProps}
        />
      )}

      {/* ✅ Bottom bar for mobile */}
      <BottomCartBar cart={cart} toggleCartSidebar={toggleCartSidebar} />

      {/* ✅ Shared cart sidebar */}
      <CartSidebar
        isOpen={isCartSidebarOpen}
        toggleCartSidebar={toggleCartSidebar}
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        subTotal={subTotal}
      />
    </>
  );
}

export default MyApp;
