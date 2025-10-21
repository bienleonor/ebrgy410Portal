import DocumentRequestForm from '../../components/resident/DocumentRequestForm';

const DocumentRequestPage = () => {
  const handleFormSubmit = (data) => {
    console.log('Submitting document request:', data);
    // Send request to backend (axios or fetch)
    // e.g., axios.post('/api/document-request', data);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Request Barangay Document</h1>
      <DocumentRequestForm onSubmit={handleFormSubmit} />
    </div>
  );
};

export default DocumentRequestPage;
