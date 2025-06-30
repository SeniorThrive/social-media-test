import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'interactive';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick,
  variant = 'default'
}) => {
  const baseClasses = 'bg-white rounded-xl border border-gray-100';
  
  const variantClasses = {
    default: 'shadow-sm',
    elevated: 'shadow-lg',
    interactive: 'shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};