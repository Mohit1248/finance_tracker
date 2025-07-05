import { createContext, useState, useEffect } from 'react';
import { logout as apiLogout } from '../services/authService';
import { setAuthToken } from '../services/api';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

useEffect(() => {
  const storedUser = localStorage.getItem('user');
  const storedToken = localStorage.getItem('token');
  if (storedUser && storedToken) {
    setUser(JSON.parse(storedUser));
    setToken(storedToken);
    setAuthToken(storedToken); // Set token on mount if exists
    console.log('AuthContext: Loaded token from localStorage:', storedToken);
  } else {
    console.log('AuthContext: No token or user found in localStorage');
  }
}, []);

 const login = (userData) => {
  setUser(userData.user);
  setToken(userData.token);
  localStorage.setItem('user', JSON.stringify(userData.user));
  localStorage.setItem('token', userData.token);
  setAuthToken(userData.token); // Set token on login
  console.log('AuthContext: Logged in with token:', userData.token);
};
const logout = async () => {
  await apiLogout();
  setUser(null);
  setToken(null);
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  setAuthToken(null); // Remove token on logout
  console.log('AuthContext: Logged out, token removed');
};

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
