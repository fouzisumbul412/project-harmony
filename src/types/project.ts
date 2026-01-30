// Project CRM Types

export type UserRole = 'Admin' | 'Developer' | 'Freelancer' | 'Accounts';

export type ProjectStatus = 
  | 'Not Started' 
  | 'In Progress' 
  | 'Completed (Dev)' 
  | 'Completed (Client Approved)';

export type PendingFrom = 
  | 'Client' 
  | 'Developer' 
  | 'Third Party' 
  | 'Done';

export type PaymentStatus = 
  | 'Fully Paid' 
  | 'Pending' 
  | 'Partial' 
  | 'Extra Pending';

export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type RiskLevel = 'Low' | 'Medium' | 'High';

export type ProjectType = 
  | 'Website' 
  | 'CRM' 
  | 'Ecommerce' 
  | 'Landing' 
  | 'Maintenance';

export type DeveloperType = 'Internal' | 'Freelance';

export interface Developer {
  id: string;
  name: string;
  type: DeveloperType;
  email: string;
  phone: string;
}

export interface FollowUp {
  id: string;
  date: string;
  note: string;
  by: string;
}

export interface Note {
  id: string;
  date: string;
  content: string;
  by: string;
}

export interface ImportantLink {
  label: string;
  url: string;
}

export interface Project {
  id: string;
  // Core Tracking Fields
  projectName: string;
  clientName: string;
  developersAssigned: string[]; // Developer IDs
  framework: string;
  startedOn: string;
  internalDeadline: string;
  actualCompletion: string | null;
  liveDate: string | null;
  projectStatus: ProjectStatus;
  currentStage: string;
  pendingFrom: PendingFrom;
  delayReason: string;
  contentReceived: boolean;
  clientResponse: string;
  lastFollowUpDate: string;
  finalApproval: boolean;
  paymentStatus: PaymentStatus;
  scopeChanges: string;
  domain: string;
  hosting: string;
  notes: Note[];
  
  // Additional Professional CRM Fields
  priority: Priority;
  projectType: ProjectType;
  estimatedEffort: string;
  actualEffortSpent: string;
  clientContactPerson: string;
  clientContactEmail: string;
  clientContactPhone: string;
  totalProjectCost: number;
  warrantyEndDate: string | null;
  amcStatus: boolean;
  amcAmount: number;
  riskLevel: RiskLevel;
  importantLinks: ImportantLink[];
  followUpHistory: FollowUp[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  developerId?: string; // If user is a developer
}
