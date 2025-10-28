import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/UseAuth";
import barangaylogo from "../../assets/brgy410.png";
import { Home, Bell, FileText, LogOut } from "lucide-react";

const ResidentSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();


  const handleLogout = () => {
    logout();
    navigate("/Login"); // redirect to login after logout
  };

  return (        
    <div className="mr-64 h-full fixed top-0 left-0 bg-white shadow-md w-64 transition-all duration-300 z-40 flex flex-col">
      <Link>
        <div className="flex items-center px-4 py-3 border-b">
          <img src={barangaylogo} alt="Logo" className="w-12 h-12" />
          <div className="ml-3">
            <h2 className="text-lg font-bold leading-tight">Barangay 410</h2>
            <p className="text-sm text-gray-500">Zone 42</p>
          </div>
        </div>
      </Link>

      <ul className="flex-1 p-4 space-y-2 text-lg font-medium">
        <li>
          <Link
            to="/resident/dashboard"
            className="flex items-center space-x-3 p-2 rounded-md hover:bg-pink-100"
          >
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link
            to="/resident/request-document"
            className="flex items-center space-x-3 p-2 rounded-md hover:bg-pink-100"
          >
            <FileText className="w-5 h-5" />
            <span>Request Document</span>
          </Link>
        </li>

        <li>
          <Link
            to="/resident/myrequests"
            className="flex items-center space-x-3 p-2 rounded-md hover:bg-pink-100"
          >
            <FileText className="w-5 h-5" />
            <span>My Requests</span>
          </Link>
        </li>

        <li>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-2 rounded-md hover:bg-red-100 text-red-600"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ResidentSidebar;