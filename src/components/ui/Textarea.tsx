import React from 'react';

interface TextareaProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  className?: string;
  id?: string;
  name?: string;
  error?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  rows = 3,
  className = '',
  id,
  name,
  error = false,
}) => {
  const baseClasses = 'w-full px-3 py-2 text-sm bg-white border rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed resize-vertical';
  
  const stateClasses = error 
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';

  return (
    <textarea
      id={id}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      rows={rows}
      className={`${baseClasses} ${stateClasses} ${className}`}
    />
  );
};