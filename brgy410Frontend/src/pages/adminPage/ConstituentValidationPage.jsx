import { useEffect, useState } from "react";
import { LogoCardWrapper } from "../../components/common/cards/LogoCardWrapper";
import axiosInstance from "../../utils/AxiosInstance";
import toast from "react-hot-toast";

export default function ConstituentValidationPage() {
  const [censusRecords, setCensusRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch census records
  const fetchCensusRecords = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/census");
      setCensusRecords(data);
    } catch (err) {
      console.error("Error fetching census records:", err);
      toast.error("Failed to load census records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCensusRecords();
  }, []);

  // Validate census record
  const handleValidate = async (stagingId) => {
    try {
      setIsProcessing(true);
      await axiosInstance.post(`/census/${stagingId}/validate`);
      toast.success("Census record validated successfully!");
      setShowViewModal(false);
      setSelectedRecord(null);
      fetchCensusRecords();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to validate census record.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Show reject modal
  const handleRejectClick = () => {
    setShowViewModal(false);
    setShowRejectModal(true);
  };

  // Confirm rejection
  const confirmReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a rejection reason.");
      return;
    }

    try {
      setIsProcessing(true);
      await axiosInstance.post(`/census/${selectedRecord.staging_id}/reject`, {
        rejection_notes: rejectReason,
      });
      toast.success("Census record rejected successfully!");
      setShowRejectModal(false);
      setRejectReason("");
      setSelectedRecord(null);
      fetchCensusRecords();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to reject census record.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter and search records
  const filteredRecords = censusRecords.filter((record) => {
    const matchesSearch =
      searchTerm === "" ||
      record.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.middle_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.submission_id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      record.status_name?.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Get status badge color
  const getStatusColor = (status) => {
    if (!status) return "bg-gray-200 text-gray-800";
    const statusLower = status.toLowerCase();
    if (statusLower === "validated") return "bg-green-200 text-green-800";
    if (statusLower === "rejected") return "bg-red-200 text-red-800";
    if (statusLower === "pending") return "bg-yellow-200 text-yellow-800";
    return "bg-blue-200 text-blue-800";
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  // Get full name
  const getFullName = (record) => {
    const parts = [
      record.first_name,
      record.middle_name,
      record.last_name,
      record.suffix,
    ].filter(Boolean);
    return parts.join(" ");
  };

  return (
    <div className="w-full px-5 pt-3">
      <LogoCardWrapper>
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2 text-gray-800">
            Census Record Validation
          </h2>
          <p className="text-gray-600">
            Review and validate census submissions to add them to the verified constituent database
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or submission ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="md:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="validated">Validated</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-sm text-yellow-600 font-medium">Pending</div>
            <div className="text-2xl font-bold text-yellow-800">
              {censusRecords.filter((r) => r.status_name?.toLowerCase() === "pending").length}
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-sm text-green-600 font-medium">Validated</div>
            <div className="text-2xl font-bold text-green-800">
              {censusRecords.filter((r) => r.status_name?.toLowerCase() === "validated").length}
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-sm text-red-600 font-medium">Rejected</div>
            <div className="text-2xl font-bold text-red-800">
              {censusRecords.filter((r) => r.status_name?.toLowerCase() === "rejected").length}
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm text-blue-600 font-medium">Total</div>
            <div className="text-2xl font-bold text-blue-800">
              {censusRecords.length}
            </div>
          </div>
        </div>

        {/* Records Table */}
        {loading ? (
          <div className="text-center py-10 text-gray-600">
            Loading census records...
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-10 text-gray-600">
            {searchTerm || filterStatus !== "all"
              ? "No records match your filters."
              : "No census records found."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-t border-black/20">
              <thead>
                <tr className="border-b border-black/20 bg-gray-50">
                  <th className="py-3 px-4 font-bold text-gray-900">Submission ID</th>
                  <th className="py-3 px-4 font-bold text-gray-900">Full Name</th>
                  <th className="py-3 px-4 font-bold text-gray-900">Sex</th>
                  <th className="py-3 px-4 font-bold text-gray-900">Birthdate</th>
                  <th className="py-3 px-4 font-bold text-gray-900">Address</th>
                  <th className="py-3 px-4 font-bold text-gray-900">Status</th>
                  <th className="py-3 px-4 font-bold text-gray-900">Date Collected</th>
                  <th className="py-3 px-4 font-bold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr
                    key={record.staging_id}
                    className="border-b border-black/10 hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4 text-gray-900 font-mono text-sm">
                      {record.submission_id}
                    </td>
                    <td className="py-3 px-4 text-gray-900 font-medium">
                      {getFullName(record)}
                    </td>
                    <td className="py-3 px-4 text-gray-900">{record.sex}</td>
                    <td className="py-3 px-4 text-gray-900">
                      {formatDate(record.birthdate)}
                    </td>
                    <td className="py-3 px-4 text-gray-900">
                      {record.address_no} {record.street_name}, {record.brgy_name}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                          record.status_name
                        )}`}
                      >
                        {record.status_name || "Unknown"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-900">
                      {formatDate(record.date_collected)}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                        onClick={() => {
                          setSelectedRecord(record);
                          setShowViewModal(true);
                        }}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </LogoCardWrapper>

      {/* View/Review Modal */}
      {showViewModal && selectedRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-800">Census Record Details</h2>
              <p className="text-sm text-gray-600 mt-1">
                Submission ID: <span className="font-mono">{selectedRecord.submission_id}</span>
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">First Name</label>
                    <p className="text-gray-900">{selectedRecord.first_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Middle Name</label>
                    <p className="text-gray-900">{selectedRecord.middle_name || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Last Name</label>
                    <p className="text-gray-900">{selectedRecord.last_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Suffix</label>
                    <p className="text-gray-900">{selectedRecord.suffix || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Sex</label>
                    <p className="text-gray-900">{selectedRecord.sex}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Birthdate</label>
                    <p className="text-gray-900">{formatDate(selectedRecord.birthdate)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nationality</label>
                    <p className="text-gray-900">{selectedRecord.nationality}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Household Head</label>
                    <p className="text-gray-900">{selectedRecord.household_head ? "Yes" : "No"}</p>
                  </div>
                </div>
              </div>

              {/* Place of Birth */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
                  Place of Birth
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">City/Municipality</label>
                    <p className="text-gray-900">{selectedRecord.birth_city_municipality}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Province</label>
                    <p className="text-gray-900">{selectedRecord.birth_province}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Country</label>
                    <p className="text-gray-900">{selectedRecord.birth_country}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-900">{selectedRecord.email || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
                  Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">House/Lot No.</label>
                    <p className="text-gray-900">{selectedRecord.house_number}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Street</label>
                    <p className="text-gray-900">{selectedRecord.street_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Barangay</label>
                    <p className="text-gray-900">{selectedRecord.barangay_name}</p>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
                  Additional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <p>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                          selectedRecord.status_name
                        )}`}
                      >
                        {selectedRecord.status_name || "Unknown"}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date Collected</label>
                    <p className="text-gray-900">{formatDate(selectedRecord.date_collected)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Collected By</label>
                    <p className="text-gray-900">
                      {selectedRecord.user_fname && selectedRecord.user_lname
                        ? `${selectedRecord.user_fname} ${selectedRecord.user_lname}`
                        : "Public Submission"}
                    </p>
                  </div>
                </div>
                {selectedRecord.notes && (
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-600">Notes</label>
                    <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">
                      {selectedRecord.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 rounded-b-2xl flex justify-end gap-3 flex-wrap">
              <button
                className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 font-medium transition"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedRecord(null);
                }}
                disabled={isProcessing}
              >
                Close
              </button>

              {selectedRecord.status_name?.toLowerCase() === "pending" && (
                <>
                  <button
                    className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleRejectClick}
                    disabled={isProcessing}
                  >
                    Reject
                  </button>
                  <button
                    className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleValidate(selectedRecord.staging_id)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Validating..." : "Validate & Add to Database"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-red-700">Reject Census Record</h2>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this census record:
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows="4"
              placeholder="Enter rejection reason..."
              disabled={isProcessing}
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 font-medium transition"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                  setShowViewModal(true);
                }}
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={confirmReject}
                disabled={isProcessing}
              >
                {isProcessing ? "Rejecting..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4 text-lg font-semibold">Processing...</p>
            <p className="text-sm text-gray-600">Please wait</p>
          </div>
        </div>
      )}
    </div>
  );
}