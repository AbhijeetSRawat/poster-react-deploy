import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Heading from '../components/core/heading';

const ArtisticAndAbstract = ({ mode, setMode }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [allLoading, setAllLoading] = useState(false);
  const [allData, setAllData] = useState([]);
  const [userLogo, setUserLogo] = useState(null);

 

  const callAllData = async () => {
    try {
      setAllLoading(true);
      const allDataResult = await fetch("http://localhost:11000/api/get/product");
      const allDataResponse = await allDataResult.json();
      setAllData(allDataResponse.allProduct || []);
    } catch (error) {
      console.error("Error in fetching all posts:", error);
      toast.error("Unable to fetch posts");
    } finally {
      setAllLoading(false);
    }
  };

  const fetchUserLogo = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const res = await fetch("http://localhost:11000/getUserDetails", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  const reqData = allData.filter(pic => pic.category === 'Artistic & Abstract');

  useEffect(() => {
    if (reqData.length > 0 && !selectedImage) {
      setSelectedImage(reqData[0]?.path);
    }
  }, [reqData]);

  const handleDownload = () => {
    if (!selectedImage) return;

    const encodedImage = encodeURIComponent(selectedImage);
    const encodedLogo = userLogo ? `&logoURL=${encodeURIComponent(userLogo)}` : "";
    const downloadURL = `http://localhost:11000/downloadWithLogo?imgURL=${encodedImage}${encodedLogo}`;

    const link = document.createElement("a");
    link.href = downloadURL;
    link.setAttribute("download", "poster.jpg");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`min-h-screen pt-16 ${mode ? "bg-blue-300 text-gray-700" : "bg-slate-900 text-gray-400"}`}>
      <Heading mode={mode} setMode={setMode} />

      {selectedImage && (
        <div className="relative flex justify-center items-center my-6 px-4">
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

      {selectedImage && (
        <div className="flex justify-center mb-4">
          <button
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded shadow transition"
          >
            Download
          </button>
        </div>
      )}

      <div className="mt-5 px-4">
        <h2 className="text-xl font-semibold mb-3">Artistic & Abstract</h2>
        {allLoading ? (
          <div className="spinner">Loading...</div>
        ) : (
          <div className="flex flex-wrap gap-4 pb-4">
            {reqData.map((pic, index) => (
              <div
                key={pic._id || index}
                className="w-[98px] h-[98px] overflow-hidden rounded shadow cursor-pointer"
              >
                <img
                  src={pic.path}
                  alt={pic.productImage || "Artistic and Abstract"}
                  onClick={() => setSelectedImage(pic.path)}
                  className="w-full h-full object-cover rounded hover:opacity-70 transition"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtisticAndAbstract;
