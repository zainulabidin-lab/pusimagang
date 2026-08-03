import React from 'react';
import './FilterBar.css';
import { Filter, X } from 'lucide-react';
import { Button } from './Button';

export interface FilterBarProps {
  children: React.ReactNode;
  activeFiltersCount?: number;
  onClearFilters?: () => void;
  title?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  children,
  activeFiltersCount = 0,
  onClearFilters,
  title = 'Filters'
}) => {
  return (
    <div className="ds-filter-bar">
      <div className="ds-filter-bar-header">
        <div className="ds-filter-bar-title">
          <Filter size={16} />
          <span>{title}</span>
          {activeFiltersCount > 0 && (
            <span className="ds-filter-badge">{activeFiltersCount}</span>
          )}
        </div>
        {activeFiltersCount > 0 && onClearFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} leftIcon={<X size={14} />}>
            Clear all
          </Button>
        )}
      </div>
      <div className="ds-filter-bar-content">
        {children}
      </div>
    </div>
  );
};
