import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import Navbar from '../components/Navbar';
import { FaArrowLeft } from 'react-icons/fa';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); 

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const [userRes, rewardsRes] = await Promise.all([
        axios.get('/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('/user/rewards', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setUser(userRes.data.user || userRes.data);
      setRewards(rewardsRes.data.rewards || []);
      setLoading(false);
    } catch (err) {
      console.error('Profile Load Error:', err);
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  useEffect(() => {
    fetchUser();
    const interval = setInterval(fetchUser, 10000);
    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setShowLogoutConfirm(false);
    navigate('/login');
  };

  const totalEarnings = rewards.reduce(
    (sum, r) => r.credited && r.status === 'completed' ? sum + r.amount : sum,
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="animate-pulse text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="bg-yellow-300 text-black text-center p-2 font-bold text-sm">
        Join a platform where students and graduates find real tasks, land internships, and earn while building valuable skills
      </div>

      <div className="bg-black min-h-screen text-white p-6">
        <button
          onClick={() => navigate(-1)}
          className="text-white flex items-center gap-2 mb-6 hover:text-yellow-400 transition duration-200"
        >
          <FaArrowLeft /> Back
        </button>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-md text-center transition-all duration-300">
            <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold mb-4 border-4 border-blue-400 shadow-lg mx-auto hover:scale-105 transition-transform">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold mb-1">{user.name}</h2>
            <p className="text-sm text-gray-400 mb-4">{user.email}</p>
            <div className="bg-gray-700 py-2 rounded-lg mt-2">
              <p><strong>ID:</strong> {user._id}</p>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="bg-gray-800 p-6 rounded-2xl shadow space-y-4 transition-all duration-300">
              <h3 className="text-lg font-bold mb-2">Quick Actions</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: '🎁 My Rewards', path: '/rewards' },
                  { label: '🔗 Linked Accounts', path: '/accounts' },
                  { label: '💰 My Wallet', path: '/wallet' },
                  { label: '📊 My Activity', path: '/activity' }
                ].map(({ label, path }) => (
                  <button
                    key={label}
                    onClick={() => navigate(path)}
                    className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-left transition duration-200"
                  >
                    {label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowLogoutConfirm(true)} 
                className="mt-6 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded w-full font-bold transition duration-200"
              >
                🚪 Log Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all duration-300">
          <div className="bg-gray-900 text-white rounded-xl shadow-lg max-w-sm w-full p-6 mx-4 animate-fadeIn scale-100 transition-transform duration-300">
            <h3 className="text-xl font-semibold mb-2">Confirm Logout</h3>
            <p className="text-sm text-gray-300">Are you sure you want to logout?</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm rounded border border-gray-600 hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm rounded bg-red-600 hover:bg-red-700 font-semibold transition"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
