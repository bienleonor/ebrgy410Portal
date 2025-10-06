import React from "react";
import { CheckCircle, Target } from "lucide-react";

const defaultPrograms = [
  { title: "Livelihood Training Schedule" },
  { title: "Youth Program" },
  { title: "Senior Citizen Benefits" },
];

const ProgramRow = ({ p }) => (
  <div className="flex items-center gap-3">
    <div className="bg-pink-50 text-pink-600 rounded-full p-2">
      <CheckCircle className="w-4 h-4" />
    </div>
    <div className="text-sm text-gray-700">{p.title}</div>
  </div>
);

const CommunityProgramsCard = ({ programs = defaultPrograms }) => {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h3 className="text-lg font-semibold mb-3">Community Programs</h3>
      <div className="space-y-3">
        {programs.map((p, i) => (
          <ProgramRow p={p} key={i} />
        ))}
      </div>
    </div>
  );
};

export default CommunityProgramsCard;
