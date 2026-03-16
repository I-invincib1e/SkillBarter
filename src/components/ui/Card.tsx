import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export function Card({
  children,
  className = '',
  hover = false,
  padding = 'md',
  onClick,
}: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`
        bg-white dark:bg-dark-card rounded-xl
        border-2 border-gray-200 dark:border-dark-border
        shadow-sm dark:shadow-none
        transition-all duration-300
        ${hover ? 'hover:-translate-y-1 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer' : ''}
        ${paddingStyles[padding]}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
