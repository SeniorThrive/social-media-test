import React from 'react';

interface TypographyProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'small';
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body',
  className = '',
  as,
  weight,
}) => {
  const variantClasses = {
    h1: 'text-2xl font-bold text-gray-900',
    h2: 'text-xl font-semibold text-gray-900',
    h3: 'text-lg font-medium text-gray-900',
    body: 'text-sm text-gray-900',
    caption: 'text-xs text-gray-600',
    small: 'text-xs text-gray-500',
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  const defaultElements = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    body: 'p',
    caption: 'span',
    small: 'span',
  };

  const Component = as || defaultElements[variant];
  const weightClass = weight ? weightClasses[weight] : '';

  return React.createElement(
    Component,
    {
      className: `${variantClasses[variant]} ${weightClass} ${className}`.trim(),
    },
    children
  );
};