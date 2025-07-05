import { useState } from 'react';
import { uploadReceipt } from '../services/uploadService';

function FileUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      const result = await uploadReceipt(formData);
      onUpload(result);
      setFile(null);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading file');
    }
  };

  return (
    <div className="card">
      <h2 className="form-title">Upload Receipt</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Select File (Image/PDF)</label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="form-input"
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="submit-button">
          Upload
        </button>
      </form>
    </div>
  );
}

export default FileUpload;