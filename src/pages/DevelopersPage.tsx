import React from 'react';
import Header from '@/components/layout/Header';
import { developers } from '@/data/developers';
import { projects } from '@/data/projects';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DevelopersPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Only Admin can access this page
  if (user?.role !== 'Admin') {
    navigate('/dashboard');
    return null;
  }

  // Calculate projects count for each developer
  const developersWithCount = developers.map((dev) => ({
    ...dev,
    projectsCount: projects.filter((p) => p.developersAssigned.includes(dev.id)).length,
  }));

  return (
    <div className="min-h-screen">
      <Header
        title="Developers"
        subtitle={`${developers.length} team members`}
      />

      <div className="p-6">
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Projects Count</th>
              </tr>
            </thead>
            <tbody>
              {developersWithCount.map((dev) => (
                <tr key={dev.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-medium text-sm">
                          {dev.name.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium text-foreground">{dev.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${dev.type === 'Internal' ? 'badge-info' : 'badge-purple'}`}>
                      {dev.type}
                    </span>
                  </td>
                  <td className="text-muted-foreground">{dev.email}</td>
                  <td className="text-muted-foreground">{dev.phone}</td>
                  <td>
                    <span className="badge badge-gray">{dev.projectsCount} projects</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DevelopersPage;
