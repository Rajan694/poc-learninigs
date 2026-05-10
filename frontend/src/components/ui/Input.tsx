import React, { type InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, label, error, id, ...props }, ref) => {
  const inputId = id || props.name;

  return (
    <div className="flex flex-col w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1 text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        className={cn(
          'glass-input w-full',
          error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-200',
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
});
Input.displayName = 'Input';

export default Input;
