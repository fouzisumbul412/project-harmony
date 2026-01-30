import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Modal from '@/components/common/Modal';
import { useAuth } from '@/context/AuthContext';
import { getProjectById } from '@/data/projects';
import { getDevelopersByIds } from '@/data/developers';
import {
  getProjectStatusBadge,
  getPendingFromBadge,
  getPaymentStatusBadge,
  getPriorityBadge,
  getRiskLevelBadge,
  formatDate,
  formatCurrency,
} from '@/utils/badges';
import {
  ArrowLeft,
  Edit,
  Calendar,
  User,
  Mail,
  Phone,
  Globe,
  Server,
  ExternalLink,
  Clock,
  AlertCircle,
  MessageSquare,
  Plus,
} from 'lucide-react';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { canViewPayments, canEditProjects, canEditDevelopmentData } = useAuth();
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [newFollowUp, setNewFollowUp] = useState('');

  const project = id ? getProjectById(id) : undefined;

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Project Not Found</h1>
          <button onClick={() => navigate('/projects')} className="btn-primary">
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const developers = getDevelopersByIds(project.developersAssigned);

  const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-4 border-b border-border bg-muted/30">
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );

  const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b border-border last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground text-right">{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Header title={project.projectName} subtitle={project.clientName} />

      <div className="p-6">
        {/* Back and Actions */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate('/projects')} className="btn-ghost">
            <ArrowLeft className="w-4 h-4" /> Back to Projects
          </button>
          {canEditProjects && (
            <button onClick={() => navigate(`/projects/${id}/edit`)} className="btn-primary">
              <Edit className="w-4 h-4" /> Edit Project
            </button>
          )}
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-3 mb-6">
          <span className={`badge ${getProjectStatusBadge(project.projectStatus).className}`}>
            Status: {project.projectStatus}
          </span>
          <span className={`badge ${getPendingFromBadge(project.pendingFrom).className}`}>
            Pending From: {project.pendingFrom}
          </span>
          <span className={`badge ${getPriorityBadge(project.priority).className}`}>
            Priority: {project.priority}
          </span>
          <span className={`badge ${getRiskLevelBadge(project.riskLevel).className}`}>
            Risk: {project.riskLevel}
          </span>
          {canViewPayments && (
            <span className={`badge ${getPaymentStatusBadge(project.paymentStatus).className}`}>
              Payment: {project.paymentStatus}
            </span>
          )}
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Information */}
          <SectionCard title="Project Information">
            <InfoRow label="Project Name" value={project.projectName} />
            <InfoRow label="Client Name" value={project.clientName} />
            <InfoRow label="Project Type" value={project.projectType} />
            <InfoRow label="Framework" value={project.framework} />
            <InfoRow label="Current Stage" value={project.currentStage} />
            <InfoRow label="Content Received" value={project.contentReceived ? 'Yes' : 'No'} />
            <InfoRow label="Final Approval" value={project.finalApproval ? 'Yes' : 'Pending'} />
          </SectionCard>

          {/* Dates & Timeline */}
          <SectionCard title="Dates & Timeline">
            <InfoRow label="Started On" value={formatDate(project.startedOn)} />
            <InfoRow label="Internal Deadline" value={formatDate(project.internalDeadline)} />
            <InfoRow label="Actual Completion" value={formatDate(project.actualCompletion)} />
            <InfoRow label="Live Date" value={formatDate(project.liveDate)} />
            <InfoRow label="Last Follow-up Date" value={formatDate(project.lastFollowUpDate)} />
            <InfoRow label="Warranty End Date" value={formatDate(project.warrantyEndDate)} />
          </SectionCard>

          {/* Status & Responsibility */}
          {canEditDevelopmentData && (
            <SectionCard title="Status & Responsibility">
              <InfoRow
                label="Project Status"
                value={
                  <span className={`badge ${getProjectStatusBadge(project.projectStatus).className}`}>
                    {project.projectStatus}
                  </span>
                }
              />
              <InfoRow
                label="Pending From"
                value={
                  <span className={`badge ${getPendingFromBadge(project.pendingFrom).className}`}>
                    {project.pendingFrom}
                  </span>
                }
              />
              <InfoRow label="Delay Reason" value={project.delayReason || '-'} />
              <InfoRow label="Client Response" value={project.clientResponse} />
              <InfoRow label="Scope Changes" value={project.scopeChanges || '-'} />
            </SectionCard>
          )}

          {/* Developers Assigned */}
          <SectionCard title="Developers Assigned">
            {developers.length > 0 ? (
              <div className="space-y-3">
                {developers.map((dev) => (
                  <div key={dev.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-primary-foreground font-medium">
                        {dev.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{dev.name}</p>
                      <p className="text-sm text-muted-foreground">{dev.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No developers assigned</p>
            )}
          </SectionCard>

          {/* Client Information */}
          <SectionCard title="Client Information">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Contact Person</p>
                  <p className="font-medium text-foreground">{project.clientContactPerson}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{project.clientContactEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">{project.clientContactPhone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Domain</p>
                  <p className="font-medium text-foreground">{project.domain}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Server className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Hosting</p>
                  <p className="font-medium text-foreground">{project.hosting}</p>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Payment & Scope Section */}
          {canViewPayments && (
            <SectionCard title="Payment & Scope">
              <InfoRow label="Total Project Cost" value={formatCurrency(project.totalProjectCost)} />
              <InfoRow
                label="Payment Status"
                value={
                  <span className={`badge ${getPaymentStatusBadge(project.paymentStatus).className}`}>
                    {project.paymentStatus}
                  </span>
                }
              />
              <InfoRow label="AMC Status" value={project.amcStatus ? 'Active' : 'No'} />
              {project.amcStatus && (
                <InfoRow label="AMC Amount" value={formatCurrency(project.amcAmount)} />
              )}
              <InfoRow label="Scope Changes" value={project.scopeChanges || 'None'} />
            </SectionCard>
          )}

          {/* Effort & Priority Section */}
          {canEditDevelopmentData && (
            <SectionCard title="Effort & Priority">
              <InfoRow label="Estimated Effort" value={project.estimatedEffort} />
              <InfoRow label="Actual Effort Spent" value={project.actualEffortSpent} />
              <InfoRow
                label="Priority"
                value={
                  <span className={`badge ${getPriorityBadge(project.priority).className}`}>
                    {project.priority}
                  </span>
                }
              />
              <InfoRow
                label="Risk Level"
                value={
                  <span className={`badge ${getRiskLevelBadge(project.riskLevel).className}`}>
                    {project.riskLevel}
                  </span>
                }
              />
            </SectionCard>
          )}

          {/* Important Links */}
          <SectionCard title="Important Links">
            {project.importantLinks.length > 0 ? (
              <div className="space-y-2">
                {project.importantLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-primary" />
                    <span className="text-foreground">{link.label}</span>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No links added</p>
            )}
          </SectionCard>
        </div>

        {/* Notes Timeline */}
        <div className="mt-6">
          <SectionCard title="Notes Timeline">
            <div className="flex justify-end mb-4">
              <button onClick={() => setShowNoteModal(true)} className="btn-secondary text-sm">
                <Plus className="w-4 h-4" /> Add Note
              </button>
            </div>
            {project.notes.length > 0 ? (
              <div className="space-y-4">
                {project.notes.map((note) => (
                  <div key={note.id} className="timeline-item">
                    <div className="timeline-dot" />
                    <div className="pl-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-foreground">{note.by}</span>
                        <span className="text-xs text-muted-foreground">{formatDate(note.date)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{note.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No notes yet</p>
            )}
          </SectionCard>
        </div>

        {/* Follow-up History */}
        <div className="mt-6">
          <SectionCard title="Follow-up History">
            <div className="flex justify-end mb-4">
              <button onClick={() => setShowFollowUpModal(true)} className="btn-secondary text-sm">
                <Plus className="w-4 h-4" /> Add Follow-up
              </button>
            </div>
            {project.followUpHistory.length > 0 ? (
              <div className="space-y-4">
                {project.followUpHistory.map((followUp) => (
                  <div key={followUp.id} className="timeline-item">
                    <div className="timeline-dot" />
                    <div className="pl-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-foreground">{followUp.by}</span>
                        <span className="text-xs text-muted-foreground">{formatDate(followUp.date)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{followUp.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No follow-ups yet</p>
            )}
          </SectionCard>
        </div>
      </div>

      {/* Add Note Modal */}
      <Modal isOpen={showNoteModal} onClose={() => setShowNoteModal(false)} title="Add Note">
        <div className="space-y-4">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Enter your note..."
            className="form-input min-h-[120px]"
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowNoteModal(false)} className="btn-ghost">
              Cancel
            </button>
            <button onClick={() => setShowNoteModal(false)} className="btn-primary">
              Save Note
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Follow-up Modal */}
      <Modal isOpen={showFollowUpModal} onClose={() => setShowFollowUpModal(false)} title="Add Follow-up">
        <div className="space-y-4">
          <textarea
            value={newFollowUp}
            onChange={(e) => setNewFollowUp(e.target.value)}
            placeholder="Enter follow-up details..."
            className="form-input min-h-[120px]"
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowFollowUpModal(false)} className="btn-ghost">
              Cancel
            </button>
            <button onClick={() => setShowFollowUpModal(false)} className="btn-primary">
              Save Follow-up
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectDetail;
