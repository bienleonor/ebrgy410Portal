import InfoCard from "../../components/common/cards/InfoCard";
import MyRecordsCard from "../../components/resident/MyRecordsCard";
import BarangayLatestActionCard from "../../components/resident/BarangayServicesCard";
import { LogoCardWrapper } from "../../components/common/cards/LogoCardWrapper";
import { useOutletContext } from "react-router-dom";

const ResidentDashboard = () => {
  const { profile, address } = useOutletContext();

  return (
    <div className="w-full px-5 pt-3">
      <LogoCardWrapper className="p-6 text-gray-800">
        <div className="text-center text-7xl font-semibold">
          <h1>WELCOME BACK, {profile.first_name?.toUpperCase()}!</h1>
        </div>

        <div className="flex-1 py-6 max-w-screen-xl w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <InfoCard label="My Requests" value="3 Pendings" icon="file-text" />
            <InfoCard label="Approved Documents" value="2 Approved" icon="check" />
            <InfoCard label="Pending Request" value="2 Pending" icon="clock" />
            <InfoCard label="Notifications" value="2 Notifications" icon="bell" />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex-1"><MyRecordsCard user={profile} address={address} /></div>
            <div className="flex-1"><BarangayLatestActionCard /></div>
          </div>
        </div>
      </LogoCardWrapper>
    </div>
  );
};

export default ResidentDashboard;
