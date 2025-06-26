import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import Heading from '../components/core/heading';
import toast from 'react-hot-toast';

const SearchPage = ({ searchValue, setSearchValue, tagvalue, setTagvalue, mode, setMode }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchPics, setSearchPics] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [userLogo, setUserLogo] = useState(null);

  const callAllData = async () => {
    try {
      setSearchLoading(true);
      const res = await fetch("http://localhost:11000/api/get/product");
      const data = await res.json();
      setSearchPics(data.allProduct || []);
    } catch (error) {
      console.error("Error fetching search posts:", error);
      toast.error("Unable to fetch search results");
    } finally {
      setSearchLoading(false);
    }
  };

  const fetchUserLogo = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const res = await fetch("http://localhost:11000/getUserDetails", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUserLogo(data?.data?.profile?.logo || null);
    } catch (err) {
      console.error("Error fetching user logo:", err);
    }
  };

  useEffect(() => {
    callAllData();
    fetchUserLogo();
  }, []);

  useEffect(() => {
    const filtered = searchPics.filter(product =>
      product.tags?.some(tag => tag.toLowerCase().includes(tagvalue))
    );
    if (filtered.length > 0) {
      setSelectedImage(filtered[0].path);
    }
    if (tagvalue === '') {
      setSelectedImage(null);
    }
  }, [tagvalue, searchPics]);

  const searchClick = (e) => {
    e.preventDefault();
    setTagvalue(searchValue);
  };

  const handleDownload = () => {
    if (!selectedImage) return;
    const encodedImg = encodeURIComponent(selectedImage);
    const encodedLogo = userLogo ? `&logoURL=${encodeURIComponent(userLogo)}` : "";
    const downloadURL = `http://localhost:11000/downloadWithLogo?imgURL=${encodedImg}${encodedLogo}`;

    const link = document.createElement("a");
    link.href = downloadURL;
    link.setAttribute("download", "poster.jpg");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`${mode ? "bg-blue-300 text-gray-700" : "bg-slate-900  text-gray-400"} min-h-screen pt-20`}>
      <Heading mode={mode} setMode={setMode} />

      {/* Search Input */}
      <div className="mt-4 flex justify-center">
        <input
          type="text"
          placeholder="Search Category or Media"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className={`w-[75vw] h-[7vh] rounded-l-md px-3 ${mode ? "bg-blue-400" : "bg-slate-800"} outline-none`}
        />
        <button
          onClick={searchClick}
          className={`w-[15vw] h-[7vh] flex justify-center items-center rounded-r-md ${mode ? "bg-blue-500" : "bg-slate-700"}`}
        >
          <FaSearch size={20} />
        </button>
      </div>

      {/* Selected Image + Logo */}
      {selectedImage && (
        <div className="relative flex justify-center items-center mt-6 px-4">
          {userLogo && (
            <img
              src={userLogo}
              alt="User Logo"
              className="absolute top-3 left-5 w-12 h-12 rounded-md border-2 border-white shadow-md"
            />
          )}
          <img
            src={selectedImage}
            alt="Selected"
            className="w-full max-w-2xl h-auto rounded-lg shadow-lg object-contain transition-all duration-300"
          />
        </div>
      )}

      {/* Download Button */}
      {selectedImage && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded shadow transition"
          >
            Download
          </button>
        </div>
      )}

      {/* Results */}
      <div className="mt-6 px-4">
        {searchLoading ? (
          <div className="text-center">Loading...</div>
        ) : tagvalue === '' ? (
          <div className="text-center text-sm">Please provide some value to search...</div>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-3">
              Related pictures for <span className="text-blue-500">{tagvalue}</span>:
            </h2>
            <div className="flex flex-wrap gap-4 pb-4">
              {searchPics
                .filter(product =>
                  product.tags?.some(tag => tag.toLowerCase().includes(tagvalue)))
                .map((pic, index) => (
                  <div
                    key={pic._id || index}
                    className="w-[98px] h-[98px] overflow-hidden rounded shadow cursor-pointer"
                  >
                    <img
                      src={pic.path}
                      alt={pic.productImage || "Tagged Image"}
                      onClick={() => setSelectedImage(pic.path)}
                      className="w-full h-full object-cover rounded hover:opacity-70 transition"
                    />
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
