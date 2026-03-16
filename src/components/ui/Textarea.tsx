import { type TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full px-4 py-3 rounded-lg
            bg-gray-50 dark:bg-dark-surface
            border-2 border-gray-200 dark:border-dark-border
            text-gray-800 dark:text-gray-200
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            focus:outline-none focus:border-gray-900 dark:focus:border-white/50
            focus:bg-white dark:focus:bg-dark-card
            transition-all duration-200 resize-none
            ${error ? 'border-red-400 focus:border-red-400' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
