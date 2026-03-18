interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`
        animate-pulse bg-gray-200 dark:bg-white/5 rounded-xl
        ${className}
      `}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-white/10 p-6 animate-pulse">
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
        <Skeleton className="w-20 h-8 rounded-lg" />
        <Skeleton className="w-20 h-8 rounded-lg" />
      </div>
    </div>
  );
}

export function ListingSkeleton() {
  return (
    <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-white/10 p-6 animate-pulse">
      <div className="flex items-start gap-3 mb-4">
        <Skeleton className="w-10 h-10 rounded-full shrink-0" />
        <div className="flex-1">
          <Skeleton className="w-32 h-4 mb-2" />
          <Skeleton className="w-16 h-3" />
        </div>
        <Skeleton className="w-12 h-5 rounded-md" />
      </div>
      <Skeleton className="w-full h-5 mb-2" />
      <Skeleton className="w-2/3 h-4 mb-4" />
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
        <div className="flex gap-3">
          <Skeleton className="w-16 h-4" />
          <Skeleton className="w-12 h-4" />
        </div>
        <Skeleton className="w-24 h-9 rounded-lg" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-dark-card">
        <Skeleton className="h-32 sm:h-40 rounded-none" />
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-10 mb-4">
            <Skeleton className="w-20 h-20 rounded-full ring-4 ring-white dark:ring-dark-card flex-shrink-0" />
            <div className="flex-1 pb-1">
              <Skeleton className="w-40 h-6 mb-2" />
              <Skeleton className="w-24 h-4" />
            </div>
          </div>
          <Skeleton className="w-full h-4 mb-2" />
          <Skeleton className="w-3/4 h-4 mb-4" />
          <div className="flex gap-2">
            <Skeleton className="w-16 h-6 rounded-full" />
            <Skeleton className="w-20 h-6 rounded-full" />
            <Skeleton className="w-14 h-6 rounded-full" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
