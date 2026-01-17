// pages/admin/HouseholdManagement.jsx
import { useEffect, useState } from "react";
import { LogoCardWrapper } from "../../components/common/cards/LogoCardWrapper";
import AxiosInstance from "../../utils/AxiosInstance";
import toast from "react-hot-toast";
import { 
  Home, 
  Users, 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  UserPlus,
  Search 
} from "lucide-react";

export default function HouseholdManagement() {
  const [households, setHouseholds] = useState([]);
  const [residents, setResidents] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedHousehold, setExpandedHousehold] = useState(null);

  // Modal states
  const [showAddHouseholdModal, setShowAddHouseholdModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showEditMemberModal, setShowEditMemberModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedHousehold, setSelectedHousehold] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  // Form states
  const [householdForm, setHouseholdForm] = useState({
    address_id: "",
  });

  const [memberForm, setMemberForm] = useState({
    household_id: "",
    resident_id: "",
    role_in_household: "Other",
  });

  const [editMemberForm, setEditMemberForm] = useState({
    role_in_household: "",
  });

  // Fetch data
  useEffect(() => {
    fetchHouseholds();
    fetchResidents();
    fetchAddresses();
  }, []);

  const fetchHouseholds = async () => {
    try {
      setLoading(true);
      const { data } = await AxiosInstance.get("/households");
      setHouseholds(data);
    } catch (err) {
      console.error("Error fetching households:", err);
      toast.error("Failed to load households");
    } finally {
      setLoading(false);
    }
  };

  const fetchResidents = async () => {
    try {
      const { data } = await axiosInstance.get("/admin/residents");
      setResidents(data);
    } catch (err) {
      console.error("Error fetching residents:", err);
    }
  };

  const fetchAddresses = async () => {
    try {
      const { data } = await axiosInstance.get("/address/addresses");
      setAddresses(data);
    } catch (err) {
      console.error("Error fetching addresses:", err);
    }
  };

  // Toggle expand household
  const toggleExpand = (householdId) => {
    setExpandedHousehold(expandedHousehold === householdId ? null : householdId);
  };

  // Add Household
  const handleAddHousehold = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/households", householdForm);
      toast.success("Household created successfully!");
      setShowAddHouseholdModal(false);
      setHouseholdForm({ address_id: "" });
      fetchHouseholds();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create household");
    }
  };

  // Add Member to Household
  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/household-members", memberForm);
      toast.success("Member added to household!");
      setShowAddMemberModal(false);
      setMemberForm({ household_id: "", resident_id: "", role_in_household: "Other" });
      fetchHouseholds();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add member");
    }
  };

  // Remove Member from Household
  const handleRemoveMember = async (memberId, householdId) => {
    if (!window.confirm("Remove this member from household?")) return;

    try {
      await axiosInstance.delete(`/household-members/${memberId}`);
      toast.success("Member removed from household");
      fetchHouseholds();
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove member");
    }
  };

  // Edit Member - Quick Role Change
  const handleQuickRoleChange = async (memberId, newRole, memberName) => {
    if (!window.confirm(`Change ${memberName}'s role to ${newRole}?`)) return;

    try {
      await AxiosInstance.put(`/household-members/${memberId}`, {
        role_in_household: newRole
      });
      toast.success("Member role updated successfully!");
      fetchHouseholds();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update member");
    }
  };

  // View Household Details
  const handleViewHousehold = (household) => {
    setSelectedHousehold(household);
    setShowViewModal(true);
  };

  // Filter households
  const filteredHouseholds = households.filter(household => {
    const address = household.full_address?.toLowerCase() || "";
    const headName = household.household_head?.toLowerCase() || "";
    return address.includes(searchTerm.toLowerCase()) || 
           headName.includes(searchTerm.toLowerCase());
  });

  // Get role icon and color
  const getRoleStyle = (role) => {
    const styles = {
      Head: { bg: "bg-blue-100", text: "text-blue-700", icon: "👑" },
      Spouse: { bg: "bg-pink-100", text: "text-pink-700", icon: "💑" },
      Child: { bg: "bg-green-100", text: "text-green-700", icon: "👶" },
      Relative: { bg: "bg-purple-100", text: "text-purple-700", icon: "👥" },
      Boarder: { bg: "bg-orange-100", text: "text-orange-700", icon: "🏠" },
      Other: { bg: "bg-gray-100", text: "text-gray-700", icon: "👤" }
    };
    return styles[role] || styles.Other;
  };

  return (
    <div className="w-full px-5 pt-3">
      <LogoCardWrapper>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Home size={32} />
              Household Management
            </h2>
            <p className="text-gray-600 mt-1">Manage household records and family structures</p>
          </div>
          <button
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all"
            onClick={() => setShowAddHouseholdModal(true)}
          >
            <Plus size={18} /> Create Household
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by address or household head..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Households</p>
                <p className="text-3xl font-bold text-blue-700">{households.length}</p>
              </div>
              <Home className="text-blue-400" size={40} />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Total Members</p>
                <p className="text-3xl font-bold text-green-700">
                  {households.reduce((sum, h) => sum + (h.member_count || 0), 0)}
                </p>
              </div>
              <Users className="text-green-400" size={40} />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Avg. Household Size</p>
                <p className="text-3xl font-bold text-purple-700">
                  {households.length > 0 
                    ? (households.reduce((sum, h) => sum + (h.member_count || 0), 0) / households.length).toFixed(1)
                    : 0}
                </p>
              </div>
              <Users className="text-purple-400" size={40} />
            </div>
          </div>
        </div>

        {/* Households List */}
        {loading ? (
          <div className="text-center py-10 text-gray-600">Loading households...</div>
        ) : filteredHouseholds.length === 0 ? (
          <div className="text-center py-10 text-gray-600">
            <Home className="mx-auto mb-4 text-gray-400" size={48} />
            <p>No households found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHouseholds.map((household) => (
              <div
                key={household.id}
                className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all"
              >
                {/* Household Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <button
                      onClick={() => toggleExpand(household.id)}
                      className="p-2 hover:bg-white/50 rounded-lg transition"
                    >
                      {expandedHousehold === household.id ? (
                        <ChevronDown size={24} className="text-blue-600" />
                      ) : (
                        <ChevronRight size={24} className="text-blue-600" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Home className="text-blue-600" size={20} />
                        <h3 className="font-bold text-lg text-gray-800">
                          {household.full_address || "No Address"}
                        </h3>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Users size={16} />
                          {household.member_count || 0} members
                        </span>
                        {household.household_head && (
                          <span className="flex items-center gap-1">
                            👑 <strong>{household.household_head}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
                      onClick={() => handleViewHousehold(household)}
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
                      onClick={() => {
                        setMemberForm({ ...memberForm, household_id: household.id });
                        setShowAddMemberModal(true);
                      }}
                      title="Add Member"
                    >
                      <UserPlus size={18} />
                    </button>
                    <button
                      className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                      onClick={() => {
                        if (window.confirm("Delete this household?")) {
                          // Handle delete
                        }
                      }}
                      title="Delete Household"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Expanded Members List */}
                {expandedHousehold === household.id && (
                  <div className="p-4">
                    {household.members && household.members.length > 0 ? (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <Users size={18} />
                          Household Members
                        </h4>
                        {household.members.map((member) => {
                          const roleStyle = getRoleStyle(member.role_in_household);
                          return (
                            <div
                              key={member.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{roleStyle.icon}</span>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {member.first_name} {member.middle_name} {member.last_name}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${roleStyle.bg} ${roleStyle.text}`}>
                                      {member.role_in_household}
                                    </span>
                                    {member.date_joined && (
                                      <span className="text-xs text-gray-500">
                                        Joined: {new Date(member.date_joined).toLocaleDateString()}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditMemberClick(member)}
                                  className="p-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition"
                                  title="Edit Member"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => handleRemoveMember(member.id, household.id)}
                                  className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
                                  title="Remove Member"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="mx-auto mb-2 text-gray-400" size={32} />
                        <p>No members in this household</p>
                        <button
                          onClick={() => {
                            setMemberForm({ ...memberForm, household_id: household.id });
                            setShowAddMemberModal(true);
                          }}
                          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Add First Member
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </LogoCardWrapper>

      {/* Add Household Modal */}
      {showAddHouseholdModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[500px] shadow-xl">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Home size={24} />
              Create New Household
            </h2>

            <form onSubmit={handleAddHousehold} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Select Address *</label>
                <select
                  value={householdForm.address_id}
                  onChange={(e) => setHouseholdForm({ ...householdForm, address_id: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  required
                >
                  <option value="">-- Select Address --</option>
                  {addresses.map((addr) => (
                    <option key={addr.addr_id} value={addr.addr_id}>
                      {addr.house_number} {addr.street}, {addr.barangay_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                  onClick={() => setShowAddHouseholdModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Create Household
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[500px] shadow-xl">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <UserPlus size={24} />
              Add Household Member
            </h2>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Select Resident *</label>
                <select
                  value={memberForm.resident_id}
                  onChange={(e) => setMemberForm({ ...memberForm, resident_id: e.target.value })}
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

              <div>
                <label className="block mb-1 font-medium">Role in Household *</label>
                <select
                  value={memberForm.role_in_household}
                  onChange={(e) => setMemberForm({ ...memberForm, role_in_household: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  required
                >
                  <option value="Head">Head</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Relative">Relative</option>
                  <option value="Boarder">Boarder</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                  onClick={() => setShowAddMemberModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Household Modal */}
      {showViewModal && selectedHousehold && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[600px] shadow-xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Household Details</h2>

            <div className="space-y-4">
              <div>
                <label className="font-semibold text-gray-700">Address:</label>
                <p className="text-gray-900">{selectedHousehold.full_address}</p>
              </div>

              <div>
                <label className="font-semibold text-gray-700">Total Members:</label>
                <p className="text-gray-900">{selectedHousehold.member_count || 0}</p>
              </div>

              <div>
                <label className="font-semibold text-gray-700">Household Head:</label>
                <p className="text-gray-900">{selectedHousehold.household_head || "Not set"}</p>
              </div>

              <div>
                <label className="font-semibold text-gray-700">Created:</label>
                <p className="text-gray-900">
                  {selectedHousehold.date_created 
                    ? new Date(selectedHousehold.date_created).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="flex justify-end mt-6">
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

      {/* Edit Member Modal */}
      {showEditMemberModal && selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[500px] shadow-xl">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Edit size={24} />
              Edit Household Member
            </h2>

            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Member:</strong> {selectedMember.first_name} {selectedMember.middle_name} {selectedMember.last_name}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Current Role:</strong> {selectedMember.role_in_household}
              </p>
            </div>

            <form onSubmit={handleEditMemberSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">New Role in Household *</label>
                <select
                  value={editMemberForm.role_in_household}
                  onChange={(e) => setEditMemberForm({ ...editMemberForm, role_in_household: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  required
                >
                  <option value="Head">Head</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Relative">Relative</option>
                  <option value="Boarder">Boarder</option>
                  <option value="Other">Other</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Note: Only one Head per household is allowed
                </p>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                  onClick={() => {
                    setShowEditMemberModal(false);
                    setSelectedMember(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700"
                >
                  Update Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}