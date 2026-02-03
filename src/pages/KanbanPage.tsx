import React, { useState, useMemo } from 'react';
import Header from '@/components/layout/Header';
import { useAuth } from '@/context/AuthContext';
import { projects } from '@/data/projects';
import { getDevelopersByIds } from '@/data/developers';
import { getPriorityBadge, getRiskLevelBadge, formatDate } from '@/utils/badges';
import { ProjectStatus } from '@/types/project';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, AlertTriangle } from 'lucide-react';

const statusColumns: { status: ProjectStatus; label: string; color: string }[] = [
  { status: 'Not Started', label: 'Not Started', color: 'bg-muted' },
  { status: 'In Progress', label: 'In Progress', color: 'bg-yellow-500' },
  { status: 'Completed (Dev)', label: 'Completed (Dev)', color: 'bg-blue-500' },
  { status: 'Completed (Client Approved)', label: 'Client Approved', color: 'bg-green-500' },
];

const KanbanPage: React.FC = () => {
  const { user, canViewAllProjects } = useAuth();
  const navigate = useNavigate();
  const [draggedProjectId, setDraggedProjectId] = useState<string | null>(null);

  const visibleProjects = useMemo(() => {
    if (canViewAllProjects) {
      return projects;
    }
    return projects.filter((p) =>
      user?.developerId ? p.developersAssigned.includes(user.developerId) : false
    );
  }, [canViewAllProjects, user?.developerId]);

  const projectsByStatus = useMemo(() => {
    const grouped: Record<ProjectStatus, typeof projects> = {
      'Not Started': [],
      'In Progress': [],
      'Completed (Dev)': [],
      'Completed (Client Approved)': [],
    };

    visibleProjects.forEach((project) => {
      if (grouped[project.projectStatus]) {
        grouped[project.projectStatus].push(project);
      }
    });

    return grouped;
  }, [visibleProjects]);

  const handleDragStart = (e: React.DragEvent, projectId: string) => {
    setDraggedProjectId(projectId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStatus: ProjectStatus) => {
    e.preventDefault();
    if (draggedProjectId) {
      // In a real app, this would update the project status
      console.log(`Moving project ${draggedProjectId} to ${newStatus}`);
      // For now, just log - would need state management for real updates
    }
    setDraggedProjectId(null);
  };

  const handleDragEnd = () => {
    setDraggedProjectId(null);
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Kanban Board"
        subtitle={`${visibleProjects.length} projects across ${statusColumns.length} stages`}
      />

      <div className="p-6">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {statusColumns.map((column) => (
            <div
              key={column.status}
              className="flex-shrink-0 w-80 bg-muted/30 rounded-xl border border-border"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.status)}
            >
              {/* Column Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${column.color}`} />
                  <h3 className="font-semibold text-foreground">{column.label}</h3>
                  <span className="ml-auto bg-muted text-muted-foreground text-xs font-medium px-2 py-1 rounded-full">
                    {projectsByStatus[column.status].length}
                  </span>
                </div>
              </div>

              {/* Cards Container */}
              <div className="p-3 space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto">
                {projectsByStatus[column.status].map((project) => {
                  const devs = getDevelopersByIds(project.developersAssigned);
                  const isHighRisk = project.riskLevel === 'High';
                  const isUrgent = project.priority === 'Urgent' || project.priority === 'High';

                  return (
                    <div
                      key={project.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, project.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => navigate(`/projects/${project.id}`)}
                      className={`
                        bg-card rounded-lg border border-border p-4 cursor-pointer
                        hover:shadow-md hover:border-primary/30 transition-all
                        ${draggedProjectId === project.id ? 'opacity-50 rotate-2 scale-105' : ''}
                        ${isHighRisk ? 'border-l-4 border-l-red-500' : ''}
                      `}
                    >
                      {/* Project Header */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h4 className="font-medium text-foreground text-sm line-clamp-2">
                          {project.projectName}
                        </h4>
                        {isHighRisk && (
                          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        )}
                      </div>

                      {/* Client */}
                      <p className="text-xs text-muted-foreground mb-3 truncate">
                        {project.clientName}
                      </p>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className={`badge text-xs ${getPriorityBadge(project.priority).className}`}>
                          {project.priority}
                        </span>
                        <span className={`badge text-xs ${getRiskLevelBadge(project.riskLevel).className}`}>
                          {project.riskLevel}
                        </span>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(project.internalDeadline)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{devs.length}</span>
                        </div>
                      </div>

                      {/* Developers Avatars */}
                      {devs.length > 0 && (
                        <div className="flex -space-x-2 mt-3">
                          {devs.slice(0, 3).map((dev, idx) => (
                            <div
                              key={dev.id}
                              className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium border-2 border-card"
                              title={dev.name}
                            >
                              {dev.name.charAt(0)}
                            </div>
                          ))}
                          {devs.length > 3 && (
                            <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-medium border-2 border-card">
                              +{devs.length - 3}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {projectsByStatus[column.status].length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No projects
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KanbanPage;
