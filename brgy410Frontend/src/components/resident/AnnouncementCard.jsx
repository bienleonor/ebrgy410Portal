import React from "react";
import { Calendar, MapPin } from "lucide-react";

const sampleAnnouncements = [
  { date: "Oct 10", title: "Barangay Assembly", meta: "@Covered Court" },
  { date: "Oct 15", title: "Free Medical Check-up", meta: "" },
  { date: "Ongoing", title: "Clean-up Drive", meta: "Volunteers Needed" },
];

const AnnouncementItem = ({ a }) => (
  <div className="flex items-start gap-3">
    <div className="bg-pink-50 text-pink-600 p-2 rounded-md shadow-sm">
      <Calendar className="w-4 h-4" />
    </div>
    <div>
      <div className="text-sm font-medium text-gray-800">{a.title}</div>
      <div className="text-xs text-gray-500">{a.date} {a.meta && <>• {a.meta}</>}</div>
    </div>
  </div>
);

const AnnouncementsCard = ({ announcements = sampleAnnouncements }) => {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h3 className="text-lg font-semibold mb-3">Announcements / Events</h3>
      <div className="space-y-3">
        {announcements.map((a, i) => (
          <AnnouncementItem a={a} key={i} />
        ))}
      </div>
    </div>
  );
};

export default AnnouncementsCard;
