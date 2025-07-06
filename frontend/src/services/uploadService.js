import api from './api';

export const uploadReceipt = async (file) => {
  console.log('uploadService.js: Uploading file:', file);
  const formData = new FormData();
  formData.append('file', file);
  console.log('uploadService.js: FormData entries:', [...formData.entries()]);
  try {
    const response = await api.post('/api/upload/receipt', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log('uploadService.js: Upload response:', response.data);
    return response.data;
  } catch (error) {
    console.error('uploadService.js: Upload error:', error);
    throw error;
  }
};