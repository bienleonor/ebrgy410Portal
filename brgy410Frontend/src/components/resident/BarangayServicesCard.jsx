import React from "react";
import { Link } from "react-router-dom";
import { Clock } from 'lucide-react';

const services = [
  { label: "Request Barangay Clearance - Pending", path: "/resident/dashboard" },
  { label: "Barangay ID - Approved", path: "/resident/dashboard" },
  { label: "Request Business Permit - Pending", path: "/resident/dashboard" },
  { label: "Request Certificate of Residency - Denied", path: "/resident/dashboard" },
];

const BarangayLatestActionCard = ({ items = services }) => {
  return (
    <div className="bg-white border border-gray-800/30 rounded-2xl shadow p-4">
      <div className="flex gap-3 align-middle">

        <Clock />
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      </div>

      <div className="space-y-3">
        {items.map((s, idx) => (
          <Link
            to={s.path}
            key={idx}
            className="block border border-gray-800/30 rounded-full px-4 py-2 text-sm text-gray-700 bg-DocReq-Pink hover:bg-pink-50 transition text-center"
          >
            {s.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BarangayLatestActionCard;
