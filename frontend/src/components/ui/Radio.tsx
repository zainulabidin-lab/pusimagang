import React, { type InputHTMLAttributes, forwardRef } from 'react';
import './Toggle.css';

export interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: boolean;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className = '', label, description, error, disabled, ...props }, ref) => {
    return (
      <label className={`ds-toggle-wrapper ${disabled ? 'disabled' : ''} ${error ? 'error' : ''} ${className}`}>
        <div className="ds-radio-container">
          <input
            type="radio"
            className="ds-radio-input"
            disabled={disabled}
            ref={ref}
            {...props}
          />
          <div className="ds-radio-custom">
            <div className="ds-radio-dot"></div>
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

Radio.displayName = 'Radio';
