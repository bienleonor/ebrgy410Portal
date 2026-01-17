import { useState, useEffect } from "react";
import axiosInstance from "../utils/AxiosInstance";
import TextInput from "../components/common/TextInput";
import PrimaryButton from "../components/common/PrimaryButton";
import toast from "react-hot-toast";
import LogoCardWrapper from "../components/common/cards/LogoCardWrapper";

const PSACensusForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState("");

  // Lookup data
  const [streets, setStreets] = useState([]);
  const [barangays, setBarangays] = useState([]);

  // Form data matching staging_census table
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix: "",
    sex: "",
    birthdate: "",
    birth_city_municipality: "",
    birth_province: "",
    birth_country: "PHILIPPINES",
    nationality: "FILIPINO",
    email: "",
    household_head: false,
    house_number: "",
    street_id: "",
    brgy_id: "1",
    notes: ""
  });

  useEffect(() => {
    const fetchLookupData = async () => {
      try {
        const [streetsRes, barangaysRes] = await Promise.all([
          axiosInstance.get("/address/streets"),
          axiosInstance.get("/address/barangays")
        ]);
        setStreets(streetsRes.data || []);
        setBarangays(barangaysRes.data || []);
      } catch (err) {
        console.error("Error fetching lookup data:", err);
        toast.error("Failed to load form data");
      }
    };

    fetchLookupData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : ["text", "email", "textarea"].includes(type)
          ? value.toUpperCase() // <-- auto-uppercase for text-like fields
          : value,
    }));
  };

  //NO BACKEND CONNECTION YET
  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post("/census/submit", formData);
      
      toast.success("Census form submitted successfully!");
      setSubmissionId(response.data.submission_id);
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to submit census form");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setSubmissionId("");
    setFormData({
      first_name: "",
      middle_name: "",
      last_name: "",
      suffix: "",
      sex: "",
      birthdate: "",
      birth_city_municipality: "",
      birth_province: "",
      birth_country: "",
      nationality: "",
      email: "",
      household_head: false,
      house_number: "",
      street_id: "",
      brgy_id: "",
      notes: ""
    });
  };

  // Success screen after submission
  if (isSubmitted) {
    return (
      <div className="p-5 max-w-4xl mx-auto">
        <LogoCardWrapper className="drop-shadow-xl/50">
          <div className="text-center py-10">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold mb-4 text-green-600">
              Census Form Submitted Successfully!
            </h1>
            <p className="text-gray-600 mb-2">
              Thank you for completing the PSA Census Form.
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Your submission ID: <span className="font-mono font-bold">{submissionId}</span>
            </p>
            <button
              onClick={resetForm}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Submit Another Response
            </button>
          </div>
        </LogoCardWrapper>
      </div>
    );
  }

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <LogoCardWrapper className="drop-shadow-xl/50">
        <h1 className="text-2xl font-bold mb-2">PSA Census Form</h1>
        <p className="text-gray-600 mb-6">
          Please complete this census form accurately. The information provided will be used for verification during the registration process.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Personal Information */}
          <fieldset className="border-2 border-gray-300 rounded-2xl p-5">
            <legend className="text-xl font-semibold px-2 flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm">1</span>
              Personal Information
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
              <TextInput
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
              <TextInput
                label="Middle Name"
                name="middle_name"
                value={formData.middle_name}
                onChange={handleChange}
              />
              <TextInput
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
              <TextInput
                label="Suffix"
                name="suffix"
                value={formData.suffix}
                onChange={handleChange}
                placeholder="Jr., Sr., III, etc."
              />

              <div>
                <label className="block text-sm font-medium mb-1">
                  Sex <span className="text-red-500">*</span>
                </label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">Select Sex</option>
                  <option value="MALE">MALE</option>
                  <option value="FEMALE">FEMALE</option>
                </select>
              </div>

              <TextInput
                label="Birth Date"
                name="birthdate"
                type="date"
                value={formData.birthdate}
                onChange={handleChange}
                required
              />

              <TextInput
                label="Nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                required
              />
            </div>
          </fieldset>

          {/* Section 2: Place of Birth */}
          <fieldset className="border-2 border-gray-300 rounded-2xl p-5">
            <legend className="text-xl font-semibold px-2 flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm">2</span>
              Place of Birth
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
              <TextInput
                label="City/Municipality"
                name="birth_city_municipality"
                value={formData.birth_city_municipality}
                onChange={handleChange}
                required
              />
              <TextInput
                label="Province"
                name="birth_province"
                value={formData.birth_province}
                onChange={handleChange}
                required
              />
              <TextInput
                label="Country"
                name="birth_country"
                value={formData.birth_country}
                onChange={handleChange}
                required
              />
            </div>
          </fieldset>

          {/* Section 3: Contact Information */}
          <fieldset className="border-2 border-gray-300 rounded-2xl p-5">
            <legend className="text-xl font-semibold px-2 flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm">3</span>
              Contact Information
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              <TextInput
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g., juan@email.com"
              />
            </div>
          </fieldset>

          {/* Section 4: Address Information */}
          <fieldset className="border-2 border-gray-300 rounded-2xl p-5">
            <legend className="text-xl font-semibold px-2 flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm">4</span>
              Address Information
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
              <TextInput
                label="House/Unit/Lot Number"
                name="house_number"
                value={formData.house_number}
                onChange={handleChange}
                required
              />

              <div>
                <label className="block text-sm font-medium mb-1">
                  Street <span className="text-red-500">*</span>
                </label>
                <select
                  name="street_id"
                  value={formData.street_id}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">Select Street</option>
                  {streets.map((street) => (
                    <option key={street.street_id} value={street.street_id}>
                      {street.street_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Barangay <span className="text-red-500">*</span>
                </label>
                <select
                  name="brgy_id"
                  value={formData.brgy_id}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">Select Barangay</option>
                  {barangays.map((brgy) => (
                    <option key={brgy.brgy_id} value={brgy.brgy_id}>
                      {brgy.barangay_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          {/* Section 5: Household Information */}
          <fieldset className="border-2 border-gray-300 rounded-2xl p-5">
            <legend className="text-xl font-semibold px-2 flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm">5</span>
              Household Information
            </legend>
            <div className="grid grid-cols-1 gap-4 mt-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="household_head"
                  name="household_head"
                  checked={formData.household_head}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <label htmlFor="household_head" className="text-sm font-medium">
                  I am the Head of Household
                </label>
              </div>
            </div>
          </fieldset>

          {/* Section 6: Additional Notes */}
          <fieldset className="border-2 border-gray-300 rounded-2xl p-5">
            <legend className="text-xl font-semibold px-2 flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm">6</span>
              Additional Notes
            </legend>
            <div className="mt-3">
              <label className="block text-sm font-medium mb-1">
                Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full border rounded px-3 py-2"
                placeholder="Any additional information..."
              />
            </div>
          </fieldset>

          {/* Data Privacy Notice */}
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-5">
            <h3 className="font-semibold text-yellow-800 mb-2">📋 Data Privacy Notice</h3>
            <p className="text-sm text-yellow-700">
              By submitting this form, you consent to the collection, processing, and storage of your personal information in accordance with the Data Privacy Act of 2012 (Republic Act No. 10173). The data collected will be used solely for census purposes and verification during registration.
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <PrimaryButton
              text={isSubmitting ? "Submitting..." : "Submit Census Form"}
              disabled={isSubmitting}
            />
          </div>
        </form>
      </LogoCardWrapper>
    </div>
  );
};

export default PSACensusForm;
