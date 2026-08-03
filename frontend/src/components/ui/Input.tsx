import React, { type InputHTMLAttributes, forwardRef, useState } from 'react';
import './Input.css';
import { Eye, EyeOff, AlertCircle, CheckCircle, X } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: boolean;
  success?: boolean;
  warning?: boolean;
  fullWidth?: boolean;
  floatingLabel?: boolean;
  onClear?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = '',
      label,
      helperText,
      leftIcon,
      rightIcon,
      error = false,
      success = false,
      warning = false,
      fullWidth = false,
      floatingLabel = false,
      type = 'text',
      onClear,
      disabled,
      value,
      onChange,
      placeholder,
      id,
      ...props
    },
    ref
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const inputId = id || `ds-input-${Math.random().toString(36).substr(2, 9)}`;
    
    // Determine actual type for password toggle
    const actualType = type === 'password' ? (isPasswordVisible ? 'text' : 'password') : type;
    
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

    const hasValue = value !== undefined && value !== null && String(value).length > 0;

    return (
      <div className={wrapperClasses}>
        {label && !floatingLabel && (
          <label htmlFor={inputId} className="ds-input-label">
            {label}
            {props.required && <span className="ds-input-required">*</span>}
          </label>
        )}
        
        <div className="ds-input-container">
          {leftIcon && <div className="ds-input-icon-left">{leftIcon}</div>}
          
          <input
            ref={ref}
            id={inputId}
            type={actualType}
            disabled={disabled}
            value={value}
            onChange={onChange}
            placeholder={floatingLabel ? ' ' : placeholder}
            className={`ds-input ${leftIcon ? 'has-left-icon' : ''} ${rightIcon || type === 'password' || onClear ? 'has-right-icon' : ''}`}
            {...props}
          />

          {floatingLabel && label && (
            <label htmlFor={inputId} className={`ds-input-floating-label ${hasValue ? 'is-filled' : ''}`}>
              {label} {props.required && '*'}
            </label>
          )}

          <div className="ds-input-icon-right">
            {onClear && hasValue && (
              <button type="button" onClick={onClear} className="ds-input-action-btn" tabIndex={-1} aria-label="Clear input">
                <X size={16} />
              </button>
            )}
            {type === 'password' && (
              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="ds-input-action-btn"
                tabIndex={-1}
                aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
              >
                {isPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}
            {error && !type && <AlertCircle size={16} className="ds-input-status-icon error" />}
            {success && !type && <CheckCircle size={16} className="ds-input-status-icon success" />}
            {rightIcon && !error && !success && rightIcon}
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

Input.displayName = 'Input';

// ------------------------------------------
// OTP INPUT COMPONENT
// ------------------------------------------
export interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (val: string) => void;
  error?: boolean;
  disabled?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({ length = 6, value, onChange, error, disabled }) => {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(-1);
    const newValue = value.split('');
    newValue[index] = val;
    const finalValue = newValue.join('').slice(0, length);
    onChange(finalValue);

    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className={`ds-otp-container ${error ? 'ds-otp-error' : ''} ${disabled ? 'ds-otp-disabled' : ''}`}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={el => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          disabled={disabled}
          className="ds-otp-input"
        />
      ))}
    </div>
  );
};

// ------------------------------------------
// TAG INPUT COMPONENT
// ------------------------------------------
export interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  label?: string;
}

export const TagInput: React.FC<TagInputProps> = ({ tags, onChange, placeholder = 'Add a tag...', fullWidth, disabled, label }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue.trim().replace(',', '');
      if (newTag && !tags.includes(newTag)) {
        onChange([...tags, newTag]);
        setInputValue('');
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div className={`ds-input-wrapper ${fullWidth ? 'ds-input-full' : ''}`}>
      {label && <label className="ds-input-label">{label}</label>}
      <div className={`ds-tag-input-container ${disabled ? 'ds-input-disabled' : ''}`}>
        {tags.map((tag, i) => (
          <span key={i} className="ds-tag">
            {tag}
            {!disabled && (
              <button type="button" onClick={() => removeTag(i)}><X size={12} /></button>
            )}
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          disabled={disabled}
          className="ds-tag-input-field"
        />
      </div>
    </div>
  );
};
