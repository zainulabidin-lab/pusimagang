import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
    message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Memuat data...' }) => {
    return (
        <div className="ds-loading-container">
            <div className="ds-loading-spinner"></div>
            {message && <p className="ds-loading-message">{message}</p>}
        </div>
    );
};

export default LoadingSpinner;
