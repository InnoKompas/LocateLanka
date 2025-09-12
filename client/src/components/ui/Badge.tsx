import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'gray';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export function Badge({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children,
  ...props 
}: BadgeProps) {
  const baseClasses = 'badge';
  
  const variantClasses = {
    primary: 'badge-primary',
    success: 'badge-success', 
    warning: 'badge-warning',
    error: 'badge-error',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-2.5 py-1.5'
  };

  return (
    <span
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
