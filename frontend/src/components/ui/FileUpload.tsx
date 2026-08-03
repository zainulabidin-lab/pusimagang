import React, { type InputHTMLAttributes, forwardRef, useState, useRef } from 'react';
import './Input.css'; // Reusing some base styles
import { UploadCloud, File, X, Loader2 } from 'lucide-react';

export interface FileUploadProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  label?: string;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  value?: File[];
  onChange?: (files: File[]) => void;
  isLoading?: boolean;
}

export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      className = '',
      label,
      helperText,
      error = false,
      disabled = false,
      accept,
      multiple = false,
      maxSizeMB = 5,
      value = [],
      onChange,
      isLoading = false,
      ...props
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = useState(false);
    const internalInputRef = useRef<HTMLInputElement>(null);

    // Merge refs
    const setRefs = (element: HTMLInputElement | null) => {
      internalInputRef.current = element;
      if (typeof ref === 'function') ref(element);
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = element;
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled && !isLoading) setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled || isLoading) return;
      handleFiles(Array.from(e.dataTransfer.files));
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) handleFiles(Array.from(e.target.files));
    };

    const handleFiles = (newFiles: File[]) => {
      const validFiles = newFiles.filter(file => file.size <= maxSizeMB * 1024 * 1024);
      if (validFiles.length < newFiles.length) {
        alert(`Some files were rejected because they exceed the ${maxSizeMB}MB limit.`);
      }
      
      const updatedFiles = multiple ? [...value, ...validFiles] : [validFiles[0]].filter(Boolean);
      onChange?.(updatedFiles);
    };

    const removeFile = (indexToRemove: number) => {
      onChange?.(value.filter((_, i) => i !== indexToRemove));
    };

    return (
      <div className={`ds-input-wrapper ${className}`}>
        {label && <label className="ds-input-label">{label}</label>}

        <div
          className={`ds-fileupload-container ${isDragging ? 'is-dragging' : ''} ${error ? 'is-error' : ''} ${disabled ? 'is-disabled' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && !isLoading && internalInputRef.current?.click()}
          style={{
            border: `2px dashed ${isDragging ? 'var(--primary)' : error ? 'var(--danger)' : 'var(--border)'}`,
            backgroundColor: isDragging ? 'rgba(15, 82, 186, 0.05)' : disabled ? '#F8FAFC' : 'var(--surface)',
            padding: 'var(--space-32) var(--space-16)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
            transition: 'all var(--transition-fast)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-12)'
          }}
        >
          <input
            type="file"
            ref={setRefs}
            onChange={handleFileSelect}
            disabled={disabled || isLoading}
            accept={accept}
            multiple={multiple}
            style={{ display: 'none' }}
            {...props}
          />
          
          <div style={{ 
            width: 48, height: 48, borderRadius: '50%', 
            backgroundColor: isDragging ? 'var(--primary)' : 'var(--surface-hover)', 
            color: isDragging ? 'white' : 'var(--text-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all var(--transition-fast)'
          }}>
            {isLoading ? <Loader2 className="ds-btn-spinner" /> : <UploadCloud size={24} />}
          </div>
          
          <div>
            <p style={{ margin: '0 0 4px 0', fontSize: 'var(--font-size-button)', fontWeight: 'var(--font-weight-medium)', color: 'var(--text-main)' }}>
              Click or drag file to this area to upload
            </p>
            <p style={{ margin: 0, fontSize: 'var(--font-size-caption)', color: 'var(--text-muted)' }}>
              Support for a single or bulk upload. Maximum size: {maxSizeMB}MB.
            </p>
          </div>
        </div>

        {value.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', marginTop: 'var(--space-8)' }}>
            {value.map((file, i) => (
              <div key={i} style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                padding: 'var(--space-8) var(--space-12)', border: '1px solid var(--border)', 
                borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)', overflow: 'hidden' }}>
                  <div style={{ color: 'var(--primary)' }}><File size={16} /></div>
                  <span style={{ fontSize: 'var(--font-size-caption)', fontWeight: 'var(--font-weight-medium)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {file.name}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                {!disabled && !isLoading && (
                  <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(i); }} style={{ 
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', borderRadius: '4px' 
                  }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {helperText && <div className={`ds-input-helper-text ${error ? 'ds-input-error' : ''}`} style={{ color: error ? 'var(--danger)' : undefined }}>{helperText}</div>}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';
