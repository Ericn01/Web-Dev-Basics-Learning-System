import { createContext, useContext, useState, useEffect } from 'react';
import api from './api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = token;
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    console.log(credentials)
    const response = await api.post('/login', credentials);
    const token = response.data.token;
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', credentials.email);
    api.defaults.headers.common['Authorization'] = `Bearer: ${token}`;
    await fetchUserProfile();
  };

  const signup = async (userData) => {
    const response = await api.post('/register', userData);
    const token = response.data.token;
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', userData.email);
    api.defaults.headers.common['Authorization'] = `Bearer: ${token}`;
    await fetchUserProfile();
  };

  const logout = async () => {
    await api.post('/logout');
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
       {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);