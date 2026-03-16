import { type SelectHTMLAttributes, type ReactNode, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, children, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`
              w-full px-4 py-3 rounded-lg appearance-none
              bg-gray-50 dark:bg-dark-surface
              border-2 border-gray-200 dark:border-dark-border
              text-gray-800 dark:text-gray-200
              focus:outline-none focus:border-gray-900 dark:focus:border-white/50
              focus:bg-white dark:focus:bg-dark-card
              transition-all duration-200
              ${error ? 'border-red-400 focus:border-red-400' : ''}
              ${className}
            `}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
