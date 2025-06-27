import React from 'react';
import { FaHome, FaImage, FaShip, FaRedoAlt, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { FaCircleInfo } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
const Navbar = () => {
;

  const navigate = useNavigate();
  const token = localStorage.getItem('token')
  return (
    <div className="fixed bottom-0 w-full md:h-[8vh] bg-slate-900 text-white flex justify-between md:justify-around px-4 py-2 shadow-[0_-2px_8px_rgba(0,0,0,0.3)] z-50">
      <NavItem onClick={()=>navigate('/')} icon={<FaHome size={20} />} label="Home" />
       <NavItem icon={<FaUserCircle size={20} />} label={ token ? 'Profile' : 'LogIn'} onClick={token ? ()=>navigate('/profile') : ()=>navigate('/login')} />
      <NavItem onClick={()=>navigate('/custom')} icon={<FaImage size={20} />} label="Custom" />
     
      <NavItem icon={<FaCircleInfo size={20} />} label="About Us" onClick={()=>navigate('/about')} />
      <NavItem icon={<FaBars size={20} />} label="More" />
    </div>
  );
};

const NavItem = ({ icon, label, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center justify-center text-xs md:text-base hover:text-blue-400 transition cursor-pointer"
    >
      {icon}
      <span className="mt-1">{label}</span>
    </div>
  );
};


export default Navbar;
