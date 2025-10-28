import { useEffect, useState } from "react";
import AxiosInstance from "../../utils/AxiosInstance";
import TextInput from "../../components/common/TextInput";
import PrimaryButton from "../../components/common/PrimaryButton";
import toast from "react-hot-toast";
import { LogoCardWrapper } from "../../components/common/LogoCardWrapper";

const ResidentProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Resident info
  const [form, setForm] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix: "",
    gender: "",
    birth_date: "",
    civil_status: "",
    nationality: "",
    occupation: "",
    contact_number: "",
    is_voter: false,
  });

  // Address info
  const [addressForm, setAddressForm] = useState({
    house_number: "",
    street: "",
    subdivision: "",
    brgy_id: "",
    purok_id: "",
  });

  const [barangays, setBarangays] = useState([]);
  const [puroks, setPuroks] = useState([]);

  // 📌 Fetch dropdown options once
  useEffect(() => {
    const fetchAddressOptions = async () => {
      try {
        const [brgyRes, purokRes] = await Promise.all([
          AxiosInstance.get("/address/barangays"),
          AxiosInstance.get("/address/purok"),
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

  // 📌 Fetch profile & prefill form
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await AxiosInstance.get("/residents/profile/me");
        setProfile(data);
        setForm((prev) => ({
          ...prev,
          ...data,
          is_voter: data.is_voter === 1 || data.is_voter === true,
        }));

        if (data.address_id) {
          const { data: addressData } = await AxiosInstance.get(
            `/address/addresses/${data.address_id}`
          );
          setAddressForm({
            house_number: addressData.house_number,
            street: addressData.street,
            subdivision: addressData.subdivision || "",
            brgy_id: addressData.brgy_id,
            purok_id: addressData.purok_id || "",
          });
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setProfile(null); // no profile yet
        } else {
          console.error(err);
          toast.error("Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
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

  // 📌 Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1️⃣ Normalize address fields
      const cleanedAddress = {
        house_number: addressForm.house_number || null,
        street: addressForm.street || null,
        subdivision: addressForm.subdivision || null,
        brgy_id: addressForm.brgy_id || null,
        purok_id: addressForm.purok_id || null,
      };

      // 2️⃣ Create or update address
      let addr_id;
      if (profile && profile.address_id) {
        await AxiosInstance.put(`/address/addresses/${profile.address_id}`, cleanedAddress);
        addr_id = profile.address_id;
      } else {
        const { data: addrData } = await AxiosInstance.post("/address/addresses", cleanedAddress);
        addr_id = addrData.addr_id;
      }

      // 3️⃣ Normalize resident form fields
      const payload = {
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
        is_voter: form.is_voter ?? false, // preserve false, convert undefined to false
        address_id: addr_id,
      };

      // 4️⃣ Create or update resident profile
      if (profile) {
        await AxiosInstance.put("/residents/profile", payload);
        toast.success("Profile updated successfully!");
      } else {
        await AxiosInstance.post("/residents/profile", payload);
        toast.success("Profile created successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save profile");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // 📌 FORM
  return (
    <div className="p-5 max-w-4xl mx-auto">
      <LogoCardWrapper className="drop-shadow-xl/50">
        <h1 className="text-2xl font-bold mb-6">
          {profile ? "Edit Resident Profile" : "Complete Your Profile"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div className="bg-white/70 backdrop-blur-lg border-2 border-gray-800/30 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput label="First Name" name="first_name" value={form.first_name} onChange={handleChange} required />
            <TextInput label="Middle Name" name="middle_name" value={form.middle_name} onChange={handleChange} />
            <TextInput label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} required />
            <TextInput label="Suffix" name="suffix" value={form.suffix} onChange={handleChange} />
          </div>

          <div className="bg-white/70 backdrop-blur-lg border-2 border-gray-800/30 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>

            <TextInput
              label="Birth Date"
              name="birth_date"
              type="date"
              value={form.birth_date ? form.birth_date.split("T")[0] : ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="bg-white/70 backdrop-blur-lg border-2 border-gray-800/30 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput label="Civil Status" name="civil_status" value={form.civil_status} onChange={handleChange} required />
            <TextInput label="Nationality" name="nationality" value={form.nationality} onChange={handleChange} required />
          </div>
          <div className="bg-white/70 backdrop-blur-lg border-2 border-gray-800/30 rounded-2xl p-5 ">
            <TextInput label="Occupation" name="occupation" value={form.occupation} onChange={handleChange} />
            <TextInput label="Contact Number" name="contact_number" value={form.contact_number} onChange={handleChange} required />
          </div>

          <div className="rounded-2xl px-5 pb-5 flex items-center space-x-2">
            <input type="checkbox" id="is_voter" name="is_voter" checked={form.is_voter} onChange={handleChange} />
            <label htmlFor="is_voter">Registered Voter</label>
          </div>

          {/* Address Section */}
          <h2 className="text-xl font-semibold mt-6 mb-2">Address Information</h2>
          <div className="bg-white/70 backdrop-blur-lg border-2 border-gray-800/30 rounded-2xl p-5  grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput label="House Number" name="house_number" value={addressForm.house_number} onChange={handleAddressChange} required />
            <TextInput label="Street" name="street" value={addressForm.street} onChange={handleAddressChange} required />
            <TextInput label="Subdivision" name="subdivision" value={addressForm.subdivision} onChange={handleAddressChange} />

            <div>
              <label className="block text-sm font-medium mb-1">Barangay</label>
              <select
                name="brgy_id"
                value={addressForm.brgy_id}
                onChange={handleAddressChange}
                className="w-full border rounded px-3 py-2"
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
              <label className="block text-sm font-medium mb-1">Purok / Sitio</label>
              <select
                name="purok_id"
                value={addressForm.purok_id || ""}
                onChange={handleAddressChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">None</option>
                {puroks.map((p) => (
                  <option key={p.purok_id} value={p.purok_id}>
                    {p.purok_name} {p.sitio_name ? `- ${p.sitio_name}` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <PrimaryButton text={profile ? "Update Profile" : "Save Profile"} />
        </form>
    </LogoCardWrapper>
    </div>
  );
};

export default ResidentProfilePage;
