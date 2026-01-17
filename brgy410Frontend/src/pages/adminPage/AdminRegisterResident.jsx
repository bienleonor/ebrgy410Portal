import { useState, useEffect } from "react";
import { LogoCardWrapper } from "../../components/common/cards/LogoCardWrapper";
import AxiosInstance from "../../utils/AxiosInstance";
import toast from "react-hot-toast";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminRegisterResident() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Dropdown data
  const [barangays, setBarangays] = useState([]);
  const [puroks, setPuroks] = useState([]);

  // 🧍‍♂️ Resident info
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix: "",
    gender: "",
    birth_date: "",
    civil_status: "",
    nationality: "Filipino",
    occupation: "",
    contact_number: "",
    is_voter: false,
  });

  // 🏠 Address info (separate, like ResidentProfilePage)
  const [addressForm, setAddressForm] = useState({
    house_number: "",
    street: "",
    subdivision: "",
    brgy_id: "",
    purok_id: "",
  });

  // Fetch barangays & puroks once
  useEffect(() => {
    const fetchAddressOptions = async () => {
      try {
        const [brgyRes, purokRes] = await Promise.all([
          axiosInstance.get("/address/barangays"),
          axiosInstance.get("/address/purok"),
        ]);
        setBarangays(brgyRes.data);
        setPuroks(purokRes.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load address dropdowns");
      }
    };
    fetchAddressOptions();
  }, []);

  // Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🧾 Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1️⃣ — Clean address data
      const cleanedAddress = {
        house_number: addressForm.house_number || null,
        street: addressForm.street || null,
        subdivision: addressForm.subdivision || null,
        brgy_id: addressForm.brgy_id || null,
        purok_id: addressForm.purok_id || null,
      };

      // Step 2️⃣ — Create address (use same path as ResidentProfilePage)
      const { data: addrData } = await axiosInstance.post(
        "/address/addresses",
        cleanedAddress
      );

      const addressId = addrData.addr_id || addrData.address_id;

      // Step 3️⃣ — Create resident with account
      const payload = {
        username: form.username,
        password: form.password,
        email: form.email,
        first_name: form.first_name || null,
        middle_name: form.middle_name || null,
        last_name: form.last_name || null,
        suffix: form.suffix || null,
        gender: form.gender || null,
        birth_date: form.birth_date || null,
        civil_status: form.civil_status || null,
        nationality: form.nationality || null,
        occupation: form.occupation || null,
        contact_number: form.contact_number || null,
        is_voter: form.is_voter ? 1 : 0,
        address_id: addressId,
      };

      await axiosInstance.post("/admin/register-with-account", payload);

      toast.success("Resident registered successfully!");

      // Step 4️⃣ — Reset form
      setForm({
        username: "",
        password: "",
        email: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        suffix: "",
        gender: "",
        birth_date: "",
        civil_status: "",
        nationality: "Filipino",
        occupation: "",
        contact_number: "",
        is_voter: false,
      });

      setAddressForm({
        house_number: "",
        street: "",
        subdivision: "",
        brgy_id: "",
        purok_id: "",
      });

      // navigate("/admin/residents"); // optional redirect

    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Failed to register resident");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-5 pt-3">
      <LogoCardWrapper>
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <UserPlus size={32} />
            Admin-Assisted Registration
          </h2>
          <p className="text-gray-600 mt-2">
            Register residents who need assistance (elderly, PWD, etc.)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account Information */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Username *</label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                  minLength={3}
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1 font-medium">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6 border-2 border-green-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">First Name *</label>
                <input
                  type="text"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Middle Name</label>
                <input
                  type="text"
                  name="middle_name"
                  value={form.middle_name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Last Name *</label>
                <input
                  type="text"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Suffix</label>
                <input
                  type="text"
                  name="suffix"
                  value={form.suffix}
                  onChange={handleChange}
                  placeholder="Jr, Sr, III, etc."
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Gender *</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Birth Date *</label>
                <input
                  type="date"
                  name="birth_date"
                  value={form.birth_date}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Civil Status *</label>
                <select
                  name="civil_status"
                  value={form.civil_status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="SINGLE">Single</option>
                  <option value="MARRIED">Married</option>
                  <option value="WIDOWED">Widowed</option>
                  <option value="SEPARATED">Separated</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Nationality *</label>
                <input
                  type="text"
                  name="nationality"
                  value={form.nationality}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={form.occupation}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Contact Number *</label>
                <input
                  type="tel"
                  name="contact_number"
                  value={form.contact_number}
                  onChange={handleChange}
                  placeholder="09XXXXXXXXX"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Address Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">House Number *</label>
                <input
                  type="text"
                  name="house_number"
                  value={addressForm.house_number}
                  onChange={handleAddressChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Street *</label>
                <input
                  type="text"
                  name="street"
                  value={addressForm.street}
                  onChange={handleAddressChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Subdivision</label>
                <input
                  type="text"
                  name="subdivision"
                  value={addressForm.subdivision}
                  onChange={handleAddressChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Barangay *</label>
                <select
                  name="brgy_id"
                  value={addressForm.brgy_id}
                  onChange={handleAddressChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                >
                  <option value="">Select Barangay</option>
                  {barangays.map((b) => (
                    <option key={b.brgy_id} value={b.brgy_id}>
                      {b.barangay_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Purok/Sitio</label>
                <select
                  name="purok_id"
                  value={addressForm.purok_id}
                  onChange={handleAddressChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="">None</option>
                  {puroks.map((p) => (
                    <option key={p.purok_id} value={p.purok_id}>
                      {p.purok_name} {p.sitio_name && `- ${p.sitio_name}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Voter Status */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_voter"
                name="is_voter"
                checked={form.is_voter}
                onChange={handleChange}
                className="w-5 h-5 rounded focus:ring-2 focus:ring-yellow-500"
              />
              <label htmlFor="is_voter" className="font-medium text-gray-800 cursor-pointer">
                Registered Voter
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-lg bg-gray-300 hover:bg-gray-400 font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Registering...
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  Register Resident
                </>
              )}
            </button>
          </div>
        </form>
      </LogoCardWrapper>
    </div>
  );
}