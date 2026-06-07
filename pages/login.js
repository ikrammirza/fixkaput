import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';

export default function Login() {
  const [phone, setPhone]           = useState('');
  const [otpSent, setOtpSent]       = useState(false);
  const [otp, setOtp]               = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [loading, setLoading]       = useState(false);
  const timerRef                    = useRef(null);
  const router                      = useRouter();

  // Cleanup timer on unmount to prevent memory leak
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startResendTimer = () => {
    setResendTimer(30);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const toastConfig = {
    position: "top-center",
    className: "custom-toast-margin",
  };

  const sendOtp = async () => {
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Enter a valid 10-digit phone number", {
        ...toastConfig,
        toastId: "invalid-phone",
      });
      return;
    }

    setLoading(true);
    setOtp(''); // Clear any previously entered OTP on resend

    try {
      const res = await axios.post('/api/send-otp', { phone });
      if (res.data.success) {
        toast.success('OTP sent successfully!', { ...toastConfig, toastId: "otp-sent" });
        setOtpSent(true);
        startResendTimer();
      } else {
        toast.error(res.data.message || 'Failed to send OTP', { ...toastConfig, toastId: "otp-error" });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Error sending OTP';
      toast.error(msg, { ...toastConfig, toastId: "otp-error" });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length < 6) {
      toast.error("Please enter the 6-digit OTP", { ...toastConfig, toastId: "empty-otp" });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        '/api/verify-otp',
        { phone, otp },
        { withCredentials: true }
      );

      if (res.data.success) {
        // Store user data (use your auth context/zustand/redux here instead if you have one)
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }

        toast.success('Login successful!', { ...toastConfig, toastId: "login-success" });

        // Small delay so user sees the success toast before redirect
        setTimeout(() => router.push('/checkout'), 1000);
      } else {
        toast.error(res.data.message || 'Invalid OTP', { ...toastConfig, toastId: "invalid-otp" });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'OTP verification failed';
      toast.error(msg, { ...toastConfig, toastId: "verify-fail" });
    } finally {
      setLoading(false);
    }
  };

  // Strip non-digits and cap at 10 characters on phone input
  const handlePhoneChange = (e) => {
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(cleaned);
  };

  // Only allow digits in OTP input
  const handleOtpChange = (e) => {
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(cleaned);
  };

  return (
    <>
      <Head>
        <title>fixKaput | Login</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 bg-gray-100">
        <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-lg shadow space-y-4">

          <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

          {!otpSent ? (
            <>
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="Enter your 10-digit phone number"
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={10}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') sendOtp();
                }}
              />
              <button
                onClick={sendOtp}
                disabled={loading}
                className={`w-full py-3 rounded font-medium transition ${
                  loading
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
                OTP sent to{' '}
                <span className="font-medium">+91 ******{phone.slice(-4)}</span>
              </p>

              <input
                name="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                autoComplete="one-time-code"
                aria-label="Enter OTP"
                placeholder="Enter 6-digit OTP"
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-400 tracking-widest text-center text-lg font-mono"
                value={otp}
                onChange={handleOtpChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') verifyOtp();
                }}
              />

              <button
                onClick={verifyOtp}
                disabled={loading || otp.length < 6}
                className={`w-full py-3 rounded font-medium transition ${
                  loading || otp.length < 6
                    ? 'bg-green-300 text-white cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button
                onClick={sendOtp}
                disabled={resendTimer > 0 || loading}
                className={`w-full py-3 rounded font-medium mt-2 transition ${
                  resendTimer > 0 || loading
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
              </button>

              <button
                onClick={() => {
                  setOtpSent(false);
                  setOtp('');
                  if (timerRef.current) clearInterval(timerRef.current);
                  setResendTimer(0);
                }}
                className="w-full text-sm text-gray-500 hover:text-gray-700 underline text-center mt-1"
              >
                Change phone number
              </button>
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
        .custom-toast-margin {
          margin-top: calc(env(safe-area-inset-top) + 60px);
        }
      `}</style>
    </>
  );
}