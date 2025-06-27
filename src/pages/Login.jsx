import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { RiVideoFill, RiNotificationLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Heading from "../components/core/heading";

const Login = ({ mode, setMode }) => {
  const navigate = useNavigate();

  // const changeTheme = () => setMode(!mode);

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (!form.email || !form.password) {
        toast.error("Email and Password are required");
        return;
      }

      const response = await axios.post("https://poster-react-deploy.onrender.com/api/auth/signin", {
        email: form.email,
        password: form.password,
      });

      console.log(response)

      localStorage.setItem('token', JSON.stringify(response.data.token));
      localStorage.setItem('user', JSON.stringify(response.data.user.email));
      localStorage.setItem('subscribed', JSON.stringify(response.data.user.subscribed));
      localStorage.setItem('fisrtName', JSON.stringify(response.data.user.firstName));
     localStorage.setItem('role', JSON.stringify(response.data.user.role));


      if (response?.data?.success) {
        toast.success("Login successful");
        if(form.email === 'Admin@gmail.com'){
           navigate("/admindashboard");
        }
        else{
          navigate("/");
        }
      } else {
        toast.error(response?.data?.message || "Invalid credentials");
      }
    } catch (error) {
      console.log("Login error:", error);
      toast.error("Error while logging in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${
        mode ? "bg-blue-300 text-gray-700" : "bg-slate-900 text-gray-400"
      } min-h-screen pt-24`}
    >
      {/* Top Heading */}
      {/* <div className="w-full h-[10vh] p-3 flex justify-between items-center">
        <div>
          <div className="flex gap-2 text-xs items-center font-bold">
            Your Business
            <div className="bg-yellow-500 w-[17vw] h-[3vh] flex justify-center text-white items-center rounded">
              Subscribe
            </div>
          </div>
          <div className="font-bold">Business {">"}</div>
        </div>
        <div className="flex items-center gap-1.5">
          <div onClick={changeTheme}>
            {mode ? (
              <MdDarkMode className="rounded-full bg-white p-2 text-blue-600 shadow-md hover:bg-blue-100 cursor-pointer transition-all duration-300" size={40} />
            ) : (
              <MdLightMode className="rounded-full bg-white p-2 text-blue-600 shadow-md hover:bg-blue-100 cursor-pointer transition-all duration-300" size={40} />
            )}
          </div>
          <RiVideoFill className="rounded-full bg-white p-2 text-blue-600 shadow-md hover:bg-blue-100 cursor-pointer transition-all duration-300" size={40} />
          <RiNotificationLine className="rounded-full bg-white p-2 text-blue-600 shadow-md hover:bg-blue-100 cursor-pointer transition-all duration-300" size={40} />
        </div>
      </div> */}
      <Heading mode={mode} setMode={setMode}/>
      {/* Login Form */}
      <div
        className={`max-w-md p-6 flex flex-col items-center mt-10 mx-2 rounded-xl shadow-2xl ${
          mode ? "bg-blue-200 shadow-blue-900" : "bg-slate-700 shadow-blue-500"
        }`}
      >
        <h2
          className={`text-xl font-bold mb-4 ${
            mode ? "text-black" : "text-white"
          }`}
        >
          Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded placeholder-gray-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border rounded placeholder-gray-400"
            required
          />

            <div onClick={()=>navigate('/forget-password')} className="w-full flex justify-end">
            Forget Password?
          </div>

          {!loading ? (
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded w-full"
            >
              Login
            </button>
          ) : (
            <div className="bg-green-600 text-white flex justify-center items-center h-[6vh] rounded w-full">
              <div className="loader"></div>
            </div>
          )}
        </form>

        <div className="mt-5 underline " onClick={()=>navigate('/signup')}>
          Create an acoount
        </div>
      </div>
    </div>
  );
};

export default Login;
