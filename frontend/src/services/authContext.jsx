import { createContext, useContext, useState, useEffect } from 'react';
import api from './api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
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
      setIsAdmin(response.data.role === 'admin');
    } catch (error) {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const response = await api.post('/login', credentials);
    const { token, role } = response.data;
    
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    await fetchUserProfile();
    return response.data;
  };


  const signup = async (userData) => {
    const response = await api.post('/register', userData);
    const { token } = response.data;
    
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    await fetchUserProfile();
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } finally {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, signup, logout, loading }}>
       {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);