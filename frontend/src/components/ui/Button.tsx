import React, { type ButtonHTMLAttributes, forwardRef } from 'react';
import './Button.css';
import { Loader2, ChevronDown } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  isDropdown?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      isDropdown = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const classes = [
      'ds-btn',
      `ds-btn-${variant}`,
      `ds-btn-${size}`,
      fullWidth ? 'ds-btn-full' : '',
      isLoading ? 'ds-btn-loading' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button 
        ref={ref} 
        className={classes} 
        disabled={disabled || isLoading} 
        {...props}
      >
        {isLoading && <Loader2 className="ds-btn-spinner" />}
        {!isLoading && leftIcon && <span className="ds-btn-icon-left">{leftIcon}</span>}
        
        {/* Only render children if it's not strictly an icon button without children */}
        {children && <span className="ds-btn-content">{children}</span>}
        
        {!isLoading && rightIcon && <span className="ds-btn-icon-right">{rightIcon}</span>}
        {!isLoading && isDropdown && <ChevronDown className="ds-btn-icon-dropdown" />}
      </button>
    );
  }
);

Button.displayName = 'Button';

// SplitButton Component
export interface SplitButtonProps {
    mainAction: React.ReactNode;
    mainOnClick: () => void;
    dropdownOptions: { label: React.ReactNode; onClick: () => void }[];
    variant?: ButtonProps['variant'];
    size?: ButtonProps['size'];
    disabled?: boolean;
    isLoading?: boolean;
}

export const SplitButton: React.FC<SplitButtonProps> = ({
    mainAction, mainOnClick, dropdownOptions, variant = 'primary', size = 'md', disabled, isLoading
}) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="ds-split-btn-group" ref={dropdownRef}>
            <Button variant={variant} size={size} disabled={disabled} isLoading={isLoading} onClick={mainOnClick} className="ds-split-btn-main">
                {mainAction}
            </Button>
            <Button variant={variant} size={size} disabled={disabled || isLoading} onClick={() => setIsOpen(!isOpen)} className="ds-split-btn-dropdown">
                <ChevronDown size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
            </Button>
            {isOpen && (
                <div className="ds-split-btn-menu">
                    {dropdownOptions.map((opt, i) => (
                        <button key={i} className="ds-split-btn-item" onClick={() => { opt.onClick(); setIsOpen(false); }}>
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
