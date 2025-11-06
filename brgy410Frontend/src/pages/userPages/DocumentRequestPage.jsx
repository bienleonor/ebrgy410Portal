import { LogoCardWrapper } from "../../components/common/cards/LogoCardWrapper";
import DocumentRequestForm from "../../components/resident/DocumentRequestForm";
import axiosInstance from "../../utils/AxiosInstance";
import toast from "react-hot-toast";

const DocumentRequestPage = () => {
  const handleFormSubmit = async (formData) => {
    try {
      const res = await axiosInstance.post("/certificates/request", formData);
      toast.success(`Request submitted! Control # ${res.data.control_number}`);
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error(error.response?.data?.message || "Submission failed.");
    }
  };

  return (
    <div className="w-full px-5 pt-3">
      <LogoCardWrapper>
        <h1 className="text-4xl font-bold mb-6 text-center">
          Request Barangay Document
        </h1>
        <DocumentRequestForm onSubmit={handleFormSubmit} />
      </LogoCardWrapper>
    </div>
  );
};

export default DocumentRequestPage;