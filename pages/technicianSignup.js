import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

export default function TechnicianSignup() {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        aadhar: "",
    });

    const router = useRouter();

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async () => {
        const { name, phone, aadhar } = form;

        if (!name || !phone || !aadhar) {
            toast.error("All fields are required");
            return;
        }

        try {
            await axios.post("/api/technicianSignup", {
                name,
                phone,
                aadhar,
            });

            toast.success("Technician registered successfully. Please login.");
            router.push("/technicianLogin"); // ⬅️ redirect to login
        } catch (err) {
            toast.error(err.response?.data?.message || "Signup failed");
        }
    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
                    Technician Signup
                </h2>

                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    className="w-full mb-4 px-4 py-2 border rounded-lg"
                    value={form.name}
                    onChange={handleChange}
                />

                <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    className="w-full mb-4 px-4 py-2 border rounded-lg"
                    value={form.phone}
                    onChange={handleChange}
                    maxLength={10}
                />

                <input
                    type="text"
                    name="aadhar"
                    placeholder="Aadhar Number"
                    className="w-full mb-6 px-4 py-2 border rounded-lg"
                    value={form.aadhar}
                    onChange={handleChange}
                    maxLength={12}
                />

                <button
                    onClick={handleSubmit}
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                >
                    Register Technician
                </button>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Already registered?{" "}
                    <a href="/technicianLogin" className="text-blue-600 hover:underline">
                        Login here
                    </a>
                </p>
            </div>
        </div>
    );
}
TechnicianSignup.getLayout = function PageLayout(page) {
    return <>{page}</>; // Only render the page, no Navbar or Footer
};