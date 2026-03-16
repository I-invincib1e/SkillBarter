import { Link, useLocation } from 'react-router-dom';
import { Home, Search, HelpCircle, Calendar, User } from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/discover', icon: Search, label: 'Discover' },
  { path: '/requests', icon: HelpCircle, label: 'Requests' },
  { path: '/sessions', icon: Calendar, label: 'Sessions' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white dark:bg-dark-bg border-t-3 border-gray-900 dark:border-white/20 safe-bottom">
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
                  ? 'text-gray-900 dark:text-cyan-400'
                  : 'text-gray-400 dark:text-gray-500 active:text-gray-600'
                }
              `}
            >
              <div className={`relative p-1.5 rounded-lg ${isActive ? 'bg-gray-100 dark:bg-dark-surface scale-110' : ''} transition-all duration-200`}>
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-space ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
