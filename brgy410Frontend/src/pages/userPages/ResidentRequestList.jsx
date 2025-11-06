import { useState, useEffect, useMemo } from "react";
import { LogoCardWrapper } from "../../components/common/cards/LogoCardWrapper";
import axiosInstance from "../../utils/AxiosInstance";
import toast from "react-hot-toast";

export default function RequestStatusUnified() {
  const [active, setActive] = useState("total");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: "total", label: "Total Requests", color: "#f9fafb" },
    { id: "rejected", label: "Rejected Requests", color: "#fee2e2" },
    { id: "approved", label: "Approved Documents", color: "#dcfce7" },
    { id: "pending", label: "Pending Requests", color: "#fef9c3" },
  ];

  // Fetch user’s requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axiosInstance.get("/certificates/my-requests");
        setRequests(res.data);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
        toast.error("Failed to load requests.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // Filtered and count logic
  const filteredData = useMemo(() => {
    if (active === "total") return requests;
    return requests.filter((r) => r.status.toLowerCase() === active);
  }, [active, requests]);

  const counts = useMemo(() => ({
    total: requests.length,
    rejected: requests.filter(r => r.status === "Rejected").length,
    approved: requests.filter(r => r.status === "Approved").length,
    pending: requests.filter(r => r.status === "Pending").length,
  }), [requests]);

  const activeTab = tabs.find((t) => t.id === active);

  return (
    <div className="w-full px-5 pt-3">
      <LogoCardWrapper>
        <h2 className="text-2xl font-black mb-6 text-gray-800">REQUEST STATUS</h2>

        {/* Tabs */}
        <div className="flex justify-between w-full rounded-t-2xl overflow-hidden relative z-10">
          {tabs.map((tab) => {
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className="relative py-4 px-11 text-sm font-semibold text-center transition-all duration-300 overflow-hidden rounded-t-full"
              >
                <span
                  className="absolute inset-0 origin-bottom transform transition-transform duration-[520ms] ease-out rounded-t-2xl pointer-events-none"
                  style={{
                    background: tab.color,
                    transform: isActive ? "scaleY(1)" : "scaleY(0)",
                  }}
                />
                <span
                  className={`relative z-10 flex flex-col items-center transition-colors duration-300 ${
                    isActive ? "text-black" : "text-gray-600"
                  }`}
                >
                  <span className="flex items-center justify-center gap-1">
                    <span className="text-xl mb-1">
                      {tab.id === "rejected"
                        ? "✖"
                        : tab.id === "total"
                        ? "🗂️"
                        : tab.id === "approved"
                        ? "⭕"
                        : "➕"}
                    </span>
                    <span className="font-bold mt-1 text-2xl">{counts[tab.id]}</span>
                  </span>
                  <span className="text-base mt-1">{tab.label}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div
          className="w-full py-4 px-8 rounded-2xl transition-all duration-500 -mt-2 drop-shadow-md shadow-sm"
          style={{
            backgroundColor: activeTab.color,
            transition: "background-color 520ms ease-out",
          }}
        >
          <h3 className="text-xl font-black mb-4 text-gray-900">REQUEST HISTORY</h3>

          {loading ? (
            <p className="text-gray-600 text-center py-6">Loading requests...</p>
          ) : filteredData.length === 0 ? (
            <p className="text-gray-500 text-center py-6">No requests found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-t border-black/20">
                <thead>
                  <tr className="border-b border-black/20">
                    <th className="py-2 font-bold text-gray-900">Document Type</th>
                    <th className="py-2 font-bold text-gray-900">Purpose</th>
                    <th className="py-2 font-bold text-gray-900">Date</th>
                    <th className="py-2 font-bold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, index) => (
                    <tr key={index} className="border-b border-black/10 text-gray-900">
                      <td className="py-3">{row.certificate_name}</td>
                      <td className="py-3">{row.purpose}</td>
                      <td className="py-3">
                        {new Date(row.submitted_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-3 font-semibold">{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </LogoCardWrapper>
    </div>
  );
}
