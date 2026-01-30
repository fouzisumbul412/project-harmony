import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { useAuth } from '@/context/AuthContext';
import { getProjectById, projects } from '@/data/projects';
import { developers } from '@/data/developers';
import {
  Project,
  ProjectStatus,
  PendingFrom,
  PaymentStatus,
  Priority,
  RiskLevel,
  ProjectType,
} from '@/types/project';
import { ArrowLeft, Save, Plus, Trash } from 'lucide-react';

const ProjectForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { canEditProjects, canViewPayments } = useAuth();
  const isEdit = Boolean(id);
  const existingProject = id ? getProjectById(id) : undefined;

  // Form state
  const [formData, setFormData] = useState({
    projectName: '',
    clientName: '',
    developersAssigned: [] as string[],
    framework: '',
    startedOn: '',
    internalDeadline: '',
    actualCompletion: '',
    liveDate: '',
    projectStatus: 'Not Started' as ProjectStatus,
    currentStage: '',
    pendingFrom: 'Developer' as PendingFrom,
    delayReason: '',
    contentReceived: false,
    clientResponse: '',
    lastFollowUpDate: '',
    finalApproval: false,
    paymentStatus: 'Pending' as PaymentStatus,
    scopeChanges: '',
    domain: '',
    hosting: '',
    priority: 'Medium' as Priority,
    projectType: 'Website' as ProjectType,
    estimatedEffort: '',
    actualEffortSpent: '',
    clientContactPerson: '',
    clientContactEmail: '',
    clientContactPhone: '',
    totalProjectCost: 0,
    warrantyEndDate: '',
    amcStatus: false,
    amcAmount: 0,
    riskLevel: 'Low' as RiskLevel,
    importantLinks: [{ label: '', url: '' }],
  });

  useEffect(() => {
    if (existingProject) {
      setFormData({
        ...existingProject,
        actualCompletion: existingProject.actualCompletion || '',
        liveDate: existingProject.liveDate || '',
        warrantyEndDate: existingProject.warrantyEndDate || '',
        importantLinks: existingProject.importantLinks.length > 0 
          ? existingProject.importantLinks 
          : [{ label: '', url: '' }],
      });
    }
  }, [existingProject]);

  if (!canEditProjects) {
    navigate('/projects');
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleDeveloperChange = (developerId: string) => {
    setFormData((prev) => ({
      ...prev,
      developersAssigned: prev.developersAssigned.includes(developerId)
        ? prev.developersAssigned.filter((id) => id !== developerId)
        : [...prev.developersAssigned, developerId],
    }));
  };

  const handleLinkChange = (index: number, field: 'label' | 'url', value: string) => {
    setFormData((prev) => ({
      ...prev,
      importantLinks: prev.importantLinks.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      ),
    }));
  };

  const addLink = () => {
    setFormData((prev) => ({
      ...prev,
      importantLinks: [...prev.importantLinks, { label: '', url: '' }],
    }));
  };

  const removeLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      importantLinks: prev.importantLinks.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to a database
    console.log('Saving project:', formData);
    navigate('/projects');
  };

  const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-card rounded-xl border border-border overflow-hidden mb-6">
      <div className="px-5 py-4 border-b border-border bg-muted/30">
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Header
        title={isEdit ? 'Edit Project' : 'Add New Project'}
        subtitle={isEdit ? existingProject?.projectName : 'Create a new project entry'}
      />

      <form onSubmit={handleSubmit} className="p-6">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate('/projects')}
          className="btn-ghost mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </button>

        {/* Core Information */}
        <FormSection title="Core Information">
          <div>
            <label className="form-label">Project Name *</label>
            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="form-label">Client Name *</label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="form-label">Project Type *</label>
            <select
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="Website">Website</option>
              <option value="CRM">CRM</option>
              <option value="Ecommerce">Ecommerce</option>
              <option value="Landing">Landing</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
          <div>
            <label className="form-label">Framework</label>
            <input
              type="text"
              name="framework"
              value={formData.framework}
              onChange={handleChange}
              className="form-input"
              placeholder="React, Next.js, etc."
            />
          </div>
          <div>
            <label className="form-label">Domain</label>
            <input
              type="text"
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Hosting</label>
            <input
              type="text"
              name="hosting"
              value={formData.hosting}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </FormSection>

        {/* Developers */}
        <FormSection title="Developers Assigned">
          <div className="col-span-2">
            <label className="form-label">Select Developers</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {developers.map((dev) => (
                <label
                  key={dev.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    formData.developersAssigned.includes(dev.id)
                      ? 'border-primary bg-secondary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.developersAssigned.includes(dev.id)}
                    onChange={() => handleDeveloperChange(dev.id)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <div>
                    <p className="font-medium text-foreground text-sm">{dev.name}</p>
                    <p className="text-xs text-muted-foreground">{dev.type}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </FormSection>

        {/* Dates & Timeline */}
        <FormSection title="Dates & Timeline">
          <div>
            <label className="form-label">Started On</label>
            <input
              type="date"
              name="startedOn"
              value={formData.startedOn}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Internal Deadline</label>
            <input
              type="date"
              name="internalDeadline"
              value={formData.internalDeadline}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Actual Completion</label>
            <input
              type="date"
              name="actualCompletion"
              value={formData.actualCompletion}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Live Date</label>
            <input
              type="date"
              name="liveDate"
              value={formData.liveDate}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Last Follow-up Date</label>
            <input
              type="date"
              name="lastFollowUpDate"
              value={formData.lastFollowUpDate}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Warranty End Date</label>
            <input
              type="date"
              name="warrantyEndDate"
              value={formData.warrantyEndDate}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </FormSection>

        {/* Status & Responsibility */}
        <FormSection title="Status & Responsibility">
          <div>
            <label className="form-label">Project Status</label>
            <select
              name="projectStatus"
              value={formData.projectStatus}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed (Dev)">Completed (Dev)</option>
              <option value="Completed (Client Approved)">Completed (Client Approved)</option>
            </select>
          </div>
          <div>
            <label className="form-label">Current Stage</label>
            <input
              type="text"
              name="currentStage"
              value={formData.currentStage}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., UI Development"
            />
          </div>
          <div>
            <label className="form-label">Pending From</label>
            <select
              name="pendingFrom"
              value={formData.pendingFrom}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Client">Client</option>
              <option value="Developer">Developer</option>
              <option value="Third Party">Third Party</option>
              <option value="Done">Done</option>
            </select>
          </div>
          <div>
            <label className="form-label">Delay Reason</label>
            <input
              type="text"
              name="delayReason"
              value={formData.delayReason}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="contentReceived"
              name="contentReceived"
              checked={formData.contentReceived}
              onChange={handleChange}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="contentReceived" className="text-sm font-medium text-foreground">
              Content Received
            </label>
          </div>
          <div>
            <label className="form-label">Client Response</label>
            <input
              type="text"
              name="clientResponse"
              value={formData.clientResponse}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., Active, Slow, etc."
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="finalApproval"
              name="finalApproval"
              checked={formData.finalApproval}
              onChange={handleChange}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="finalApproval" className="text-sm font-medium text-foreground">
              Final Approval Received
            </label>
          </div>
          <div>
            <label className="form-label">Scope Changes</label>
            <textarea
              name="scopeChanges"
              value={formData.scopeChanges}
              onChange={handleChange}
              className="form-input min-h-[80px]"
              placeholder="Describe any scope changes..."
            />
          </div>
        </FormSection>

        {/* Client Information */}
        <FormSection title="Client Information">
          <div>
            <label className="form-label">Contact Person</label>
            <input
              type="text"
              name="clientContactPerson"
              value={formData.clientContactPerson}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Contact Email</label>
            <input
              type="email"
              name="clientContactEmail"
              value={formData.clientContactEmail}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Contact Phone</label>
            <input
              type="tel"
              name="clientContactPhone"
              value={formData.clientContactPhone}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </FormSection>

        {/* Effort & Priority */}
        <FormSection title="Effort & Priority">
          <div>
            <label className="form-label">Estimated Effort</label>
            <input
              type="text"
              name="estimatedEffort"
              value={formData.estimatedEffort}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., 200 hours"
            />
          </div>
          <div>
            <label className="form-label">Actual Effort Spent</label>
            <input
              type="text"
              name="actualEffortSpent"
              value={formData.actualEffortSpent}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., 150 hours"
            />
          </div>
          <div>
            <label className="form-label">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label className="form-label">Risk Level</label>
            <select
              name="riskLevel"
              value={formData.riskLevel}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </FormSection>

        {/* Payment Section */}
        {canViewPayments && (
          <FormSection title="Payment & AMC">
            <div>
              <label className="form-label">Total Project Cost (₹)</label>
              <input
                type="number"
                name="totalProjectCost"
                value={formData.totalProjectCost}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Payment Status</label>
              <select
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Fully Paid">Fully Paid</option>
                <option value="Pending">Pending</option>
                <option value="Partial">Partial</option>
                <option value="Extra Pending">Extra Pending</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="amcStatus"
                name="amcStatus"
                checked={formData.amcStatus}
                onChange={handleChange}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="amcStatus" className="text-sm font-medium text-foreground">
                AMC Active
              </label>
            </div>
            {formData.amcStatus && (
              <div>
                <label className="form-label">AMC Amount (₹)</label>
                <input
                  type="number"
                  name="amcAmount"
                  value={formData.amcAmount}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            )}
          </FormSection>
        )}

        {/* Important Links */}
        <div className="bg-card rounded-xl border border-border overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Important Links</h3>
            <button type="button" onClick={addLink} className="btn-ghost text-sm">
              <Plus className="w-4 h-4" /> Add Link
            </button>
          </div>
          <div className="p-5 space-y-3">
            {formData.importantLinks.map((link, index) => (
              <div key={index} className="flex gap-3 items-start">
                <div className="flex-1">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => handleLinkChange(index, 'label', e.target.value)}
                    className="form-input"
                    placeholder="Label (e.g., Figma)"
                  />
                </div>
                <div className="flex-[2]">
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                    className="form-input"
                    placeholder="URL"
                  />
                </div>
                {formData.importantLinks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLink(index)}
                    className="btn-ghost text-destructive p-2"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/projects')} className="btn-ghost">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            <Save className="w-4 h-4" /> {isEdit ? 'Update Project' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
