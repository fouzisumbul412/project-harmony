import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole, User } from '@/types/project';

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
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

// Simulated users for each role
const mockUsers: Record<UserRole, User> = {
  Admin: {
    id: 'user-1',
    name: 'Admin User',
    email: 'admin@outrightcreators.com',
    role: 'Admin',
  },
  Developer: {
    id: 'user-2',
    name: 'Rahul Sharma',
    email: 'rahul@outrightcreators.com',
    role: 'Developer',
    developerId: 'dev-1',
  },
  Freelancer: {
    id: 'user-5',
    name: 'Sneha Reddy',
    email: 'sneha.freelance@gmail.com',
    role: 'Freelancer',
    developerId: 'dev-4',
  },
  Accounts: {
    id: 'user-8',
    name: 'Accounts Team',
    email: 'accounts@outrightcreators.com',
    role: 'Accounts',
  },
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: UserRole) => {
    setUser(mockUsers[role]);
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = user !== null;

  // RBAC Rules
  const canViewPayments = user?.role === 'Admin' || user?.role === 'Accounts';
  const canEditProjects = user?.role === 'Admin';
  const canViewAllProjects = user?.role === 'Admin' || user?.role === 'Accounts';
  const canEditDevelopmentData = user?.role !== 'Accounts';
  
  // New permissions: Developer and Freelancer can add projects
  const canAddProjects = user?.role === 'Admin' || user?.role === 'Developer' || user?.role === 'Freelancer';
  const canManageUsers = user?.role === 'Admin';
  const canViewAuditHistory = user?.role === 'Admin';

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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
