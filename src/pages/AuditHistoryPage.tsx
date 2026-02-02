import React, { useState, useMemo } from 'react';
import Header from '@/components/layout/Header';
import { getAuditLogs } from '@/data/auditLogs';
import { AuditLog, AuditAction, AuditEntity } from '@/types/audit';
import { formatDate } from '@/utils/badges';
import {
  Plus,
  Edit2,
  Trash2,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  FileText,
  User,
  FolderKanban,
  MessageSquare,
  Calendar,
} from 'lucide-react';

const AuditHistoryPage: React.FC = () => {
  const [logs] = useState<AuditLog[]>(getAuditLogs());
  const [actionFilter, setActionFilter] = useState<AuditAction | ''>('');
  const [entityFilter, setEntityFilter] = useState<AuditEntity | ''>('');
  const [userFilter, setUserFilter] = useState<string>('');
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());

  // Get unique users who performed actions
  const uniqueUsers = useMemo(() => {
    const users = logs.map((log) => log.performedBy.name);
    return [...new Set(users)];
  }, [logs]);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (actionFilter && log.action !== actionFilter) return false;
      if (entityFilter && log.entity !== entityFilter) return false;
      if (userFilter && log.performedBy.name !== userFilter) return false;
      return true;
    });
  }, [logs, actionFilter, entityFilter, userFilter]);

  const clearFilters = () => {
    setActionFilter('');
    setEntityFilter('');
    setUserFilter('');
  };

  const hasActiveFilters = actionFilter || entityFilter || userFilter;

  const toggleExpand = (logId: string) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedLogs(newExpanded);
  };

  const getActionIcon = (action: AuditAction) => {
    switch (action) {
      case 'created':
        return <Plus className="w-4 h-4 text-green-500" />;
      case 'updated':
        return <Edit2 className="w-4 h-4 text-blue-500" />;
      case 'deleted':
        return <Trash2 className="w-4 h-4 text-red-500" />;
    }
  };

  const getActionBadgeClass = (action: AuditAction) => {
    switch (action) {
      case 'created':
        return 'badge-green';
      case 'updated':
        return 'badge-blue';
      case 'deleted':
        return 'badge-red';
    }
  };

  const getEntityIcon = (entity: AuditEntity) => {
    switch (entity) {
      case 'project':
        return <FolderKanban className="w-4 h-4" />;
      case 'note':
        return <FileText className="w-4 h-4" />;
      case 'follow_up':
        return <Calendar className="w-4 h-4" />;
      case 'user':
        return <User className="w-4 h-4" />;
      case 'developer':
        return <User className="w-4 h-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen">
      <Header title="Audit History" subtitle={`${filteredLogs.length} events`} />

      <div className="p-6">
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filters:</span>
          </div>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value as AuditAction | '')}
            className="form-select min-w-[140px]"
          >
            <option value="">All Actions</option>
            <option value="created">Created</option>
            <option value="updated">Updated</option>
            <option value="deleted">Deleted</option>
          </select>

          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value as AuditEntity | '')}
            className="form-select min-w-[140px]"
          >
            <option value="">All Types</option>
            <option value="project">Project</option>
            <option value="note">Note</option>
            <option value="follow_up">Follow-up</option>
            <option value="user">User</option>
          </select>

          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="form-select min-w-[160px]"
          >
            <option value="">All Users</option>
            {uniqueUsers.map((userName) => (
              <option key={userName} value={userName}>
                {userName}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button onClick={clearFilters} className="btn-ghost text-sm py-1 px-2">
              <X className="w-4 h-4" /> Clear
            </button>
          )}
        </div>

        {/* Audit Log List */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="divide-y divide-border">
            {filteredLogs.map((log) => {
              const isExpanded = expandedLogs.has(log.id);
              return (
                <div key={log.id} className="p-4">
                  <div
                    className="flex items-start gap-4 cursor-pointer"
                    onClick={() => log.changes && toggleExpand(log.id)}
                  >
                    {/* Action Icon */}
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      {getActionIcon(log.action)}
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`badge ${getActionBadgeClass(log.action)}`}>
                          {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                        </span>
                        <span className="badge badge-gray inline-flex items-center gap-1">
                          {getEntityIcon(log.entity)}
                          {log.entity.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-foreground mt-1">{log.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {log.performedBy.name}
                          <span className="text-xs">({log.performedBy.role})</span>
                        </span>
                        <span>{formatTimestamp(log.timestamp)}</span>
                      </div>
                    </div>

                    {/* Expand Button */}
                    {log.changes && log.changes.length > 0 && (
                      <button className="btn-ghost p-2 flex-shrink-0">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Changes Details */}
                  {isExpanded && log.changes && (
                    <div className="mt-4 ml-14 bg-muted rounded-lg p-4">
                      <h4 className="text-sm font-medium text-foreground mb-3">Changes Made:</h4>
                      <div className="space-y-2">
                        {log.changes.map((change, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 text-sm"
                          >
                            <span className="font-medium text-foreground min-w-[120px]">
                              {change.field}:
                            </span>
                            <span className="text-red-500 line-through">
                              {String(change.oldValue) || '(empty)'}
                            </span>
                            <span className="text-muted-foreground">→</span>
                            <span className="text-green-600">
                              {String(change.newValue) || '(empty)'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredLogs.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">
              No audit logs match your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditHistoryPage;
