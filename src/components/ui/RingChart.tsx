interface RingChartProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export function RingChart({
  percentage,
  size = 120,
  strokeWidth = 10,
  color = '#4F46E5',
  bgColor = '#E5E7EB',
  showLabel = true,
  label,
  className = '',
}: RingChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
          className="dark:opacity-20"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
          style={{
            animation: 'ringFill 1s ease-out forwards',
          }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {Math.round(percentage)}%
          </span>
          {label && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

interface MultiRingChartProps {
  rings: Array<{
    percentage: number;
    color: string;
    label?: string;
  }>;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function MultiRingChart({
  rings,
  size = 140,
  strokeWidth = 8,
  className = '',
}: MultiRingChartProps) {
  const gap = 4;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {rings.map((ring, index) => {
          const radius = (size - strokeWidth) / 2 - (index * (strokeWidth + gap));
          const circumference = 2 * Math.PI * radius;
          const offset = circumference - (ring.percentage / 100) * circumference;

          return (
            <g key={index}>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#E5E7EB"
                strokeWidth={strokeWidth}
                className="dark:opacity-20"
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={ring.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-1000 ease-out"
                style={{
                  animationDelay: `${index * 0.2}s`,
                }}
              />
            </g>
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {rings.slice(0, 1).map((ring, index) => (
          <div key={index} className="text-center">
            <span className="text-xl font-bold text-gray-800 dark:text-gray-100">
              {Math.round(ring.percentage)}%
            </span>
            {ring.label && (
              <p className="text-xs text-gray-500 dark:text-gray-400">{ring.label}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
