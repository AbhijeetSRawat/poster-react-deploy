import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { FaTachometerAlt, FaUsers, FaBoxOpen, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [subscribedUsers, setSubscribedUsers] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userRes = await fetch("http://localhost:11000/api/admin/view/users");
      const userData = await userRes.json();
      const allUsers = userData.allUsers || [];
      setUsers(allUsers);
      const subs = allUsers.filter(user => user.subscribed === true);
      setSubscribedUsers(subs);
      renderUserChart(countByMonth(allUsers), countByMonth(subs));

      const productRes = await fetch("http://localhost:11000/api/get/product");
      const productData = await productRes.json();
      const allProducts = productData.allProduct || [];
      setProducts(allProducts);
      renderProductChart(countByMonth(allProducts));
    } catch (err) {
      console.error("Dashboard load failed:", err);
    }
  };

  const getMonthName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'short', year: 'numeric' });
  };

  const countByMonth = (data, key = "createdAt") => {
    const counts = {};
    data.forEach(item => {
      const month = getMonthName(item[key]);
      counts[month] = (counts[month] || 0) + 1;
    });
    return counts;
  };

  const renderUserChart = (allMap, subsMap) => {
    const ctx = document.getElementById('userChart')?.getContext('2d');
    if (!ctx) return;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(allMap),
        datasets: [
          {
            label: 'All Users',
            data: Object.values(allMap),
            backgroundColor: '#1abc9c',
          },
          {
            label: 'Subscribed Users',
            data: Object.keys(allMap).map(month => subsMap[month] || 0),
            backgroundColor: '#2e86de',
          }
        ]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
      }
    });
  };

  const renderProductChart = (dataMap) => {
    const ctx = document.getElementById('productChart')?.getContext('2d');
    if (!ctx) return;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: Object.keys(dataMap),
        datasets: [{
          label: 'Products',
          data: Object.values(dataMap),
          backgroundColor: 'rgba(52,73,94,0.1)',
          borderColor: '#34495e',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
      }
    });
  };

  const sectionStyle = darkMode ? 'bg-slate-900 text-gray-100' : 'bg-gray-100 text-gray-800';
  const cardStyle = darkMode ? 'bg-slate-700 text-white' : 'bg-white text-black';

  return (
    <div className="relative min-h-screen">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            onClick={() => setSidebarOpen(false)}
          />
          <div className={`fixed top-0 left-0 w-64 h-full z-50 transition-transform duration-300 ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-800'} shadow-lg`}>
            <div className="flex items-center justify-between p-4 border-b border-gray-300">
              <h2 className="text-lg font-bold">Admin</h2>
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
              <button onClick={() => navigate('/')} className="flex items-center gap-3 p-2 hover:bg-red-500 rounded">
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </>
      )}

      {/* Topbar & Page */}
      <div className={`flex-1 ${sectionStyle} px-4 py-6`}>
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="bg-teal-600 text-white px-3 py-1 rounded shadow"
          >
            ☰
          </button>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? (
              <MdLightMode size={28} className="text-yellow-300 hover:text-yellow-400" />
            ) : (
              <MdDarkMode size={28} className="text-gray-700 hover:text-gray-600" />
            )}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className={`${cardStyle} shadow-md rounded p-6 text-center`}>
            <h3 className="text-lg font-semibold">Total Users</h3>
            <p className="text-2xl font-bold text-teal-500">{users.length}</p>
          </div>
          <div className={`${cardStyle} shadow-md rounded p-6 text-center`}>
            <h3 className="text-lg font-semibold">Subscribed Users</h3>
            <p className="text-2xl font-bold text-blue-500">{subscribedUsers.length}</p>
          </div>
          <div className={`${cardStyle} shadow-md rounded p-6 text-center`}>
            <h3 className="text-lg font-semibold">Total Products</h3>
            <p className="text-2xl font-bold text-indigo-500">{products.length}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className={`${cardStyle} shadow rounded p-4`}>
            <h3 className="text-md font-semibold text-center mb-3">Users Per Month</h3>
            <canvas id="userChart" height="260" />
          </div>
          <div className={`${cardStyle} shadow rounded p-4`}>
            <h3 className="text-md font-semibold text-center mb-3">Products Per Month</h3>
            <canvas id="productChart" height="260" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
