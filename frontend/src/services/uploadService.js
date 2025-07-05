import api from './api';
// uploadService.js
export const uploadReceipt = async (file) => {
  const formData = new FormData();
  formData.append('file', file); // 🔑 must match .single('file')
  const response = await api.post('/upload/receipt', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

