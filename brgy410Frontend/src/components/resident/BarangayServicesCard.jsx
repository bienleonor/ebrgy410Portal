import React from "react";
import { Link } from "react-router-dom";

const services = [
  { label: "Request Barangay Clearance", path: "/resident/request?type=clearance" },
  { label: "Request Barangay ID", path: "/resident/request?type=id" },
  { label: "Request Business Permit", path: "/resident/request?type=business-permit" },
  { label: "Request Certificate of Residency", path: "/resident/request?type=residency" },
];

const BarangayServicesCard = ({ items = services }) => {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Barangay Services</h3>

      <div className="space-y-3">
        {items.map((s, idx) => (
          <Link
            to={s.path}
            key={idx}
            className="block border rounded-full px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 transition text-center"
          >
            {s.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BarangayServicesCard;
