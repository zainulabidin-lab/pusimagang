import React, { type HTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes } from 'react';
import './Table.css';

export const Table = React.forwardRef<HTMLTableElement, HTMLAttributes<HTMLTableElement>>(
  ({ className = '', ...props }, ref) => (
    <div className="ds-table-container">
      <table ref={ref} className={`ds-table ${className}`} {...props} />
    </div>
  )
);
Table.displayName = 'Table';

export const TableHeader = React.forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = '', ...props }, ref) => (
    <thead ref={ref} className={`ds-table-header ${className}`} {...props} />
  )
);
TableHeader.displayName = 'TableHeader';

export const TableBody = React.forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = '', ...props }, ref) => (
    <tbody ref={ref} className={`ds-table-body ${className}`} {...props} />
  )
);
TableBody.displayName = 'TableBody';

export const TableFooter = React.forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = '', ...props }, ref) => (
    <tfoot ref={ref} className={`ds-table-footer ${className}`} {...props} />
  )
);
TableFooter.displayName = 'TableFooter';

export const TableRow = React.forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
  ({ className = '', ...props }, ref) => (
    <tr ref={ref} className={`ds-table-row ${className}`} {...props} />
  )
);
TableRow.displayName = 'TableRow';

export const TableHead = React.forwardRef<HTMLTableCellElement, ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className = '', ...props }, ref) => (
    <th ref={ref} className={`ds-table-head ${className}`} {...props} />
  )
);
TableHead.displayName = 'TableHead';

export const TableCell = React.forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className = '', ...props }, ref) => (
    <td ref={ref} className={`ds-table-cell ${className}`} {...props} />
  )
);
TableCell.displayName = 'TableCell';

export const TableCaption = React.forwardRef<HTMLTableCaptionElement, HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className = '', ...props }, ref) => (
    <caption ref={ref} className={`ds-table-caption ${className}`} {...props} />
  )
);
TableCaption.displayName = 'TableCaption';
