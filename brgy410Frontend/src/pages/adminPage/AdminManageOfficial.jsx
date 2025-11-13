import { useEffect, useState } from "react";
import { LogoCardWrapper } from "../../components/common/cards/LogoCardWrapper";
import AxiosInstance from "../../utils/AxiosInstance";
import toast from "react-hot-toast";
import { UserPlus, Eye, Edit, UserX, Search, History } from "lucide-react";

export default function BrgyOfficialsManagement() {
  const [officials, setOfficials] = useState([]);
  const [residents, setResidents] = useState([]);
  const [positions, setPositions] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [filter, setFilter] = useState("active"); // 'active', 'all', 'past'
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOfficial, setSelectedOfficial] = useState(null);

  // Form state for adding new official
  const [form, setForm] = useState({
    resident_id: "",
    position_id: "",
    start_term: "",
    remark: ""
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    position_id: "",
    start_term: "",
    end_term: "",
    remark: "",
    stat_id: ""
  });

  // 🧠 Fetch all data on mount
  useEffect(() => {
    fetchOfficials();
    fetchResidents();
    fetchPositions();
    fetchStatuses();
  }, []);

  const fetchOfficials = async () => {
    try {
      setLoading(true);
      const { data } = await AxiosInstance.get("/brgy-officials");
      setOfficials(data);
      console.log(data)
    } catch (err) {
      console.error("Error fetching officials:", err);
      toast.error("Failed to load officials.");
    } finally {
      setLoading(false);
    }
  };

  const fetchResidents = async () => {
    try {
      const { data } = await AxiosInstance.get("/admin/residents"); // or "/admin/residents" if you prefer
      setResidents(data);
    } catch (err) {
      console.error("Error fetching residents:", err);
    }
  };

  const fetchPositions = async () => {
    try {
      // Fetch from your position table
      const { data } = await AxiosInstance.get("/positions");
      setPositions(data);
      console.log(data)
    } catch (err) {
      console.error("Error fetching positions:", err);
      // Fallback: hardcode positions if endpoint doesn't exist yet
      setPositions([
        { position_id: 1, position_name: "Chairman/Chairwoman" },
        { position_id: 2, position_name: "Councilor/Kagawad" },
        { position_id: 3, position_name: "Secretary" },
        { position_id: 4, position_name: "Treasurer" },
        { position_id: 5, position_name: "Administrator" }
      ]);
    }
  };

  const fetchStatuses = async () => {
    try {
      // Fetch from your status table
      const { data } = await AxiosInstance.get("/status");
      setStatuses(data);
    } catch (err) {
      console.error("Error fetching statuses:", err);
      // Fallback: hardcode statuses if endpoint doesn't exist yet
      setStatuses([
        { stat_id: 1, status: "active" },
        { stat_id: 2, status: "term_ended" },
        { stat_id: 3, status: "suspended" },
        { stat_id: 4, status: "acting" }
      ]);
    }
  };

  // 📅 Calculate end term (3 years from start)
  const calculateEndTerm = (startDate) => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setFullYear(end.getFullYear() + 3);
    return end.toISOString().split('T')[0];
  };

  // 🔹 Add New Official
  const handleAddOfficial = async (e) => {
    e.preventDefault();[]
    
    if (!form.resident_id || !form.position_id || !form.start_term) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const endTerm = calculateEndTerm(form.start_term);
      
      await AxiosInstance.post("/brgy-officials", {
        ...form,
        end_term: endTerm,
        stat_id: 1 // Active status
      });

      toast.success("Official added successfully!");
      setShowAddModal(false);
      setForm({ resident_id: "", position_id: "", start_term: "", remark: "" });
      fetchOfficials();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add official.");
    }
  };

  // 🔹 View Official Details
  const handleViewOfficial = (official) => {
    setSelectedOfficial(official);
    setShowViewModal(true);
  };

  // 🔹 Edit Official
  const handleEditClick = (official) => {
    setSelectedOfficial(official);
    setEditForm({
      position_id: official.position_id,
      start_term: official.start_term.split('T')[0],
      end_term: official.end_term.split('T')[0],
      remark: official.remark || "",
      stat_id: official.stat_id
    });
    setShowEditModal(true);
  };

  const handleUpdateOfficial = async (e) => {
    e.preventDefault();

    try {
      await AxiosInstance.put(`/brgy-officials/${selectedOfficial.brgy_official_no}`, editForm);
      toast.success("Official updated successfully!");
      setShowEditModal(false);
      fetchOfficials();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update official.");
    }
  };

  // 🔹 Deactivate Official (End term / Suspend)
  const handleDeactivate = async (official, reason) => {
    const confirmMsg = reason === "term_ended" 
      ? "Mark this official's term as ended?" 
      : "Suspend this official?";

    if (!window.confirm(confirmMsg)) return;

    try {
      const newStatus = reason === "term_ended" ? 2 : 3; // 2=term_ended, 3=suspended
      
      await AxiosInstance.put(`/brgy-officials/${official.brgy_official_no}`, {
        stat_id: newStatus,
        remark: reason === "term_ended" ? "Term ended" : "Suspended"
      });

      toast.success("Official status updated!");
      fetchOfficials();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status.");
    }
  };

  // 🔹 Reactivate Official (for re-election)
  const handleReactivate = async (official) => {
    if (!window.confirm("Reactivate this official for a new term?")) return;

    const newStartTerm = prompt("Enter new start term date (YYYY-MM-DD):");
    if (!newStartTerm) return;

    try {
      const newEndTerm = calculateEndTerm(newStartTerm);

      await AxiosInstance.put(`/brgy-officials/${official.brgy_official_no}`, {
        start_term: newStartTerm,
        end_term: newEndTerm,
        stat_id: 1, // Active
        remark: "Re-elected"
      });

      toast.success("Official reactivated successfully!");
      fetchOfficials();
    } catch (err) {
      console.error(err);
      toast.error("Failed to reactivate official.");
    }
  };

  // 🔍 Filter officials
  const filteredOfficials = officials
    .filter(official => {
      if (filter === "active") return official.stat_id === 1;
      if (filter === "past") return official.stat_id !== 1;
      return true; // 'all'
    })
    .filter(official => {
      const fullName = `${official.first_name} ${official.last_name}`.toLowerCase();
      const position = official.position_name?.toLowerCase() || "";
      return fullName.includes(searchTerm.toLowerCase()) || 
             position.includes(searchTerm.toLowerCase());
    });

  return (
    <div className="w-full px-5 pt-3">
      <LogoCardWrapper>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Barangay Officials Management</h2>
          <button
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all"
            onClick={() => setShowAddModal(true)}
          >
            <UserPlus size={18} /> Add Official
          </button>
        </div>

        {/* Filters */}
        <div className="mb-4 flex gap-4 flex-wrap items-center">
          {/* Status Filter */}
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded-lg transition ${
                filter === "active" 
                  ? "bg-green-600 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setFilter("active")}
            >
              Active
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition ${
                filter === "past" 
                  ? "bg-orange-600 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setFilter("past")}
            >
              Past Officials
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition ${
                filter === "all" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-10 text-gray-600">Loading officials...</div>
        ) : filteredOfficials.length === 0 ? (
          <div className="text-center py-10 text-gray-600">No officials found.</div>
        ) : (
          <div className="overflow-x-auto rounded-2xl shadow-sm border border-gray-200 bg-white">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-3 font-bold text-gray-700">#</th>
                  <th className="text-left p-3 font-bold text-gray-700">Name</th>
                  <th className="text-left p-3 font-bold text-gray-700">Position</th>
                  <th className="text-left p-3 font-bold text-gray-700">Term</th>
                  <th className="text-left p-3 font-bold text-gray-700">Status</th>
                  <th className="text-center p-3 font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOfficials.map((official, index) => (
                  <tr key={official.brgy_official_no} className="border-t hover:bg-gray-50 transition-all">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3 font-medium text-gray-900">
                      {official.first_name} {official.middle_name && `${official.middle_name[0]}.`} {official.last_name}
                    </td>
                    <td className="p-3 text-gray-700">{official.position_name}</td>
                    <td className="p-3 text-gray-700">
                      {new Date(official.start_term).toLocaleDateString()} - {new Date(official.end_term).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          official.stat_id === 1
                            ? "bg-green-200 text-green-800"
                            : official.stat_id === 2
                            ? "bg-gray-200 text-gray-800"
                            : official.stat_id === 3
                            ? "bg-red-200 text-red-800"
                            : "bg-blue-200 text-blue-800"
                        }`}
                      >
                        {official.status_name || "Unknown"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center gap-2">
                        <button
                          className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
                          onClick={() => handleViewOfficial(official)}
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>

                        {official.stat_id === 1 && (
                          <>
                            <button
                              className="p-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                              onClick={() => handleEditClick(official)}
                              title="Edit Official"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                              onClick={() => handleDeactivate(official, "term_ended")}
                              title="End Term"
                            >
                              <UserX size={18} />
                            </button>
                          </>
                        )}

                        {official.stat_id !== 1 && (
                          <button
                            className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
                            onClick={() => handleReactivate(official)}
                            title="Reactivate for Re-election"
                          >
                            <History size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </LogoCardWrapper>

      {/* ➕ Add Official Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[500px] shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Add New Official</h2>

            <form onSubmit={handleAddOfficial} className="space-y-4">
              {/* Select Resident */}
              <div>
                <label className="block mb-1 font-medium">Select Resident *</label>
                <select
                  value={form.resident_id}
                  onChange={(e) => setForm({ ...form, resident_id: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  required
                >
                  <option value="">-- Select Resident --</option>
                  {residents.map((res) => (
                    <option key={res.resident_id} value={res.resident_id}>
                      {res.first_name} {res.middle_name} {res.last_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Position */}
              <div>
                <label className="block mb-1 font-medium">Position *</label>
                <select
                  value={form.position_id}
                  onChange={(e) => setForm({ ...form, position_id: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  required
                >
                  <option value="">-- Select Position --</option>
                  {positions.map((pos) => (
                    <option key={pos.position_id} value={pos.position_id}>
                      {pos.position_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Term */}
              <div>
                <label className="block mb-1 font-medium">Start Term Date *</label>
                <input
                  type="date"
                  value={form.start_term}
                  onChange={(e) => setForm({ ...form, start_term: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  End term will be auto-calculated (3 years from start)
                </p>
              </div>

              {/* Remarks */}
              <div>
                <label className="block mb-1 font-medium">Remarks</label>
                <textarea
                  value={form.remark}
                  onChange={(e) => setForm({ ...form, remark: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  rows="3"
                  placeholder="Optional notes..."
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                  onClick={() => {
                    setShowAddModal(false);
                    setForm({ resident_id: "", position_id: "", start_term: "", remark: "" });
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Add Official
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 👁️ View Official Modal */}
      {showViewModal && selectedOfficial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[450px] shadow-xl">
            <h2 className="text-xl font-bold mb-4">Official Details</h2>

            <div className="space-y-2">
              <p><b>Name:</b> {selectedOfficial.first_name} {selectedOfficial.middle_name} {selectedOfficial.last_name}</p>
              <p><b>Position:</b> {selectedOfficial.position_name}</p>
              <p><b>Start Term:</b> {new Date(selectedOfficial.start_term).toLocaleDateString()}</p>
              <p><b>End Term:</b> {new Date(selectedOfficial.end_term).toLocaleDateString()}</p>
              <p><b>Status:</b> {selectedOfficial.status_name}</p>
              {selectedOfficial.remark && <p><b>Remarks:</b> {selectedOfficial.remark}</p>}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✏️ Edit Official Modal */}
      {showEditModal && selectedOfficial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[500px] shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Edit Official</h2>

            <form onSubmit={handleUpdateOfficial} className="space-y-4">
              {/* Position */}
              <div>
                <label className="block mb-1 font-medium">Position *</label>
                <select
                  value={editForm.position_id}
                  onChange={(e) => setEditForm({ ...editForm, position_id: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  required
                >
                  {positions.map((pos) => (
                    <option key={pos.position_id} value={pos.position_id}>
                      {pos.position_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Term */}
              <div>
                <label className="block mb-1 font-medium">Start Term *</label>
                <input
                  type="date"
                  value={editForm.start_term}
                  onChange={(e) => setEditForm({ ...editForm, start_term: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  required
                />
              </div>

              {/* End Term */}
              <div>
                <label className="block mb-1 font-medium">End Term *</label>
                <input
                  type="date"
                  value={editForm.end_term}
                  onChange={(e) => setEditForm({ ...editForm, end_term: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  required
                />
              </div>

              {/* Status */}
              <div>
                <label className="block mb-1 font-medium">Status *</label>
                <select
                  value={editForm.stat_id}
                  onChange={(e) => setEditForm({ ...editForm, stat_id: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  required
                >
                  {statuses.map((stat) => (
                    <option key={stat.stat_id} value={stat.stat_id}>
                      {stat.status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Remarks */}
              <div>
                <label className="block mb-1 font-medium">Remarks</label>
                <textarea
                  value={editForm.remark}
                  onChange={(e) => setEditForm({ ...editForm, remark: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  rows="3"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                >
                  Update Official
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}