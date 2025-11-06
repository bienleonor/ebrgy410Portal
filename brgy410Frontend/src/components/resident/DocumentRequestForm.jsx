import { useState, useEffect } from "react";
import axiosInstance from "../../utils/AxiosInstance";
import { PURPOSE_OPTIONS } from "../../data/constant";
import PrimaryButton from "../common/PrimaryButton";

const DocumentRequestForm = ({ onSubmit }) => {
  const [certificateTypes, setCertificateTypes] = useState([]);
  const [certificateTypeId, setCertificateTypeId] = useState("");
  const [purpose, setPurpose] = useState("");
  const [otherPurpose, setOtherPurpose] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchCertificateTypes = async () => {
      try {
        const res = await axiosInstance.get("/certificates/types");
        setCertificateTypes(res.data);
      } catch (err) {
        console.error("Failed to load certificate types:", err);
      }
    };
    fetchCertificateTypes();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalPurpose = purpose === "Others" ? otherPurpose : purpose;
    onSubmit({ certificate_type_id: certificateTypeId, purpose: finalPurpose, quantity });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full p-4 rounded-xl space-y-4">
      {/* Certificate Type */}
      <div className="flex items-baseline bg-DocReq-Pink rounded-4xl">
        <label className="block mb-1 font-medium pl-7">Type of Document</label>
        <select
          value={certificateTypeId}
          onChange={(e) => setCertificateTypeId(e.target.value)}
          required
          className="w-200 border px-3 py-2 ml-auto rounded-4xl h-15 bg-white text-black/70"
        >
          <option value="">-- Select Type --</option>
          {certificateTypes.map((type) => (
            <option key={type.cert_type_id} value={type.cert_type_id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      {/* Quantity */}
      <div className="flex items-baseline bg-DocReq-Pink rounded-4xl">
        <label className="block mb-1 font-medium pl-7">Quantity</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
          className="w-200 border px-3 py-2 ml-auto rounded-4xl h-15 bg-white text-black/70"
        />
      </div>

      {/* Purpose */}
      <div className="flex items-baseline bg-DocReq-Pink rounded-4xl">
        <label className="block mb-1 font-medium pl-7">Purpose</label>
        <select
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          required
          className="w-200 border px-3 py-2 ml-auto rounded-4xl h-15 bg-white text-black/70"
        >
          <option value="">-- Select Purpose --</option>
          {PURPOSE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* Other Purpose */}
      {purpose === "Others" && (
        <div className="flex items-baseline bg-DocReq-Pink rounded-4xl">
          <label className="block mb-1 font-medium pl-7">Please specify</label>
          <input
            type="text"
            value={otherPurpose}
            onChange={(e) => setOtherPurpose(e.target.value)}
            className="w-200 border px-3 py-2 ml-auto rounded-4xl h-15 bg-white text-black/70"
            placeholder="Enter other purpose"
            required
          />
        </div>
      )}

      <PrimaryButton type="submit" text="Submit Request" />
    </form>
  );
};

export default DocumentRequestForm;