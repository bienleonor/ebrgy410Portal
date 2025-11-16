import React from 'react';
import barangaylogo from '../../assets/Barangaylogo.svg'
import { useAuth } from "../../hooks/UseAuth";
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Bell, FileText, Users, UserCheck, UserPlus, LogOut, UserRoundCog, House } from 'lucide-react'; // using lucide icons

const AdminSideBar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/Login");
  };

  const navItems = [
    { label: 'Dashboard', icon: <Home size={20} />, path: '/admin/dashboard' },
    { label: 'Notifications', icon: <Bell size={20} />, path: '/admin/notifications' },
    { label: 'View Requests', icon: <FileText size={20} />, path: '/admin/requests' },
    { label: 'Barangay Officals Term Management', icon: <UserRoundCog size={35} />, path: '/admin/manage-official' },
    { label: 'Residents', icon: <Users size={20} />, path: '/admin/residents' },
    { label: 'Create Account', icon: <UserPlus size={20} />, path: '/admin/create-account' },
    { label: 'Household', icon: <House size={20} />, path: '/admin/households' },
  ];

  return (
    <div
      id="sidebar"
      className="h-full fixed top-0 left-0 bg-white shadow-md w-64 transition-all duration-300 z-40 flex flex-col"
    >
      {/* Logo/Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <NavLink to="/admin/dashboard">
          <div className="flex items-center">
            <img src={barangaylogo} alt="Logo" className="w-12 h-12" />
            <p className="ml-4 text-xl font-semibold leading-tight">
              Barangay 410 <br /> Zone 42
            </p>
          </div>
        </NavLink>
      </div>

      {/* Navigation Links */}
      <ul className="flex-1 p-4 space-y-2 text-base font-medium">
        {navItems.map((item) => (
          <li key={item.label}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 p-2 rounded-lg transition ${
                  isActive
                    ? 'bg-pink-500 text-white font-semibold'
                    : 'hover:bg-pink-100 text-gray-700'
                }`
              }
            >
              {item.icon}
              <span className="sidebar-label">{item.label}</span>
            </NavLink>
          </li>
        ))}

        {/* Logout Button */}
        <li>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 p-2 rounded-lg w-full hover:bg-red-100 text-red-600"
          >
            <LogOut size={20} />
            <span className="sidebar-label">Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AdminSideBar;
