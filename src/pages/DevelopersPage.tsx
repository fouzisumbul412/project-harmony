import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Developer } from '@/types/project';

const API = 'http://localhost/project-crm/api/developers';

type DeveloperRow = Developer & {
  userId: string;
  isActive: boolean;
  projectsCount: number;
};

const DevelopersPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [developers, setDevelopers] = useState<DeveloperRow[]>([]);

  // Only Admin can access this page
  useEffect(() => {
    if (user && user.role !== 'Admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;
    if (user.role !== 'Admin') return;

    const fetchDevelopers = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${API}/index.php?includeInactiveUsers=1&includeInactiveProjects=1`,
          { credentials: 'include' }
        );

        const data = await res.json();
        setDevelopers(Array.isArray(data) ? data : []);
      } catch (e) {
        setDevelopers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDevelopers();
  }, [user]);

  if (!user) return null;

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading developers…</div>;
  }

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
                <th>GitHub</th>
                <th>Projects Count</th>
              </tr>
            </thead>
            <tbody>
              {developers.map((dev) => (
                <tr key={dev.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-medium text-sm">
                          {dev.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{dev.name}</span>
                        {!dev.isActive && (
                          <span className="text-xs text-muted-foreground">Inactive</span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className={`badge ${dev.type === 'Internal' ? 'badge-info' : 'badge-purple'}`}>
                      {dev.type}
                    </span>
                  </td>

                  <td className="text-muted-foreground">{dev.email}</td>
                  <td className="text-muted-foreground">{dev.phone}</td>

                  <td className="text-muted-foreground">
                    {dev.githubUrl ? (
                      <a
                        href={dev.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                      >
                        View
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>

                  <td>
                    <span className="badge badge-gray">{dev.projectsCount} projects</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {developers.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">
              No developers found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DevelopersPage;
