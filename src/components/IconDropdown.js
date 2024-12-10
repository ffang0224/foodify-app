import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useAuthUser } from "../hooks/useAuthUser";

const IconDropdown = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { userData } = useAuthUser();

  if (!isOpen || !userData) return null;

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
      onClose();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="absolute right-4 top-16 bg-white shadow-lg rounded-md py-2 w-48 z-50">
      <div className="border-b pb-2 mb-2 px-4">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-semibold">
            {userData.firstName[0]}
            {userData.lastName[0]}
          </div>
          <span className="text-sm ml-2">
            {userData.firstName} {userData.lastName}
          </span>
        </div>
        <span className="text-xs text-gray-500 mt-1 block">
          {userData.email}
        </span>
      </div>
      <div className="flex flex-col">
        <button
          onClick={() => {
            navigate("/profile");
            onClose();
          }}
          className="text-left px-4 py-2 hover:bg-gray-100"
        >
          Profile
        </button>
        <button
          onClick={() => {
            navigate("/settings");
            onClose();
          }}
          className="text-left px-4 py-2 hover:bg-gray-100"
        >
          Account Settings
        </button>
        <button className="text-left px-4 py-2 hover:bg-gray-100">Help</button>
        <button
          onClick={handleLogout}
          className="text-left px-4 py-2 text-red-600 hover:bg-red-50"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default IconDropdown;
