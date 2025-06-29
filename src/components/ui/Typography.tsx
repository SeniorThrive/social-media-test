import React from 'react';

interface TypographyProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'body' | 'caption';
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body',
  className = '',
  as,
}) => {
  const variantClasses = {
    h1: 'text-h1 text-st_black',
    h2: 'text-h2 text-st_black',
    body: 'text-body text-st_black',
    caption: 'text-caption text-st_taupe',
  };

  const defaultElements = {
    h1: 'h1',
    h2: 'h2',
    body: 'p',
    caption: 'span',
  };

  const Component = as || defaultElements[variant];

  return React.createElement(
    Component,
    {
      className: `${variantClasses[variant]} ${className}`,
    },
    children
  );
};