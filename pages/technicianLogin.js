// pages/technicianLogin.js
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

export default function TechnicianLogin() {
    const [step, setStep] = useState(1);
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const router = useRouter();

    const sendOtp = async () => {
        if (!/^\d{10}$/.test(phone)) {
            toast.error("Enter a valid 10-digit phone number");
            return;
        }

        try {
            await axios.post("/api/technician/send-otp", { phone });
            setStep(2);
            toast.success("OTP sent to technician");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send OTP");
        }
    };

    const verifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }

        try {
            const res = await axios.post("/api/technician/verify-otp", {
                phone,
                otp,
            });

            toast.success(res.data?.message || "Logged in successfully");
            router.push("/partnerrequests");
        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed");
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
                    Technician Login
                </h2>

                {step === 1 && (
                    <>
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            className="w-full mb-4 px-4 py-2 border rounded-lg"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            maxLength={10}
                        />
                        <button
                            onClick={sendOtp}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Send OTP
                        </button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            className="w-full mb-4 px-4 py-2 border rounded-lg"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                        />
                        <button
                            onClick={verifyOtp}
                            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                        >
                            Verify & Login
                        </button>
                    </>
                )}

                <p className="mt-6 text-center text-sm text-gray-600">
                    New technician?{" "}
                    <a href="/technicianSignup" className="text-blue-600 hover:underline">
                        Register here
                    </a>
                </p>
            </div>
        </div>
    );
}
TechnicianLogin.getLayout = function PageLayout(page) {
    return <>{page}</>; // Only render the page, no Navbar or Footer
};