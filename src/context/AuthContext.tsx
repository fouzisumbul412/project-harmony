import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/types/project';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  canViewPayments: boolean;
  canEditProjects: boolean;
  canViewAllProjects: boolean;
  canEditDevelopmentData: boolean;
  canAddProjects: boolean;
  canManageUsers: boolean;
  canViewAuditHistory: boolean;
} 

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Restore session on refresh
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch(
          'http://localhost/project-crm/api/auth/me.php',
          { credentials: 'include' }
        );

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(
        'http://localhost/project-crm/api/auth/login.php',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();
      if (!data.success) return false;

      setUser(data.user);
      return true;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    await fetch(
      'http://localhost/project-crm/api/auth/logout.php',
      { credentials: 'include' }
    );
    setUser(null);
  };

  const isAuthenticated = !!user;

  // 🔐 RBAC (unchanged)
  const canViewPayments = user?.role === 'Admin' || user?.role === 'Accounts';
  const canEditProjects = user?.role === 'Admin' || user?.role === 'Developer';
  const canViewAllProjects = user?.role === 'Admin' || user?.role === 'Accounts';
  const canEditDevelopmentData = user?.role !== 'Accounts';
  const canAddProjects =
    user?.role === 'Admin' ||
    user?.role === 'Developer' ||
    user?.role === 'Freelancer';
  const canManageUsers = user?.role === 'Admin';
  const canViewAuditHistory = user?.role === 'Admin';

  if (loading) return null; // or loader

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
        canViewPayments,
        canEditProjects,
        canViewAllProjects,
        canEditDevelopmentData,
        canAddProjects,
        canManageUsers,
        canViewAuditHistory,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
