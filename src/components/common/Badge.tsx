import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'gray' | 'orange';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'gray', className = '' }) => {
  const variantClasses = {
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
    purple: 'badge-purple',
    gray: 'badge-gray',
    orange: 'badge-orange',
  };

  return (
    <span className={`badge ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
