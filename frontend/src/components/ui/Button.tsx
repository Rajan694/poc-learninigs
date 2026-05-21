import React, { type ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

import { BiLoaderAlt } from 'react-icons/bi';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'danger';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'glass-button',
      outline: 'glass-button-outline',
      danger: 'glass-button-danger',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <BiLoaderAlt className="animate-spin mr-2 h-4 w-4" />}
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';

export default Button;
