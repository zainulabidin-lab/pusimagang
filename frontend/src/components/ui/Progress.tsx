import React from 'react';
import './Progress.css';

// ------------------------------------------
// LINEAR PROGRESS
// ------------------------------------------
export interface LinearProgressProps {
  value?: number; // 0 to 100
  label?: string;
  showValue?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  indeterminate?: boolean;
}

export const LinearProgress: React.FC<LinearProgressProps> = ({
  value = 0,
  label,
  showValue = false,
  color = 'primary',
  size = 'md',
  indeterminate = false,
}) => {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div className={`ds-progress-linear ds-progress-${size}`}>
      {(label || showValue) && (
        <div className="ds-progress-header">
          {label && <span className="ds-progress-label">{label}</span>}
          {showValue && !indeterminate && <span className="ds-progress-value">{Math.round(safeValue)}%</span>}
        </div>
      )}
      <div className="ds-progress-track">
        <div 
          className={`ds-progress-bar ds-progress-color-${color} ${indeterminate ? 'ds-progress-indeterminate' : ''}`}
          style={{ width: indeterminate ? '100%' : `${safeValue}%` }}
        />
      </div>
    </div>
  );
};

// ------------------------------------------
// CIRCULAR PROGRESS
// ------------------------------------------
export interface CircularProgressProps {
  value?: number;
  size?: number;
  strokeWidth?: number;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  showValue?: boolean;
  indeterminate?: boolean;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value = 0,
  size = 48,
  strokeWidth = 4,
  color = 'primary',
  showValue = false,
  indeterminate = false,
}) => {
  const safeValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = indeterminate ? 0 : circumference - (safeValue / 100) * circumference;

  return (
    <div className={`ds-progress-circular ${indeterminate ? 'ds-progress-circular-indeterminate' : ''}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="ds-progress-circular-track"
          strokeWidth={strokeWidth}
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
        <circle
          className={`ds-progress-circular-bar ds-progress-text-${color}`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
      </svg>
      {showValue && !indeterminate && (
        <div className="ds-progress-circular-value">
          {Math.round(safeValue)}%
        </div>
      )}
    </div>
  );
};

// ------------------------------------------
// STEP PROGRESS
// ------------------------------------------
export interface StepProps {
  label: string;
  description?: string;
  status: 'complete' | 'current' | 'upcoming';
}

export interface StepProgressProps {
  steps: StepProps[];
  direction?: 'horizontal' | 'vertical';
}

export const StepProgress: React.FC<StepProgressProps> = ({ steps, direction = 'horizontal' }) => {
  return (
    <div className={`ds-step-progress ds-step-${direction}`}>
      {steps.map((step, index) => (
        <div key={index} className={`ds-step-item ds-step-${step.status}`}>
          <div className="ds-step-indicator-wrapper">
            <div className="ds-step-indicator">
              {step.status === 'complete' ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            {index < steps.length - 1 && <div className="ds-step-line" />}
          </div>
          <div className="ds-step-content">
            <span className="ds-step-label">{step.label}</span>
            {step.description && <span className="ds-step-description">{step.description}</span>}
          </div>
        </div>
      ))}
    </div>
  );
};
