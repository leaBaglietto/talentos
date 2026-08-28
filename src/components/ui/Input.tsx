import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', style, ...props }, ref) => {
    return (
      <div className="flex flex-col w-full">
        {label && (
          <label className="text-xs sm:text-sm text-dark-200 mb-2 font-medium tracking-wide">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full group">
          <input
            ref={ref}
            style={{ paddingLeft: '5%', ...style }}
            className={`w-full bg-transparent hover:bg-orange-500/[0.02] border rounded-full h-14 sm:h-16 text-sm sm:text-base text-white placeholder-dark-300 outline-none focus:outline-none focus:ring-0 transition-colors
              ${icon ? 'pr-14' : 'pr-6'}
              ${error ? 'border-red-500 focus:border-red-400' : 'border-orange-500 focus:border-orange-400'}
              ${className}`}
            {...props}
          />
          {icon && (
            <div className="absolute right-6 text-orange-500 pointer-events-none flex items-center justify-center">
              {icon}
            </div>
          )}
        </div>
        {error && <span className="mt-1.5 px-3 text-xs text-red-400 font-medium">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
