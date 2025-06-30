import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'interactive' | 'glass' | 'gradient';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick,
  variant = 'default'
}) => {
  const baseClasses = 'rounded-2xl border transition-all duration-300';
  
  const variantClasses = {
    default: 'bg-white border-gray-100 shadow-sm',
    elevated: 'bg-white border-gray-100 shadow-lg',
    interactive: 'bg-white border-gray-100 shadow-sm hover:shadow-xl cursor-pointer hover:-translate-y-1',
    glass: 'bg-white/80 backdrop-blur-sm border-white/20 shadow-lg',
    gradient: 'bg-gradient-to-br from-white to-gray-50 border-gray-100 shadow-sm'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};