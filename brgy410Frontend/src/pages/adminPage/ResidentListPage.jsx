import { useState, useEffect } from "react";
import { LogoCardWrapper } from "../../components/common/cards/LogoCardWrapper";
import { Eye, Edit, Trash2, UserPlus, X } from "lucide-react";
import axiosInstance from "../../utils/AxiosInstance";
import { toast } from "react-hot-toast";

export default function ResidentListPage() {
  const [residents, setResidents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [voterFilter, setVoterFilter] = useState("all"); // all | voters | non_voters

  const [selected, setSelected] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    gender: "",
    address_id: "",
    contact_number: "",
    is_voter: 0,
  });

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

  // === INPUT HANDLER ===
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () =>
    setFormData({
      first_name: "",
      middle_name: "",
      last_name: "",
      gender: "",
      address_id: "",
      contact_number: "",
      is_voter: 0,
    });

  // === ADD ===
  const handleAddResident = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/admin/residents", formData);
      toast.success("Resident added successfully!");
      setShowAddModal(false);
      resetForm();
      fetchResidents();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add resident");
    }
  };

  // === UPDATE ===
  const handleEditResident = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/admin/residents/${selected.resident_id}`, formData);
      toast.success("Resident updated successfully!");
      setShowEditModal(false);
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

  // === EDIT MODAL OPEN ===
  const openEditModal = (res) => {
    setSelected(res);
    setFormData({
      first_name: res.first_name,
      middle_name: res.middle_name || "",
      last_name: res.last_name,
      gender: res.gender,
      address_id: res.address_id || "",
      contact_number: res.contact_number || "",
      is_voter: res.is_voter || 0,
    });
    setShowEditModal(true);
  };

  return (
    <div className="w-full px-5 pt-3">
      <LogoCardWrapper>
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-gray-800">Resident Records</h2>
          <button
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all"
            onClick={() => setShowAddModal(true)}
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
                    <td className="p-3 text-gray-700">{res.gender}</td>
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
                            setShowViewModal(true);
                          }}
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="p-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                          onClick={() => openEditModal(res)}
                        >
                          <Edit size={18} />
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

      {/* === VIEW MODAL === */}
      {showViewModal && selected && (
        <Modal title="Resident Details" onClose={() => setShowViewModal(false)}>
          <p><b>Name:</b> {selected.first_name} {selected.middle_name || ""} {selected.last_name}</p>
          <p><b>Gender:</b> {selected.gender}</p>
          <p><b>Contact:</b> {selected.contact_number}</p>
          <p><b>Registered Voter:</b> {selected.is_voter === 1 ? "Yes" : "No"}</p>
        </Modal>
      )}

      {/* === ADD / EDIT MODALS === */}
      {(showAddModal || showEditModal) && (
        <Modal
          title={showAddModal ? "Add Resident" : "Edit Resident"}
          onClose={() => {
            setShowAddModal(false);
            setShowEditModal(false);
          }}
        >
          <form
            onSubmit={showAddModal ? handleAddResident : handleEditResident}
            className="space-y-4"
          >
            <input
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded-lg"
            />
            <input
              name="middle_name"
              placeholder="Middle Name"
              value={formData.middle_name}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
            />
            <input
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded-lg"
            />
            <input
              name="gender"
              placeholder="Gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
            />
            <input
              name="contact_number"
              placeholder="Contact Number"
              value={formData.contact_number}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
            />

            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                name="is_voter"
                checked={formData.is_voter === 1}
                onChange={(e) => setFormData({ ...formData, is_voter: e.target.checked ? 1 : 0 })}
                className="w-4 h-4 accent-blue-600"
              />
              Registered Voter
            </label>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                }}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {showAddModal ? "Add" : "Update"}
              </button>
            </div>
          </form>
        </Modal>
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
