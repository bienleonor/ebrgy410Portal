import React from "react";
import { Bell, User } from "lucide-react";
import { Link } from "react-router-dom";

const ResidentHeader = () => {
  return (
    <header className="flex justify-between items-center px-6 py-5 bg-white shadow-sm border-b">
      <h1 className="text-xl font-semibold">Resident Dashboard</h1>

      <div className="flex items-center space-x-4">
        <span className="font-medium">NAME</span>
        <span className="text-sm text-gray-500">Resident</span>
        <Bell className="w-6 h-6 cursor-pointer hover:text-pink-600" />
        <Link to="/resident/profile">
          <User className="w-6 h-6 cursor-pointer hover:text-pink-600" />
        </Link>
      </div>
    </header>
  );
};

export default ResidentHeader;