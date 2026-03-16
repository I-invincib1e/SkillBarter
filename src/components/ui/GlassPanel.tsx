import { type ReactNode } from 'react';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
}

export function GlassPanel({ children, className = '' }: GlassPanelProps) {
  return (
    <div
      className={`
        bg-white/60 dark:bg-slate-800/60
        backdrop-blur-xl rounded-xl
        border-2 border-gray-200 dark:border-slate-700/60
        ${className}
      `}
    >
      {children}
    </div>
  );
}
