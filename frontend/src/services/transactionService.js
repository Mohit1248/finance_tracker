import api, { setAuthToken } from './api';

export const getTransactions = async (params = {}) => {
  console.log('transactionService.js: Sending GET request with headers:', api.defaults.headers.common, 'Params:', params);
  const response = await api.get('/api/transactions/transactions', { params }); // Updated to /api/transactions/transactions
  console.log('transactionService.js: GET response:', response.data);
  return response.data;
};

export const createTransaction = async (transaction) => {
  console.log('transactionService.js: Sending POST request with headers:', api.defaults.headers.common, 'Data:', transaction);
  const response = await api.post('/api/transactions/transactions', transaction); // Updated to /api/transactions/transactions
  console.log('transactionService.js: POST response:', response.data);
  return response.data;
};

export const uploadReceipt = async (file) => {
  console.log('transactionService.js: Uploading file object:', file, 'Initial headers:', api.defaults.headers);
  const formData = new FormData();
  formData.append('file', file);
  console.log('transactionService.js: FormData entries:', [...formData.entries()]);
  const response = await api.post('/api/upload/receipt', formData);
  console.log('transactionService.js: Upload response:', response.data);
  return response.data;
};

export const getTransactionSummary = async () => {
  console.log('transactionService.js: Fetching transaction summary');
  const response = await api.get('/api/transactions/summary'); // Updated to /api/transactions/summary
  console.log('transactionService.js: Summary response:', response.data);
  return response.data;
};