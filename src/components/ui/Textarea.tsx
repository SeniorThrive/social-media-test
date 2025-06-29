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
}) => {
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
      className={`w-full border border-st_taupe rounded-lg py-2 px-3 text-body text-st_black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-st_light_blue focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 resize-vertical ${className}`}
    />
  );
};