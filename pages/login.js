import { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const startResendTimer = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const sendOtp = async () => {
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Enter a valid 10-digit phone number", {
        toastId: "invalid-phone",
        position: "top-center",
        className: "custom-toast-margin",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/send-otp', { phone });
      if (res.data.success) {
        toast.success('OTP sent successfully!', {
          toastId: "otp-sent",
          position: "top-center",
          className: "custom-toast-margin",
        });
        setOtpSent(true);
        startResendTimer();
      } else {
        toast.error(res.data.message || 'Failed to send OTP', {
          toastId: "otp-error",
          position: "top-center",
          className: "custom-toast-margin",
        });
      }
    } catch (err) {
      toast.error('Error sending OTP', {
        toastId: "otp-error",
        position: "top-center",
        className: "custom-toast-margin",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP", {
        toastId: "empty-otp",
        position: "top-center",
        className: "custom-toast-margin",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/verify-otp', { phone, otp }, { withCredentials: true });

      if (res.data.success) {
        toast.success('Login successful!', {
          toastId: "login-success",
          position: "top-center",
          className: "custom-toast-margin",
        });
        router.push('/checkout');
      } else {
        toast.error(res.data.message || 'Invalid OTP', {
          toastId: "invalid-otp",
          position: "top-center",
          className: "custom-toast-margin",
        });
      }
    } catch (err) {
      toast.error('OTP verification failed', {
        toastId: "verify-fail",
        position: "top-center",
        className: "custom-toast-margin",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>fixKaput | Login</title>
      </Head>

      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="custom-toast-margin"
      />

      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 bg-gray-100">
        <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-lg shadow space-y-4">
          <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

          {!otpSent ? (
            <>
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="Enter your phone number"
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <button
                onClick={sendOtp}
                disabled={loading}
                className={`w-full py-3 rounded font-medium transition ${loading
                  ? 'bg-blue-300 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </>
          ) : (
            <>
              <p className="text-center text-gray-600">
                OTP sent to <span className="font-medium">+91 ******{phone.slice(-4)}</span>
              </p>
              <input
                name="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                autoComplete="one-time-code"
                aria-label="Enter OTP"
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                onClick={verifyOtp}
                disabled={loading}
                className={`w-full py-3 rounded font-medium transition ${loading
                  ? 'bg-green-300 text-white cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button
                onClick={sendOtp}
                disabled={resendTimer > 0 || loading}
                className={`w-full py-3 rounded font-medium mt-2 transition ${resendTimer > 0 || loading
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
              >
                {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Add custom styling for toast margin */}
      <style jsx global>{`
        .custom-toast-margin {
          margin-top: calc(env(safe-area-inset-top) + 60px);
        }
      `}</style>
    </>
  );
}
