
import React, { forwardRef } from 'react';

const Input = forwardRef(({
  type = 'text',
  label,
  error,
  icon,
  fullWidth = true,
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'block rounded-lg border focus:outline-none focus:ring-2 transition-all';
  const widthClass = fullWidth ? 'w-full' : '';
  const errorClass = error 
    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
    : 'border-zinc-300 focus:ring-zinc-900 focus:border-zinc-900';
  const iconClass = icon ? 'pl-10' : 'px-4';

  return (
    <div className={`${widthClass} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-zinc-400">{icon}</span>
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`${baseClasses} ${errorClass} ${iconClass} py-2.5 ${widthClass}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;