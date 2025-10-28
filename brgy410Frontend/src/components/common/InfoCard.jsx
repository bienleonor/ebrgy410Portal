import React from "react";
import { Users, Home, FileText, Megaphone, Check, Clock, Bell } from "lucide-react";

const iconMap = {
  users: <Users className="w-6 h-6" />,
  home: <Home className="w-6 h-6" />,
  "file-text": <FileText className="w-6 h-6" />,
  megaphone: <Megaphone className="w-6 h-6" />,
  check: <Check className="w-6 h-6" />,
  clock: <Clock  className="w-6 h-6" />,
  bell: <Bell  className="w-6 h-6" />,

};

const InfoCard = ({ label = "", value = "", icon = null }) => {
  let iconNode = null;
  if (React.isValidElement(icon)) iconNode = icon;
  else if (typeof icon === "string" && iconMap[icon]) iconNode = iconMap[icon];
  else iconNode = <Users className="w-6 h-6" />;

  return (
    <div className="bg-white/70 backdrop-blur-lg border-2 border-gray-800/30 rounded-2xl shadow-lg p-4 flex items-center gap-4">
      <div className="bg-pink-600/10 text-pink-800 border-2 border-gray-800/30 rounded-lg p-3 shadow-inner backdrop-blur-sm">
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
