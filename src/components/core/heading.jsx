import React, { useEffect, useState } from 'react';
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaUserCircle } from "react-icons/fa";

const Heading = ({ mode, setMode }) => {
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState(null);
  const [subscribed, setSubscribed] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [token, setToken] = useState(null);
  const [role,setRole] = useState(null);

  useEffect(() => {
    const email = JSON.parse(localStorage.getItem('user'));
    const isSubscribed = JSON.parse(localStorage.getItem('subscribed'));
    const fname = JSON.parse(localStorage.getItem('fisrtName'));
    const ttoken = JSON.parse(localStorage.getItem('token'));
    const rrole = JSON.parse(localStorage.getItem('role'));

    if (email) setUserEmail(email);
    if (isSubscribed !== null) setSubscribed(isSubscribed);
    if (fname) setFirstName(fname);
    if (ttoken) setToken(ttoken);
    if (rrole) setRole(rrole);

  }, []);

  const changeTheme = () => setMode(!mode);

  const logOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('subscribed');
    localStorage.removeItem('fisrtName');
    localStorage.removeItem('token');
    localStorage.removeItem('business');
    localStorage.removeItem('role');
    setUserEmail(null);
    setSubscribed(null);
    setFirstName(null);
    setToken(null);
    toast.success("You have successfully Logged Out");
    navigate('/signup');
  };

  const clickProfileHandler = (e)=>{

    e.preventDefault();
    if(role === 'admin'){
       navigate('/admindashboard')
    }
    else{
       navigate('/profile')
    }
  }

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-inherit shadow">
      <div className="w-full h-[10vh] px-4 sm:px-6 flex justify-between items-center">
        <div>
          <div className="flex gap-2 text-xs items-center font-bold">
            Your Business
            <div className="bg-yellow-500 min-w-[17vw] min-h-[3vh] flex justify-center text-white items-center rounded cursor-pointer">
              {!userEmail ? (
                <div onClick={() => navigate('/signup')}>SignUp</div>
              ) : subscribed === true || subscribed === 'true' ? (
                <div>Welcome</div>
              ) : (
                <div onClick={() => navigate('/subscribe')}>Subscribe</div>
              )}
            </div>
          </div>
          <div className="font-bold">
            {localStorage.getItem('business') || "Business"}
          </div>
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

          {token && (
            <FaUserCircle
              onClick={(e)=>clickProfileHandler(e)}
              size={40}
              className="rounded-full bg-white p-2 text-blue-600 shadow-md hover:bg-blue-100 cursor-pointer transition-all duration-300"
            />
          )}

          {userEmail && (
            <div onClick={logOut}>
              <IoIosLogOut
                size={40}
                className="rounded-full bg-white p-2 text-blue-600 shadow-md hover:bg-blue-100 cursor-pointer transition-all duration-300"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Heading;
