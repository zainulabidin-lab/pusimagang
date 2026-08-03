import React from 'react';
import './Timeline.css';

export interface TimelineItemProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  time?: React.ReactNode;
  icon?: React.ReactNode;
  status?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  isLast?: boolean;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
  title,
  description,
  time,
  icon,
  status = 'default',
  isLast = false
}) => {
  return (
    <div className={`ds-timeline-item ds-timeline-status-${status}`}>
      <div className="ds-timeline-separator">
        <div className="ds-timeline-dot">
          {icon}
        </div>
        {!isLast && <div className="ds-timeline-connector" />}
      </div>
      <div className="ds-timeline-content">
        <div className="ds-timeline-header">
          <h4 className="ds-timeline-title">{title}</h4>
          {time && <span className="ds-timeline-time">{time}</span>}
        </div>
        {description && <div className="ds-timeline-description">{description}</div>}
      </div>
    </div>
  );
};

export interface TimelineProps {
  items: Omit<TimelineItemProps, 'isLast'>[];
  align?: 'left' | 'alternate';
}

export const Timeline: React.FC<TimelineProps> = ({ items, align = 'left' }) => {
  return (
    <div className={`ds-timeline ds-timeline-align-${align}`}>
      {items.map((item, index) => (
        <TimelineItem 
          key={index} 
          {...item} 
          isLast={index === items.length - 1} 
        />
      ))}
    </div>
  );
};
