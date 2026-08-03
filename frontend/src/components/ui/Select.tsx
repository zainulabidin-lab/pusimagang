import React, { type SelectHTMLAttributes, forwardRef } from 'react';
import './Input.css'; // Reuses input styling
import { ChevronDown, AlertCircle, CheckCircle } from 'lucide-react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  error?: boolean;
  success?: boolean;
  warning?: boolean;
  fullWidth?: boolean;
  floatingLabel?: boolean;
  options: { value: string | number; label: string; disabled?: boolean }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className = '',
      label,
      helperText,
      leftIcon,
      error = false,
      success = false,
      warning = false,
      fullWidth = false,
      floatingLabel = false,
      options,
      disabled,
      value,
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || `ds-select-${Math.random().toString(36).substr(2, 9)}`;
    const hasValue = value !== undefined && value !== null && String(value).length > 0;
    
    const wrapperClasses = [
      'ds-input-wrapper',
      fullWidth ? 'ds-input-full' : '',
      disabled ? 'ds-input-disabled' : '',
      error ? 'ds-input-error' : '',
      success ? 'ds-input-success' : '',
      warning ? 'ds-input-warning' : '',
      floatingLabel ? 'ds-input-floating-wrapper' : '',
      className
    ].filter(Boolean).join(' ');

    return (
      <div className={wrapperClasses}>
        {label && !floatingLabel && (
          <label htmlFor={selectId} className="ds-input-label">
            {label}
            {props.required && <span className="ds-input-required">*</span>}
          </label>
        )}
        
        <div className="ds-input-container">
          {leftIcon && <div className="ds-input-icon-left">{leftIcon}</div>}
          
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            value={value}
            className={`ds-input ${leftIcon ? 'has-left-icon' : ''} has-right-icon`}
            style={{ appearance: 'none' }}
            {...props}
          >
            {/* If there's no default value, we can optionally show a placeholder */}
            {!hasValue && <option value="" disabled hidden></option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          {floatingLabel && label && (
            <label htmlFor={selectId} className={`ds-input-floating-label ${hasValue ? 'is-filled' : ''}`}>
              {label} {props.required && '*'}
            </label>
          )}

          <div className="ds-input-icon-right" style={{ pointerEvents: 'none' }}>
            {error && <AlertCircle size={16} className="ds-input-status-icon error" />}
            {success && <CheckCircle size={16} className="ds-input-status-icon success" />}
            {!error && !success && <ChevronDown size={16} />}
          </div>
        </div>

        {helperText && (
          <div className="ds-input-helper-text">
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
