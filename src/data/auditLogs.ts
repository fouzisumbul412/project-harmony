import { AuditLog } from '@/types/audit';

// Simulated audit log store
export let auditLogs: AuditLog[] = [
  {
    id: 'audit-1',
    action: 'created',
    entity: 'project',
    entityId: 'proj-1',
    entityName: 'Sukhada Wellness Portal',
    performedBy: { id: 'user-1', name: 'Admin User', role: 'Admin' },
    timestamp: '2024-10-15T09:30:00Z',
    description: 'Created project "Sukhada Wellness Portal"',
  },
  {
    id: 'audit-2',
    action: 'updated',
    entity: 'project',
    entityId: 'proj-1',
    entityName: 'Sukhada Wellness Portal',
    changes: [
      { field: 'projectStatus', oldValue: 'Not Started', newValue: 'In Progress' },
      { field: 'currentStage', oldValue: 'Planning', newValue: 'Frontend Development' },
    ],
    performedBy: { id: 'user-2', name: 'Rahul Sharma', role: 'Developer' },
    timestamp: '2024-10-20T14:15:00Z',
    description: 'Updated project status and stage',
  },
  {
    id: 'audit-3',
    action: 'created',
    entity: 'note',
    entityId: 'n1',
    entityName: 'Sukhada Wellness Portal',
    performedBy: { id: 'user-2', name: 'Rahul Sharma', role: 'Developer' },
    timestamp: '2025-01-28T10:00:00Z',
    description: 'Added note: "Client approved homepage design"',
  },
  {
    id: 'audit-4',
    action: 'created',
    entity: 'project',
    entityId: 'proj-2',
    entityName: 'Vsource Overseas CRM',
    performedBy: { id: 'user-1', name: 'Admin User', role: 'Admin' },
    timestamp: '2024-11-01T11:00:00Z',
    description: 'Created project "Vsource Overseas CRM"',
  },
  {
    id: 'audit-5',
    action: 'updated',
    entity: 'project',
    entityId: 'proj-2',
    entityName: 'Vsource Overseas CRM',
    changes: [
      { field: 'riskLevel', oldValue: 'Medium', newValue: 'High' },
      { field: 'delayReason', oldValue: '', newValue: 'Waiting for API documentation from client' },
    ],
    performedBy: { id: 'user-1', name: 'Admin User', role: 'Admin' },
    timestamp: '2025-01-15T09:45:00Z',
    description: 'Updated risk level and delay reason',
  },
  {
    id: 'audit-6',
    action: 'created',
    entity: 'follow_up',
    entityId: 'f3',
    entityName: 'Vsource Overseas CRM',
    performedBy: { id: 'user-1', name: 'Admin User', role: 'Admin' },
    timestamp: '2025-01-27T16:30:00Z',
    description: 'Added follow-up: "Sent reminder for API docs"',
  },
  {
    id: 'audit-7',
    action: 'created',
    entity: 'user',
    entityId: 'user-2',
    entityName: 'Rahul Sharma',
    performedBy: { id: 'user-1', name: 'Admin User', role: 'Admin' },
    timestamp: '2024-09-01T10:00:00Z',
    description: 'Created user "Rahul Sharma" with role Developer',
  },
  {
    id: 'audit-8',
    action: 'updated',
    entity: 'project',
    entityId: 'proj-3',
    entityName: 'RS Fisheries E-commerce',
    changes: [
      { field: 'projectStatus', oldValue: 'In Progress', newValue: 'Completed (Client Approved)' },
      { field: 'finalApproval', oldValue: false, newValue: true },
      { field: 'paymentStatus', oldValue: 'Partial', newValue: 'Fully Paid' },
    ],
    performedBy: { id: 'user-1', name: 'Admin User', role: 'Admin' },
    timestamp: '2025-01-05T11:00:00Z',
    description: 'Marked project as completed with client approval',
  },
  {
    id: 'audit-9',
    action: 'deleted',
    entity: 'note',
    entityId: 'n-deleted',
    entityName: 'Vsource Overseas CRM',
    performedBy: { id: 'user-3', name: 'Amit Kumar', role: 'Developer' },
    timestamp: '2025-01-20T15:00:00Z',
    description: 'Deleted note: "Outdated client feedback"',
  },
  {
    id: 'audit-10',
    action: 'created',
    entity: 'project',
    entityId: 'proj-6',
    entityName: 'Grano Foods Landing',
    performedBy: { id: 'user-3', name: 'Amit Kumar', role: 'Developer' },
    timestamp: '2025-01-20T09:00:00Z',
    description: 'Created project "Grano Foods Landing"',
  },
];

let auditCounter = auditLogs.length;

export const addAuditLog = (log: Omit<AuditLog, 'id'>): AuditLog => {
  auditCounter++;
  const newLog: AuditLog = {
    ...log,
    id: `audit-${auditCounter}`,
  };
  auditLogs = [newLog, ...auditLogs];
  return newLog;
};

export const getAuditLogs = (): AuditLog[] => {
  return [...auditLogs].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

export const getAuditLogsByEntity = (entity: string, entityId: string): AuditLog[] => {
  return auditLogs
    .filter((log) => log.entity === entity && log.entityId === entityId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};
