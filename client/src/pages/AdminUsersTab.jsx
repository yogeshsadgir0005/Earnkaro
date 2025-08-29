import React, { useEffect, useState } from 'react';
import axios from '../utils/axios'; 

const AdminUsersTab = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/admin/users');
      setUsers(res.data);
    } catch {}
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4 transition-all duration-300">
      <h2 className="text-2xl font-bold text-white mb-6">👥 All Users</h2>
      <div className="overflow-auto max-h-[500px] border border-gray-300 rounded-lg shadow-md transition">
        <table className="min-w-full bg-white text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase text-center">
            <tr>
              <th className="py-3 px-4 border">Name</th>
              <th className="py-3 px-4 border">Email</th>
              <th className="py-3 px-4 border">Points</th>
              <th className="py-3 px-4 border">Admin?</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr
                key={user._id}
                className="text-center transition hover:bg-blue-50 duration-200"
              >
                <td className="py-2 px-4 border font-medium text-gray-900">{user.name}</td>
                <td className="py-2 px-4 border text-gray-700">{user.email}</td>
                <td className="py-2 px-4 border text-green-600 font-semibold">₹{user.points}</td>
                <td className="py-2 px-4 border">
                  {user.isAdmin ? (
                    <span className="text-green-600 font-bold transition">✅</span>
                  ) : (
                    <span className="text-red-500 font-bold transition">❌</span>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-400 italic animate-pulse">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersTab;
