import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Plus,
  LogOut,
  ChevronLeft,
  ChevronRight,
  History,
  UserPlus,
  Columns,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const { user, logout, canAddProjects, canManageUsers, canViewAuditHistory } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/projects', label: 'Projects', icon: FolderKanban },
    { path: '/kanban', label: 'Kanban Board', icon: Columns },
    ...(canAddProjects
      ? [{ path: '/projects/new', label: 'Add Project', icon: Plus }]
      : []),
    ...(user?.role === 'Admin'
      ? [{ path: '/developers', label: 'Developers', icon: Users }]
      : []),
    ...(canManageUsers
      ? [{ path: '/users', label: 'User Management', icon: UserPlus }]
      : []),
    ...(canViewAuditHistory
      ? [{ path: '/audit-history', label: 'Audit History', icon: History }]
      : []),
  ];

  const isActive = (path: string) => {
    if (path === '/projects') {
      return location.pathname === '/projects';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-sidebar flex flex-col transition-all duration-300 z-50 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-bold text-sm">OC</span>
            </div>
            <span className="text-sidebar-foreground font-semibold text-sm">
              Outright Creators
            </span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center mx-auto">
            <span className="text-sidebar-primary-foreground font-bold text-sm">OC</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={`sidebar-link ${
                  isActive(item.path)
                    ? 'sidebar-link-active'
                    : 'sidebar-link-inactive'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-sidebar-border">
        {!collapsed && user && (
          <div className="mb-3">
            <p className="text-sidebar-foreground text-sm font-medium truncate">
              {user.name}
            </p>
            <p className="text-sidebar-foreground/60 text-xs">{user.role}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="sidebar-link sidebar-link-inactive w-full"
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </aside>
  );
};

export default Sidebar;
