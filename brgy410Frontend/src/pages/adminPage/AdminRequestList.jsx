import { useEffect, useState } from "react";
import { LogoCardWrapper } from "../../components/common/cards/LogoCardWrapper";
import AxiosInstance from "../../utils/AxiosInstance";
import toast from "react-hot-toast";

export default function AdminRequestList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDenyModal, setShowDenyModal] = useState(false);
  const [denyReason, setDenyReason] = useState("");

  // 🧠 Fetch all certificate requests
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data } = await AxiosInstance.get("/certificates/requests");
      setRequests(data);
    } catch (err) {
      console.error("Error fetching requests:", err);
      toast.error("Failed to load requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // 🔹 Approve Request
  const handleApprove = async (id) => {
    try {
      await AxiosInstance.put(`/certificates/${id}/status`, {
        status: "Approved",
        remarks: "Approved by Admin",
      });
      toast.success("Request approved successfully!");
      setShowViewModal(false);
      setSelectedRequest(null);
      fetchRequests();
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve request.");
    }
  };

  // 🔹 Deny Flow
  const handleDenyClick = () => {
    setShowViewModal(false);
    setShowDenyModal(true);
  };

  const confirmDeny = async () => {
    if (!denyReason.trim()) {
      toast.error("Please provide a denial reason.");
      return;
    }

    try {
      await AxiosInstance.put(
        `/certificates/${selectedRequest.cert_req_id}/status`,
        {
          status: "Rejected",
          denied_reason: denyReason,
        }
      );
      toast.success("Request denied successfully!");
      setShowDenyModal(false);
      setDenyReason("");
      setSelectedRequest(null);
      fetchRequests();
    } catch (err) {
      console.error(err);
      toast.error("Failed to deny request.");
    }
  };

  // 🔹 Download generated PDF (secured path)
  const handleDownload = async (req) => {
    try {
      const token = localStorage.getItem("token");
      const fileUrl = `http://localhost:5000/api/certificate-attachments/download/${req.cert_req_id}?token=${token}`;
      window.open(fileUrl, "_blank");
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Failed to download document.");
    }
  };

  // 🔹 Print PDF
  const handlePrint = async (req) => {
    try {
      const token = localStorage.getItem("token");
      const fileUrl = `http://localhost:5000/api/certificate-attachments/download/${req.cert_req_id}?token=${token}`;
      const printWindow = window.open(fileUrl, "_blank");

      if (!printWindow) {
        toast.error("Popup blocked — please allow popups for this site.");
        return;
      }

      const checkLoaded = setInterval(() => {
        try {
          if (printWindow.document.readyState === "complete") {
            clearInterval(checkLoaded);
            printWindow.focus();
            printWindow.print();
          }
        } catch {
          // ignore until ready
        }
      }, 500);
    } catch (err) {
      console.error("Print error:", err);
      toast.error("Failed to open document for printing.");
    }
  };

  return (
    <div className="w-full px-5 pt-3">
      <LogoCardWrapper>
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          All Certificate Requests
        </h2>

        {loading ? (
          <div className="text-center py-10 text-gray-600">
            Loading requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-10 text-gray-600">
            No certificate requests found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-t border-black/20">
              <thead>
                <tr className="border-b border-black/20">
                  <th className="py-2 font-bold text-gray-900">Resident</th>
                  <th className="py-2 font-bold text-gray-900">Document</th>
                  <th className="py-2 font-bold text-gray-900">Purpose</th>
                  <th className="py-2 font-bold text-gray-900">Status</th>
                  <th className="py-2 font-bold text-gray-900">Date Submitted</th>
                  <th className="py-2 font-bold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr
                    key={req.cert_req_id}
                    className="border-b border-black/10 text-gray-900"
                  >
                    <td className="py-3">{req.resident_name}</td>
                    <td className="py-3">{req.certificate_name}</td>
                    <td className="py-3">{req.purpose}</td>
                    <td className="py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          req.status === "Approved"
                            ? "bg-green-200 text-green-800"
                            : req.status === "Rejected"
                            ? "bg-red-200 text-red-800"
                            : "bg-yellow-200 text-yellow-800"
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3">
                      {new Date(req.submitted_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      })}
                    </td>
                    <td className="py-3 flex gap-2">
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        onClick={() => {
                          setSelectedRequest(req);
                          setShowViewModal(true);
                        }}
                      >
                        View
                      </button>

                      {req.status === "Approved" && (
                        <button
                          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
                          onClick={() => handleDownload(req)}
                        >
                          Download
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </LogoCardWrapper>

      {/* 🔍 View Modal */}
      {showViewModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[450px] shadow-xl">
            <h2 className="text-xl font-bold mb-4">Request Details</h2>

            <div className="space-y-2">
              <p><b>Resident:</b> {selectedRequest.resident_name}</p>
              <p><b>Document:</b> {selectedRequest.certificate_name}</p>
              <p><b>Purpose:</b> {selectedRequest.purpose}</p>
              <p><b>Status:</b> {selectedRequest.status}</p>
            </div>

            <div className="flex justify-end gap-2 mt-6 flex-wrap">
              <button
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedRequest(null);
                }}
              >
                Close
              </button>

              {selectedRequest.status === "Approved" && (
                <>
                  <button
                    className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-800"
                    onClick={() => handleDownload(selectedRequest)}
                  >
                    Download
                  </button>

                  <button
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                    onClick={() => handlePrint(selectedRequest)}
                  >
                    Print
                  </button>
                </>
              )}

              {selectedRequest.status === "Pending" && (
                <>
                  <button
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                    onClick={handleDenyClick}
                  >
                    Deny
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                    onClick={() => handleApprove(selectedRequest.cert_req_id)}
                  >
                    Approve
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ❌ Deny Reason Modal */}
      {showDenyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[400px] shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-red-700">Deny Request</h2>
            <label className="block mb-2 font-medium">Reason for denial:</label>
            <textarea
              value={denyReason}
              onChange={(e) => setDenyReason(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
              rows="3"
              placeholder="Enter reason..."
            />
            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                onClick={() => setShowDenyModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                onClick={confirmDeny}
              >
                Confirm Deny
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
