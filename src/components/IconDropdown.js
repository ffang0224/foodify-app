import React from 'react';
import { useNavigate } from 'react-router-dom';

const IconDropdown = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
//   const handleProfileClick = () => {
//     navigate('/profile');
//     onClose();
//   };
  
  if (!isOpen) return null;

  return (
    <div className="absolute right-4 top-16 bg-white shadow-lg rounded-md py-2 w-48 z-50">
      <div className="border-b pb-2 mb-2 px-4">
        <img src="https://static.vecteezy.com/system/resources/thumbnails/019/896/012/small_2x/female-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png" 
            alt="User" 
            className="w-8 h-8 rounded-full inline-block mr-2" />
        <span className="text-sm">Alice Smith</span>
      </div>
      <div className="flex flex-col">
        <button 
          onClick={() => {
            navigate('/profile');
            onClose();
          }}
          className="text-left px-4 py-2 hover:bg-gray-100"
        > Profile </button>
        <button className="text-left px-4 py-2 hover:bg-gray-100">Account Settings</button>
        <button className="text-left px-4 py-2 hover:bg-gray-100">Help</button>
        <button 
          onClick={() => {
            navigate('/login');
            onClose();
          }}
          className="text-left px-4 py-2 hover:bg-gray-100"
        > Log Out </button>
      </div>
    </div>
  );
};

export default IconDropdown;