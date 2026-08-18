import React, { ButtonHTMLAttributes } from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`custom-button ${variant} ${isLoading ? 'loading' : ''} ${className || ''}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="loader"></span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
