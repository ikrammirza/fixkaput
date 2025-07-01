import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useRef, useState, useEffect } from "react";
import LoadingBar from "react-top-loading-bar";
import { useRouter } from "next/router";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


function MyApp({ Component, pageProps }) {
  const [cart, setCart] = useState({});
  const [progress, setProgress] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [user, setUser] = useState({ value: null });
  const router = useRouter();
  const socketRef = useRef(null);


  useEffect(() => {
    // Route change event listeners for the loading bar
    router.events.on("routeChangeStart", () => {
      setProgress(40);
    });
    router.events.on("routeChangeComplete", () => {
      setProgress(100);
    });

    // Load cart from localStorage
    try {
      if (localStorage.getItem("cart")) {
        const savedCart = JSON.parse(localStorage.getItem("cart"));
        setCart(savedCart);
        saveCart(savedCart);
      }
    } catch (error) {
      console.error(error);
      localStorage.clear();
    }
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me", {
          credentials: "include", // Important to send cookies
        });
        const data = await res.json();

        if (data.success) {
          setUser({ value: data.user }); // ✅ Set actual user data, like { name, phone, _id }
        } else {
          setUser({ value: null });
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUser({ value: null });
      }
    };

    fetchUser();
  }, [router.query]);

  const logout = async () => {
    try {
      await axios.post('/api/logout');
      localStorage.removeItem('phone'); // optional
      setUser({ value: null });         // reset user
      router.push('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const saveCart = (myCart) => {
    localStorage.setItem("cart", JSON.stringify(myCart));
    let subt = 0;
    const keys = Object.keys(myCart);
    for (let i = 0; i < keys.length; i++) {
      subt += myCart[keys[i]].price * myCart[keys[i]].qty;
    }
    setSubTotal(subt);
  };

  const addToCart = (itemCode, qty, price, name) => {
    const newCart = { ...cart }; // Make a copy of the cart
    if (itemCode in newCart) {
      newCart[itemCode].qty += qty;
    } else {
      newCart[itemCode] = { qty: 1, price, name };
    }
    setCart(newCart);
    saveCart(newCart);
  };

  const removeFromCart = (itemCode, qty) => {
    const newCart = { ...cart }; // Make a copy of the cart
    if (itemCode in newCart) {
      newCart[itemCode].qty -= qty;
    }
    if (newCart[itemCode].qty <= 0) {
      delete newCart[itemCode];
    }
    setCart(newCart);
    saveCart(newCart);
  };

  const clearCart = () => {
    setCart({});
    saveCart({});
  };

  return (
    <>
      <LoadingBar
        color="#4267b2"
        progress={progress}
        waitingTime={400}
        onLoaderFinished={() => setProgress(0)}
      />
      <Navbar
        logout={logout}
        user={user}
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        subTotal={subTotal}
      />
      <Component
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        subTotal={subTotal}

        {...pageProps}
      />
      <Footer />
    </>
  );
}

export default MyApp;
