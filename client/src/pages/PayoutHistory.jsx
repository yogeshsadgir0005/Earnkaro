import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import Navbar from '../components/Navbar';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function PayoutHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('/payout/history');
        setHistory(res.data || []);
      } catch (err) {
        console.error('Failed to load payout history:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getStatusBadge = (status) => {
    const base =
      'px-2 py-1 rounded-full text-xs font-bold shadow-sm transition-all duration-300';
    switch (status) {
      case 'completed':
        return `${base} bg-green-600 text-white`;
      case 'failed':
        return `${base} bg-red-600 text-white`;
      default:
        return `${base} bg-yellow-400 text-black`;
    }
  };

  return (
    <>
      <Navbar />

      <div className="bg-yellow-300 text-black text-center p-2 font-bold text-sm transition">
        Track all your previous payout withdrawals here.
      </div>

      <main className="bg-black min-h-screen text-white p-6 transition-all duration-300">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-400 flex items-center gap-2 hover:underline text-sm mb-6 transition duration-200"
        >
          <FaArrowLeft /> Back
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center animate-fadeIn">
          📤 Payout History
        </h2>

        {loading ? (
          <p className="text-center text-gray-400 animate-pulse">Loading...</p>
        ) : history.length === 0 ? (
          <p className="text-center text-gray-500 italic">No payout records found.</p>
        ) : (
          <div className="space-y-4 max-w-2xl mx-auto animate-fadeIn">
            {history.map((entry) => (
              <div
                key={entry._id}
                className="bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold text-white">₹{entry.amount}</h3>
                  <span className={getStatusBadge(entry.status)}>
                    {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-300 mb-1">
                  <strong>Method:</strong> {entry.method?.toUpperCase()}
                </p>
                {entry.utr && (
                  <p className="text-sm text-gray-400 mb-1">
                    <strong>UTR:</strong> {entry.utr}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  {new Date(entry.createdAt).toLocaleString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
