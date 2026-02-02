import { ManagedUser } from '@/types/user';

// Simulated users store
export let managedUsers: ManagedUser[] = [
  {
    id: 'user-1',
    name: 'Admin User',
    email: 'admin@outrightcreators.com',
    role: 'Admin',
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'System',
    isActive: true,
  },
  {
    id: 'user-2',
    name: 'Rahul Sharma',
    email: 'rahul@outrightcreators.com',
    role: 'Developer',
    developerId: 'dev-1',
    createdAt: '2024-09-01T10:00:00Z',
    createdBy: 'Admin User',
    isActive: true,
  },
  {
    id: 'user-3',
    name: 'Priya Patel',
    email: 'priya@outrightcreators.com',
    role: 'Developer',
    developerId: 'dev-2',
    createdAt: '2024-09-01T10:00:00Z',
    createdBy: 'Admin User',
    isActive: true,
  },
  {
    id: 'user-4',
    name: 'Amit Kumar',
    email: 'amit@outrightcreators.com',
    role: 'Developer',
    developerId: 'dev-3',
    createdAt: '2024-09-05T10:00:00Z',
    createdBy: 'Admin User',
    isActive: true,
  },
  {
    id: 'user-5',
    name: 'Sneha Reddy',
    email: 'sneha.freelance@gmail.com',
    role: 'Freelancer',
    developerId: 'dev-4',
    createdAt: '2024-10-01T10:00:00Z',
    createdBy: 'Admin User',
    isActive: true,
  },
  {
    id: 'user-6',
    name: 'Vikram Singh',
    email: 'vikram.dev@gmail.com',
    role: 'Freelancer',
    developerId: 'dev-5',
    createdAt: '2024-10-15T10:00:00Z',
    createdBy: 'Admin User',
    isActive: true,
  },
  {
    id: 'user-7',
    name: 'Ananya Gupta',
    email: 'ananya@outrightcreators.com',
    role: 'Developer',
    developerId: 'dev-6',
    createdAt: '2024-11-01T10:00:00Z',
    createdBy: 'Admin User',
    isActive: true,
  },
  {
    id: 'user-8',
    name: 'Accounts Team',
    email: 'accounts@outrightcreators.com',
    role: 'Accounts',
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'System',
    isActive: true,
  },
];

let userCounter = managedUsers.length;

export const addUser = (user: Omit<ManagedUser, 'id'>): ManagedUser => {
  userCounter++;
  const newUser: ManagedUser = {
    ...user,
    id: `user-${userCounter}`,
  };
  managedUsers = [...managedUsers, newUser];
  return newUser;
};

export const updateUser = (id: string, updates: Partial<ManagedUser>): ManagedUser | null => {
  const index = managedUsers.findIndex((u) => u.id === id);
  if (index === -1) return null;
  
  managedUsers[index] = { ...managedUsers[index], ...updates };
  return managedUsers[index];
};

export const deleteUser = (id: string): boolean => {
  const originalLength = managedUsers.length;
  managedUsers = managedUsers.filter((u) => u.id !== id);
  return managedUsers.length < originalLength;
};

export const getUserById = (id: string): ManagedUser | undefined => {
  return managedUsers.find((u) => u.id === id);
};

export const getUsers = (): ManagedUser[] => {
  return [...managedUsers];
};
