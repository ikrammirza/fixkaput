import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router"; // For redirection after successful login

const userdetailsmobile = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();

  const sendOtp = async () => {
    if (phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }
    try {
      const response = await axios.post("/api/sendotp", { phone });
      if (response.data.success) {
        setOtpSent(true);
        toast.success("OTP sent successfully!");
      } else {
        toast.error("Failed to send OTP.");
      }
    } catch (error) {
      toast.error("An error occurred while sending OTP.");
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }
    try {
      const response = await axios.post("/api/verifyotp", { phone, otp });
      if (response.data.success) {
        toast.success("Login successful!");
        // Store token in localStorage for future API requests
        localStorage.setItem("authToken", response.data.token);
        // Redirect to account page after successful verification
        router.push("/myaccountmobile");
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while verifying OTP.");
    }
  };

  return (
    <div className="flex items-center justify-center h-[524px] bg-blue-50">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-center text-blue-600">
          {otpSent ? "Enter OTP" : "Login"}
        </h1>
        {!otpSent ? (
          <div className="mt-4">
            <label className="block text-sm text-gray-700">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength="10"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter your phone number"
            />
            <button
              onClick={sendOtp}
              className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Send OTP
            </button>
          </div>
        ) : (
          <div className="mt-4">
            <label className="block text-sm text-gray-700">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength="6"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter the OTP sent to your phone"
            />
            <button
              onClick={verifyOtp}
              className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Verify OTP
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default userdetailsmobile;
