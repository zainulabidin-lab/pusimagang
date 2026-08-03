import React from 'react';
import './Input.css';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, helperText, ...props }, ref) => {
    
    const wrapperClasses = [
      'ds-input-wrapper',
      error ? 'has-error' : '',
      props.disabled ? 'is-disabled' : '',
    ].filter(Boolean).join(' ');

    const id = props.id || props.name || React.useId();

    return (
      <div className="ds-form-group">
        {label && <label htmlFor={id} className="ds-label">{label}</label>}
        
        <div className={wrapperClasses}>
          <textarea
            ref={ref}
            id={id}
            className={`ds-input ds-textarea ${className}`}
            {...props}
          />
        </div>

        {error && <p className="ds-error-text">{error}</p>}
        {!error && helperText && <p className="ds-helper-text">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
