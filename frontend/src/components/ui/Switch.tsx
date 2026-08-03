import React, { type InputHTMLAttributes, forwardRef } from 'react';
import './Toggle.css';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: boolean;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className = '', label, description, error, disabled, ...props }, ref) => {
    return (
      <label className={`ds-toggle-wrapper ${disabled ? 'disabled' : ''} ${error ? 'error' : ''} ${className}`}>
        <div className="ds-switch-container">
          <input
            type="checkbox"
            className="ds-switch-input"
            disabled={disabled}
            ref={ref}
            {...props}
          />
          <div className="ds-switch-custom">
            <div className="ds-switch-thumb"></div>
          </div>
        </div>
        {(label || description) && (
          <div className="ds-toggle-label-container">
            {label && <span className="ds-toggle-label">{label}</span>}
            {description && <span className="ds-toggle-description">{description}</span>}
          </div>
        )}
      </label>
    );
  }
);

Switch.displayName = 'Switch';
