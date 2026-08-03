import React from 'react';
import { Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import './Alert.css';

export type AlertVariant = 'info' | 'warning' | 'danger' | 'success';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  icon?: boolean | React.ReactNode;
}

const defaultIcons = {
  info: <Info size={20} />,
  warning: <AlertTriangle size={20} />,
  danger: <XCircle size={20} />,
  success: <CheckCircle size={20} />
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className = '', variant = 'info', title, icon = true, children, ...props }, ref) => {
    
    const iconElement = typeof icon === 'boolean' && icon ? defaultIcons[variant] : icon;

    return (
      <div 
        ref={ref} 
        className={`ds-alert ds-alert--${variant} ${className}`} 
        role="alert"
        {...props}
      >
        {iconElement && <div className="ds-alert-icon">{iconElement}</div>}
        <div className="ds-alert-content">
          {title && <h5 className="ds-alert-title">{title}</h5>}
          <div className="ds-alert-description">{children}</div>
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';
