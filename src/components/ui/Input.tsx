import React, { InputHTMLAttributes } from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <div className={`input-wrapper ${className || ''}`}>
        {icon && <div className="input-icon">{icon}</div>}
        <input
          ref={ref}
          className={`custom-input ${icon ? 'with-icon' : ''}`}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';
