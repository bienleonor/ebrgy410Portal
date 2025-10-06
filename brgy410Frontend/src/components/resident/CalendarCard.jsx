import React from "react";
import { Calendar } from "lucide-react";

const CalendarCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center justify-center">
      <Calendar className="w-8 h-8 text-gray-600 mb-3" />
      <div className="text-sm font-medium text-gray-700">Calendar</div>
      <div className="text-xs text-gray-400 mt-2">(Integrate your calendar or events here)</div>
    </div>
  );
};

export default CalendarCard;
