// Extended User Types for User Management
import { UserRole } from './project';

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  developerId?: string;
  createdAt: string;
  createdBy: string;
  isActive: boolean;
}
