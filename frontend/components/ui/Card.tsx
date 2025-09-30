import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: CardProps) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }: CardProps) {
  return (
    <h3 className={`text-2xl font-bold text-gray-900 dark:text-gray-100 ${className}`}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className = '' }: CardProps) {
  return <div className={className}>{children}</div>;
}
