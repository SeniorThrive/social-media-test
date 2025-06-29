import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
}) => {
  const baseClasses = 'rounded-xl border-none font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-st_light_orange focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-st_light_blue text-white hover:bg-st_dark_blue disabled:bg-gray-300',
    secondary: 'bg-st_dark_blue text-white hover:bg-st_light_blue disabled:bg-gray-300',
    accent: 'bg-st_light_orange text-white hover:bg-orange-600 disabled:bg-gray-300',
    outline: 'bg-transparent border-2 border-st_light_blue text-st_light_blue hover:bg-st_light_blue hover:text-white disabled:border-gray-300 disabled:text-gray-300',
  };

  const sizeClasses = {
    sm: 'py-1 px-3 text-caption',
    md: 'py-2 px-4 text-body',
    lg: 'py-3 px-6 text-body',
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};