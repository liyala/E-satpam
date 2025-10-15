import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
  const response = await authAPI.login(credentials);
  const { token, user } = response.data;
  
  // Simpan token & role ke localStorage
  localStorage.setItem('token', token);
  if (user?.role) {
    localStorage.setItem('role', user.role);
    // console.log("Role disimpan:", user.role);
  } else {
    console.warn("Role user tidak ditemukan dalam response backend!");
  }

  setUser(user);
  return response.data;
};

  // const login = async (credentials) => {
  //   const response = await authAPI.login(credentials);
  //   const { token, user } = response.data;
    
  //   localStorage.setItem('token', token);
  //   setUser(user);
    
  //   return response.data;
  // };

  const register = async (userData) => {
    const response = await authAPI.register(userData);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  setUser(null);
};


  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAdmin,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};