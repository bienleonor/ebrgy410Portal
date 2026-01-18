import { useState, useEffect } from "react";
import { LogoCardWrapper } from "../../components/common/cards/LogoCardWrapper";
import { Eye, Edit, Trash2, UserPlus, X, Save } from "lucide-react";
import axiosInstance from "../../utils/AxiosInstance";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ResidentListPage() {

  const [residents, setResidents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [voterFilter, setVoterFilter] = useState("all"); // all | voters | non_voters

  const [selected, setSelected] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState({});

  const navigate = useNavigate();

  // === FETCH RESIDENTS ===
  const fetchResidents = async () => {
    try {
      const { data } = await axiosInstance.get("/admin/residents");
      setResidents(data);
      setFiltered(data);
    } catch (err) {
      console.error("Error fetching residents:", err);
      toast.error("Failed to load residents");
    }
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  // === FILTER BY SEARCH AND VOTER STATUS ===
  useEffect(() => {
    const result = residents.filter((res) => {
      const matchesSearch = `${res.first_name} ${res.last_name}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesVoter =
        voterFilter === "voters"
          ? res.is_voter === 1
          : voterFilter === "non_voters"
          ? res.is_voter === 0
          : true;

      return matchesSearch && matchesVoter;
    });
    setFiltered(result);
  }, [search, residents, voterFilter]);

  // === UPDATE ===
  const handleEditResident = async () => {
    try {
      await axiosInstance.put(`/admin/residents/${selected.verified_id}`, editData);
      toast.success("Resident updated successfully!");
      setIsEditMode(false);
      setShowViewModal(false);
      fetchResidents();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update resident");
    }
  };

  // === DELETE ===
  const handleDeleteResident = async (residentId) => {
    if (!window.confirm("Are you sure you want to delete this resident?")) return;
    try {
      await axiosInstance.delete(`/admin/residents/${residentId}`);
      toast.success("Resident deleted successfully!");
      fetchResidents();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete resident");
    }
  };

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const handleEditChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  return (
    <div className="w-full px-5 pt-3">
      <LogoCardWrapper>
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-gray-800">Resident Records</h2>
          <button
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all"
            onClick={() => navigate("/admin/create-account")} // Redirect instead of opening modal
          >
            <UserPlus size={18} /> Add Resident
          </button>
        </div>

        {/* SEARCH + FILTER */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/2 p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={voterFilter}
            onChange={(e) => setVoterFilter(e.target.value)}
            className="p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Residents</option>
            <option value="voters">Registered Voters Only</option>
            <option value="non_voters">Non-Voters Only</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-2xl shadow-sm border border-gray-200 bg-white">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3 font-bold text-gray-700">#</th>
                <th className="text-left p-3 font-bold text-gray-700">Full Name</th>
                <th className="text-left p-3 font-bold text-gray-700">Gender</th>
                <th className="text-left p-3 font-bold text-gray-700">Contact</th>
                <th className="text-left p-3 font-bold text-gray-700">Voter</th>
                <th className="text-center p-3 font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((res, index) => (
                  <tr key={res.resident_id} className="border-t hover:bg-gray-50 transition-all">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3 font-medium text-gray-900">
                      {res.first_name} {res.middle_name && `${res.middle_name[0]}.`} {res.last_name}
                    </td>
                    <td className="p-3 text-gray-700">{res.sex}</td>
                    <td className="p-3 text-gray-700">{res.contact_number || "—"}</td>
                    <td className="p-3 text-gray-700">
                      {res.is_voter === 1 ? (
                        <span className="text-green-700 font-semibold">Yes</span>
                      ) : (
                        <span className="text-gray-500">No</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
                          onClick={() => {
                            setSelected(res);
                            setEditData(res);
                            setIsEditMode(false);
                            setShowViewModal(true);
                          }}
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                          onClick={() => handleDeleteResident(res.resident_id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
                    No residents found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </LogoCardWrapper>

      {/* === VIEW MODAL WITH EDIT MODE === */}
      {showViewModal && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {isEditMode ? "Edit Resident Information" : "Resident Details"}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Verified ID: <span className="font-mono">{selected.verified_id}</span>
                </p>
              </div>
              {!isEditMode && (
                <button
                  onClick={() => setIsEditMode(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Edit size={18} />
                  Edit Mode
                </button>
              )}
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
                    {isEditMode ? (
                      <input
                        type="text"
                        value={editData.first_name || ""}
                        onChange={(e) => handleEditChange("first_name", e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        disabled
                      />
                    ) : (
                      <p className="text-gray-900 mt-1">{selected.first_name}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Middle Name</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={editData.middle_name || ""}
                        onChange={(e) => handleEditChange("middle_name", e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        disabled
                      />
                    ) : (
                      <p className="text-gray-900 mt-1">{selected.middle_name || "N/A"}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Last Name</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={editData.last_name || ""}
                        onChange={(e) => handleEditChange("last_name", e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        disabled
                      />
                    ) : (
                      <p className="text-gray-900 mt-1">{selected.last_name}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Suffix</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={editData.suffix || ""}
                        onChange={(e) => handleEditChange("suffix", e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        disabled
                      />
                    ) : (
                      <p className="text-gray-900 mt-1">{selected.suffix || "N/A"}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Sex</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={editData.sex || ""}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                        disabled
                      />
                    ) : (
                      <p className="text-gray-900 mt-1">{selected.sex}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Birthdate</label>
                    {isEditMode ? (
                      <input
                        type="date"
                        value={editData.birthdate?.split('T')[0] || ""}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                        disabled
                      />
                    ) : (
                      <p className="text-gray-900 mt-1">{formatDate(selected.birthdate)}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nationality</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={editData.nationality || ""}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                        disabled
                      />
                    ) : (
                      <p className="text-gray-900 mt-1">{selected.nationality}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
                  Contact & Additional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    {isEditMode ? (
                      <input
                        type="email"
                        value={editData.email || ""}
                        onChange={(e) => handleEditChange("email", e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900 mt-1">{selected.email || "N/A"}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Contact Number</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={editData.contact_number || ""}
                        onChange={(e) => handleEditChange("contact_number", e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900 mt-1">{selected.contact_number || "N/A"}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Civil Status</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={editData.civil_status || ""}
                        onChange={(e) => handleEditChange("civil_status", e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900 mt-1">{selected.civil_status || "N/A"}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Religion</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={editData.religion || ""}
                        onChange={(e) => handleEditChange("religion", e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900 mt-1">{selected.religion || "N/A"}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Occupation</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={editData.occupation || ""}
                        onChange={(e) => handleEditChange("occupation", e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900 mt-1">{selected.occupation || "N/A"}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Voter & Status Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
                  Voter & Special Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Registered Voter</label>
                    {isEditMode ? (
                      <label className="flex items-center gap-2 mt-2">
                        <input
                          type="checkbox"
                          checked={editData.registered_voter === 1}
                          onChange={(e) => handleEditChange("registered_voter", e.target.checked ? 1 : 0)}
                          className="w-4 h-4 accent-blue-600"
                        />
                        <span className="text-sm text-gray-700">Yes</span>
                      </label>
                    ) : (
                      <p className="text-gray-900 mt-1">{selected.registered_voter === 1 ? "Yes" : "No"}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Senior Citizen</label>
                    {isEditMode ? (
                      <label className="flex items-center gap-2 mt-2">
                        <input
                          type="checkbox"
                          checked={editData.senior_citizen === 1}
                          onChange={(e) => handleEditChange("senior_citizen", e.target.checked ? 1 : 0)}
                          className="w-4 h-4 accent-blue-600"
                        />
                        <span className="text-sm text-gray-700">Yes</span>
                      </label>
                    ) : (
                      <p className="text-gray-900 mt-1">{selected.senior_citizen === 1 ? "Yes" : "No"}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">PWD</label>
                    {isEditMode ? (
                      <label className="flex items-center gap-2 mt-2">
                        <input
                          type="checkbox"
                          checked={editData.pwd === 1}
                          onChange={(e) => handleEditChange("pwd", e.target.checked ? 1 : 0)}
                          className="w-4 h-4 accent-blue-600"
                        />
                        <span className="text-sm text-gray-700">Yes</span>
                      </label>
                    ) : (
                      <p className="text-gray-900 mt-1">{selected.pwd === 1 ? "Yes" : "No"}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
                  Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">House/Lot No.</label>
                    <p className="text-gray-900 mt-1 bg-gray-50 px-3 py-2 rounded">{selected.house_number || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Street</label>
                    <p className="text-gray-900 mt-1 bg-gray-50 px-3 py-2 rounded">{selected.street_name || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Barangay</label>
                    <p className="text-gray-900 mt-1 bg-gray-50 px-3 py-2 rounded">{selected.barangay_name || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 rounded-b-2xl flex justify-end gap-3">
              {isEditMode ? (
                <>
                  <button
                    className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 font-medium transition"
                    onClick={() => {
                      setIsEditMode(false);
                      setEditData(selected);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 font-medium transition flex items-center gap-2"
                    onClick={handleEditResident}
                  >
                    <Save size={18} />
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 font-medium transition"
                  onClick={() => {
                    setShowViewModal(false);
                    setSelected(null);
                  }}
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// === SIMPLE MODAL COMPONENT ===
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[400px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">{title}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
