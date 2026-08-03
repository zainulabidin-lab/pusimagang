import React from 'react';
import './EmptyState.css'; // Reusing EmptyState CSS for layout structure
import { ShieldAlert, ServerCrash, WifiOff, FileQuestion, Lock } from 'lucide-react';

export type ErrorType = '404' | '403' | '500' | 'network' | 'permission' | 'empty_search';

export interface ErrorStateProps {
  type?: ErrorType;
  title?: string;
  description?: string;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  variant?: 'default' | 'card' | 'table';
}

const errorConfig: Record<ErrorType, { icon: React.ReactNode; title: string; desc: string }> = {
  '404': {
    icon: <FileQuestion size={48} strokeWidth={1} className="error-icon" />,
    title: 'Page Not Found',
    desc: 'The page you are looking for does not exist or has been moved.'
  },
  '403': {
    icon: <ShieldAlert size={48} strokeWidth={1} className="error-icon" />,
    title: 'Access Denied',
    desc: 'You do not have permission to view this resource.'
  },
  '500': {
    icon: <ServerCrash size={48} strokeWidth={1} className="error-icon" />,
    title: 'Server Error',
    desc: 'Our servers are currently experiencing issues. Please try again later.'
  },
  'network': {
    icon: <WifiOff size={48} strokeWidth={1} className="error-icon" />,
    title: 'Connection Lost',
    desc: 'Please check your internet connection and try again.'
  },
  'permission': {
    icon: <Lock size={48} strokeWidth={1} className="error-icon" />,
    title: 'Action Not Allowed',
    desc: 'You do not have the required permissions to perform this action.'
  },
  'empty_search': {
    icon: <FileQuestion size={48} strokeWidth={1} className="error-icon" />,
    title: 'No Results Found',
    desc: 'We could not find anything matching your search criteria.'
  }
};

export const ErrorState: React.FC<ErrorStateProps> = ({
  type = '404',
  title,
  description,
  primaryAction,
  secondaryAction,
  variant = 'default'
}) => {
  const config = errorConfig[type];

  const classes = [
    'ds-empty-state',
    `ds-empty-state-${variant}`
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <div className="ds-empty-state-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
        {config.icon}
      </div>
      <h3 className="ds-empty-state-title">{title || config.title}</h3>
      <p className="ds-empty-state-description">{description || config.desc}</p>
      
      {(primaryAction || secondaryAction) && (
        <div className="ds-empty-state-actions">
          {secondaryAction}
          {primaryAction}
        </div>
      )}
    </div>
  );
};
