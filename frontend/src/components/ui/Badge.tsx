import React, { type HTMLAttributes, forwardRef } from 'react';
import './Badge.css';

export type BadgeVariant = 
  | 'default'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'completed'
  | 'cancelled'
  | 'draft'
  | 'expired'
  | 'in_progress'
  | 'new'
  | 'archived'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', variant = 'default', size = 'md', dot = false, children, ...props }, ref) => {
    
    // Map standard generic variants to specific semantic ones for backwards compatibility
    let appliedVariant = variant;
    if (variant === 'success') appliedVariant = 'completed';
    if (variant === 'warning') appliedVariant = 'pending';
    if (variant === 'danger') appliedVariant = 'rejected';
    if (variant === 'info') appliedVariant = 'new';
    
    const classes = [
      'ds-badge',
      `ds-badge-${appliedVariant}`,
      `ds-badge-${size}`,
      className
    ].filter(Boolean).join(' ');

    return (
      <span ref={ref} className={classes} {...props}>
        {dot && <span className="ds-badge-dot" />}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
