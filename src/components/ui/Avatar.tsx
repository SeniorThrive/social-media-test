import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fallback?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  className = '',
  fallback,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base', // 40x40px as specified
    lg: 'w-16 h-16 text-xl',
  };

  const baseClasses = `rounded-full border-2 border-st_light_blue object-cover ${sizeClasses[size]}`;

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${baseClasses} ${className}`}
      />
    );
  }

  // Fallback avatar with initials or default icon
  return (
    <div className={`${baseClasses} bg-st_light_purple text-white flex items-center justify-center font-medium ${className}`}>
      {fallback ? fallback.charAt(0).toUpperCase() : '👤'}
    </div>
  );
};