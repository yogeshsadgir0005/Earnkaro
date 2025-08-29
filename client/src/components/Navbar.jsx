import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import axios from '../utils/axios';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDesktopMenu, setShowDesktopMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const desktopMenuRef = useRef();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await axios.get('/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data.user || res.data);
      } catch (err) {
        console.error('Navbar Auth Error:', err);
        localStorage.removeItem('token');
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (desktopMenuRef.current && !desktopMenuRef.current.contains(e.target)) {
        setShowDesktopMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    window.location.href = '/login';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="flex justify-between items-center p-4 bg-black text-white relative transition-all duration-300 ease-in-out">
      <div className="flex items-center gap-4 transition-all duration-300 ease-in-out">
        <div
          onClick={() => setShowMobileMenu(true)}
          className="flex flex-col justify-center items-center cursor-pointer md:hidden transition-transform duration-300 ease-in-out hover:scale-105"
          title="Menu"
        >
          <div className="w-5 h-0.5 bg-white mb-1 rounded"></div>
          <div className="w-5 h-0.5 bg-white mb-1 rounded"></div>
          <div className="w-5 h-0.5 bg-white rounded"></div>
        </div>
        <Link to="/home" className="font-bold text-xl transition-opacity duration-300 ease-in-out">
          Earn<span className="text-blue-500">Karo</span>
        </Link>
      </div>

      <nav className="space-x-6 hidden md:flex transition-opacity duration-300 ease-in-out">
        <Link to="/home" className={`${isActive('/home') ? 'opacity-50 underline' : ''} transition hover:opacity-80`}>
          Home
        </Link>
        <Link to="/earn" className={`${isActive('/earn') ? 'opacity-50 underline' : ''} transition hover:opacity-80`}>
          Earn
        </Link>
        <Link to="/leaderboard" className={`${isActive('/leaderboard') ? 'opacity-50 underline' : ''} transition hover:opacity-80`}>
          Leaderboard
        </Link>
        <Link to="/referrals" className={`${isActive('/referrals') ? 'opacity-50 underline' : ''} transition hover:opacity-80`}>
          Referrals
        </Link>
      </nav>

      <div className="relative transition-all duration-300 ease-in-out" ref={desktopMenuRef}>
        {user ? (
<div
  onClick={() => {
    if (window.innerWidth >= 768) {
      setShowDesktopMenu(!showDesktopMenu);
    }
  }}
  className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white cursor-pointer select-none"
  title={user.name}
>
  {user.name?.charAt(0).toUpperCase()}
</div>


        ) : (
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-4 py-1 rounded-full transition-all duration-300 ease-in-out hover:opacity-80"
          >
            Login
          </button>
        )}

        <div
          className={`absolute right-0 mt-2 w-56 bg-white text-black rounded shadow z-50 transform transition-all duration-300 ease-in-out origin-top-right ${
            showDesktopMenu ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-10 opacity-0 scale-95 pointer-events-none'
          }`}
        >
          <button
            onClick={() => {
              navigate('/profile');
              setShowDesktopMenu(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-all duration-200 ease-in-out"
          >
            👤 Profile
          </button>
          <div className="block md:hidden border-t border-gray-200 mt-2">
            <button
              onClick={() => {
                navigate('/earn');
                setShowDesktopMenu(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-all duration-200 ease-in-out"
            >
              💸 Earn
            </button>
            <button
              onClick={() => {
                navigate('/leaderboard');
                setShowDesktopMenu(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-all duration-200 ease-in-out"
            >
              🏆 Leaderboard
            </button>
            <button
              onClick={() => {
                navigate('/referrals');
                setShowDesktopMenu(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-all duration-200 ease-in-out"
            >
              🤝 Referrals
            </button>
          </div>
          <button
            onClick={() => {
              setShowLogoutConfirm(true);
              setShowDesktopMenu(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500 transition-all duration-200 ease-in-out"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white text-black shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          showMobileMenu ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-300 transition-all duration-300 ease-in-out">
          <h2 className="font-bold text-lg">Menu</h2>
          <button onClick={() => setShowMobileMenu(false)} className="text-gray-600 text-2xl transition-all duration-200 ease-in-out hover:scale-110">
            &times;
          </button>
        </div>

        <div className="flex flex-col px-4 py-2 space-y-2 transition-all duration-300 ease-in-out">
          <button
            onClick={() => {
              navigate('/profile');
              setShowMobileMenu(false);
            }}
            className="text-left hover:bg-gray-100 px-2 py-2 rounded transition-all duration-200 ease-in-out"
          >
            👤 Profile
          </button>
          <button
            onClick={() => {
              navigate('/home');
              setShowMobileMenu(false);
            }}
            className="text-left hover:bg-gray-100 px-2 py-2 rounded transition-all duration-200 ease-in-out"
          >
            🏠 Home
          </button>
          <button
            onClick={() => {
              navigate('/earn');
              setShowMobileMenu(false);
            }}
            className="text-left hover:bg-gray-100 px-2 py-2 rounded transition-all duration-200 ease-in-out"
          >
            💸 Earn
          </button>
          <button
            onClick={() => {
              navigate('/leaderboard');
              setShowMobileMenu(false);
            }}
            className="text-left hover:bg-gray-100 px-2 py-2 rounded transition-all duration-200 ease-in-out"
          >
            🏆 Leaderboard
          </button>
          <button
            onClick={() => {
              navigate('/referrals');
              setShowMobileMenu(false);
            }}
            className="text-left hover:bg-gray-100 px-2 py-2 rounded transition-all duration-200 ease-in-out"
          >
            🤝 Referrals
          </button>
          <button
            onClick={() => {
              setShowLogoutConfirm(true);
              setShowMobileMenu(false);
            }}
            className="text-left hover:bg-gray-100 px-2 py-2 rounded text-red-500 transition-all duration-200 ease-in-out"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ease-in-out">
          <div className="bg-gray-900 text-white rounded-xl shadow-lg max-w-sm w-full p-6 mx-4 transform scale-95 opacity-0 animate-fade-slide-in">
            <h3 className="text-xl font-semibold mb-2">Confirm Logout</h3>
            <p className="text-sm text-gray-300">Are you sure you want to logout?</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm rounded border border-gray-600 hover:bg-gray-700 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm rounded bg-red-600 hover:bg-red-700 font-semibold transition-all duration-200"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
