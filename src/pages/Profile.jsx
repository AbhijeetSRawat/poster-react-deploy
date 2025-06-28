import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Heading from "../components/core/heading";

const ProfilePage = ({ mode, setMode }) => {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    number: "",
    email: "",
    address: "",
    about: "",
    business: "",
    age: "",
    gender: "",
    logo: null,
    footer: null,
  });

  const [preview1, setPreview1] = useState(null);
  const [preview2, setPreview2] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [footerImage, setFooterImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  const token = JSON.parse(localStorage.getItem("token"));

  const fetchProfile = async () => {
    if (!token) {
      toast.error("You need to log in first");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get("https://poster-react-deploy.onrender.com/getUserDetails", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = res.data.data;
      const profile = user.profile;

      localStorage.setItem("business", profile?.business || "");

      setForm({
        firstname: user.firstName || "",
        lastname: user.lastName || "",
        number: user.number || "",
        email: user.email || "",
        address: profile?.address || "",
        business: profile?.business || "",
        about: profile?.about || "",
        age: profile?.age || "",
        gender: profile?.gender || "",
        logo: null,
        footer: null,
      });

      setProfileImage(profile?.logo || null);
      setFooterImage(profile?.footer || null);
    } catch (error) {
      console.error("Fetch profile error:", error);
      toast.error("Failed to fetch profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "logo" && files.length > 0) {
      const file = files[0];
      setForm((prev) => ({ ...prev, logo: file }));
      setPreview1(URL.createObjectURL(file));
    } else if (name === "footer" && files.length > 0) {
      const file = files[0];
      setForm((prev) => ({ ...prev, footer: file }));
      setPreview2(URL.createObjectURL(file));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: name === "age" ? parseInt(value, 10) || "" : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(form).forEach(([key, val]) => {
      if (val !== null) data.append(key, val);
    });

    try {
      setLoading(true);
      const res = await axios.post("https://poster-react-deploy.onrender.com/profile", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success("Profile updated successfully!");
        setEditMode(false);
        fetchProfile();
      } else {
        toast.error("Profile update failed");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen pt-16 ${mode ? "bg-blue-300 text-gray-700" : "bg-slate-900 text-gray-300"}`}>
      <Heading mode={mode} setMode={setMode} />

      <div className={`max-w-md flex flex-col items-center p-6 mt-10 mx-5 rounded-xl shadow-2xl md:mt-28 md:max-w-[85vw] md:mx-auto ${mode ? "bg-blue-200 shadow-blue-900" : "bg-slate-700 shadow-blue-500"}`}>
        <h2 className={`text-xl font-bold mb-4 md:text-3xl ${mode ? "text-black" : "text-white"}`}>
          {editMode ? "Edit Profile" : "My Profile"}
        </h2>

        {!editMode ? (
          <>
            <div className="w-full space-y-2 text-left text-sm md:text-xl">
              <p><strong>First Name:</strong> {form.firstname || "N/A"}</p>
              <p><strong>Last Name:</strong> {form.lastname || "N/A"}</p>
              <p><strong>Email:</strong> {form.email || "N/A"}</p>
              <p><strong>Phone Number:</strong> {form.number || "N/A"}</p>
              <p><strong>Business:</strong> {form.business || "N/A"}</p>
              <p><strong>Address:</strong> {form.address || "N/A"}</p>
              <p><strong>About:</strong> {form.about || "N/A"}</p>
              <p><strong>Age:</strong> {form.age || "N/A"}</p>
              <p><strong>Gender:</strong> {form.gender || "N/A"}</p>
              {profileImage && (
                <>
                  <p className="font-bold text-sm md:text-xl">Logo:</p>
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-48 object-contain rounded-lg shadow mt-2"
                  />
                </>
              )}
              {footerImage && (
                <>
                  <p className="font-bold text-sm md:text-xl">Footer:</p>
                  <img
                    src={footerImage}
                    alt="Footer"
                    className="w-full h-48 object-contain rounded-lg shadow mt-2"
                  />
                </>
              )}
            </div>

            <button
              onClick={() => setEditMode(true)}
              className="bg-yellow-500 mt-6 px-4 py-2 rounded text-white font-semibold md:text-2xl"
            >
              Edit Profile
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 w-full">
            <input type="text" name="address" placeholder="Address" value={form.address} onChange={handleChange} className="w-full p-2 border rounded placeholder-gray-400 md:h-[5vh] md:text-xl" required />
            <textarea name="about" placeholder="About" value={form.about} onChange={handleChange} className="w-full p-2 border rounded placeholder-gray-400 md:h-[5vh] md:text-xl" required />
            <input type="text" name="business" placeholder="Business" value={form.business} onChange={handleChange} className="w-full p-2 border rounded placeholder-gray-400 md:h-[5vh] md:text-xl" required />
            <input type="number" name="age" placeholder="Age" value={form.age} onChange={handleChange} className="w-full p-2 border rounded placeholder-gray-400 md:h-[5vh] md:text-xl" required />
            <select name="gender" value={form.gender} onChange={handleChange} className="w-full p-2 border rounded" required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            {preview1 && (
              <div className="mb-4">
                <img src={preview1} alt="Logo Preview" className="w-full h-48 object-contain rounded-lg shadow" />
              </div>
            )}
            <label htmlFor="logo" className="text-base font-semibold md:text-xl">Logo:</label>
            <input type="file" accept="image/*" name="logo" onChange={handleChange} className="w-full p-2 border rounded" />

            {preview2 && (
              <div className="mb-4">
                <img src={preview2} alt="Footer Preview" className="w-full h-48 object-contain rounded-lg shadow" />
              </div>
            )}
            <label htmlFor="footer" className="text-base font-semibold md:text-xl">Footer:</label>
            <input type="file" accept="image/*" name="footer" onChange={handleChange} className="w-full p-2 border rounded" />

            <div className="flex gap-3 md:text-2xl">
              <button type="submit" disabled={loading} className={`w-full py-2 rounded text-white font-semibold ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}>
                {loading ? "Saving..." : "Save"}
              </button>
 <button
                type="button"
                onClick={() => setEditMode(false)}
                className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        <div
          onClick={() => navigate("/")}
          className="mt-6 underline cursor-pointer md:text-xl"
        >
          Go to HomePage
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;