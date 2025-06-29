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
  const baseClasses = 'bg-white rounded-lg border border-gray-200';
  
  const variantClasses = {
    default: 'shadow-facebook',
    elevated: 'shadow-facebook-elevated',
    interactive: 'shadow-facebook hover:shadow-facebook-hover transition-shadow duration-200 cursor-pointer'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <div className={classes} onClick={onClick}>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};