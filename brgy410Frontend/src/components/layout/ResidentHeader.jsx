import React from "react";
import { Bell, User } from "lucide-react";

const ResidentHeader = () => {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
      <h1 className="text-xl font-semibold">Resident Dashboard</h1>

      <div className="flex items-center space-x-4">
        <span className="font-medium">Bien Andrey Bacsain</span>
        <span className="text-sm text-gray-500">Resident</span>
        <Bell className="w-6 h-6 cursor-pointer hover:text-pink-600" />
        <User className="w-6 h-6 cursor-pointer hover:text-pink-600" />
      </div>
    </header>
  );
};

export default ResidentHeader;