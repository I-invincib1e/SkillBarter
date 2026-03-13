interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showOnline?: boolean;
  className?: string;
}

export function Avatar({
  src,
  name,
  size = 'md',
  showOnline = false,
  className = '',
}: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  };

  const onlineSizes = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
    xl: 'w-5 h-5',
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const colors = [
    'bg-primary-500',
    'bg-accent-500',
    'bg-success-500',
    'bg-blue-500',
    'bg-teal-500',
    'bg-cyan-500',
  ];

  const colorIndex = name.charCodeAt(0) % colors.length;

  return (
    <div className={`relative inline-block ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizes[size]} rounded-full object-cover ring-2 ring-white dark:ring-dark-card`}
        />
      ) : (
        <div
          className={`
            ${sizes[size]} ${colors[colorIndex]}
            rounded-full flex items-center justify-center
            text-white font-semibold
            ring-2 ring-white dark:ring-dark-card
          `}
        >
          {initials}
        </div>
      )}
      {showOnline && (
        <span
          className={`
            absolute bottom-0 right-0 ${onlineSizes[size]}
            bg-accent-500 rounded-full
            ring-2 ring-white dark:ring-dark-card
          `}
        />
      )}
    </div>
  );
}
