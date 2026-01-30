import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import SummaryCard from '@/components/common/SummaryCard';
import { useAuth } from '@/context/AuthContext';
import { projects } from '@/data/projects';
import { getDevelopersByIds } from '@/data/developers';
import {
  getProjectStatusBadge,
  getPendingFromBadge,
  getPaymentStatusBadge,
  getPriorityBadge,
  getRiskLevelBadge,
  formatDate,
} from '@/utils/badges';
import {
  FolderKanban,
  Clock,
  UserCheck,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  Calendar,
  ArrowRight,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, canViewPayments, canViewAllProjects } = useAuth();
  const navigate = useNavigate();

  // Filter projects based on role
  const visibleProjects = canViewAllProjects
    ? projects
    : projects.filter((p) =>
        user?.developerId ? p.developersAssigned.includes(user.developerId) : false
      );

  // Calculate summary stats
  const totalProjects = visibleProjects.length;
  const inProgress = visibleProjects.filter((p) => p.projectStatus === 'In Progress').length;
  const waitingForClient = visibleProjects.filter((p) => p.pendingFrom === 'Client').length;
  const paymentPending = visibleProjects.filter(
    (p) => p.paymentStatus !== 'Fully Paid'
  ).length;
  const completedDevNoApproval = visibleProjects.filter(
    (p) => p.projectStatus === 'Completed (Dev)' && !p.finalApproval
  ).length;
  const highRisk = visibleProjects.filter((p) => p.riskLevel === 'High').length;

  // Follow-up required today (simulated)
  const today = new Date().toISOString().split('T')[0];
  const followUpToday = visibleProjects.filter((p) => p.lastFollowUpDate === today).length;

  // Projects needing attention
  const projectsNeedingAttention = visibleProjects.filter(
    (p) =>
      p.pendingFrom === 'Client' ||
      (canViewPayments && p.paymentStatus !== 'Fully Paid') ||
      p.riskLevel === 'High'
  );

  return (
    <div className="min-h-screen">
      <Header
        title="Dashboard"
        subtitle={`Welcome back, ${user?.name}`}
      />

      <div className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <SummaryCard
            title="Total Projects"
            value={totalProjects}
            icon={<FolderKanban className="w-5 h-5 text-primary" />}
            iconBgColor="bg-secondary"
          />
          <SummaryCard
            title="In Progress"
            value={inProgress}
            icon={<Clock className="w-5 h-5 text-yellow-600" />}
            iconBgColor="bg-yellow-100"
          />
          <SummaryCard
            title="Waiting for Client"
            value={waitingForClient}
            icon={<UserCheck className="w-5 h-5 text-red-600" />}
            iconBgColor="bg-red-100"
          />
          {canViewPayments && (
            <SummaryCard
              title="Payment Pending"
              value={paymentPending}
              icon={<CreditCard className="w-5 h-5 text-orange-600" />}
              iconBgColor="bg-orange-100"
            />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <SummaryCard
            title="Completed (No Approval)"
            value={completedDevNoApproval}
            icon={<CheckCircle className="w-5 h-5 text-blue-600" />}
            iconBgColor="bg-blue-100"
          />
          <SummaryCard
            title="High Risk Projects"
            value={highRisk}
            icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
            iconBgColor="bg-red-100"
          />
          <SummaryCard
            title="Follow-up Required Today"
            value={followUpToday}
            icon={<Calendar className="w-5 h-5 text-purple-600" />}
            iconBgColor="bg-purple-100"
          />
        </div>

        {/* Projects Needing Attention */}
        <div className="bg-card rounded-xl border border-border">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Projects Needing Attention
            </h2>
            <button
              onClick={() => navigate('/projects')}
              className="btn-ghost text-sm"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Client</th>
                  <th>Status</th>
                  <th>Pending From</th>
                  <th>Priority</th>
                  <th>Risk</th>
                  {canViewPayments && <th>Payment</th>}
                  <th>Last Follow-up</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {projectsNeedingAttention.slice(0, 8).map((project) => (
                  <tr key={project.id}>
                    <td className="font-medium text-foreground">
                      {project.projectName}
                    </td>
                    <td className="text-muted-foreground">{project.clientName}</td>
                    <td>
                      <span className={`badge ${getProjectStatusBadge(project.projectStatus).className}`}>
                        {project.projectStatus}
                      </span>
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
                    {canViewPayments && (
                      <td>
                        <span className={`badge ${getPaymentStatusBadge(project.paymentStatus).className}`}>
                          {project.paymentStatus}
                        </span>
                      </td>
                    )}
                    <td className="text-muted-foreground text-sm">
                      {formatDate(project.lastFollowUpDate)}
                    </td>
                    <td>
                      <button
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className="btn-ghost text-sm py-1 px-2"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {projectsNeedingAttention.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No projects need immediate attention. Great job! 🎉
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
