import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { useAuth } from '@/context/AuthContext';
import { projects } from '@/data/projects';
import { developers, getDevelopersByIds } from '@/data/developers';
import {
  getProjectStatusBadge,
  getPendingFromBadge,
  getPaymentStatusBadge,
  getPriorityBadge,
  getRiskLevelBadge,
  formatDate,
} from '@/utils/badges';
import { Project, ProjectStatus, PendingFrom, PaymentStatus, Priority, RiskLevel } from '@/types/project';
import { Plus, Filter, X, Eye } from 'lucide-react';

const ProjectsList: React.FC = () => {
  const { user, canViewPayments, canViewAllProjects, canAddProjects } = useAuth();
  const navigate = useNavigate();

  // Filter states
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | ''>('');
  const [developerFilter, setDeveloperFilter] = useState<string>('');
  const [clientFilter, setClientFilter] = useState<string>('');
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | ''>('');
  const [pendingFilter, setPendingFilter] = useState<PendingFrom | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | ''>('');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | ''>('');

  // Base projects based on role
  const baseProjects = useMemo(() => {
    if (canViewAllProjects) {
      return projects;
    }
    return projects.filter((p) =>
      user?.developerId ? p.developersAssigned.includes(user.developerId) : false
    );
  }, [canViewAllProjects, user?.developerId]);

  // Get unique clients
  const clients = useMemo(() => {
    return [...new Set(baseProjects.map((p) => p.clientName))];
  }, [baseProjects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return baseProjects.filter((project) => {
      if (statusFilter && project.projectStatus !== statusFilter) return false;
      if (developerFilter && !project.developersAssigned.includes(developerFilter)) return false;
      if (clientFilter && project.clientName !== clientFilter) return false;
      if (paymentFilter && project.paymentStatus !== paymentFilter) return false;
      if (pendingFilter && project.pendingFrom !== pendingFilter) return false;
      if (priorityFilter && project.priority !== priorityFilter) return false;
      if (riskFilter && project.riskLevel !== riskFilter) return false;
      return true;
    });
  }, [baseProjects, statusFilter, developerFilter, clientFilter, paymentFilter, pendingFilter, priorityFilter, riskFilter]);

  const clearFilters = () => {
    setStatusFilter('');
    setDeveloperFilter('');
    setClientFilter('');
    setPaymentFilter('');
    setPendingFilter('');
    setPriorityFilter('');
    setRiskFilter('');
  };

  const hasActiveFilters = statusFilter || developerFilter || clientFilter || paymentFilter || pendingFilter || priorityFilter || riskFilter;

  return (
    <div className="min-h-screen">
      <Header
        title="Projects"
        subtitle={`${filteredProjects.length} projects`}
      />

      <div className="p-6">
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {hasActiveFilters ? 'Filtered results' : 'All projects'}
            </span>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="btn-ghost text-sm py-1 px-2">
                <X className="w-4 h-4" /> Clear
              </button>
            )}
          </div>
          {canAddProjects && (
            <button onClick={() => navigate('/projects/new')} className="btn-primary">
              <Plus className="w-4 h-4" /> Add Project
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="filter-bar">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | '')}
            className="form-select min-w-[160px]"
          >
            <option value="">All Status</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed (Dev)">Completed (Dev)</option>
            <option value="Completed (Client Approved)">Completed (Client Approved)</option>
          </select>

          <select
            value={developerFilter}
            onChange={(e) => setDeveloperFilter(e.target.value)}
            className="form-select min-w-[160px]"
          >
            <option value="">All Developers</option>
            {developers.map((dev) => (
              <option key={dev.id} value={dev.id}>{dev.name}</option>
            ))}
          </select>

          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="form-select min-w-[160px]"
          >
            <option value="">All Clients</option>
            {clients.map((client) => (
              <option key={client} value={client}>{client}</option>
            ))}
          </select>

          {canViewPayments && (
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value as PaymentStatus | '')}
              className="form-select min-w-[160px]"
            >
              <option value="">All Payments</option>
              <option value="Fully Paid">Fully Paid</option>
              <option value="Pending">Pending</option>
              <option value="Partial">Partial</option>
              <option value="Extra Pending">Extra Pending</option>
            </select>
          )}

          <select
            value={pendingFilter}
            onChange={(e) => setPendingFilter(e.target.value as PendingFrom | '')}
            className="form-select min-w-[160px]"
          >
            <option value="">All Pending From</option>
            <option value="Client">Client</option>
            <option value="Developer">Developer</option>
            <option value="Third Party">Third Party</option>
            <option value="Done">Done</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as Priority | '')}
            className="form-select min-w-[140px]"
          >
            <option value="">All Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value as RiskLevel | '')}
            className="form-select min-w-[140px]"
          >
            <option value="">All Risk</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Projects Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Client</th>
                  <th>Framework</th>
                  <th>Developers</th>
                  <th>Status</th>
                  <th>Stage</th>
                  <th>Pending From</th>
                  <th>Priority</th>
                  <th>Risk</th>
                  <th>Deadline</th>
                  {canViewPayments && <th>Payment</th>}
                  <th>Last Follow-up</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => {
                  const devs = getDevelopersByIds(project.developersAssigned);
                  return (
                    <tr key={project.id}>
                      <td className="font-medium text-foreground max-w-[200px] truncate">
                        {project.projectName}
                      </td>
                      <td className="text-muted-foreground max-w-[150px] truncate">
                        {project.clientName}
                      </td>
                      <td className="text-sm text-muted-foreground">
                        {project.framework}
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-1 max-w-[150px]">
                          {devs.slice(0, 2).map((dev) => (
                            <span key={dev.id} className="badge badge-gray text-xs">
                              {dev.name.split(' ')[0]}
                            </span>
                          ))}
                          {devs.length > 2 && (
                            <span className="badge badge-gray text-xs">+{devs.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${getProjectStatusBadge(project.projectStatus).className}`}>
                          {project.projectStatus}
                        </span>
                      </td>
                      <td className="text-sm text-muted-foreground max-w-[120px] truncate">
                        {project.currentStage}
                      </td>
                      <td>
                        <span className={`badge ${getPendingFromBadge(project.pendingFrom).className}`}>
                          {project.pendingFrom}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getPriorityBadge(project.priority).className}`}>
                          {project.priority}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getRiskLevelBadge(project.riskLevel).className}`}>
                          {project.riskLevel}
                        </span>
                      </td>
                      <td className="text-sm text-muted-foreground whitespace-nowrap">
                        {formatDate(project.internalDeadline)}
                      </td>
                      {canViewPayments && (
                        <td>
                          <span className={`badge ${getPaymentStatusBadge(project.paymentStatus).className}`}>
                            {project.paymentStatus}
                          </span>
                        </td>
                      )}
                      <td className="text-sm text-muted-foreground whitespace-nowrap">
                        {formatDate(project.lastFollowUpDate)}
                      </td>
                      <td>
                        <button
                          onClick={() => navigate(`/projects/${project.id}`)}
                          className="btn-ghost text-sm py-1 px-2"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredProjects.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">
              No projects match your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsList;
