import React, { useEffect, useState } from 'react';
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { FaTachometerAlt, FaUsers, FaBoxOpen, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch("https://poster-react-deploy.onrender.com/getAllUsers");
      const data = await res.json();
      setUsers(data.data || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const sectionStyle = darkMode ? 'bg-slate-900 text-gray-100' : 'bg-gray-100 text-gray-800';
  const cardStyle = darkMode ? 'bg-slate-700 text-white' : 'bg-white text-black';

  return (
    <div className="relative min-h-screen">
      {/* Sidebar & Overlay */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={() => setSidebarOpen(false)} />
          <div className={`fixed top-0 left-0 w-64 h-full z-50 md:text-xl ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-800'} shadow-lg`}>
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold md:text-2xl">Admin</h2>
              <button onClick={() => setSidebarOpen(false)} className="text-lg">×</button>
            </div>
            <nav className="flex flex-col gap-1 p-4">
              <button onClick={() => navigate('/admindashboard')} className="flex items-center gap-3 p-2 hover:bg-teal-600 rounded">
                <FaTachometerAlt />
                <span>Dashboard</span>
              </button>
              <button onClick={() => navigate('/adminusers')} className="flex items-center gap-3 p-2 bg-teal-600 text-white rounded">
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

      {/* Main */}
      <div className={`flex-1 min-h-screen ${sectionStyle} px-4 py-6`}>
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="bg-teal-600 text-white px-3 py-1 rounded shadow"
          >
            ☰ 
          </button>
          <h1 className="text-2xl font-bold md:text-3xl">Users</h1>
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? (
              <MdLightMode size={28} className="text-yellow-300 hover:text-yellow-400" />
            ) : (
              <MdDarkMode size={28} className="text-gray-700 hover:text-gray-600" />
            )}
          </button>
        </div>

        {/* Table */}
        <div className={`${cardStyle} shadow rounded overflow-x-auto`}>
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className={darkMode ? "bg-slate-700 text-white" : "bg-gray-100 text-gray-600"}>
              <tr>
                <th className="px-6 py-3 text-left uppercase font-semibold tracking-wider md:text-2xl">Email</th>
                <th className="px-6 py-3 text-left uppercase font-semibold tracking-wider md:text-2xl">Action</th>
              </tr>
            </thead>
            <tbody className={darkMode ? "divide-y divide-gray-600" : "bg-white divide-y divide-gray-200"}>
              {users.map(user => (
                <tr key={user._id}>
                  <td className="px-6 py-3 md:text-xl">{user.email}</td>
                  <td className="px-6 py-3 md:text-xl">
                    <button
                      onClick={() => openModal(user)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={2} className="text-center py-6 text-gray-500">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[60]">
          <div className={`${cardStyle} max-w-md w-full rounded shadow-lg p-6 relative`}>
            <h2 className="text-lg font-bold mb-4 md:text-3xl">User Details</h2>
            <ul className="space-y-2 text-sm md:text-xl">
              <li><strong>Name:</strong> {selectedUser.firstName} {selectedUser.lastName || ""}</li>
              <li><strong>Email:</strong> {selectedUser.email}</li>
              <li><strong>Phone:</strong> {selectedUser.number || "N/A"}</li>
              <li><strong>Subscribed:</strong> {selectedUser.subscribed ? "Yes" : "No"}</li>
              {selectedUser.subscriptionDate && (
                <li><strong>Subscription Date:</strong> {new Date(selectedUser.subscriptionDate).toLocaleDateString()}</li>
              )}
              {selectedUser.profile && (
                <>
                  <li><strong>Business:</strong> {selectedUser.profile.business || "N/A"}</li>
                  <li><strong>Gender:</strong> {selectedUser.profile.gender || "N/A"}</li>
                  <li><strong>Age:</strong> {selectedUser.profile.age || "N/A"}</li>
                  <li><strong>Address:</strong> {selectedUser.profile.address || "N/A"}</li>
                  <li><strong>About:</strong> {selectedUser.profile.about || "N/A"}</li>
                  {selectedUser.profile.logo && (
                    <li>
                      <strong>Logo:</strong><br />
                      <img
                        src={selectedUser.profile.logo}
                        alt="Logo"
                        className="mt-2 w-20 h-20 object-contain rounded border shadow"
                      />
                    </li>
                  )}
                </>
              )}
            </ul>
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
