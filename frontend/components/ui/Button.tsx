import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus-visible:ring-gray-600',
    outline:
      'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 focus-visible:ring-blue-600',
  };

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-5 text-base',
    lg: 'h-13 px-7 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
