import React from 'react';
import './EmptyState.css';
import { Search } from 'lucide-react';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  variant?: 'default' | 'card' | 'table';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = <Search size={48} strokeWidth={1} />,
  primaryAction,
  secondaryAction,
  variant = 'default',
}) => {
  const classes = [
    'ds-empty-state',
    `ds-empty-state-${variant}`
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <div className="ds-empty-state-icon">
        {icon}
      </div>
      <h3 className="ds-empty-state-title">{title}</h3>
      {description && (
        <p className="ds-empty-state-description">{description}</p>
      )}
      {(primaryAction || secondaryAction) && (
        <div className="ds-empty-state-actions">
          {secondaryAction}
          {primaryAction}
        </div>
      )}
    </div>
  );
};
