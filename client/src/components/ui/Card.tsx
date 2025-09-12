import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
}

export function Card({ children, className, variant = 'default', ...props }: CardProps) {
  const baseClasses = 'card';
  
  const variantClasses = {
    default: '',
    outlined: 'border-2 bg-transparent',
    elevated: 'card-elevated'
  };

  return (
    <div 
      className={cn(baseClasses, variantClasses[variant], className)} 
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function CardHeader({ title, description, action }: CardHeaderProps) {
  return (
    <div className="card-header">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-heading-3">{title}</h3>
          {description && (
            <p className="text-body-sm text-secondary mt-1">{description}</p>
          )}
        </div>
        {action && <div className="ml-4">{action}</div>}
      </div>
    </div>
  );
}

export function CardContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('card-body', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('card-footer', className)} {...props}>
      {children}
    </div>
  );
}
