import React, { useState } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [statusMsg, setStatusMsg] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheckEmail = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/auth/check-email', { email });
      if (!res.data.exists) {
        setStatusMsg({ type: 'error', message: 'User does not exist' });
      } else {
        await axios.post('/auth/send-otp', { email });
        setStatusMsg({ type: 'success', message: 'OTP sent to your email' });
        setStep(2);
      }
    } catch {
      setStatusMsg({ type: 'error', message: 'Server error while checking email' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/auth/verify-reset-otp', { email, otp });
      if (res.data.success || res.data.message?.includes('OTP verified')) {
        setStatusMsg({ type: 'success', message: 'OTP verified. You may reset your password.' });
        setStep(3);
      } else {
        setStatusMsg({ type: 'error', message: 'Invalid OTP' });
      }
    } catch {
      setStatusMsg({ type: 'error', message: 'OTP verification failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setStatusMsg({ type: 'error', message: 'Passwords do not match' });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/auth/reset-password', {
        email,
        otp,
        newPassword,
      });
      setStatusMsg({ type: 'success', message: 'Password reset successful. Redirecting...' });
      setTimeout(() => navigate('/login'), 2000);
    } catch {
      setStatusMsg({ type: 'error', message: 'Failed to reset password' });
    } finally {
      setLoading(false);
    }
  };

  return (
 <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex flex-col">
  <div className="bg-yellow-500 text-black text-sm text-center py-2 font-semibold shadow-md">
    🔐 Reset your password securely using OTP verification
  </div>

  <div className="p-4">
    <button
      onClick={() => navigate(-1)}
      className="text-white flex items-center gap-2 hover:text-yellow-400 transition-all duration-200"
    >
      <FaArrowLeft /> Back
    </button>
  </div>

  {statusMsg.message && (
    <div
      className={`mx-auto mb-4 text-center px-4 py-3 rounded-lg max-w-md w-full font-medium transition-all duration-300 ${
        statusMsg.type === 'success'
          ? 'bg-green-100 text-green-800 border border-green-400'
          : 'bg-red-100 text-red-800 border border-red-400'
      }`}
    >
      {statusMsg.message}
    </div>
  )}

  <div className="flex flex-col items-center justify-center flex-1 px-4">
    <div className="bg-[#121212] border border-blue-500 rounded-2xl w-full max-w-md p-8 shadow-2xl space-y-6">
      <h2 className="text-3xl font-bold text-blue-400 text-center mb-4 tracking-wide">
        Forgot Password
      </h2>

      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#1e1e1e] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />
          <button
            onClick={handleCheckEmail}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200"
          >
            {loading ? <FaSpinner className="animate-spin mx-auto" /> : 'Send OTP'}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full bg-[#1e1e1e] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 tracking-widest text-center"
          />
          <button
            onClick={handleVerifyOtp}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200"
          >
            {loading ? <FaSpinner className="animate-spin mx-auto" /> : 'Verify OTP'}
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-[#1e1e1e] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-[#1e1e1e] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />
          <button
            onClick={handleResetPassword}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-200"
          >
            {loading ? <FaSpinner className="animate-spin mx-auto" /> : 'Reset Password'}
          </button>
        </>
      )}
    </div>
  </div>
</div>

  );
};

export default ForgotPassword;
