import axios from "axios";
import React, {  useState } from "react";
import toast from "react-hot-toast";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { RiVideoFill, RiNotificationLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Heading from "../components/core/heading";

const SignUp = ({ mode, setMode }) => {
  const navigate = useNavigate();

  // const changeTheme = () => {
  //   setMode(!mode);
  // };

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    number: "",
    password: "",
    otp: "",
  });

  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e) => {
    setForm((prevForm) => {
      return { ...prevForm, [e.target.name]: e.target.value };
    });
  };

  const sendOtp = async () => {
    // Send OTP logic here (API call)

    try {
      setLoading(true);

      if (
        !form.firstName ||
        !form.lastName ||
        !form.email ||
        !form.number ||
        !form.password
      ) {
        toast.error("All fields are necessary");
        return;
      }

      const response = await axios.post("https://poster-react-deploy.onrender.com/request-otp", {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        number: form.number,
        password: form.password,
      });
      console.log("otp response is", response);
      toast.success("OTP has been sent to your email!");
    } catch (error) {
      console.log("error while sending otp", error);
      toast.error("Error while sending otp");
    } finally {
      setLoading(false);
    }
    setOtpSent(true);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (
        !form.firstName ||
        !form.lastName ||
        !form.email ||
        !form.number ||
        !form.password ||
        !form.otp
      ) {
        toast.error("All fields are necessary");
        return;
      }

      const response = await axios.post("https://poster-react-deploy.onrender.com/verify-otp", {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        number: form.number,
        password: form.password,
        otp: form.otp,
      });


        if (response?.data?.success) {
          toast.success("Signed up successfully");
          navigate("/login");
        } else {
          toast.error("Error while sign up");
        }
    } catch (error) {
      toast.error("Error while signing up");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${
        mode ? "bg-blue-300 text-gray-700" : "bg-slate-900 text-gray-400"
      } min-h-screen pt-20`}
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
              <MdDarkMode
                size={40}
                className="rounded-full bg-white p-2 text-blue-600 shadow-md hover:bg-blue-100 cursor-pointer transition-all duration-300"
              />
            ) : (
              <MdLightMode
                size={40}
                className="rounded-full bg-white p-2 text-blue-600 shadow-md hover:bg-blue-100 cursor-pointer transition-all duration-300"
              />
            )}
          </div>
          <RiVideoFill
            size={40}
            className="rounded-full bg-white p-2 text-blue-600 shadow-md hover:bg-blue-100 cursor-pointer transition-all duration-300"
          />
          <RiNotificationLine
            size={40}
            className="rounded-full bg-white p-2 text-blue-600 shadow-md hover:bg-blue-100 cursor-pointer transition-all duration-300"
          />
        </div>
      </div> */}
      <Heading mode={mode} setMode={setMode}/>
      {/* sign up form */}

      <div
        className={`max-w-md flex flex-col items-center p-6 mt-10 mx-2  rounded-xl md:mx-auto md:mt-40 md:max-w-2xl md:rounded-3xl shadow-2xl ${
          mode ? `bg-blue-200 shadow-blue-900 ` : `bg-slate-700 shadow-blue-500`
        }  `}
      >
        <h2
          className={`text-xl md:text-3xl font-bold mb-4 ${
            mode ? `text-black` : `text-white`
          }`}
        >
          Sign Up
        </h2>
        <form onSubmit={handleSignup} className="space-y-3 ">
          <input
            type="text"
            name="firstName"
            className={`  w-full  md:h-[5vh] md:text-xl p-2 border rounded placeholder-gray-400`}
            value={form.firstName}
            onChange={handleChange}
            placeholder="First Name"
            required
          />
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="w-full  md:h-[5vh] md:text-xl p-2 border placeholder-gray-400 rounded"
            required
          />
          <div className="space-y-2">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full  md:h-[5vh] md:text-xl p-2 border placeholder-gray-400 rounded"
              required
            />
            <input
              type="tel"
              name="number"
              value={form.number}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full  md:h-[5vh] md:text-xl p-2 border placeholder-gray-400 rounded"
              required
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full  md:h-[5vh] md:text-xl p-2 border placeholder-gray-400 rounded"
              required
            />
            {!otpSent &&
              (loading ? (
                <div className=" bg-blue-500 flex justify-center items-center  text-white h-[6vh] px-4 py-2 rounded w-full">
                  <div className="loader"></div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={sendOtp}
                  className="bg-blue-500 text-white h-[6vh] md:text-2xl  px-4 py-2 rounded w-full"
                >
                  Send OTP
                </button>
              ))}
          </div>
          {otpSent && (
            <>
              <input
                type="text"
                name="otp"
                value={form.otp}
                onChange={handleChange}
                placeholder="Enter OTP"
                className="w-full p-2 border md:h-[5vh] md:text-xl placeholder-gray-400 rounded"
                required
              />

              {!loading ? (
                <button
                  type="submit"
                  className="bg-green-600 md:text-2xl text-white px-4 py-2  rounded w-full"
                >
                  Sign Up
                </button>
              ) : (
                <div className=" bg-green-600 flex justify-center items-center  text-white h-[6vh] px-4 py-2 rounded w-full">
                  <div className="loader"></div>
                </div>
              )}
            </>
          )}
        </form>
        <div className="mt-3 md:text-xl underline" onClick={()=>navigate('/login')}>
          Already have an account
        </div>
      </div>
    </div>
  );
};

export default SignUp;
