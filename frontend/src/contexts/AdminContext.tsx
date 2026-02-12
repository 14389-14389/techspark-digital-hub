import React, { createContext, useContext, useState, useEffect } from 'react';
import { Admin } from '../types/admin';
import { getCurrentAdmin, removeToken } from '../services/admin';

interface AdminContextType {
  admin: Admin | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  setAdmin: (admin: Admin | null) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const result = await getCurrentAdmin();
      if (result.success) {
        setAdmin(result.admin);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const logout = () => {
    removeToken();
    setAdmin(null);
  };

  return (
    <AdminContext.Provider
      value={{
        admin,
        loading,
        isAuthenticated: !!admin,
        logout,
        setAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};