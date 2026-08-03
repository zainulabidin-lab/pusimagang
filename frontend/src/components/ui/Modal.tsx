import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import './Modal.css';

export type ModalSize = 'sm' | 'md' | 'lg' | 'full';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  size?: ModalSize;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  size = 'md', 
  children, 
  footer 
}) => {
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="ds-modal-overlay" onClick={onClose}>
      <div 
        className={`ds-modal-content ds-modal--${size}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ds-modal-header">
          {title && <h2 className="ds-modal-title">{title}</h2>}
          <button className="ds-modal-close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>
        
        <div className="ds-modal-body">
          {children}
        </div>

        {footer && (
          <div className="ds-modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
