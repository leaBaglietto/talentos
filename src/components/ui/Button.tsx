import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const variantStyles = {
  primary: 'bg-orange-500 text-dark-900 font-semibold hover:bg-orange-400 shadow-md shadow-orange-500/10 hover:shadow-xl hover:shadow-orange-500/20 active:scale-[0.98]',
  secondary: 'bg-dark-800 text-white font-medium hover:bg-dark-700 border border-white/10 hover:border-white/20 active:scale-[0.98]',
  outline: 'border border-white/20 text-white font-medium hover:bg-white/10 hover:border-white/30 backdrop-blur-sm active:scale-[0.98]',
  ghost: 'bg-transparent text-dark-200 font-medium hover:text-white hover:bg-white/5 active:scale-[0.98]',
  danger: 'bg-red-500/10 text-red-400 font-medium border border-red-500/20 hover:bg-red-500 hover:text-white active:scale-[0.98]',
};

const sizeStyles = {
  sm: 'h-9 px-5 text-xs tracking-tight',
  md: 'h-11 px-6 sm:px-8 text-sm tracking-tight',
  lg: 'h-14 px-9 sm:px-12 text-base tracking-tight font-semibold',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, className = '', children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`group relative inline-flex items-center justify-center gap-2 rounded-full font-sans transition-all duration-300 ease-out will-change-transform cursor-pointer select-none ${variantStyles[variant]} ${sizeStyles[size]} ${disabled || loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''} ${className}`}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : null}
        <span className="relative z-10 inline-flex items-center gap-2">
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';
