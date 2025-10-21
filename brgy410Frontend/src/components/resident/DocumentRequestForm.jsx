import { useState } from 'react';
import { DOCUMENT_TYPES, PURPOSE_OPTIONS } from '../../data/constant';

const DocumentRequestForm = ({ onSubmit }) => {
  const [documentType, setDocumentType] = useState('barangay_indigency');
  const [purpose, setPurpose] = useState('');
  const [otherPurpose, setOtherPurpose] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalPurpose = purpose === 'Others' ? otherPurpose : purpose;
    onSubmit({ documentType, purpose: finalPurpose });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow rounded space-y-4">
      <div>
        <label className="block mb-1 font-medium">Type of Document</label>
        <select
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          {DOCUMENT_TYPES.map((doc) => (
            <option key={doc.value} value={doc.value}>{doc.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Purpose</label>
        <select
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="" disabled>Select purpose</option>
          {PURPOSE_OPTIONS.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {purpose === 'Others' && (
        <div>
          <label className="block mb-1 font-medium">Please specify</label>
          <input
            type="text"
            value={otherPurpose}
            onChange={(e) => setOtherPurpose(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter other purpose"
            required
          />
        </div>
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit Request
      </button>
    </form>
  );
};

export default DocumentRequestForm;
