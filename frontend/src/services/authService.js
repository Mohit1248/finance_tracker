import api from './api';

export const login = async (credentials) => {
  console.log('authService.js: Sending login request with credentials:', credentials);
  const response = await api.post('/api/auth/login', credentials, {
    headers: { 'Content-Type': 'application/json' },
  });
  console.log('authService.js: Login response:', response.data);
  return response.data;
};

export const logout = async (options = {}) => {
  console.log('authService.js: Sending logout request with options:', options);
  const response = await api.post('/api/auth/logout', null, {
    params: options,
  });
  console.log('authService.js: Logout response:', response.data);
  return response.data;
};

export const register = async (userData) => {
  console.log('authService.js: Sending register request with userData:', userData);
  const response = await api.post('/api/auth/register', userData, {
    headers: { 'Content-Type': 'application/json' },
  });
  console.log('authService.js: Register response:', response.data);
  return response.data;
};