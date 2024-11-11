import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Link from "next/link";

const TechnicianLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/technicianLogin", {
        email,
        password,
      });

      // If login is successful
      localStorage.setItem("technicianToken", response.data.token);
      console.log("technicianId:", response.data.technicianId);
      localStorage.setItem("technicianId", response.data.technicianId);
      toast.success("Login successful");
      router.push("/partnerrequests"); // Redirect to PartnerRequests page
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Invalid credentials, please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Technician Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Login
        </button>
        <div className="flex flex-row">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-500">
            Don’t have an account yet?{" "}
          </p>
          <div className="text-sm font-medium text-blue-500 hover:underline dark:text-blue-500 pl-2">
            <Link href="/technicianSignup">Sign up</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TechnicianLogin;
