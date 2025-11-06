import React from "react";
import { useAuth } from "../../hooks/UseAuth";
import { Phone, MapPin } from "lucide-react";

const MyRecordsCard = ({ user = null, address = null }) => {
  const auth = useAuth?.();
  const u = user ?? auth?.user;
  const fullAddress = address
    ? `${address.house_number} ${address.street}${address.subdivision ? ", " + address.subdivision : ""}, ${address.barangay_name}${address.zone_number ? " " + address.zone_number : ""}, ${address.city_name}, ${address.province_name}`
    : "No address";

  function capitalizeWords(str) {
    if (!str) return ""; // handle null/undefined
    return str
      .split(" ") // split the string into words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // capitalize first letter
      .join(" "); // join words back
  }

  // ✅ Proper registered voter logic
  const voters = u.is_voter === 1 || u.is_voter === true
    ? "Registered Voter"
    : "Not Registered Voter";


  return (
    <div className="bg-white border border-gray-800/30 rounded-2xl shadow p-5">
      {/* Personal Info */}
      <div className="rounded-lg p-4">
        <div className="flex items-center gap-5">
          <div>
            <img src="..." alt="..." />
          </div>
          <div className="">
            <p className="text-sm text-gray-700">{u.username || `${u.first_name} ${u.last_name}`}</p>
            <p className="text-sm text-gray-700 mt-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> {capitalizeWords(`${fullAddress}`)}
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-700 mt-2 flex items-center gap-2">
          <Phone className="w-4 h-4" /> {u.contact_number || "No contact info"}
        </p>
        <p className="text-sm text-gray-700 mt-2 flex items-center gap-2">
          <Phone className="w-4 h-4" /> {voters}
        </p>
        
      </div>

      {/* Request Status (optional if data available) */}
      {u.requests?.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-2">My Requests</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {u.requests.map((req, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{req.name}</span>
                <span
                  className={`${
                    req.status === "Completed"
                      ? "text-green-600"
                      : req.status === "Pending"
                      ? "text-yellow-600"
                      : "text-blue-600"
                  }`}
                >
                  {req.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MyRecordsCard;
