import { useState } from "react";
import TextInput from "../components/common/TextInput";
import PrimaryButton from "../components/common/PrimaryButton";
import toast from "react-hot-toast";
import { LogoCardWrapper } from "../components/common/cards/LogoCardWrapper";

const PSACensusForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Personal Information
  const [personalInfo, setPersonalInfo] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix: "",
    gender: "",
    birth_date: "",
    birth_place: "",
    civil_status: "",
    nationality: "",
    religion: "",
    blood_type: "",
  });

  // Contact Information
  const [contactInfo, setContactInfo] = useState({
    contact_number: "",
    email: "",
  });

  // Address Information
  const [addressInfo, setAddressInfo] = useState({
    house_number: "",
    street: "",
    subdivision: "",
    barangay: "",
    municipality: "",
    province: "",
    zip_code: "",
  });

  // Educational & Employment Information
  const [educEmployment, setEducEmployment] = useState({
    highest_education: "",
    occupation: "",
    employment_status: "",
    monthly_income: "",
  });

  // Household Information
  const [householdInfo, setHouseholdInfo] = useState({
    relationship_to_head: "",
    is_household_head: false,
    household_size: "",
  });

  // Voter & ID Information
  const [voterInfo, setVoterInfo] = useState({
    is_registered_voter: false,
    voter_id: "",
    philhealth_member: false,
    philhealth_number: "",
    sss_member: false,
    sss_number: "",
    tin_number: "",
  });

  // Handlers
  const handlePersonalChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPersonalInfo((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEducEmploymentChange = (e) => {
    const { name, value } = e.target;
    setEducEmployment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleHouseholdChange = (e) => {
    const { name, value, type, checked } = e.target;
    setHouseholdInfo((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleVoterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVoterInfo((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Compile all census data
      const censusData = {
        personal_info: {
          ...personalInfo,
          birth_date: personalInfo.birth_date || null,
        },
        contact_info: contactInfo,
        address_info: addressInfo,
        education_employment: educEmployment,
        household_info: householdInfo,
        voter_id_info: voterInfo,
        submitted_at: new Date().toISOString(),
      };

      // For now, just log the data (no backend connection yet)
      console.log("PSA Census Data:", censusData);

      // Simulate submission delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Census form submitted successfully!");
      setIsSubmitted(true);

      // TODO: Connect to separate database for census data
      // await AxiosInstance.post("/census/submit", censusData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit census form");
    } finally {
      setIsSubmitting(false);
    }
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
            <p className="text-gray-600 mb-6">
              Thank you for completing the PSA Census Form. Your data has been recorded and will be used for verification purposes during registration.
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false);
                // Reset all forms
                setPersonalInfo({
                  first_name: "",
                  middle_name: "",
                  last_name: "",
                  suffix: "",
                  gender: "",
                  birth_date: "",
                  birth_place: "",
                  civil_status: "",
                  nationality: "",
                  religion: "",
                  blood_type: "",
                });
                setContactInfo({ contact_number: "", email: "" });
                setAddressInfo({
                  house_number: "",
                  street: "",
                  subdivision: "",
                  barangay: "",
                  municipality: "",
                  province: "",
                  zip_code: "",
                });
                setEducEmployment({
                  highest_education: "",
                  occupation: "",
                  employment_status: "",
                  monthly_income: "",
                });
                setHouseholdInfo({
                  relationship_to_head: "",
                  is_household_head: false,
                  household_size: "",
                });
                setVoterInfo({
                  is_registered_voter: false,
                  voter_id: "",
                  philhealth_member: false,
                  philhealth_number: "",
                  sss_member: false,
                  sss_number: "",
                  tin_number: "",
                });
              }}
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
          <div>
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm">1</span>
              Personal Information
            </h2>
            <div className="bg-white/70 backdrop-blur-lg border-2 border-gray-800/30 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextInput
                label="First Name"
                name="first_name"
                value={personalInfo.first_name}
                onChange={handlePersonalChange}
                required
              />
              <TextInput
                label="Middle Name"
                name="middle_name"
                value={personalInfo.middle_name}
                onChange={handlePersonalChange}
              />
              <TextInput
                label="Last Name"
                name="last_name"
                value={personalInfo.last_name}
                onChange={handlePersonalChange}
                required
              />
              <TextInput
                label="Suffix (Jr., Sr., III, etc.)"
                name="suffix"
                value={personalInfo.suffix}
                onChange={handlePersonalChange}
              />

              <div>
                <label className="block text-sm font-medium mb-1">Gender <span className="text-red-500">*</span></label>
                <select
                  name="gender"
                  value={personalInfo.gender}
                  onChange={handlePersonalChange}
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
                value={personalInfo.birth_date}
                onChange={handlePersonalChange}
                required
              />

              <TextInput
                label="Place of Birth"
                name="birth_place"
                value={personalInfo.birth_place}
                onChange={handlePersonalChange}
                required
              />

              <div>
                <label className="block text-sm font-medium mb-1">Civil Status <span className="text-red-500">*</span></label>
                <select
                  name="civil_status"
                  value={personalInfo.civil_status}
                  onChange={handlePersonalChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">Select Civil Status</option>
                  <option value="SINGLE">Single</option>
                  <option value="MARRIED">Married</option>
                  <option value="WIDOWED">Widowed</option>
                  <option value="SEPARATED">Separated</option>
                  <option value="DIVORCED">Divorced</option>
                  <option value="ANNULLED">Annulled</option>
                </select>
              </div>

              <TextInput
                label="Nationality"
                name="nationality"
                value={personalInfo.nationality}
                onChange={handlePersonalChange}
                required
              />

              <TextInput
                label="Religion"
                name="religion"
                value={personalInfo.religion}
                onChange={handlePersonalChange}
              />

              <div>
                <label className="block text-sm font-medium mb-1">Blood Type</label>
                <select
                  name="blood_type"
                  value={personalInfo.blood_type}
                  onChange={handlePersonalChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select Blood Type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Contact Information */}
          <div>
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm">2</span>
              Contact Information
            </h2>
            <div className="bg-white/70 backdrop-blur-lg border-2 border-gray-800/30 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextInput
                label="Contact Number"
                name="contact_number"
                value={contactInfo.contact_number}
                onChange={handleContactChange}
                placeholder="e.g., 09123456789"
                required
              />
              <TextInput
                label="Email Address"
                name="email"
                type="email"
                value={contactInfo.email}
                onChange={handleContactChange}
                placeholder="e.g., juan@email.com"
              />
            </div>
          </div>

          {/* Section 3: Address Information */}
          <div>
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm">3</span>
              Address Information
            </h2>
            <div className="bg-white/70 backdrop-blur-lg border-2 border-gray-800/30 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextInput
                label="House/Unit/Lot Number"
                name="house_number"
                value={addressInfo.house_number}
                onChange={handleAddressChange}
                required
              />
              <TextInput
                label="Street"
                name="street"
                value={addressInfo.street}
                onChange={handleAddressChange}
                required
              />
              <TextInput
                label="Subdivision/Village"
                name="subdivision"
                value={addressInfo.subdivision}
                onChange={handleAddressChange}
              />
              <TextInput
                label="Barangay"
                name="barangay"
                value={addressInfo.barangay}
                onChange={handleAddressChange}
                required
              />
              <TextInput
                label="Municipality/City"
                name="municipality"
                value={addressInfo.municipality}
                onChange={handleAddressChange}
                required
              />
              <TextInput
                label="Province"
                name="province"
                value={addressInfo.province}
                onChange={handleAddressChange}
                required
              />
              <TextInput
                label="ZIP Code"
                name="zip_code"
                value={addressInfo.zip_code}
                onChange={handleAddressChange}
              />
            </div>
          </div>

          {/* Section 4: Education & Employment */}
          <div>
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm">4</span>
              Education & Employment
            </h2>
            <div className="bg-white/70 backdrop-blur-lg border-2 border-gray-800/30 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Highest Educational Attainment <span className="text-red-500">*</span></label>
                <select
                  name="highest_education"
                  value={educEmployment.highest_education}
                  onChange={handleEducEmploymentChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">Select Education Level</option>
                  <option value="NO_FORMAL_EDUCATION">No Formal Education</option>
                  <option value="ELEMENTARY_UNDERGRADUATE">Elementary Undergraduate</option>
                  <option value="ELEMENTARY_GRADUATE">Elementary Graduate</option>
                  <option value="HIGHSCHOOL_UNDERGRADUATE">High School Undergraduate</option>
                  <option value="HIGHSCHOOL_GRADUATE">High School Graduate</option>
                  <option value="SENIOR_HIGH_UNDERGRADUATE">Senior High Undergraduate</option>
                  <option value="SENIOR_HIGH_GRADUATE">Senior High Graduate</option>
                  <option value="VOCATIONAL">Vocational/Technical</option>
                  <option value="COLLEGE_UNDERGRADUATE">College Undergraduate</option>
                  <option value="COLLEGE_GRADUATE">College Graduate</option>
                  <option value="POST_GRADUATE">Post Graduate (Masters/PhD)</option>
                </select>
              </div>

              <TextInput
                label="Occupation"
                name="occupation"
                value={educEmployment.occupation}
                onChange={handleEducEmploymentChange}
                placeholder="e.g., Teacher, Engineer, Student, N/A"
              />

              <div>
                <label className="block text-sm font-medium mb-1">Employment Status <span className="text-red-500">*</span></label>
                <select
                  name="employment_status"
                  value={educEmployment.employment_status}
                  onChange={handleEducEmploymentChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">Select Employment Status</option>
                  <option value="EMPLOYED">Employed</option>
                  <option value="SELF_EMPLOYED">Self-Employed</option>
                  <option value="UNEMPLOYED">Unemployed</option>
                  <option value="STUDENT">Student</option>
                  <option value="RETIRED">Retired</option>
                  <option value="OFW">OFW (Overseas Filipino Worker)</option>
                  <option value="HOMEMAKER">Homemaker</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Monthly Income (PHP)</label>
                <select
                  name="monthly_income"
                  value={educEmployment.monthly_income}
                  onChange={handleEducEmploymentChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select Income Range</option>
                  <option value="NO_INCOME">No Income</option>
                  <option value="BELOW_10000">Below ₱10,000</option>
                  <option value="10000_20000">₱10,000 - ₱20,000</option>
                  <option value="20001_40000">₱20,001 - ₱40,000</option>
                  <option value="40001_60000">₱40,001 - ₱60,000</option>
                  <option value="60001_100000">₱60,001 - ₱100,000</option>
                  <option value="ABOVE_100000">Above ₱100,000</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 5: Household Information */}
          <div>
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm">5</span>
              Household Information
            </h2>
            <div className="bg-white/70 backdrop-blur-lg border-2 border-gray-800/30 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_household_head"
                  name="is_household_head"
                  checked={householdInfo.is_household_head}
                  onChange={handleHouseholdChange}
                />
                <label htmlFor="is_household_head">I am the Head of Household</label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Relationship to Household Head <span className="text-red-500">*</span></label>
                <select
                  name="relationship_to_head"
                  value={householdInfo.relationship_to_head}
                  onChange={handleHouseholdChange}
                  className="w-full border rounded px-3 py-2"
                  required
                  disabled={householdInfo.is_household_head}
                >
                  <option value="">Select Relationship</option>
                  <option value="HEAD">Head</option>
                  <option value="SPOUSE">Spouse</option>
                  <option value="SON">Son</option>
                  <option value="DAUGHTER">Daughter</option>
                  <option value="FATHER">Father</option>
                  <option value="MOTHER">Mother</option>
                  <option value="BROTHER">Brother</option>
                  <option value="SISTER">Sister</option>
                  <option value="GRANDPARENT">Grandparent</option>
                  <option value="GRANDCHILD">Grandchild</option>
                  <option value="IN_LAW">In-Law</option>
                  <option value="RELATIVE">Other Relative</option>
                  <option value="NON_RELATIVE">Non-Relative</option>
                  <option value="BOARDER">Boarder</option>
                </select>
              </div>

              <TextInput
                label="Number of Household Members"
                name="household_size"
                type="number"
                min="1"
                value={householdInfo.household_size}
                onChange={handleHouseholdChange}
                placeholder="e.g., 5"
                required
              />
            </div>
          </div>

          {/* Section 6: Voter & Government IDs */}
          <div>
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm">6</span>
              Voter Registration & Government IDs
            </h2>
            <div className="bg-white/70 backdrop-blur-lg border-2 border-gray-800/30 rounded-2xl p-5 space-y-4">
              {/* Voter */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_registered_voter"
                    name="is_registered_voter"
                    checked={voterInfo.is_registered_voter}
                    onChange={handleVoterChange}
                  />
                  <label htmlFor="is_registered_voter">Registered Voter</label>
                </div>
                {voterInfo.is_registered_voter && (
                  <TextInput
                    label="Voter's ID Number"
                    name="voter_id"
                    value={voterInfo.voter_id}
                    onChange={handleVoterChange}
                    placeholder="(Optional)"
                  />
                )}
              </div>

              {/* PhilHealth */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="philhealth_member"
                    name="philhealth_member"
                    checked={voterInfo.philhealth_member}
                    onChange={handleVoterChange}
                  />
                  <label htmlFor="philhealth_member">PhilHealth Member</label>
                </div>
                {voterInfo.philhealth_member && (
                  <TextInput
                    label="PhilHealth Number"
                    name="philhealth_number"
                    value={voterInfo.philhealth_number}
                    onChange={handleVoterChange}
                    placeholder="(Optional)"
                  />
                )}
              </div>

              {/* SSS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="sss_member"
                    name="sss_member"
                    checked={voterInfo.sss_member}
                    onChange={handleVoterChange}
                  />
                  <label htmlFor="sss_member">SSS Member</label>
                </div>
                {voterInfo.sss_member && (
                  <TextInput
                    label="SSS Number"
                    name="sss_number"
                    value={voterInfo.sss_number}
                    onChange={handleVoterChange}
                    placeholder="(Optional)"
                  />
                )}
              </div>

              {/* TIN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextInput
                  label="TIN (Tax Identification Number)"
                  name="tin_number"
                  value={voterInfo.tin_number}
                  onChange={handleVoterChange}
                  placeholder="(Optional)"
                />
              </div>
            </div>
          </div>

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
