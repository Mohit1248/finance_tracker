import { useState } from 'react';
import FileUpload from '../components/FileUpload';

function UploadReceipt() {
  const [uploadedData, setUploadedData] = useState(null);

  const handleUpload = (data) => {
    setUploadedData(data);
  };

  return (
    <div>
      <div className="card">
        <FileUpload onUpload={handleUpload} />
      </div>
      {uploadedData && (
        <div className="card">
          <h2 className="form-title">Uploaded Data</h2>
          <pre>{JSON.stringify(uploadedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default UploadReceipt;