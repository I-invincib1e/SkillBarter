import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Search, Bell, Zap, User } from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { path: '/discover', icon: Search, label: 'Discover' },
  { path: '/requests', icon: Bell, label: 'Requests' },
  { path: '/sessions', icon: Zap, label: 'Sessions' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/70 dark:bg-dark-bg/70 backdrop-blur-2xl border-t border-gray-200/60 dark:border-white/10 safe-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex flex-col items-center justify-center gap-0.5 w-14 h-12 rounded-lg transition-all duration-200
                ${isActive
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-400 dark:text-gray-500 active:text-gray-600'
                }
              `}
            >
              <div className={`relative p-1.5 rounded-lg ${isActive ? 'bg-blue-50 dark:bg-blue-500/10' : ''} transition-all duration-200`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                {isActive && (
                  <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full" />
                )}
              </div>
              <span className={`font-mono text-[9px] ${isActive ? 'font-bold text-gray-900 dark:text-white' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
