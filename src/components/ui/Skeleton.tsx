interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`
        animate-pulse bg-gray-200 dark:bg-dark-surface rounded-xl
        ${className}
      `}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <Skeleton className="w-24 h-4 mb-2" />
          <Skeleton className="w-16 h-3" />
        </div>
      </div>
      <Skeleton className="w-full h-5 mb-3" />
      <Skeleton className="w-3/4 h-4 mb-4" />
      <div className="flex gap-2">
        <Skeleton className="w-20 h-8" />
        <Skeleton className="w-20 h-8" />
      </div>
    </div>
  );
}

export function ListingSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="flex items-start gap-3 mb-4">
        <Skeleton className="w-10 h-10 rounded-full shrink-0" />
        <div className="flex-1">
          <Skeleton className="w-32 h-4 mb-2" />
          <Skeleton className="w-16 h-3" />
        </div>
        <Skeleton className="w-12 h-6 rounded-full" />
      </div>
      <Skeleton className="w-full h-6 mb-2" />
      <Skeleton className="w-2/3 h-4 mb-4" />
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <Skeleton className="w-20 h-5" />
          <Skeleton className="w-20 h-5" />
        </div>
        <Skeleton className="w-32 h-10 rounded-xl" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="text-center animate-pulse">
      <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
      <Skeleton className="w-32 h-6 mx-auto mb-2" />
      <Skeleton className="w-48 h-4 mx-auto mb-4" />
      <div className="flex justify-center gap-4">
        <Skeleton className="w-16 h-10" />
        <Skeleton className="w-16 h-10" />
        <Skeleton className="w-16 h-10" />
      </div>
    </div>
  );
}
