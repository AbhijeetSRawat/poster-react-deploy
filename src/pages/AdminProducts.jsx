import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { FaPlus, FaEdit, FaSave, FaTimes, FaBars, FaTachometerAlt, FaUsers, FaBoxOpen, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState(null); // 'add' or 'edit'
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [loading,setLoading] = useState(false);
  const [formData, setFormData] = useState({
    product_image: null,
    category: '',
    tags: ''
  });

  const categoryOptions = [
    "Business Specific", "Home Decor", "Event & Celebrations",
    "Inspirational & Quotes", "Custom Design", "Seasonal Themes",
    "Hobbies & Interests", "Outdoor & Commercial", "Artistic & Abstract", "Religious & Cultural"
  ];

  useEffect(() => {
    if (activeView === 'edit') fetchProducts();
  }, [activeView]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('https://poster-react-deploy.onrender.com/api/get/product');
      setProducts(res.data.allProduct || []);
    } catch (err) {
      console.error('Failed to load products:', err);
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, product_image: e.target.files[0] });
  };

  const handleUpload = async () => {
    const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
    const data = new FormData();

    if (!formData.product_image || !formData.category) {
      toast.error("Please provide category and image");
      return;
    }

    data.append('category', formData.category);
    data.append('product_image', formData.product_image);
    tags.forEach(tag => data.append('tags', tag));

    try {
        setLoading(true)
      await axios.post("https://poster-react-deploy.onrender.com/api/admin/add/product", data);
      toast.success('Product added successfully');
      setFormData({ product_image: null, category: '', tags: '' });
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error('Upload failed');
    }
    finally{
        setLoading(false);
    }
  };

  const openEditModal = (product) => {
    setEditProduct({ ...product, newImage: null });
  };

  const handleEditChange = (field, value) => {
    setEditProduct({ ...editProduct, [field]: value });
  };

  const handleProductUpdate = async () => {
  try {
    const form = new FormData();
    form.append('productName', editProduct.productName || '');
    form.append('price', editProduct.price || '');
    form.append('offerOnPrice', editProduct.offerOnPrice || '');
    form.append('category', editProduct.category || '');
    form.append('rating', editProduct.rating || '');
    if (editProduct.newImage) {
      form.append('product_image', editProduct.newImage);
    }

    await axios.put(
      `https://poster-react-deploy.onrender.com/api/product/edit/${editProduct._id}`,
      form
    );

    toast.success('Product updated successfully');
    setEditProduct(null);
    fetchProducts();
  } catch (err) {
    console.error('Update failed:', err);
    toast.error('Update failed');
  }
};


  const base = `min-h-screen flex ${darkMode ? 'bg-slate-900 text-white' : 'bg-gray-100 text-gray-800'}`;
  const card = `rounded shadow-md p-4 ${darkMode ? 'bg-slate-800 text-white' : 'bg-white'}`;

  return (
    <div className={base}>
      {/* Sidebar */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            onClick={() => setSidebarOpen(false)}
          />
          <div className={`fixed top-0 left-0 w-64 h-full z-50 md:text-xl ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-800'} shadow-lg`}>
            <div className="flex items-center justify-between p-4 border-b border-gray-300 ">
              <h2 className="text-lg font-bold md:text-2xl">Admin</h2>
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
              <button className="flex items-center gap-3 p-2 bg-teal-600 text-white rounded">
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

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => setSidebarOpen(true)} className="text-teal-600">
            <FaBars size={24} />
          </button>
          <h1 className="text-2xl font-bold md:text-3xl">Manage Products</h1>
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <MdLightMode size={24} className="text-yellow-300" /> : <MdDarkMode size={24} className="text-gray-700" />}
          </button>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button onClick={() => setActiveView('add')} className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 md:text-xl">
            <FaPlus /> Add Product
          </button>
          <button onClick={() => setActiveView('edit')} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 md:text-xl">
            <FaEdit /> View / Edit Products
          </button>
        </div>

        {/* Add Product Form */}
        {activeView === 'add' && (
          <div className={card}>
            <h2 className="text-lg font-semibold mb-4 md:text-2xl">Add Product</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1 md:text-xl">Category</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2 border rounded md:text-xl">
                  <option className={`${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-800'}`} value="">-- Select Category --</option>
                  {categoryOptions.map((cat, i) => (
                    <option className={`${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-800'}`} key={i} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1 md:text-xl">Tags</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full p-2 border rounded placeholder-green-400 md:text-xl"
                  placeholder="e.g. festive, hot deal"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm mb-1 md:text-xl">Upload Image</label>
                <input type="file" onChange={handleFileChange} className="w-full p-2 border rounded md:text-xl" />
              </div>
            </div>
           {(loading)?
            (<div className="mt-4 bg-green-600 w-[40vw]  hover:bg-green-700 text-white px-4 py-2 rounded flex justify-between"><div className='loader1 flex justify-between'></div></div>):( <button onClick={handleUpload} className="mt-4 bg-green-600 hover:bg-green-700 text-white md:text-2xl px-4 py-2 rounded">
              Upload Product
            </button>)
           }
          </div>
        )}

        {/* Edit Product List */}
        {activeView === 'edit' && (
          <div className={card}>
            <h2 className="text-lg font-semibold mb-4 md:text-3xl">Product List</h2>
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="bg-green-700 text-white md:text-lg">
                  <th className="text-left p-2">Image</th>
                  <th className="text-left p-2">Category</th>
                                  <th className="text-left p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map(prod => (
                <tr key={prod._id} className="border-t">
                  <td className="p-2">
                    {prod.path ? (
                      <img src={prod.path} alt="product" className="w-20 h-auto rounded border" />
                    ) : (
                      <span className="text-sm text-gray-400 italic">No image</span>
                    )}
                  </td>
                  <td className="p-2 md:text-lg">{prod.category}</td>
                  <td className="p-2">
                    <button
                      onClick={() => openEditModal(prod)}
                      className="bg-blue-600 hover:bg-blue-700 text-white md:text-xl px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-sm text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
{editProduct && (
  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 z-50">
    <div className={`${card} w-full max-w-md`}>
      <h3 className="text-lg font-bold mb-4 md:text-2xl">Edit Product</h3>
      <div className="space-y-3">

        <label className="block text-sm md:text-xl">Product Name</label>
        <input
          type="text"
          value={editProduct.productName || ''}
          onChange={(e) => handleEditChange('productName', e.target.value)}
          className="w-full p-2 border rounded"
        />

        <label className="block text-sm md:text-xl">Price</label>
        <input
          type="number"
          value={editProduct.price || ''}
          onChange={(e) => handleEditChange('price', e.target.value)}
          className="w-full p-2 border rounded"
        />

        <label className="block text-sm md:text-xl">Offer On Price</label>
        <input
          type="number"
          value={editProduct.offerOnPrice || ''}
          onChange={(e) => handleEditChange('offerOnPrice', e.target.value)}
          className="w-full p-2 border rounded"
        />

        <label className="block text-sm md:text-xl">Category</label>
        <select
          value={editProduct.category}
          onChange={(e) => handleEditChange('category', e.target.value)}
          className="w-full p-2 border rounded"
        >
          {categoryOptions.map((cat, i) => (
            <option key={i} value={cat} className={`${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-800'}`}>
              {cat}
            </option>
          ))}
        </select>

        <label className="block text-sm md:text-xl">Rating</label>
        <input
          type="number"
          max="5"
          min="0"
          step="0.1"
          value={editProduct.rating || ''}
          onChange={(e) => handleEditChange('rating', e.target.value)}
          className="w-full p-2 border rounded"
        />

        <label className="block text-sm md:text-xl">New Image (optional)</label>
        <input
          type="file"
          onChange={(e) => handleEditChange('newImage', e.target.files[0])}
          className="w-full p-2 border rounded"
        />

        <div className="flex justify-between items-center pt-2">
          <button
            onClick={handleProductUpdate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 md:text-2xl"
          >
            <FaSave /> Save Changes
          </button>
          <button
            onClick={() => setEditProduct(null)}
            className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1 md:text-2xl"
          >
            <FaTimes /> Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div> {/* end of main content */}
  </div> 
  );
};

export default AdminProducts;
