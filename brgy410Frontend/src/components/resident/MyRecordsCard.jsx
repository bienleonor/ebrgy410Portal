import React from "react";
import { useAuth } from "../../hooks/UseAuth";
import { Phone, MapPin } from "lucide-react";

const mockUser = {
  name: "Bien Andrey Bacsain",
  address: "1234 Barangay St.",
  contact: "091223428274",
  requests: [
    { name: "Barangay Clearance", status: "Pending" },
    { name: "Certificate of Residency", status: "In progress" },
    { name: "Business Permit", status: "Completed" },
  ],
};

const StatusPill = ({ status }) => {
  const color =
    status.toLowerCase() === "pending"
      ? "bg-yellow-100 text-yellow-800"
      : status.toLowerCase() === "completed"
      ? "bg-green-100 text-green-800"
      : "bg-blue-100 text-blue-800";

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
      {status}
    </span>
  );
};

const MyRecordsCard = ({ user = null }) => {
  const auth = useAuth?.();
  const u = user ?? auth?.user ?? mockUser;

  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <h3 className="text-lg font-semibold mb-3">My Records</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Personal Info */}
        <div className="border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Personal Information</h4>
          <p className="text-sm text-gray-700">{u.name}</p>
          <p className="text-sm text-gray-700 mt-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> {u.address}
          </p>
          <p className="text-sm text-gray-700 mt-2 flex items-center gap-2">
            <Phone className="w-4 h-4" /> {u.contact}
          </p>
        </div>

        {/* Document Requests */}
        <div className="border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Document Request</h4>
          <ul className="space-y-2">
            {u.requests?.map((r, idx) => (
              <li key={idx} className="flex items-center justify-between">
                <div className="text-sm text-gray-700">{r.name}</div>
                <StatusPill status={r.status} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MyRecordsCard;
