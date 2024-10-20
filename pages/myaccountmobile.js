import { useRouter } from "next/router"; // For navigation
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyAccountMobile = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Clear the auth token and redirect to login
    localStorage.removeItem("token");
    toast.success("You are successfully logged out", {
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
    router.push("/"); // Redirect to home or login page
  };

  return (
    <div className="flex flex-col items-center justify-center h-[524px] bg-gradient-to-r from-blue-50 to-blue-100 p-6">
      <ToastContainer
        toastStyle={{ backgroundColor: "#1e88e5" }}
        position="bottom-center"
        autoClose={1000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-xs">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          My Account
        </h1>

        {/* Redirect buttons */}
        <button
          onClick={() => router.push("/myaccount")}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-lg mb-4 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out"
        >
          Your Details
        </button>

        <button
          onClick={() => router.push("/orders")}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-lg mb-4 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out"
        >
          Your Orders
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-gradient-to-r from-red-500 to-red-700 text-white text-lg font-semibold py-3 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out"
        >
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default MyAccountMobile;
