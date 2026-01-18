import { useEffect, useState } from "react";
import { LogoCardWrapper } from "../../components/common/cards/LogoCardWrapper";
import axiosInstance from "../../utils/AxiosInstance";
import toast from "react-hot-toast";

export default function AdminRequestList() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDenyModal, setShowDenyModal] = useState(false);
  const [denyReason, setDenyReason] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [statuses, setStatuses] = useState([]);

  // 🧠 Fetch certificate statuses
  const fetchStatuses = async () => {
    try {
      const { data } = await axiosInstance.get("/lookup/certificate-status");
      setStatuses(data);
    } catch (err) {
      console.error("Error fetching statuses:", err);
    }
  };

  // 🧠 Fetch all certificate requests
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/certificates/requests");
      setRequests(data);
    } catch (err) {
      console.error("Error fetching requests:", err);
      toast.error("Failed to load requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
    fetchRequests();
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequests = requests.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 🔹 Approve Request
  const handleApprove = async (id) => {
    try {
      setIsGenerating(true); // 🔥 Show popup + disable UI

      // Get Approved status ID from lookup
      const approvedStatus = statuses.find(s => s.status_name.toUpperCase() === "APPROVED");
      if (!approvedStatus) {
        toast.error("Approved status not found");
        setIsGenerating(false);
        return;
      }

      await axiosInstance.put(`/certificates/${id}/status`, {
        statusId: approvedStatus.stat_id,
        denied_reason: null,
      });

      toast.success("Document is being generated...");
      setShowViewModal(false);
      setSelectedRequest(null);
      setCurrentPage(1); // Reset to first page
      
      // Poll for attachment completion
      let pollCount = 0;
      const maxPolls = 30; // Poll for up to 30 seconds
      const pollInterval = setInterval(async () => {
        pollCount++;
        
        // Fetch fresh data and check if attachment exists
        const { data } = await axiosInstance.get("/certificates/requests");
        const updatedRequest = data.find(r => r.cert_req_id === id);
        
        if (updatedRequest?.has_attachment === 1 || pollCount >= maxPolls) {
          clearInterval(pollInterval);
          setIsGenerating(false);
          setRequests(data); // Update the list with fresh data
          if (updatedRequest?.has_attachment === 1) {
            toast.success("Document ready for download!");
          } else {
            toast.error("Document generation timed out. Please refresh the page.");
          }
        } else {
          setRequests(data); // Update list during polling
        }
      }, 1000);
      
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve request.");
      setIsGenerating(false);
    }
  };

  // 🔹 Deny Flow
  const handleDenyClick = () => {
    setShowViewModal(false);
    setShowDenyModal(true);
  };

  const confirmDeny = async () => {
    // Get Rejected status from lookup
    const rejectedStatus = statuses.find(s => s.status_name.toUpperCase() === "REJECTED");
    if (!rejectedStatus) {
      toast.error("Rejected status not found");
      return;
    }

    try {
      await axiosInstance.put(
        `/certificates/${selectedRequest.cert_req_id}/status`,
        {
          statusId: rejectedStatus.stat_id,
          denied_reason: denyReason,
        }
      );
      toast.success("Request denied successfully!");
      setShowDenyModal(false);
      setDenyReason("");
      setSelectedRequest(null);
      setCurrentPage(1); // Reset to first page
      fetchRequests();
    } catch (err) {
      console.error(err);
      toast.error("Failed to deny request.");
    }
  };

  // 🔹 Release Certificate
  const handleRelease = async (id) => {
    try {
      // Get Released status from lookup
      const releasedStatus = statuses.find(s => s.status_name.toUpperCase() === "RELEASED");
      if (!releasedStatus) {
        toast.error("Released status not found");
        return;
      }

      await axiosInstance.put(`/certificates/${id}/release`, {
        statusId: releasedStatus.stat_id,
      });

      toast.success("Certificate released successfully!");
      setShowViewModal(false);
      setSelectedRequest(null);
      setCurrentPage(1); // Reset to first page
      fetchRequests();
    } catch (err) {
      console.error(err);
      toast.error("Failed to release certificate.");
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
                  <th className="py-2 font-bold text-gray-900">Control Number</th>
                  <th className="py-2 font-bold text-gray-900">Resident</th>
                  <th className="py-2 font-bold text-gray-900">Document</th>
                  <th className="py-2 font-bold text-gray-900">Purpose</th>
                  <th className="py-2 font-bold text-gray-900">Status</th>
                  <th className="py-2 font-bold text-gray-900">Date Submitted</th>
                  <th className="py-2 font-bold text-gray-900 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentRequests.map((req) => (
                  <tr
                    key={req.cert_req_id}
                    className="border-b border-black/10 text-gray-900"
                  >
                    <td className="py-3">{req.control_number || 'N/A'}</td>
                    <td className="py-3">{req.resident_name}</td>
                    <td className="py-3">{req.certificate_name}</td>
                    <td className="py-3">{req.purpose}</td>
                    <td className="py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          req.status?.toUpperCase() === "RELEASED"
                            ? "bg-green-200 text-green-800"
                            : req.status?.toUpperCase() === "PENDING"
                            ? "bg-blue-200 text-blue-800"
                            : req.status?.toUpperCase() === "REJECTED"
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

                      {req.status?.toUpperCase() === "APPROVED" && req.has_attachment === 1 && (
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

            {/* Pagination Controls */}
            {requests.length > itemsPerPage && (
              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-gray-600">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, requests.length)} of {requests.length} requests
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Show first page, last page, current page, and pages around current
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-4 py-2 rounded-lg transition ${
                            currentPage === pageNumber
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 hover:bg-gray-300"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return <span key={pageNumber} className="px-2">...</span>;
                    }
                    return null;
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </LogoCardWrapper>

      {/* 🔍 View Modal */}
      {showViewModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[450px] shadow-xl">
            <h2 className="text-xl font-bold mb-4">Request Details</h2>

            <div className="space-y-2">
              <p><b>Control Number:</b> {selectedRequest.control_number || 'N/A'}</p>
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

              {selectedRequest.status?.toUpperCase() === "APPROVED" && selectedRequest.has_attachment === 1 && (
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

                  <button
                    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                    onClick={() => handleRelease(selectedRequest.cert_req_id)}
                  >
                    Release
                  </button>
                </>
              )}

              {selectedRequest.status?.toUpperCase() === "APPROVED" && selectedRequest.has_attachment !== 1 && (
                <div className="text-sm text-yellow-600 mt-2">
                  Document is being generated, please wait...
                </div>
              )}

              {selectedRequest.status?.toUpperCase() === "PENDING" && (
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
      {isGenerating && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4 text-lg font-semibold">Generating document…</p>
            <p className="text-sm text-gray-600">Please wait</p>
          </div>
        </div>
      )}
    </div>
  );
}
