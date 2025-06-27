import React, { useEffect, useState } from 'react';
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { FaTachometerAlt, FaUsers, FaBoxOpen, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AddReferral = () => {
  const navigate = useNavigate();
  const [referalcode, setReferalcode] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [message, setMessage] = useState(null);

  const sectionStyle = darkMode ? 'bg-slate-900 text-gray-100' : 'bg-gray-100 text-gray-800';
  const cardStyle = darkMode ? 'bg-slate-700 text-white' : 'bg-white text-black';

  const handleCreateReferral = async () => {
    const code = referalcode.trim();
    if (!code) {
      setMessage('Please enter a referral code.');
      return;
    }

    try {
      const res = await fetch('https://poster-react-deploy.onrender.com/createReferal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referalcode: code }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage('✅ Referral created successfully!');
        setReferalcode('');
      } else {
        setMessage('❌ ' + (data.message || 'Failed to create referral.'));
      }
    } catch (err) {
      console.error('Referral creation error:', err);
      setMessage('❌ Something went wrong. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen pb-10">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            onClick={() => setSidebarOpen(false)}
          />
          <div className={`fixed top-0 left-0 w-64 h-full z-50 transition-transform duration-300 md:text-xl ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-800'} shadow-lg`}>
            <div className="flex items-center justify-between p-4 border-b border-gray-300">
              <h2 className="text-lg font-bold md:text-3xl">Admin</h2>
              <button onClick={() => setSidebarOpen(false)} className="text-lg">×</button>
            </div>
            <nav className="flex flex-col gap-1 p-4">
              <button onClick={() => navigate('/admindashboard')} className="flex items-center gap-3 p-2 hover:bg-teal-600 rounded">
                <FaTachometerAlt />
                <span>Dashboard</span>
              </button>
              <button onClick={() => navigate('/adminusers')} className="flex items-center gap-3 p-2 hover:bg-teal-600 rounded">
                <FaUsers />
                <span>Users</span>
              </button>
              <button onClick={() => navigate('/adminproducts')} className="flex items-center gap-3 p-2 hover:bg-teal-600 rounded">
                <FaBoxOpen />
                <span>Products</span>
              </button>
              <button onClick={() => navigate('/addreferal')} className="flex items-center gap-3 p-2 bg-teal-600 text-white rounded">
                <FaUsers />
                <span>Add Referral</span>
              </button>
              <button onClick={() => navigate('/')} className="flex items-center gap-3 p-2 hover:bg-red-500 rounded">
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </>
      )}

      {/* Topbar & Page */}
      <div className={`flex-1 ${sectionStyle} min-h-screen px-4 py-6`}>
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="bg-teal-600 text-white px-3 py-1 rounded shadow"
          >
            ☰
          </button>
          <h1 className="text-2xl font-bold md:text-3xl md:mb-6">Add Referral Code</h1>
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? (
              <MdLightMode size={28} className="text-yellow-300 hover:text-yellow-400" />
            ) : (
              <MdDarkMode size={28} className="text-gray-700 hover:text-gray-600" />
            )}
          </button>
        </div>

        <div className="flex justify-center">
          <div className={`${cardStyle} shadow-md rounded p-6 w-full max-w-md`}>
            <label htmlFor="referalcode" className="block mb-2 font-semibold">Referral Code:</label>
            <input
              id="referalcode"
              type="text"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Enter referral code..."
              value={referalcode}
              onChange={(e) => setReferalcode(e.target.value)}
            />
            <button
              onClick={handleCreateReferral}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded"
            >
              Add Referral
            </button>
            {message && (
              <p className="mt-4 text-center text-sm font-medium text-red-400">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddReferral;
