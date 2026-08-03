import React, { useEffect } from 'react';
import './Drawer.css';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  position?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  position = 'right',
  size = 'md',
  closeOnOverlayClick = true,
}) => {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="ds-drawer-overlay" onClick={closeOnOverlayClick ? onClose : undefined}>
      <div 
        className={`ds-drawer-panel ds-drawer-${position} ds-drawer-size-${size} ${isOpen ? 'open' : ''}`} 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="ds-drawer-header">
          <div className="ds-drawer-header-content">
            {title && <h2 className="ds-drawer-title">{title}</h2>}
            {description && <p className="ds-drawer-description">{description}</p>}
          </div>
          <button 
            type="button"
            className="ds-drawer-close"
            onClick={onClose}
            aria-label="Close drawer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="ds-drawer-body">
          {children}
        </div>

        {footer && (
          <div className="ds-drawer-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
