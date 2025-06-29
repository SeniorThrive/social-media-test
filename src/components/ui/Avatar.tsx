import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallback?: string;
  online?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  className = '',
  fallback,
  online = false,
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };

  const baseClasses = `relative rounded-full bg-gray-200 flex items-center justify-center font-medium text-gray-600 ${sizeClasses[size]}`;

  return (
    <div className={`${baseClasses} ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span className="select-none">
          {fallback ? fallback.charAt(0).toUpperCase() : '👤'}
        </span>
      )}
      
      {online && (
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
      )}
    </div>
  );
};