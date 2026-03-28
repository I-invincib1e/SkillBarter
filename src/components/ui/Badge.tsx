import { type ReactNode } from 'react';
import * as Icons from 'lucide-react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'clay';
  size?: 'sm' | 'md';
  icon?: keyof typeof Icons;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  icon,
  color,
  className = '',
  style: styleProp,
}: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 dark:bg-dark-surface text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-dark-border',
    primary: 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800',
    accent: 'bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 border border-accent-200 dark:border-accent-800',
    success: 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300 border border-success-200 dark:border-success-800',
    clay: 'shadow-clay dark:shadow-clay-dark text-white border border-white/20',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  const IconComponent = icon ? (Icons[icon] as React.ComponentType<{ className?: string }>) : null;

  const style = variant === 'clay' && color
    ? { background: `linear-gradient(135deg, ${color}, ${color}dd)`, ...styleProp }
    : styleProp;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-space font-medium rounded-full
        ${variants[variant]}
        ${sizes[size]}
        ${variant === 'clay' ? 'transform transition-transform hover:scale-105' : ''}
        ${className}
      `}
      style={style}
    >
      {IconComponent && <IconComponent className="w-3.5 h-3.5" />}
      {children}
    </span>
  );
}
