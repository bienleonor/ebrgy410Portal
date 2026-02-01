import { useEffect, useState } from "react";
import InfoCard from "../../components/common/cards/InfoCard";
import MyRecordsCard from "../../components/resident/MyRecordsCard";
import BarangayLatestActionCard from "../../components/resident/BarangayServicesCard";
import { LogoCardWrapper } from "../../components/common/cards/LogoCardWrapper";
import { useOutletContext } from "react-router-dom";
import axiosInstance from "../../utils/AxiosInstance";
import toast from "react-hot-toast";

const ResidentDashboard = () => {
  const { profile, address } = useOutletContext();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axiosInstance.get("/certificates/my-requests");
        setRequests(res.data);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
        toast.error("Failed to load your requests.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // Compute counts
  const counts = {
    total: requests.length,
    approved: requests.filter(r => r.status?.toUpperCase() === "RELEASED").length,
    pending: requests.filter(r => r.status?.toUpperCase() === "PENDING").length,
    rejected: requests.filter(r => r.status?.toUpperCase() === "REJECTED").length,
  };

  if (!profile) {
    return <div className="text-center py-10">Loading profile...</div>;
  }

  return (
    <div className="w-full px-5 pt-3">
      <LogoCardWrapper className="p-6 text-gray-800">
        <div className="text-center text-7xl font-semibold">
          <h1>WELCOME BACK, {profile.first_name?.toUpperCase()}!</h1>
        </div>

        <div className="flex-1 py-6 max-w-screen-xl w-full">
          {loading ? (
            <div className="text-center text-gray-600 py-6">Loading your data...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <InfoCard label="My Requests" value={`${counts.total} Total`} icon="file-text" />
              <InfoCard label="Approved Documents" value={`${counts.approved} Approved`} icon="check" />
              <InfoCard label="Pending Requests" value={`${counts.pending} Pending`} icon="clock" />
              <InfoCard label="Rejected Requests" value={`${counts.rejected} Rejected`} icon="x" />
            </div>
          )}

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
