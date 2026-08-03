import React, { useState, useRef, useEffect, type ReactNode } from 'react';
import './Dropdown.css';
import { ChevronDown, Check, X } from 'lucide-react';
import { Input } from './Input';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string | string[];
  onChange?: (value: any) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  helperText?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  disabled = false,
  error = false,
  fullWidth = false,
  multiple = false,
  searchable = false,
  helperText,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: DropdownOption) => {
    if (option.disabled) return;

    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(option.value)
        ? currentValues.filter((v) => v !== option.value)
        : [...currentValues, option.value];
      onChange?.(newValues);
    } else {
      onChange?.(option.value);
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  const removeMultiValue = (e: React.MouseEvent, valToRemove: string) => {
    e.stopPropagation();
    if (multiple && Array.isArray(value)) {
      onChange?.(value.filter((v) => v !== valToRemove));
    }
  };

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderValue = () => {
    if (multiple && Array.isArray(value) && value.length > 0) {
      return (
        <div className="ds-dropdown-multi-values">
          {value.map((v) => {
            const opt = options.find((o) => o.value === v);
            if (!opt) return null;
            return (
              <span key={v} className="ds-dropdown-tag">
                {opt.icon && <span className="ds-dropdown-tag-icon">{opt.icon}</span>}
                {opt.label}
                <button type="button" onClick={(e) => removeMultiValue(e, v)}>
                  <X size={12} />
                </button>
              </span>
            );
          })}
        </div>
      );
    }

    if (!multiple && value) {
      const opt = options.find((o) => o.value === value);
      if (opt) {
        return (
          <div className="ds-dropdown-single-value">
            {opt.icon && <span className="ds-dropdown-tag-icon">{opt.icon}</span>}
            {opt.label}
          </div>
        );
      }
    }

    return <span className="ds-dropdown-placeholder">{placeholder}</span>;
  };

  const containerClasses = [
    'ds-input-wrapper',
    fullWidth ? 'ds-input-full' : '',
    error ? 'ds-input-error' : '',
    disabled ? 'ds-input-disabled' : '',
  ].filter(Boolean).join(' ');

  const triggerClasses = [
    'ds-dropdown-trigger',
    isOpen ? 'ds-dropdown-trigger-open' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} ref={dropdownRef}>
      {label && <label className="ds-input-label">{label}</label>}

      <div
        className={triggerClasses}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        tabIndex={disabled ? -1 : 0}
      >
        <div className="ds-dropdown-value-container">{renderValue()}</div>
        <div className="ds-dropdown-indicators">
          <ChevronDown size={16} className={`ds-dropdown-icon ${isOpen ? 'open' : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div className="ds-dropdown-menu">
          {searchable && (
            <div className="ds-dropdown-search">
              <Input
                autoFocus
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="ds-dropdown-search-input"
              />
            </div>
          )}

          <div className="ds-dropdown-options">
            {filteredOptions.length === 0 ? (
              <div className="ds-dropdown-empty">No options found</div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = multiple
                  ? Array.isArray(value) && value.includes(opt.value)
                  : value === opt.value;

                return (
                  <div
                    key={opt.value}
                    className={`ds-dropdown-option ${isSelected ? 'selected' : ''} ${opt.disabled ? 'disabled' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(opt);
                    }}
                  >
                    <div className="ds-dropdown-option-label">
                      {opt.icon && <span className="ds-dropdown-option-icon">{opt.icon}</span>}
                      {opt.label}
                    </div>
                    {isSelected && <Check size={16} className="ds-dropdown-check" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {helperText && <div className="ds-input-helper-text">{helperText}</div>}
    </div>
  );
};
