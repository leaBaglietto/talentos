import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-dark-800/80 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl shadow-black/80 transition-all duration-300
        ${hoverable ? 'hover:border-orange-500/50 hover:bg-dark-800/90 cursor-pointer' : ''} 
        ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
