import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import { useAuth } from '@/context/AuthContext';
import { managedUsers, addUser, updateUser, deleteUser } from '@/data/users';
import { developers } from '@/data/developers';
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

const UsersPage: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<ManagedUser[]>(managedUsers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Developer' as UserRole,
    developerId: '',
  });

  const roleIcons: Record<UserRole, React.ReactNode> = {
    Admin: <Users className="w-4 h-4" />,
    Developer: <Code className="w-4 h-4" />,
    Freelancer: <Briefcase className="w-4 h-4" />,
    Accounts: <Calculator className="w-4 h-4" />,
  };

  const getRoleBadgeClass = (role: UserRole): string => {
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

  const openCreateDialog = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'Developer', developerId: '' });
    setIsDialogOpen(true);
  };

  const openEditDialog = (u: ManagedUser) => {
    setEditingUser(u);
    setFormData({
      name: u.name,
      email: u.email,
      role: u.role,
      developerId: u.developerId || '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email) return;

    if (editingUser) {
      // Update existing user
      const updated = updateUser(editingUser.id, {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        developerId: formData.role === 'Developer' || formData.role === 'Freelancer' 
          ? formData.developerId 
          : undefined,
      });

      if (updated) {
        addAuditLog({
          action: 'updated',
          entity: 'user',
          entityId: updated.id,
          entityName: updated.name,
          changes: [
            { field: 'name', oldValue: editingUser.name, newValue: updated.name },
            { field: 'email', oldValue: editingUser.email, newValue: updated.email },
            { field: 'role', oldValue: editingUser.role, newValue: updated.role },
          ],
          performedBy: { id: user!.id, name: user!.name, role: user!.role },
          timestamp: new Date().toISOString(),
          description: `Updated user "${updated.name}"`,
        });
        setUsers([...managedUsers]);
      }
    } else {
      // Create new user
      const newUser = addUser({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        developerId: formData.role === 'Developer' || formData.role === 'Freelancer' 
          ? formData.developerId 
          : undefined,
        createdAt: new Date().toISOString(),
        createdBy: user!.name,
        isActive: true,
      });

      addAuditLog({
        action: 'created',
        entity: 'user',
        entityId: newUser.id,
        entityName: newUser.name,
        performedBy: { id: user!.id, name: user!.name, role: user!.role },
        timestamp: new Date().toISOString(),
        description: `Created user "${newUser.name}" with role ${newUser.role}`,
      });
      setUsers([...managedUsers]);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (userId: string) => {
    const userToDelete = users.find((u) => u.id === userId);
    if (!userToDelete) return;

    const success = deleteUser(userId);
    if (success) {
      addAuditLog({
        action: 'deleted',
        entity: 'user',
        entityId: userId,
        entityName: userToDelete.name,
        performedBy: { id: user!.id, name: user!.name, role: user!.role },
        timestamp: new Date().toISOString(),
        description: `Deleted user "${userToDelete.name}"`,
      });
      setUsers([...managedUsers]);
    }
    setDeleteConfirm(null);
  };

  const toggleUserStatus = (userId: string) => {
    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) return;

    const updated = updateUser(userId, { isActive: !targetUser.isActive });
    if (updated) {
      addAuditLog({
        action: 'updated',
        entity: 'user',
        entityId: updated.id,
        entityName: updated.name,
        changes: [{ field: 'isActive', oldValue: targetUser.isActive, newValue: updated.isActive }],
        performedBy: { id: user!.id, name: user!.name, role: user!.role },
        timestamp: new Date().toISOString(),
        description: `${updated.isActive ? 'Activated' : 'Deactivated'} user "${updated.name}"`,
      });
      setUsers([...managedUsers]);
    }
  };

  // Get unassigned developers for linking
  const getAvailableDevelopers = () => {
    const assignedDevIds = users
      .filter((u) => u.developerId && u.id !== editingUser?.id)
      .map((u) => u.developerId);
    return developers.filter((d) => !assignedDevIds.includes(d.id));
  };

  return (
    <div className="min-h-screen">
      <Header title="User Management" subtitle={`${users.length} users`} />

      <div className="p-6">
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground text-sm">
            Manage user accounts and their roles
          </p>
          <button onClick={openCreateDialog} className="btn-primary">
            <Plus className="w-4 h-4" /> Add User
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Developer Profile</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Created By</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const linkedDev = u.developerId 
                    ? developers.find((d) => d.id === u.developerId) 
                    : null;
                  return (
                    <tr key={u.id}>
                      <td className="font-medium text-foreground">{u.name}</td>
                      <td className="text-muted-foreground">{u.email}</td>
                      <td>
                        <span className={`badge ${getRoleBadgeClass(u.role)} inline-flex items-center gap-1`}>
                          {roleIcons[u.role]}
                          {u.role}
                        </span>
                      </td>
                      <td className="text-muted-foreground text-sm">
                        {linkedDev ? linkedDev.name : '-'}
                      </td>
                      <td>
                        <span className={`badge ${u.isActive ? 'badge-green' : 'badge-gray'}`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="text-muted-foreground text-sm">
                        {formatDate(u.createdAt)}
                      </td>
                      <td className="text-muted-foreground text-sm">{u.createdBy}</td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditDialog(u)}
                            className="btn-ghost p-2"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleUserStatus(u.id)}
                            className="btn-ghost p-2"
                            title={u.isActive ? 'Deactivate' : 'Activate'}
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
                              title="Delete"
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
            <DialogTitle>{editingUser ? 'Edit User' : 'Create New User'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="form-select w-full"
              >
                <option value="Admin">Admin</option>
                <option value="Developer">Developer</option>
                <option value="Freelancer">Freelancer</option>
                <option value="Accounts">Accounts</option>
              </select>
            </div>
            {(formData.role === 'Developer' || formData.role === 'Freelancer') && (
              <div className="space-y-2">
                <Label htmlFor="developerId">Link to Developer Profile</Label>
                <select
                  id="developerId"
                  value={formData.developerId}
                  onChange={(e) => setFormData({ ...formData, developerId: e.target.value })}
                  className="form-select w-full"
                >
                  <option value="">No linked profile</option>
                  {getAvailableDevelopers().map((dev) => (
                    <option key={dev.id} value={dev.id}>
                      {dev.name} ({dev.type})
                    </option>
                  ))}
                  {editingUser?.developerId && (
                    <option value={editingUser.developerId}>
                      {developers.find((d) => d.id === editingUser.developerId)?.name} (current)
                    </option>
                  )}
                </select>
              </div>
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
