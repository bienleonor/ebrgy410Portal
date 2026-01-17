import { useEffect, useState } from "react";
import axiosInstance from "../../utils/AxiosInstance";
import TextInput from "../../components/common/TextInput";
import PrimaryButton from "../../components/common/PrimaryButton";
import toast from "react-hot-toast";
import { LogoCardWrapper } from "../../components/common/cards/LogoCardWrapper";

const ResidentProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Resident info
  const [form, setForm] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix: "",
    sex: "",
    birthdate: "",
    birth_city_municipality: "",
    birth_province: "",
    birth_country: "",
    civil_status: "",
    nationality: "",
    email: "",
    contact_number: "",
    occupation: "",
    religion: "",
    ethnic: false,
    ethnicity: "",
    blood_type_id: "",
    educ_attain_id: "",
    income_range_id: "",
    health_conditions: "",
    is_househead: false,
    pwd: false,
    senior_citizen: false,
    registered_voter: false,
    voter_num: "",
    philhealth_mem: false,
    philhealth_num: "",
    sss_mem: false,
    sss_num: "",
    tin_num: "",
  });

  // Address info
  const [addressForm, setAddressForm] = useState({
    house_number: "",
    street_id: "",
    subdivision: "",
    brgy_id: "",
    purok_id: "",
  });

  const [barangays, setBarangays] = useState([]);
  const [puroks, setPuroks] = useState([]);
  const [streets, setStreets] = useState([]);
  const [bloodTypes, setBloodTypes] = useState([]);
  const [educationLevels, setEducationLevels] = useState([]);
  const [incomeRanges, setIncomeRanges] = useState([]);
  const [civilStatusOptions, setCivilStatusOptions] = useState([]);

  // 📌 Fetch dropdown options once
  useEffect(() => {
    const fetchAddressOptions = async () => {
      try {
        const [brgyRes, purokRes, streetRes, bloodRes, educRes, incomeRes, civilRes] = await Promise.all([
          axiosInstance.get("/address/barangays"),
          axiosInstance.get("/address/purok"),
          axiosInstance.get("/address/streets"),
          axiosInstance.get("/lookup/blood-types"),
          axiosInstance.get("/lookup/education-attainments"),
          axiosInstance.get("/lookup/income-ranges"),
          axiosInstance.get("/lookup/civil-status-options"),
        ]);
        setBarangays(brgyRes.data);
        setPuroks(purokRes.data);
        setStreets(streetRes.data);
        setBloodTypes(bloodRes.data);
        setEducationLevels(educRes.data);
        setIncomeRanges(incomeRes.data);
        
        // Handle civil status - might be nested or direct array
        const civilData = Array.isArray(civilRes.data) ? civilRes.data : (civilRes.data?.data || []);
        console.log("Civil Status Data:", civilData);
        setCivilStatusOptions(civilData);
      } catch (err) {
        console.error("Error loading dropdowns:", err);
        toast.error("Failed to load address dropdowns");
      }
    };
    fetchAddressOptions();
  }, []);

  // 📌 Fetch profile & prefill form
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axiosInstance.get("/residents/profile/me");
        setProfile(data);
        setForm((prev) => ({
          ...prev,
          ...data,
          registered_voter: data.registered_voter === 1 || data.registered_voter === true,
          is_househead: data.is_househead === 1 || data.is_househead === true,
          pwd: data.pwd === 1 || data.pwd === true,
          senior_citizen: data.senior_citizen === 1 || data.senior_citizen === true,
          ethnic: data.ethnic === 1 || data.ethnic === true,
          philhealth_mem: data.philhealth_mem === 1 || data.philhealth_mem === true,
          sss_mem: data.sss_mem === 1 || data.sss_mem === true,
        }));

        if (data.addr_id) {
          const { data: addressData } = await axiosInstance.get(
            `/address/addresses/${data.addr_id}`
          );
          setAddressForm({
            house_number: addressData.house_number || "",
            street_id: addressData.street_id || "",
            subdivision: addressData.subdivision || "",
            brgy_id: addressData.brgy_id || "",
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
        street_id: addressForm.street_id || null,
        subdivision: addressForm.subdivision || null,
        brgy_id: addressForm.brgy_id || null,
        purok_id: addressForm.purok_id || null,
      };

      // 2️⃣ Find existing address or create new one (prevents duplicates)
      const { data: addrData } = await axiosInstance.post("/address/addresses/find-or-create", cleanedAddress);
      const addr_id = addrData.addr_id;

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
        await axiosInstance.put("/residents/profile", payload);
        toast.success("Profile updated successfully!");
      } else {
        await axiosInstance.post("/residents/profile", payload);
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
          <h2 className="text-xl font-semibold">Personal Information</h2>
          <div className="bg-white/70 backdrop-blur-lg border-2 border-gray-800/30 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput label="First Name" name="first_name" value={form.first_name} onChange={handleChange} required disabled />
            <TextInput label="Middle Name" name="middle_name" value={form.middle_name} onChange={handleChange} disabled />
            <TextInput label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} required disabled />
            <TextInput label="Suffix" name="suffix" value={form.suffix} onChange={handleChange} disabled />
            <TextInput label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
          </div>

          <h2 className="text-xl font-semibold mt-4">Birth Information</h2>
          <div className="bg-white/70 backdrop-blur-lg border-2 border-gray-800/30 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Sex</label>
              <select
                name="sex"
                value={form.sex}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
                disabled
              >
                <option value="">Select Sex</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>

            <TextInput
              label="Birth Date"
              name="birthdate"
              type="date"
              value={form.birthdate ? form.birthdate.split("T")[0] : ""}
              onChange={handleChange}
              required
              disabled
            />

            <TextInput label="Birth City/Municipality" name="birth_city_municipality" value={form.birth_city_municipality} onChange={handleChange} disabled />
            <TextInput label="Birth Province" name="birth_province" value={form.birth_province} onChange={handleChange} disabled />
            <TextInput label="Birth Country" name="birth_country" value={form.birth_country} onChange={handleChange} disabled />
          </div>

          <h2 className="text-xl font-semibold mt-4">Personal Details</h2>
          <div className="bg-white/70 backdrop-blur-lg border-2 border-gray-800/30 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Civil Status</label>
              <select
                name="civil_status"
                value={form.civil_status || ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Civil Status</option>
                {Array.isArray(civilStatusOptions) && civilStatusOptions.map((cs) => (
                  <option key={cs.stat_id} value={cs.stat_id}>
                    {cs.status_name}
                  </option>
                ))}
              </select>
            </div>
            <TextInput label="Nationality" name="nationality" value={form.nationality} onChange={handleChange} disabled />
            <TextInput label="Religion" name="religion" value={form.religion} onChange={handleChange} />
            <TextInput label="Ethnicity" name="ethnicity" value={form.ethnicity} onChange={handleChange} />
            
            <div>
              <label className="block text-sm font-medium mb-1">Blood Type</label>
              <select
                name="blood_type_id"
                value={form.blood_type_id || ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Blood Type</option>
                {bloodTypes.map((bt) => (
                  <option key={bt.blood_type_id} value={bt.blood_type_id}>
                    {bt.blood_type_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Education Level</label>
              <select
                name="educ_attain_id"
                value={form.educ_attain_id || ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Education Level</option>
                {educationLevels.map((ed) => (
                  <option key={ed.educ_attain_id} value={ed.educ_attain_id}>
                    {ed.educ_attain}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="ethnic" name="ethnic" checked={form.ethnic} onChange={handleChange} />
              <label htmlFor="ethnic">Member of Ethnic Group</label>
            </div>
          </div>

          <h2 className="text-xl font-semibold mt-4">Employment & Income</h2>
          <div className="bg-white/70 backdrop-blur-lg border-2 border-gray-800/30 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput label="Occupation" name="occupation" value={form.occupation} onChange={handleChange} />
            
            <div>
              <label className="block text-sm font-medium mb-1">Income Range</label>
              <select
                name="income_range_id"
                value={form.income_range_id || ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Income Range</option>
                {incomeRanges.map((ir) => (
                  <option key={ir.income_range_id} value={ir.income_range_id}>
                    {ir.income_range}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <h2 className="text-xl font-semibold mt-4">Contact Information</h2>
          <div className="bg-white/70 backdrop-blur-lg border-2 border-gray-800/30 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput label="Contact Number" name="contact_number" value={form.contact_number} onChange={handleChange} />
            <TextInput label="Health Conditions" name="health_conditions" value={form.health_conditions} onChange={handleChange} />
          </div>

          <h2 className="text-xl font-semibold mt-4">Government IDs & Benefits</h2>
          <div className="bg-white/70 backdrop-blur-lg border-2 border-gray-800/30 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="philhealth_mem" name="philhealth_mem" checked={form.philhealth_mem} onChange={handleChange} />
              <label htmlFor="philhealth_mem">PhilHealth Member</label>
            </div>
            <TextInput label="PhilHealth Number" name="philhealth_num" value={form.philhealth_num} onChange={handleChange} disabled={!form.philhealth_mem} />

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="sss_mem" name="sss_mem" checked={form.sss_mem} onChange={handleChange} />
              <label htmlFor="sss_mem">SSS Member</label>
            </div>
            <TextInput label="SSS Number" name="sss_num" value={form.sss_num} onChange={handleChange} disabled={!form.sss_mem} />

            <TextInput label="TIN Number" name="tin_num" value={form.tin_num} onChange={handleChange} className="col-span-2" />
          </div>

          <h2 className="text-xl font-semibold mt-4">Household & Voter Information</h2>
          <div className="bg-white/70 backdrop-blur-lg border-2 border-gray-800/30 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="is_househead" name="is_househead" checked={form.is_househead} onChange={handleChange} disabled />
              <label htmlFor="is_househead">Household Head</label>
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="pwd" name="pwd" checked={form.pwd} onChange={handleChange} />
              <label htmlFor="pwd">Person with Disability (PWD)</label>
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="senior_citizen" name="senior_citizen" checked={form.senior_citizen} onChange={handleChange} />
              <label htmlFor="senior_citizen">Senior Citizen</label>
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="registered_voter" name="registered_voter" checked={form.registered_voter} onChange={handleChange} />
              <label htmlFor="registered_voter">Registered Voter</label>
            </div>

            <TextInput label="Voter Number" name="voter_num" value={form.voter_num} onChange={handleChange} disabled={!form.registered_voter} className="col-span-2" />
          </div>

          {/* Address Section */}
          <h2 className="text-xl font-semibold mt-6 mb-2">Address Information</h2>
          <div className="bg-white/70 backdrop-blur-lg border-2 border-gray-800/30 rounded-2xl p-5  grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput label="House Number" name="house_number" value={addressForm.house_number} onChange={handleAddressChange} required />
            
            <div>
              <label className="block text-sm font-medium mb-1">Street</label>
              <select
                name="street_id"
                value={addressForm.street_id || ""}
                onChange={handleAddressChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">Select Street</option>
                {streets.map((s) => (
                  <option key={s.street_id} value={s.street_id}>
                    {s.street_name}
                  </option>
                ))}
              </select>
            </div>

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
