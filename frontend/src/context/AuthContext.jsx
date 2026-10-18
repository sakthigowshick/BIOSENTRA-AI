import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Configure backend API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
axios.defaults.baseURL = API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Set token header helper
  const setAuthHeader = (jwtToken) => {
    if (jwtToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        setAuthHeader(storedToken);
        try {
          const response = await axios.get('/auth/me');
          setUser(response.data);
        } catch (error) {
          console.error("Token validation failed:", error);
          logout();
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setAuthHeader(access_token);
      
      const userResponse = await axios.get('/auth/me');
      setUser(userResponse.data);
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      const message = error.response?.data?.detail || "Login failed. Please check credentials.";
      return { success: false, error: message };
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      await axios.post('/auth/register', { name, email, password });
      setLoading(false);
      // Log in immediately after registration
      return await login(email, password);
    } catch (error) {
      setLoading(false);
      const message = error.response?.data?.detail || "Registration failed. Try a different email.";
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setAuthHeader(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
