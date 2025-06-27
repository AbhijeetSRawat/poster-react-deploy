import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Heading from '../components/core/heading';
import Navbar from '../components/core/Navbar';
import logo from '../assets/img/logo_techbro-removebg-preview.png';

const ForgetPassword = ({ mode, setMode }) => {
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading,setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      setLoading(true);
      const response = await fetch('https://poster-react-deploy.onrender.com/api/auth/forgetpassword', {
        method: "POST",
        headers: {
          Accept: 'application/json',
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email.trim() })
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMsg(result.message || 'Email not found');
        return;
      }

      localStorage.setItem('email', email.trim());
      navigate('/enter-otp');
    } catch (err) {
      console.error(err);
      setErrorMsg('Server error. Please try again.');
    }
    finally{
      setLoading(false);
    }
  };

  const bg = mode ? 'bg-blue-100 text-gray-800' : 'bg-slate-900 text-white';
  const inputStyle = 'w-full p-2 rounded border';
  const footerBg = mode ? 'bg-blue-200 text-gray-800' : 'bg-slate-800 text-gray-300';

  return (
    <div className={`${bg} min-h-screen pt-[10vh]`}>
      <Heading mode={mode} setMode={setMode} />
      <Navbar mode={mode} setMode={setMode} />

      <section className="max-w-lg mx-auto mt-10 p-6 shadow rounded bg-white text-black">
        <h2 className="text-xl font-semibold mb-4 text-center">Forgot Your Password?</h2>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm mb-1">Enter your registered email:</label>
          <input
            type="email"
            className={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          {errorMsg && <p className="text-red-500 mt-2 text-sm">{errorMsg}</p>}
          <button type="submit" className="mt-4 w-full flex justify-center bg-teal-600 hover:bg-teal-700 text-white py-2 rounded">
            {
              loading ? (<div className='loader w-full h-full flex justify-center'></div>):(<>Send OTP</>)
            }
          </button>
        </form>
      </section>

      <footer className={`${footerBg} text-center text-sm py-6 mt-20`}>
        <div className="max-w-screen-xl mx-auto px-4">
          <img src={logo} alt="Logo" className="h-10 mx-auto mb-2" />
          <p>&copy; 2025 TechBro24. Designed by <a href="https://www.techbro24.com/" className="underline">TechBro24</a></p>
        </div>
      </footer>
    </div>
  );
};

export default ForgetPassword;
