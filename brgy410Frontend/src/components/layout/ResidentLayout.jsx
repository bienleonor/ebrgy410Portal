import { Outlet } from "react-router-dom";
import ResidentSidebar from "./ResidentSidebar";
import ResidentHeader from "../../components/layout/ResidentHeader";

const ResidentLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header - fixed on top */}
      <ResidentHeader />

      <div className="flex flex-1">
        {/* Sidebar - fixed left */}
        <ResidentSidebar />

        {/* Main Content Area */}
        <main className="flex-1 ml-64 w-full">
          <Outlet /> {/* Where ResidentDashboard & other pages render */}
        </main>
      </div>
    </div>
  );
};

export default ResidentLayout;
