import InfoCard from "../../components/common/InfoCard";
import MyRecordsCard from "../../components/resident/MyRecordsCard";
import AnnouncementsCard from "../../components/resident/AnnouncementCard";
import CommunityProgramsCard from "../../components/resident/CommunityProgramsCard";
import BarangayServicesCard from "../../components/resident/BarangayServicesCard";
import CalendarCard from "../../components/resident/CalendarCard";
import MapCard from "../../components/resident/MapCard";
import { LogoCardWrapper } from "../../components/common/LogoCardWrapper";

const ResidentDashboard = () => {
  return (
    <div className="w-full px-5 py-2 min-h-screen bg-gradient-to-b from-pink-500 to-pink-300">

      <LogoCardWrapper className=" p-6 text-gray-800">
        {/* Top Header */}

        {/* Main Container */}
        <div className="flex-1 py-6 max-w-screen-xl w-full">
          {/* Top Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <InfoCard label="My Requests" value="3 Pendings" icon="file-text" />
          </div>

          {/* Middle Section: My Records | Announcements | Barangay Services */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {/* My Records */}
            <div className="col-span-1">
              <MyRecordsCard />
            </div>

            {/* Barangay Services */}
            <div className="col-span-1">
              <BarangayServicesCard />
            </div>
          </div>
        </div>
      </LogoCardWrapper>
    </div>
  );
};

export default ResidentDashboard;
