import { createContext, useState, useEffect } from 'react';
import { logout as apiLogout } from '../services/authService';
import { setAuthToken } from '../services/api';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const validateAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      if (storedUser && storedToken) {
        try {
          setAuthToken(storedToken);
          const response = await apiLogout({ validate: true }); // Assume logout can validate token
          if (response.status === 200) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setToken(storedToken);
            console.log('AuthContext: Valid token loaded, user:', parsedUser.email);
          } else {
            console.log('AuthContext: Invalid token, clearing state');
            localStorage.removeItem('user');
            localStorage.removeItem('token');
          }
        } catch (e) {
          console.error('AuthContext: Token validation error, clearing state:', e);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      } else {
        console.log('AuthContext: No stored token or user');
      }
      setLoading(false);
    };
    validateAuth();
  }, []);

  const login = (userData) => {
    setUser(userData.user);
    setToken(userData.token);
    localStorage.setItem('user', JSON.stringify(userData.user));
    localStorage.setItem('token', userData.token);
    setAuthToken(userData.token);
    console.log('AuthContext: Logged in with token:', userData.token.substring(0, 10) + '...');
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setAuthToken(null);
    console.log('AuthContext: Logged out, token removed');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
}