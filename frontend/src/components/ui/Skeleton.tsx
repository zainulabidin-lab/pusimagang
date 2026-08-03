import React, { type HTMLAttributes, forwardRef } from 'react';
import './Skeleton.css';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'circular' | 'text';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className = '',
      variant = 'text',
      width,
      height,
      animation = 'pulse',
      style,
      ...props
    },
    ref
  ) => {
    const classes = [
      'ds-skeleton',
      `ds-skeleton-${variant}`,
      `ds-skeleton-${animation}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={ref}
        className={classes}
        style={{ width, height, ...style }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

// --- Helper Composites ---

export const SkeletonCard = () => (
  <div style={{ padding: 'var(--space-24)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--surface)' }}>
    <Skeleton variant="circular" width={40} height={40} style={{ marginBottom: 'var(--space-16)' }} />
    <Skeleton variant="text" width="60%" height={24} style={{ marginBottom: 'var(--space-8)' }} />
    <Skeleton variant="text" width="100%" height={16} style={{ marginBottom: 'var(--space-4)' }} />
    <Skeleton variant="text" width="80%" height={16} />
  </div>
);

export const SkeletonTable = ({ rows = 5 }: { rows?: number }) => (
  <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface)', overflow: 'hidden' }}>
    <div style={{ display: 'flex', gap: 'var(--space-16)', padding: 'var(--space-16)', borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(248, 250, 252, 0.8)' }}>
      <Skeleton variant="text" width="20%" height={20} />
      <Skeleton variant="text" width="40%" height={20} />
      <Skeleton variant="text" width="40%" height={20} />
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} style={{ display: 'flex', gap: 'var(--space-16)', padding: 'var(--space-16)', borderBottom: i === rows - 1 ? 'none' : '1px solid var(--border)' }}>
        <Skeleton variant="text" width="20%" height={20} />
        <Skeleton variant="text" width="40%" height={20} />
        <Skeleton variant="text" width="30%" height={20} />
      </div>
    ))}
  </div>
);

export const SkeletonForm = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
    <div>
      <Skeleton variant="text" width="20%" height={16} style={{ marginBottom: 'var(--space-8)' }} />
      <Skeleton variant="rectangular" width="100%" height={40} style={{ borderRadius: 'var(--radius-md)' }} />
    </div>
    <div>
      <Skeleton variant="text" width="30%" height={16} style={{ marginBottom: 'var(--space-8)' }} />
      <Skeleton variant="rectangular" width="100%" height={40} style={{ borderRadius: 'var(--radius-md)' }} />
    </div>
    <div>
      <Skeleton variant="text" width="15%" height={16} style={{ marginBottom: 'var(--space-8)' }} />
      <Skeleton variant="rectangular" width="100%" height={100} style={{ borderRadius: 'var(--radius-md)' }} />
    </div>
    <Skeleton variant="rectangular" width="120px" height={40} style={{ borderRadius: 'var(--radius-md)', alignSelf: 'flex-start' }} />
  </div>
);
