import React from "react";
import { Users, Home, FileText, Megaphone } from "lucide-react";

const iconMap = {
  users: <Users className="w-6 h-6" />,
  home: <Home className="w-6 h-6" />,
  "file-text": <FileText className="w-6 h-6" />,
  megaphone: <Megaphone className="w-6 h-6" />,
};

const InfoCard = ({ label = "", value = "", icon = null }) => {
  let iconNode = null;
  if (React.isValidElement(icon)) iconNode = icon;
  else if (typeof icon === "string" && iconMap[icon]) iconNode = iconMap[icon];
  else iconNode = <Users className="w-6 h-6" />;

  return (
    <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-4">
      <div className="bg-pink-50 text-pink-600 rounded-lg p-3 shadow-inner">
        {iconNode}
      </div>
      <div className="flex-1">
        <div className="text-xl font-bold text-gray-800">{value}</div>
        <div className="text-sm text-gray-500 mt-1">{label}</div>
      </div>
    </div>
  );
};

export default InfoCard;
