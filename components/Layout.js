import Navbar from "./Navbar";
import Footer from "./Footer";
import Bottombar from "./Bottombar";

const Layout = ({
  children,
  logout,
  user,
  cart,
  addToCart,
  removeFromCart,
  clearCart,
  subTotal,
}) => {
  return (
    <>
      <Navbar
        logout={logout}
        user={user}
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        subTotal={subTotal}
      />
      <main>{children}</main>
      <Footer />
      <Bottombar />
    </>
  );
};

export default Layout;
