import InfoCard from "../../components/common/InfoCard";
import MyRecordsCard from "../../components/resident/MyRecordsCard";
import AnnouncementsCard from "../../components/resident/AnnouncementCard";
import CommunityProgramsCard from "../../components/resident/CommunityProgramsCard";
import BarangayServicesCard from "../../components/resident/BarangayServicesCard";
import CalendarCard from "../../components/resident/CalendarCard";
import MapCard from "../../components/resident/MapCard";

const ResidentDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 to-pink-500 p-6 text-gray-800">
      {/* Top Header */}

      {/* Main Container */}
      <div className="flex-1 py-6 max-w-screen-xl w-full">
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <InfoCard label="Total Residents" value="1,632" icon="users" />
          <InfoCard label="Household Count" value="235" icon="home" />
          <InfoCard label="My Requests" value="3 Pendings" icon="file-text" />
          <InfoCard label="Ayuda ni Mayor" value="Announcement" icon="megaphone" />
        </div>

        {/* Middle Section: My Records | Announcements | Barangay Services */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* My Records */}
          <div className="col-span-1">
            <MyRecordsCard />
          </div>

          {/* Announcements */}
          <div className="col-span-1">
            <AnnouncementsCard />
          </div>

          {/* Barangay Services */}
          <div className="col-span-1">
            <BarangayServicesCard />
          </div>
        </div>

        {/* Bottom Section: Community Programs | Calendar + Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Community Programs - spans 2 cols */}
          <div className="col-span-1 lg:col-span-2">
            <CommunityProgramsCard />
          </div>

          {/* Calendar + Map stacked on the right */}
          <div className="col-span-1 space-y-4">
            <CalendarCard />
            <MapCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentDashboard;
