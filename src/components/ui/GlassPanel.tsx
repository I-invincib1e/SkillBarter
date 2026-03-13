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
        backdrop-blur-xl
        border border-white/40 dark:border-slate-700/40
        ${className}
      `}
    >
      {children}
    </div>
  );
}
