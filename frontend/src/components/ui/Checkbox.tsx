import React, { type InputHTMLAttributes, forwardRef } from 'react';
import './Toggle.css';
import { Check } from 'lucide-react';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', label, description, error, disabled, ...props }, ref) => {
    return (
      <label className={`ds-toggle-wrapper ${disabled ? 'disabled' : ''} ${error ? 'error' : ''} ${className}`}>
        <div className="ds-checkbox-container">
          <input
            type="checkbox"
            className="ds-checkbox-input"
            disabled={disabled}
            ref={ref}
            {...props}
          />
          <div className="ds-checkbox-custom">
            <Check size={14} className="ds-checkbox-icon" strokeWidth={3} />
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

Checkbox.displayName = 'Checkbox';
