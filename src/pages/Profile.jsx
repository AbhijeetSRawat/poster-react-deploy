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
    business:"",
    age: "",
    gender: "",
    logo: null,
  });

  const [preview, setPreview] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  const token = JSON.parse(localStorage.getItem("token"));

  const fetchProfile = async () => {
    try {
      const res = await axios.get("https://poster-react-deploy.onrender.com/getUserDetails", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = res.data.data;
      const profile = res.data.data.profile;
      localStorage.setItem('business',profile?.business || "");
      setForm({
        firstname: user.firstName || "",
        lastname: user.lastName || "",
        number: user.number || "",
        email: user.email || "",
        address: profile?.address || "",
        business:profile?.business||"",
        about: profile?.about || "",
        age: profile?.age || "",
        gender: profile?.gender || "",
        logo: null,
      });

      setProfileImage(profile?.logo || null);
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
    if (name === "logo") {
      setForm({ ...form, logo: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: name === "age" ? parseInt(value) : value });
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

      <div className={`max-w-md flex flex-col items-center p-6 mt-10 mx-5 rounded-xl shadow-2xl ${mode ? "bg-blue-200 shadow-blue-900" : "bg-slate-700 shadow-blue-500"}`}>
        <h2 className={`text-xl font-bold mb-4 ${mode ? "text-black" : "text-white"}`}>
          {editMode ? "Edit Profile" : "My Profile"}
        </h2>

        {!editMode ? (
          <>
            <div className="w-full space-y-2 text-left text-sm">
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
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-48 object-contain rounded-lg shadow mt-4"
                />
              )}
            </div>

            <button
              onClick={() => setEditMode(true)}
              className="bg-yellow-500 mt-6 px-4 py-2 rounded text-white font-semibold"
            >
              Edit Profile
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 w-full">
            <input type="text" name="address" placeholder="Address" value={form.address} onChange={handleChange} className="w-full p-2 border rounded placeholder-gray-400" required />
            <textarea name="about" placeholder="About" value={form.about} onChange={handleChange} className="w-full p-2 border rounded placeholder-gray-400" required />
             <input type="text" name="business" placeholder="Business" value={form.business} onChange={handleChange} className="w-full p-2 border rounded placeholder-gray-400" required />
            <input type="number" name="age" placeholder="Age" value={form.age} onChange={handleChange} className="w-full p-2 border rounded placeholder-gray-400" required />
            <select name="gender" value={form.gender} onChange={handleChange} className="w-full p-2 border rounded" required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            {preview && (
              <div className="mb-4">
                <img src={preview} alt="Preview" className="w-full h-48 object-contain rounded-lg shadow" />
              </div>
            )}

            <input type="file" accept="image/*" name="logo" onChange={handleChange} className="w-full p-2 border rounded" />

            <div className="flex gap-3">
              <button type="submit" disabled={loading} className={`w-full py-2 rounded text-white font-semibold ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}>
                {loading ? "Saving..." : "Save"}
              </button>
              <button type="button" onClick={() => setEditMode(false)} className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded font-semibold">
                Cancel
              </button>
            </div>
          </form>
        )}

        <div onClick={() => navigate("/")} className="mt-6 underline cursor-pointer">
          Go to HomePage
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
