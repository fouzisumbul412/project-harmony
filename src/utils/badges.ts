import { 
  ProjectStatus, 
  PendingFrom, 
  PaymentStatus, 
  Priority, 
  RiskLevel 
} from '@/types/project';

interface BadgeConfig {
  className: string;
  label?: string;
}

export const getProjectStatusBadge = (status: ProjectStatus): BadgeConfig => {
  switch (status) {
    case 'In Progress':
      return { className: 'badge-warning' };
    case 'Completed (Client Approved)':
      return { className: 'badge-success' };
    case 'Completed (Dev)':
      return { className: 'badge-info' };
    case 'Not Started':
      return { className: 'badge-gray' };
    default:
      return { className: 'badge-gray' };
  }
};

export const getPendingFromBadge = (pendingFrom: PendingFrom): BadgeConfig => {
  switch (pendingFrom) {
    case 'Client':
      return { className: 'badge-danger' };
    case 'Developer':
      return { className: 'badge-info' };
    case 'Third Party':
      return { className: 'badge-purple' };
    case 'Done':
      return { className: 'badge-success' };
    default:
      return { className: 'badge-gray' };
  }
};

export const getPaymentStatusBadge = (status: PaymentStatus): BadgeConfig => {
  switch (status) {
    case 'Fully Paid':
      return { className: 'badge-success' };
    case 'Pending':
      return { className: 'badge-danger' };
    case 'Extra Pending':
      return { className: 'badge-orange' };
    case 'Partial':
      return { className: 'badge-warning' };
    default:
      return { className: 'badge-gray' };
  }
};

export const getPriorityBadge = (priority: Priority): BadgeConfig => {
  switch (priority) {
    case 'Urgent':
      return { className: 'badge-danger' };
    case 'High':
      return { className: 'badge-orange' };
    case 'Medium':
      return { className: 'badge-info' };
    case 'Low':
      return { className: 'badge-gray' };
    default:
      return { className: 'badge-gray' };
  }
};

export const getRiskLevelBadge = (level: RiskLevel): BadgeConfig => {
  switch (level) {
    case 'High':
      return { className: 'badge-danger' };
    case 'Medium':
      return { className: 'badge-orange' };
    case 'Low':
      return { className: 'badge-success' };
    default:
      return { className: 'badge-gray' };
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string | null): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};
