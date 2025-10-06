import React from "react";
import { MapPin } from "lucide-react";

const MapCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-pink-50 text-pink-600 p-2 rounded-md">
          <MapPin className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-semibold">Barangay Map</h3>
      </div>

      <div className="w-full h-36 bg-gray-50 rounded-md border border-dashed border-gray-200 flex items-center justify-center text-sm text-gray-400">
        Map placeholder — embed your map (Leaflet / Google Maps) here.
      </div>
    </div>
  );
};

export default MapCard;
