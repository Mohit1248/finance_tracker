import api, { setAuthToken } from './api';

export const getTransactions = async (params = {}) => {
  console.log('transactionService.js: Sending request with headers:', api.defaults.headers.common);
  const response = await api.get('/transactions', { params });
  return response.data;
};

export const createTransaction = async (transaction) => {
  console.log('transactionService.js: Sending request with headers:', api.defaults.headers.common);
  const response = await api.post('/transactions', transaction);
  return response.data;
};