import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { useAuth } from '@/context/AuthContext';
import {
  getProjectStatusBadge,
  getPendingFromBadge,
  getPaymentStatusBadge,
  getPriorityBadge,
  getRiskLevelBadge,
  formatDate,
} from '@/utils/badges';
import {
  Project,
  ProjectStatus,
  PendingFrom,
  PaymentStatus,
  Priority,
  RiskLevel,
  Developer,
} from '@/types/project';
import { Plus, Filter, X, Eye } from 'lucide-react';

const API = 'http://localhost/project-crm/api/projects';
const DEV_API = 'http://localhost/project-crm/api/developers';

const ProjectsList: React.FC = () => {
  const { canViewPayments, canAddProjects } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [statusFilter, setStatusFilter] = useState<ProjectStatus | ''>('');
  const [developerFilter, setDeveloperFilter] = useState<string>('');
  const [clientFilter, setClientFilter] = useState<string>('');
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | ''>('');
  const [pendingFilter, setPendingFilter] = useState<PendingFrom | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | ''>('');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | ''>('');

  useEffect(() => {
    fetch(`${API}/index.php`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch(() => setProjects([]));
  }, []);

  useEffect(() => {
    fetch(`${DEV_API}/index.php`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setDevelopers(Array.isArray(data) ? data : []))
      .catch(() => setDevelopers([]));
  }, []);

  const devMap = useMemo(() => {
    const m = new Map<string, Developer>();
    developers.forEach((d) => m.set(d.id, d));
    return m;
  }, [developers]);

  const clients = useMemo(
    () => [...new Set(projects.map((p) => p.clientName).filter(Boolean))],
    [projects]
  );

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (statusFilter && project.projectStatus !== statusFilter) return false;
      if (developerFilter && !project.developersAssigned?.includes(developerFilter)) return false;
      if (clientFilter && project.clientName !== clientFilter) return false;
      if (paymentFilter && project.paymentStatus !== paymentFilter) return false;
      if (pendingFilter && project.pendingFrom !== pendingFilter) return false;
      if (priorityFilter && project.priority !== priorityFilter) return false;
      if (riskFilter && project.riskLevel !== riskFilter) return false;
      return true;
    });
  }, [projects, statusFilter, developerFilter, clientFilter, paymentFilter, pendingFilter, priorityFilter, riskFilter]);

  const clearFilters = () => {
    setStatusFilter('');
    setDeveloperFilter('');
    setClientFilter('');
    setPaymentFilter('');
    setPendingFilter('');
    setPriorityFilter('');
    setRiskFilter('');
  };
