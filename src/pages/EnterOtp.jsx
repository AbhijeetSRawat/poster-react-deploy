import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Heading from '../components/core/heading';
import Navbar from '../components/core/Navbar';
import logo from '../assets/img/logo_techbro-removebg-preview.png';
import toast from 'react-hot-toast';

const EnterOtp = ({ mode, setMode }) => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [step, setStep] = useState('otp'); // 'otp' or 'reset'
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (!storedEmail) {
      navigate('/forget-password');
    } else {
      setEmail(storedEmail);
      window.scrollTo(0, 0);
    }
  }, [navigate]);

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      setLoading(true);
      const res = await fetch('https://poster-react-deploy.onrender.com/api/auth/verifyOtp', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || 'Invalid OTP');
        return;
      }

      setUserId(data.userId);
      setStep('reset');
    } catch (err) {
      console.error(err);
      setErrorMsg('Server error. Try again.');
    }
     finally{
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!password.trim()) {
      setErrorMsg('Password cannot be empty');
      return;
    }

    try {
      const res = await fetch(`https://poster-react-deploy.onrender.com/api/auth/resetpassword/${userId}`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const result = await res.json();

      if (!res.ok) {
        setErrorMsg(result.message || 'Password reset failed');
        return;
      }

      localStorage.removeItem('email');
      toast.success("Password changes successfully!")
      navigate('/login');
    } catch (err) {
      console.error(err);
      toast.error("Unable to change password!")
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  const bg = mode ? 'bg-blue-100 text-gray-800' : 'bg-slate-900 text-white';
  const inputStyle = 'w-full p-2 border rounded md:h-[5vh] md:text-xl';
  const footerBg = mode ? 'bg-blue-200 text-gray-800' : 'bg-slate-800 text-gray-300';

  return (
    <div className={`${bg} min-h-screen pt-[10vh]`}>
      <Heading mode={mode} setMode={setMode} />
      <Navbar mode={mode} setMode={setMode} />

      <section className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded text-black">
        {step === 'otp' ? (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center md:text-3xl">Enter OTP</h2>
            <form onSubmit={handleOtpSubmit}>
              <label className="block text-sm mb-1 md:text-base">OTP sent to {email}</label>
              <input
                type="text"
                className={inputStyle}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                required
              />
              {errorMsg && <p className="text-red-500 mt-2 text-sm">{errorMsg}</p>}
              <button type="submit" className="mt-4 w-full flex justify-center bg-teal-600 hover:bg-teal-700 text-white py-2 rounded md:text-2xl">
               {
              loading ? (<div className='loader w-full h-full flex justify-center'></div>):(<>Verify OTP</>)
            }
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center md:text-3xl">Set New Password</h2>
            <form onSubmit={handlePasswordSubmit}>
              <label className="block text-sm mb-1 md:text-base">New Password</label>
              <input
                type="password"
                className={inputStyle}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New secure password"
                required
              />
              {errorMsg && <p className="text-red-500 mt-2 text-sm">{errorMsg}</p>}
              <button type="submit" className="mt-4 w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded md:text-2xl">
                Reset Password
              </button>
            </form>
          </>
        )}
      </section>

      <footer className={`${footerBg} text-center text-sm py-6 mt-20 md:mt-[40vh] `}>
        <div className="max-w-screen-xl mx-auto px-4">
          <img src={logo} alt="Logo" className="h-10 mx-auto mb-2 md:h-24" />
          <p className='md:text-xl'>&copy; 2025 TechBro24. Designed by <a href="https://www.techbro24.com/" className="underline">TechBro24</a></p>
        </div>
      </footer>
    </div>
  );
};

export default EnterOtp;
