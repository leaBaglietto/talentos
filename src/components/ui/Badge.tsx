import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'orange' | 'success' | 'danger' | 'warning' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles = {
  default: 'bg-dark-700/80 border border-white/10 text-dark-200',
  orange: 'bg-orange-500/15 border border-orange-500/40 text-orange-400',
  success: 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400',
  danger: 'bg-red-500/15 border border-red-500/40 text-red-400',
  warning: 'bg-amber-500/15 border border-amber-500/40 text-amber-400',
  outline: 'border border-orange-500/50 text-white',
};

const sizeStyles = {
  sm: 'px-2.5 py-0.5 text-[11px]',
  md: 'px-3.5 py-1 text-xs',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center justify-center font-medium rounded-full ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
