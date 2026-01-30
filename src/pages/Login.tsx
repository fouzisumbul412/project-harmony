import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/project';
import { Users, Code, Briefcase, Calculator } from 'lucide-react';

const Login: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const roles: { role: UserRole; label: string; description: string; icon: React.ReactNode }[] = [
    {
      role: 'Admin',
      label: 'Admin',
      description: 'Full access to all projects, settings, and team management',
      icon: <Users className="w-6 h-6" />,
    },
    {
      role: 'Developer',
      label: 'Developer',
      description: 'View assigned projects, update status and notes',
      icon: <Code className="w-6 h-6" />,
    },
    {
      role: 'Freelancer',
      label: 'Freelancer',
      description: 'View assigned projects, update progress',
      icon: <Briefcase className="w-6 h-6" />,
    },
    {
      role: 'Accounts',
      label: 'Accounts',
      description: 'View all projects, manage payment information',
      icon: <Calculator className="w-6 h-6" />,
    },
  ];

  const handleLogin = () => {
    if (selectedRole) {
      login(selectedRole);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-center items-center p-12">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-8">
            <span className="text-accent-foreground font-bold text-3xl">OC</span>
          </div>
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">
            Outright Creators
          </h1>
          <p className="text-xl text-primary-foreground/80 mb-6">
            Project CRM
          </p>
          <p className="text-primary-foreground/60 text-sm">
            Manage your web development projects, track client follow-ups, 
            monitor payments, and assign responsibilities all in one place.
          </p>
        </div>
      </div>

      {/* Right Panel - Login */}
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-foreground font-bold text-2xl">OC</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Outright Creators</h1>
            <p className="text-muted-foreground">Project CRM</p>
          </div>

          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Welcome back
          </h2>
          <p className="text-muted-foreground mb-8">
            Select your role to continue to the dashboard
          </p>

          <div className="space-y-3 mb-8">
            {roles.map((item) => (
              <button
                key={item.role}
                onClick={() => setSelectedRole(item.role)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  selectedRole === item.role
                    ? 'border-primary bg-secondary'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      selectedRole === item.role
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleLogin}
            disabled={!selectedRole}
            className="btn-primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue as {selectedRole || '...'}
          </button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            This is a demo application with simulated authentication
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
