import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/AxiosInstance";
import LogoCardWrapper from "../../components/common/cards/LogoCardWrapper";
import TextInput from "../../components/common/TextInput";
import PrimaryButton from "../../components/common/PrimaryButton";

const VerifiedResidentForm = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Lookup data
  const [streets, setStreets] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [bloodTypes, setBloodTypes] = useState([]);
  const [educAttainments, setEducAttainments] = useState([]);
  const [incomeRanges, setIncomeRanges] = useState([]);

  const [formData, setFormData] = useState({
    verified_id: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix: "",
    sex: "",
    birthdate: "",
    nationality: "",
    email: "",
    civil_status: "",
    is_househead: false,
    verified_by: "",
    verified_date: "",
    record_status: "",
    addr_id: "",
    // Address display fields
    address_no: "",
    street_name: "",
    barangay_name: "",
    nickname: "",
    blood_type_id: "",
    blood_type_name: "",
    contact_number: "",
    religion: "",
    ethnic: "",
    ethnicity: "",
    educ_attain_id: "",
    educ_attain_name: "",
    occupation: "",
    income_range_id: "",
    income_range_name: "",
    health_conditions: "",
    pwd: false,
    senior_citizen: false,
    registered_voter: false,
    voter_num: "",
    philhealth_mem: false,
    philhealth_num: "",
    sss_mem: false,
    sss_num: "",
    tin_num: "",
    date_created: "",
    date_updated: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch lookup data in parallel
        const [streetsRes, barangaysRes, bloodTypesRes, educRes, incomeRes] =
          await Promise.all([
            axiosInstance.get("/address/streets"),
            axiosInstance.get("/address/barangays"),
            axiosInstance.get("/lookup/blood-types"),
            axiosInstance.get("/lookup/education-attainments"),
            axiosInstance.get("/lookup/income-ranges"),
          ]);

        setStreets(streetsRes.data || []);
        setBarangays(barangaysRes.data || []);
        setBloodTypes(bloodTypesRes.data || []);
        setEducAttainments(educRes.data || []);
        setIncomeRanges(incomeRes.data || []);

        // Fetch verified resident data if ID provided
        if (id) {
          const residentRes = await axiosInstance.get(
            `/verified-resident/${id}`
          );
          if (residentRes.data) {
            setFormData((prev) => ({
              ...prev,
              ...residentRes.data,
              birthdate: residentRes.data.birthdate
                ? residentRes.data.birthdate.split("T")[0]
                : "",
              verified_date: residentRes.data.verified_date
                ? residentRes.data.verified_date.split("T")[0]
                : "",
              date_created: residentRes.data.date_created
                ? new Date(residentRes.data.date_created).toLocaleString()
                : "",
              date_updated: residentRes.data.date_updated
                ? new Date(residentRes.data.date_updated).toLocaleString()
                : "",
            }));
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load resident data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Allow all editable fields to be changed
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      // Update all editable fields (not from staging_census)
      await axiosInstance.patch(`/verified-resident/${id}`, {
        email: formData.email,
        is_househead: formData.is_househead,
        civil_status: formData.civil_status,
        nickname: formData.nickname,
        blood_type_id: formData.blood_type_id || null,
        contact_number: formData.contact_number,
        religion: formData.religion,
        ethnic: formData.ethnic,
        ethnicity: formData.ethnicity,
        educ_attain_id: formData.educ_attain_id || null,
        occupation: formData.occupation,
        income_range_id: formData.income_range_id || null,
        health_conditions: formData.health_conditions,
        pwd: formData.pwd,
        senior_citizen: formData.senior_citizen,
        registered_voter: formData.registered_voter,
        voter_num: formData.voter_num,
        philhealth_mem: formData.philhealth_mem,
        philhealth_num: formData.philhealth_num,
        sss_mem: formData.sss_mem,
        sss_num: formData.sss_num,
        tin_num: formData.tin_num,
      });
      setSuccess("Profile updated successfully");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <LogoCardWrapper>
        <div className="text-center py-8">
          <p className="text-gray-600">Loading verified resident data...</p>
        </div>
      </LogoCardWrapper>
    );
  }

  return (
    <div className="w-full px-5 pt-3">
      <LogoCardWrapper>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            Resident Profile
          </h1>
          <p className="text-sm text-gray-500 text-center mt-1">
            Fields from census are read-only • Additional details are editable
          </p>
          <div className="flex justify-center gap-4 mt-2 text-xs">
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
              Status: {formData.record_status || "Active"}
            </span>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
              Verified: {formatDate(formData.verified_date)}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Personal Information */}
          <fieldset className="border border-gray-300 rounded-lg p-4">
            <legend className="text-lg font-semibold text-gray-700 px-2">
              Section 1: Personal Information
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <TextInput
                label="First Name"
                name="first_name"
                value={formData.first_name}
                disabled
              />
              <TextInput
                label="Middle Name"
                name="middle_name"
                value={formData.middle_name}
                disabled
              />
              <TextInput
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                disabled
              />
              <TextInput
                label="Suffix"
                name="suffix"
                value={formData.suffix}
                disabled
              />
              <TextInput
                label="Nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sex
                </label>
                <select
                  name="sex"
                  value={formData.sex}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                >
                  <option value="">-</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <TextInput
                label="Birthdate"
                name="birthdate"
                type="date"
                value={formData.birthdate}
                disabled
              />
              <TextInput
                label="Nationality"
                name="nationality"
                value={formData.nationality}
                disabled
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Civil Status
                </label>
                <select
                  name="civil_status"
                  value={formData.civil_status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">-</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Separated">Separated</option>
                  <option value="Divorced">Divorced</option>
                </select>
              </div>
              <TextInput
                label="Religion"
                name="religion"
                value={formData.religion}
                onChange={handleChange}
              />
              <TextInput
                label="Ethnic Group"
                name="ethnic"
                value={formData.ethnic}
                onChange={handleChange}
              />
              <TextInput
                label="Ethnicity"
                name="ethnicity"
                value={formData.ethnicity}
                onChange={handleChange}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blood Type
                </label>
                <select
                  name="blood_type_id"
                  value={formData.blood_type_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">-</option>
                  {bloodTypes.map((bt) => (
                    <option key={bt.blood_type_id} value={bt.blood_type_id}>
                      {bt.blood_type_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          {/* Section 2: Contact Information */}
          <fieldset className="border border-gray-300 rounded-lg p-4">
            <legend className="text-lg font-semibold text-gray-700 px-2">
              Section 2: Contact Information
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              <TextInput
                label="Contact Number"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
              />
            </div>
          </fieldset>

          {/* Section 3: Address Information */}
          <fieldset className="border border-gray-300 rounded-lg p-4">
            <legend className="text-lg font-semibold text-gray-700 px-2">
              Section 3: Address Information
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextInput
                label="Address/House No."
                name="address_no"
                value={formData.address_no}
                disabled
              />
              <TextInput
                label="Street"
                name="street_name"
                value={formData.street_name}
                disabled
              />
              <TextInput
                label="Barangay"
                name="barangay_name"
                value={formData.barangay_name}
                disabled
              />
            </div>
          </fieldset>

          {/* Section 4: Household Information */}
          <fieldset className="border border-gray-300 rounded-lg p-4">
            <legend className="text-lg font-semibold text-gray-700 px-2">
              Section 4: Household Information
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_househead"
                  checked={formData.is_househead}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label className="text-sm font-medium text-gray-700">
                  Household Head
                </label>
              </div>
            </div>
          </fieldset>

          {/* Section 5: Education & Employment */}
          <fieldset className="border border-gray-300 rounded-lg p-4">
            <legend className="text-lg font-semibold text-gray-700 px-2">
              Section 5: Education & Employment
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Educational Attainment
                </label>
                <select
                  name="educ_attain_id"
                  value={formData.educ_attain_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">-</option>
                  {educAttainments.map((ea) => (
                    <option key={ea.educ_attain_id} value={ea.educ_attain_id}>
                      {ea.educ_attain}
                    </option>
                  ))}
                </select>
              </div>
              <TextInput
                label="Occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Income Range
                </label>
                <select
                  name="income_range_id"
                  value={formData.income_range_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">-</option>
                  {incomeRanges.map((ir) => (
                    <option key={ir.income_range_id} value={ir.income_range_id}>
                      {ir.income_range}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          {/* Section 6: Health Information */}
          <fieldset className="border border-gray-300 rounded-lg p-4">
            <legend className="text-lg font-semibold text-gray-700 px-2">
              Section 6: Health Information
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Health Conditions
                </label>
                <textarea
                  name="health_conditions"
                  value={formData.health_conditions}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="pwd"
                    checked={formData.pwd}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    PWD
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="senior_citizen"
                    checked={formData.senior_citizen}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Senior Citizen
                  </label>
                </div>
              </div>
            </div>
          </fieldset>

          {/* Section 7: Voter & Government IDs */}
          <fieldset className="border border-gray-300 rounded-lg p-4">
            <legend className="text-lg font-semibold text-gray-700 px-2">
              Section 7: Voter & Government IDs
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="registered_voter"
                  checked={formData.registered_voter}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label className="text-sm font-medium text-gray-700">
                  Registered Voter
                </label>
              </div>
              <TextInput
                label="Voter ID Number"
                name="voter_num"
                value={formData.voter_num}
                onChange={handleChange}
              />
              <div></div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="philhealth_mem"
                  checked={formData.philhealth_mem}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label className="text-sm font-medium text-gray-700">
                  PhilHealth Member
                </label>
              </div>
              <TextInput
                label="PhilHealth Number"
                name="philhealth_num"
                value={formData.philhealth_num}
                onChange={handleChange}
              />
              <div></div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="sss_mem"
                  checked={formData.sss_mem}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label className="text-sm font-medium text-gray-700">
                  SSS Member
                </label>
              </div>
              <TextInput
                label="SSS Number"
                name="sss_num"
                value={formData.sss_num}
                onChange={handleChange}
              />
              <TextInput
                label="TIN Number"
                name="tin_num"
                value={formData.tin_num}
                onChange={handleChange}
              />
            </div>
          </fieldset>

          {/* Section 8: Verification & Audit */}
          {/* <fieldset className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <legend className="text-lg font-semibold text-gray-700 px-2">
              Section 8: Verification & Audit Trail
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Verified ID
                </label>
                <p className="text-sm text-gray-700 font-mono bg-white px-3 py-2 rounded border">
                  {formData.verified_id || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Verified By
                </label>
                <p className="text-sm text-gray-700 bg-white px-3 py-2 rounded border">
                  {formData.verified_by || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Verified Date
                </label>
                <p className="text-sm text-gray-700 bg-white px-3 py-2 rounded border">
                  {formatDate(formData.verified_date)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Record Status
                </label>
                <p className="text-sm text-gray-700 bg-white px-3 py-2 rounded border">
                  {formData.record_status || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Date Created
                </label>
                <p className="text-sm text-gray-700 bg-white px-3 py-2 rounded border">
                  {formData.date_created || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Last Updated
                </label>
                <p className="text-sm text-gray-700 bg-white px-3 py-2 rounded border">
                  {formData.date_updated || "N/A"}
                </p>
              </div>
            </div>
          </fieldset> */}

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-4">
            <PrimaryButton
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {saving ? "Saving..." : "Update Profile"}
            </PrimaryButton>
          </div>
        </form>
      </LogoCardWrapper>
    </div>
  );
};

export default VerifiedResidentForm;
