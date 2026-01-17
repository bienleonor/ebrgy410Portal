import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import barangaylogo from "../../assets/brgy410.png";
import { Home, FileText, LogOut } from "lucide-react";
import { useProfileValidation } from "../../hooks/useProfileValidation";

const ResidentSidebar = ({ profile }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { enforceProfileCompletion } = useProfileValidation();

  const handleProtectedNavigation = (path) => {
    // ✅ Only allow navigation if profile is complete
    if (enforceProfileCompletion(profile)) {
      navigate(path);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="mr-64 h-full fixed top-0 left-0 bg-white shadow-md w-64 transition-all duration-300 z-40 flex flex-col">
      <div className="flex items-center px-4 py-3 border-b">
        <img src={barangaylogo} alt="Logo" className="w-12 h-12" />
        <div className="ml-3">
          <h2 className="text-lg font-bold leading-tight">Barangay 410</h2>
          <p className="text-sm text-gray-500">Zone 42</p>
        </div>
      </div>

      <ul className="flex-1 p-4 space-y-2 text-lg font-medium">
        <li>
          <button
            onClick={() => handleProtectedNavigation("/resident/dashboard")}
            className="flex items-center space-x-3 p-2 w-full text-left rounded-md hover:bg-pink-100"
          >
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
        </li>

        <li>
          <button
            onClick={() => handleProtectedNavigation("/resident/request-document")}
            className="flex items-center space-x-3 p-2 w-full text-left rounded-md hover:bg-pink-100"
          >
            <FileText className="w-5 h-5" />
            <span>Request Document</span>
          </button>
        </li>

        <li>
          <button
            onClick={() => handleProtectedNavigation("/resident/requestBrgyID")}
            className="flex items-center space-x-3 p-2 w-full text-left rounded-md hover:bg-pink-100"
          >
            <FileText className="w-5 h-5" />
            <span>Request Barangay ID</span>
          </button>
        </li>

        <li>
          <button
            onClick={() => handleProtectedNavigation("/resident/myrequests")}
            className="flex items-center space-x-3 p-2 w-full text-left rounded-md hover:bg-pink-100"
          >
            <FileText className="w-5 h-5" />
            <span>My Requests</span>
          </button>
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
