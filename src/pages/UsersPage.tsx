// File: C:\xampp\htdocs\project-crm\react-project-crm\src\pages\UsersPage.tsx

import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import { useAuth } from '@/context/AuthContext';
import { addAuditLog } from '@/data/auditLogs';
import { ManagedUser } from '@/types/user';
import { UserRole } from '@/types/project';
import { formatDate } from '@/utils/badges';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Plus,
  Edit2,
  Trash2,
  UserCheck,
  UserX,
  Users,
  Code,
  Briefcase,
  Calculator,
} from 'lucide-react';

const API_BASE = 'http://localhost/project-crm/api/users';

type ManagedUserWithDevFields = ManagedUser & {
  phone?: string | null;
  githubUrl?: string | null;
};

const UsersPage: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<ManagedUserWithDevFields[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUserWithDevFields | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Developer' as UserRole,
    password: '',
    phone: '',
    githubUrl: '',
  });

  const isDevRole = formData.role === 'Developer' || formData.role === 'Freelancer';

  /* ---------------- API HELPERS ---------------- */

  const fetchUsers = async () => {
    const res = await fetch(`${API_BASE}/index.php`, {
      credentials: 'include',
    });
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
  };

  const createUser = async () => {
    const payload: any = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      password: formData.password,
    };

    // ✅ Dev/Freelancer extra fields
    if (isDevRole) {
      payload.phone = formData.phone;
      payload.githubUrl = formData.githubUrl;
    } else {
      payload.phone = null;
      payload.githubUrl = null;
    }

    await fetch(`${API_BASE}/create.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
  };

  const updateUser = async (id: string) => {
    const payload: any = {
      id,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      password: formData.password || undefined,
    };

    // ✅ Dev/Freelancer extra fields
    if (isDevRole) {
      payload.phone = formData.phone;
      payload.githubUrl = formData.githubUrl;
    } else {
      payload.phone = null;
      payload.githubUrl = null;
    }

    await fetch(`${API_BASE}/update.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
  };

  const deleteUser = async (id: string) => {
    await fetch(`${API_BASE}/delete.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id }),
    });
  };

  const toggleStatus = async (id: string, status: boolean) => {
    await fetch(`${API_BASE}/status.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id, status: status ? 1 : 0 }),
    });
  };

  /* ---------------- EFFECT ---------------- */

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ---------------- UI HELPERS ---------------- */

  const roleIcons: Record<UserRole, React.ReactNode> = {
    Admin: <Users className="w-4 h-4" />,
    Developer: <Code className="w-4 h-4" />,
    Freelancer: <Briefcase className="w-4 h-4" />,
    Accounts: <Calculator className="w-4 h-4" />,
  };

  const getRoleBadgeClass = (role: UserRole) => {
    switch (role) {
      case 'Admin':
        return 'badge-purple';
      case 'Developer':
        return 'badge-blue';
      case 'Freelancer':
        return 'badge-yellow';
      case 'Accounts':
        return 'badge-green';
      default:
        return 'badge-gray';
    }
  };

  /* ---------------- HANDLERS ---------------- */

  const openCreateDialog = () => {
    setEditingUser(null);
    setShowPassword(false);
    setFormData({
      name: '',
      email: '',
      role: 'Developer',
      password: '',
      phone: '',
      githubUrl: '',
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (u: ManagedUserWithDevFields) => {
    setEditingUser(u);
    setShowPassword(false);
    setFormData({
      name: u.name,
      email: u.email,
      role: u.role,
      password: '',
      phone: (u.phone as string) || '',
      githubUrl: (u.githubUrl as string) || '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) return;

    if (!editingUser && !formData.password) {
      alert('Password is required');
      return;
    }

    if (isDevRole) {
      if (!formData.phone.trim()) {
        alert('Phone is required for Developer/Freelancer');
        return;
      }
      if (!formData.githubUrl.trim()) {
        alert('GitHub profile link is required for Developer/Freelancer');
        return;
      }
    }

    if (editingUser) {
      await updateUser(editingUser.id);
    } else {
      await createUser();
    }

    setIsDialogOpen(false);
    fetchUsers();
  };

  const handleDelete = async (id: string) => {
    await deleteUser(id);
    addAuditLog({
      action: 'deleted',
      entity: 'user',
      entityId: id,
      entityName: 'User',
      performedBy: { id: user!.id, name: user!.name, role: user!.role },
      timestamp: new Date().toISOString(),
      description: 'Deleted user',
    });
    setDeleteConfirm(null);
    fetchUsers();
  };

  const handleToggleStatus = async (u: ManagedUserWithDevFields) => {
    await toggleStatus(u.id, !u.isActive);
    addAuditLog({
      action: 'updated',
      entity: 'user',
      entityId: u.id,
      entityName: u.name,
      performedBy: { id: user!.id, name: user!.name, role: user!.role },
      timestamp: new Date().toISOString(),
      description: `${u.isActive ? 'Deactivated' : 'Activated'} user "${u.name}"`,
    });
    fetchUsers();
  };

  /* ---------------- JSX ---------------- */

  return (
    <div className="min-h-screen">
      <Header title="User Management" subtitle={`${users.length} users`} />

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground text-sm">
            Manage user accounts and their roles
          </p>
          <button onClick={openCreateDialog} className="btn-primary">
            <Plus className="w-4 h-4" /> Add User
          </button>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Created By</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  return (
                    <tr key={u.id}>
                      <td className="font-medium">{u.name}</td>
                      <td className="text-muted-foreground">{u.email}</td>
                      <td>
                        <span
                          className={`badge ${getRoleBadgeClass(
                            u.role
                          )} inline-flex gap-1`}
                        >
                          {roleIcons[u.role]}
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            u.isActive ? 'badge-green' : 'badge-gray'
                          }`}
                        >
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="text-muted-foreground text-sm">
                        {formatDate(u.createdAt)}
                      </td>
                      <td className="text-muted-foreground text-sm">{u.createdBy}</td>
                      <td>
                        <div className="flex gap-1">
                          <button
                            onClick={() => openEditDialog(u)}
                            className="btn-ghost p-2"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(u)}
                            className="btn-ghost p-2"
                          >
                            {u.isActive ? (
                              <UserX className="w-4 h-4 text-orange-500" />
                            ) : (
                              <UserCheck className="w-4 h-4 text-green-500" />
                            )}
                          </button>
                          {u.id !== user?.id && (
                            <button
                              onClick={() => setDeleteConfirm(u.id)}
                              className="btn-ghost p-2 text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Edit User' : 'Create New User'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter email address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                {editingUser ? 'New Password (optional)' : 'Password'}
              </Label>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder={
                    editingUser
                      ? 'Leave blank to keep existing password'
                      : 'Enter password'
                  }
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? '👁' : '🫣'}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => {
                  const nextRole = e.target.value as UserRole;

                  // switching away from dev roles clears dev-only fields
                  if (nextRole !== 'Developer' && nextRole !== 'Freelancer') {
                    setFormData({
                      ...formData,
                      role: nextRole,
                      phone: '',
                      githubUrl: '',
                    });
                  } else {
                    setFormData({ ...formData, role: nextRole });
                  }
                }}
                className="form-select w-full"
              >
                <option value="Admin">Admin</option>
                <option value="Developer">Developer</option>
                <option value="Freelancer">Freelancer</option>
                <option value="Accounts">Accounts</option>
              </select>
            </div>

            {/* ✅ Developer/Freelancer fields ONLY (no linked profile, no linkedin) */}
            {(formData.role === 'Developer' || formData.role === 'Freelancer') && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="githubUrl">GitHub Profile Link</Label>
                  <Input
                    id="githubUrl"
                    value={formData.githubUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, githubUrl: e.target.value })
                    }
                    placeholder="https://github.com/username"
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <button onClick={() => setIsDialogOpen(false)} className="btn-ghost">
              Cancel
            </button>
            <button onClick={handleSubmit} className="btn-primary">
              {editingUser ? 'Save Changes' : 'Create User'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Are you sure you want to delete this user? This action cannot be undone.
          </p>
          <DialogFooter>
            <button onClick={() => setDeleteConfirm(null)} className="btn-ghost">
              Cancel
            </button>
            <button
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="btn-primary bg-destructive hover:bg-destructive/90"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;
