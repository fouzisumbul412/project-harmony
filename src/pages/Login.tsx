import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/project';
import { Users, Code, Briefcase, Calculator, ArrowLeft } from 'lucide-react';

type Step = 'ROLE' | 'CREDENTIALS';

const Login: React.FC = () => {
  const [step, setStep] = useState<Step>('ROLE');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const roles = [
    {
      role: 'Admin' as UserRole,
      label: 'Admin',
      description: 'Full access to all projects, settings, and team management',
      icon: <Users className="w-6 h-6" />,
    },
    {
      role: 'Developer' as UserRole,
      label: 'Developer',
      description: 'View assigned projects, update status and notes',
      icon: <Code className="w-6 h-6" />,
    },
    {
      role: 'Freelancer' as UserRole,
      label: 'Freelancer',
      description: 'View assigned projects, update progress',
      icon: <Briefcase className="w-6 h-6" />,
    },
    {
      role: 'Accounts' as UserRole,
      label: 'Accounts',
      description: 'View all projects, manage payment information',
      icon: <Calculator className="w-6 h-6" />,
    },
  ];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep('CREDENTIALS');
  };

  const handleLogin = async () => {
    setError('');
    if (!email || !password) return;

    const success = await login(email, password);

    if (!success) {
      setError('Invalid email or password');
      return;
    }

    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Branding Panel */}
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
            Manage projects, clients, payments, and responsibilities in one place.
          </p>
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Welcome back
          </h2>

          {step === 'ROLE' && (
            <>
              <p className="text-muted-foreground mb-8">
                Select your role to continue
              </p>

              <div className="space-y-3">
                {roles.map((item) => (
                  <button
                    key={item.role}
                    onClick={() => handleRoleSelect(item.role)}
                    className="w-full p-4 rounded-xl border-2 border-border text-left hover:border-primary hover:bg-muted/50 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                        {item.icon}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{item.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 'CREDENTIALS' && selectedRole && (
            <>
              <button
                onClick={() => setStep('ROLE')}
                className="flex items-center gap-2 text-sm text-muted-foreground mb-6"
              >
                <ArrowLeft size={16} />
                Change role
              </button>

              <div className="mb-4">
                <p className="text-sm text-muted-foreground">Logging in as</p>
                <p className="text-lg font-semibold">{selectedRole}</p>
              </div>

              <div className="space-y-4 mb-4">
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-border"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-border"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 mb-4">{error}</p>
              )}

              <button
                onClick={handleLogin}
                className="btn-primary w-full py-3"
              >
                Login as {selectedRole}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
