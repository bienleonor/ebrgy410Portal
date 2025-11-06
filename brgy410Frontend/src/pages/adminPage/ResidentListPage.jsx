import { useState, useEffect } from "react";
import { LogoCardWrapper } from "../../components/common/cards/LogoCardWrapper";
import { Eye, Edit, Trash2, UserPlus } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-hot-toast";

export default function ResidentListPage() {
  const [residents, setResidents] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  // Fetch residents
  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const { data } = await axiosInstance.get("/residents");
        setResidents(data);
        setFiltered(data);
      } catch (err) {
        console.error("Error fetching residents:", err);
        toast.error("Failed to load residents");
      }
    };
    fetchResidents();
  }, []);

  // Filter by search keyword
  useEffect(() => {
    const result = residents.filter((res) =>
      `${res.first_name} ${res.last_name}`.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, residents]);

  return (
    <div className="w-full px-5 pt-3">
      <LogoCardWrapper>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-gray-800">Resident Records</h2>
          <button
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all"
            onClick={() => toast("Add new resident clicked")}
          >
            <UserPlus size={18} /> Add Resident
          </button>
        </div>

        {/* 🔍 Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 📋 Table */}
        <div className="overflow-x-auto rounded-2xl shadow-sm border border-gray-200 bg-white">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3 font-bold text-gray-700">#</th>
                <th className="text-left p-3 font-bold text-gray-700">Full Name</th>
                <th className="text-left p-3 font-bold text-gray-700">Gender</th>
                <th className="text-left p-3 font-bold text-gray-700">Address</th>
                <th className="text-left p-3 font-bold text-gray-700">Contact</th>
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
                    <td className="p-3 text-gray-700">{res.address_name || "—"}</td>
                    <td className="p-3 text-gray-700">{res.contact_number || "—"}</td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
                          onClick={() => toast(`Viewing ${res.first_name}`)}
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="p-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                          onClick={() => toast(`Editing ${res.first_name}`)}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                          onClick={() => toast(`Deleting ${res.first_name}`)}
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
    </div>
  );
}
