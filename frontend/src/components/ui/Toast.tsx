import React, { useState, useEffect } from 'react';
import './Toast.css';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  title: string;
  message?: string;
  type?: ToastType;
  duration?: number;
  onClose: (id: string) => void;
}

const icons = {
  success: <CheckCircle size={20} className="ds-toast-icon success" />,
  error: <AlertCircle size={20} className="ds-toast-icon error" />,
  warning: <AlertTriangle size={20} className="ds-toast-icon warning" />,
  info: <Info size={20} className="ds-toast-icon info" />
};

export const Toast: React.FC<ToastProps> = ({
  id,
  title,
  message,
  type = 'info',
  duration = 5000,
  onClose
}) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(id), 300); // Wait for animation
  };

  return (
    <div className={`ds-toast ${isClosing ? 'closing' : ''}`} role="alert">
      <div className="ds-toast-icon-container">
        {icons[type]}
      </div>
      <div className="ds-toast-content">
        <div className="ds-toast-title">{title}</div>
        {message && <div className="ds-toast-message">{message}</div>}
      </div>
      <button onClick={handleClose} className="ds-toast-close" aria-label="Close notification">
        <X size={16} />
      </button>
    </div>
  );
};

// Toast Container for managing multiple toasts (typically rendered at root)
// This is a simplified version; in a real app you'd use a Context or a store.
export const ToastContainer: React.FC<{ toasts: ToastProps[] }> = ({ toasts }) => {
  return (
    <div className="ds-toast-container">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};
