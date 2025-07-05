import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  // Remove withCredentials if you do not use cookies
  // withCredentials: true,
});

// Function to set Authorization header with Bearer token
export const setAuthToken = (token) => {
  if (token) {
    console.log('api.js: Setting auth token:', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    console.log('api.js: Removing auth token');
    delete api.defaults.headers.common['Authorization'];
  }
};
console.log('api.js: Initial headers:', api.defaults.headers.common);
export default api;
