// Audit History Types

export type AuditAction = 'created' | 'updated' | 'deleted';

export type AuditEntity = 
  | 'project' 
  | 'note' 
  | 'follow_up' 
  | 'user' 
  | 'developer';

export interface AuditFieldChange {
  field: string;
  oldValue: string | number | boolean | null;
  newValue: string | number | boolean | null;
}

export interface AuditLog {
  id: string;
  action: AuditAction;
  entity: AuditEntity;
  entityId: string;
  entityName: string;
  changes?: AuditFieldChange[];
  performedBy: {
    id: string;
    name: string;
    role: string;
  };
  timestamp: string;
  description: string;
}
