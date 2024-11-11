import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";


const TechnicianSignup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [aadhar, setAadhar] = useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Send the signup request
      const response = await axios.post("/api/technicianSignup", {
        name,
        email,
        password,
        phone,
        aadhar,
      });

      // Show success toast and redirect to login page
      toast.success("Signup successful! Please log in.");
      router.push("/technicianLogin"); // Redirect to login page
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error("Signup failed. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Technician Signup</h1>
      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="p-2 border rounded"
        />
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
        <input
          type="tel"
          placeholder="Phone (+91 format)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Aadhar Number (12 digits)"
          value={aadhar}
          onChange={(e) => setAadhar(e.target.value)}
          required
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default TechnicianSignup;
