import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = false,
  interactive = false,
  onChange,
  className = '',
}: StarRatingProps) {
  const sizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = (index: number) => {
    if (interactive && onChange) {
      onChange(index + 1);
    }
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: maxRating }).map((_, index) => {
        const filled = index < Math.floor(rating);
        const partial = index === Math.floor(rating) && rating % 1 > 0;

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(index)}
            disabled={!interactive}
            className={`
              relative
              ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
            `}
          >
            <Star
              className={`
                ${sizes[size]}
                ${filled || partial ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-500'}
                transition-colors
              `}
            />
            {partial && (
              <Star
                className={`
                  ${sizes[size]} absolute inset-0 text-yellow-400 fill-yellow-400
                `}
                style={{
                  clipPath: `inset(0 ${100 - (rating % 1) * 100}% 0 0)`,
                }}
              />
            )}
          </button>
        );
      })}
      {showValue && (
        <span className="ml-1 text-sm font-medium text-gray-600 dark:text-gray-400">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