const activeChips = [
  statusFilter && { label: 'Status', value: statusFilter, clear: () => setStatusFilter('') },
  developerFilter && {
    label: 'Developer',
    value: developers.find((d) => d.id === developerFilter)?.name,
    clear: () => setDeveloperFilter(''),
  },
  clientFilter && { label: 'Client', value: clientFilter, clear: () => setClientFilter('') },
  paymentFilter && { label: 'Payment', value: paymentFilter, clear: () => setPaymentFilter('') },
  pendingFilter && { label: 'Pending', value: pendingFilter, clear: () => setPendingFilter('') },
  priorityFilter && { label: 'Priority', value: priorityFilter, clear: () => setPriorityFilter('') },
  riskFilter && { label: 'Risk', value: riskFilter, clear: () => setRiskFilter('') },
].filter(Boolean) as {
  label: string;
  value: string | undefined;
  clear: () => void;
}[];

  return (
    <div className="min-h-screen relative">
      <Header title="Projects" subtitle={`${filteredProjects.length} projects`} />

      <div className="p-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="btn-ghost flex items-center gap-2"
          >
            <Filter className="w-4 h-4" /> Filters
          </button>

          {canAddProjects && (
            <button onClick={() => navigate('/projects/new')} className="btn-primary">
              <Plus className="w-4 h-4" /> Add Project
            </button>
          )}
        </div>
        {/* Active Filter Chips */}
{activeChips.length > 0 && (
  <div className="flex flex-wrap gap-2 mb-4">
    {activeChips.map((chip, i) => (
      <div
        key={i}
        className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
      >
        <span className="font-medium">{chip.label}:</span>
        <span>{chip.value}</span>
        <X
          className="w-3 h-3 cursor-pointer"
          onClick={chip.clear}
        />
      </div>
    ))}
  </div>
)}
{/* MOBILE CARD VIEW */}
<div className="md:hidden space-y-4">
  {filteredProjects.map((project) => {
    const devs =
      project.developersAssigned?.map((id) => devMap.get(id)).filter(Boolean) as Developer[];

    return (
      <div
        key={project.id}
        className="bg-card border border-border rounded-xl p-4 shadow-sm"
      >
        {/* Top */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-base">{project.projectName}</h3>
            <p className="text-sm text-muted-foreground">{project.clientName}</p>
          </div>

          <button
            onClick={() => navigate(`/projects/${project.id}`)}
            className="btn-ghost"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Framework + Deadline */}
        <div className="flex justify-between text-sm mb-2">
          <span>{project.framework}</span>
          <span>{formatDate(project.internalDeadline)}</span>
        </div>

        {/* Developers */}
        <div className="flex flex-wrap gap-1 mb-2">
          {devs.map((dev) => (
            <span key={dev.id} className="badge badge-gray text-xs">
              {dev.name.split(' ')[0]}
            </span>
          ))}
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap gap-2 mb-2">
          <span className={`badge ${getProjectStatusBadge(project.projectStatus).className}`}>
            {project.projectStatus}
          </span>
          <span className={`badge ${getPriorityBadge(project.priority).className}`}>
            {project.priority}
          </span>
          <span className={`badge ${getRiskLevelBadge(project.riskLevel).className}`}>
            {project.riskLevel}
          </span>
          <span className={`badge ${getPendingFromBadge(project.pendingFrom).className}`}>
            {project.pendingFrom}
          </span>
          {canViewPayments && (
            <span className={`badge ${getPaymentStatusBadge(project.paymentStatus).className}`}>
              {project.paymentStatus}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="text-xs text-muted-foreground">
          Last Follow-up: {formatDate(project.lastFollowUpDate)}
        </div>
      </div>
    );
  })}
</div>


        {/* TABLE */}
        <div className="hidden md:block bg-card rounded-xl border border-border overflow-hidden">
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
                  const devs =
                    project.developersAssigned?.map((id) => devMap.get(id)).filter(Boolean) as Developer[];

                  return (
                    <tr key={project.id}>
                      <td className="font-medium">{project.projectName}</td>
                      <td>{project.clientName}</td>
                      <td>{project.framework}</td>

                      <td>
  <div className="flex gap-1 flex-wrap">
    {devs.slice(0, 2).map((dev) => (
      <span key={dev.id} className="badge badge-gray text-xs">
        {dev.name.split(' ')[0]}
      </span>
    ))}
  </div>
</td>


                      <td>
                        <span className={`badge ${getProjectStatusBadge(project.projectStatus).className}`}>
                          {project.projectStatus}
                        </span>
                      </td>

                      <td>{project.currentStage}</td>

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

                      <td>{formatDate(project.internalDeadline)}</td>

                      {canViewPayments && (
                        <td>
                          <span className={`badge ${getPaymentStatusBadge(project.paymentStatus).className}`}>
                            {project.paymentStatus}
                          </span>
                        </td>
                      )}

                      <td>{formatDate(project.lastFollowUpDate)}</td>
                      <td>
                        <button onClick={() => navigate(`/projects/${project.id}`)} className="btn-ghost">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ================= FILTER DRAWER ================= */}
      <div
        className={`fixed inset-0 z-50 transition ${
          isFilterOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            isFilterOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsFilterOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`absolute right-0 top-0 h-full w-[360px] bg-white shadow-xl p-6 transition-transform duration-300 ${
            isFilterOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Filters</h2>
            <X className="cursor-pointer" onClick={() => setIsFilterOpen(false)} />
          </div>

          <div className="space-y-4">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="form-select w-full">
              <option value="">All Status</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed (Dev)">Completed (Dev)</option>
              <option value="Completed (Client Approved)">Completed (Client Approved)</option>
            </select>

            <select value={developerFilter} onChange={(e) => setDeveloperFilter(e.target.value)} className="form-select w-full">
              <option value="">All Developers</option>
              {developers.map((dev) => (
                <option key={dev.id} value={dev.id}>{dev.name}</option>
              ))}
            </select>

            <select value={clientFilter} onChange={(e) => setClientFilter(e.target.value)} className="form-select w-full">
              <option value="">All Clients</option>
              {clients.map((client) => (
                <option key={client} value={client}>{client}</option>
              ))}
            </select>

            <select value={pendingFilter} onChange={(e) => setPendingFilter(e.target.value as any)} className="form-select w-full">
              <option value="">All Pending From</option>
              <option value="Client">Client</option>
              <option value="Developer">Developer</option>
              <option value="Third Party">Third Party</option>
              <option value="Done">Done</option>
            </select>

            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as any)} className="form-select w-full">
              <option value="">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>

            <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value as any)} className="form-select w-full">
              <option value="">All Risk</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="mt-8 flex gap-3">
            <button onClick={clearFilters} className="btn-ghost w-full">Clear</button>
            <button onClick={() => setIsFilterOpen(false)} className="btn-primary w-full">Apply</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsList;
