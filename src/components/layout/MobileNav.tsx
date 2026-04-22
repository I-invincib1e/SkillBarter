import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Zap,
  User,
  MoreHorizontal,
  Wallet,
  Award,
  FileText,
  Bell,
  Settings,
  X,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { path: '/discover', icon: Search, label: 'Discover' },
  { path: '/sessions', icon: Zap, label: 'Sessions' },
  { path: '/profile', icon: User, label: 'Profile' },
];

const moreItems = [
  { path: '/zeno', icon: Sparkles, label: 'Zeno' },
  { path: '/listings', icon: FileText, label: 'My Listings' },
  { path: '/requests', icon: Bell, label: 'Requests' },
  { path: '/wallet', icon: Wallet, label: 'Wallet' },
  { path: '/badges', icon: Award, label: 'Badges' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export function MobileNav() {
  const location = useLocation();
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      {showMore && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setShowMore(false)}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          <div
            className="absolute bottom-20 left-4 right-4 bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl p-3 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-2 pb-2 mb-1 border-b border-gray-100 dark:border-white/5">
              <span className="font-mono text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">More</span>
              <button
                onClick={() => setShowMore(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setShowMore(false)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors min-h-[64px] ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-mono text-[10px] font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <nav
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/70 dark:bg-dark-bg/70 backdrop-blur-2xl border-t border-gray-200/60 dark:border-white/10 safe-bottom"
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                aria-current={isActive ? 'page' : undefined}
                aria-label={item.label}
                className={`
                  flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[48px] rounded-lg transition-all duration-200
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
                <span className={`font-mono text-[10px] ${isActive ? 'font-bold text-gray-900 dark:text-white' : 'font-medium'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}

          <button
            onClick={() => setShowMore(!showMore)}
            aria-label="More navigation options"
            aria-expanded={showMore}
            className={`
              flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[48px] rounded-lg transition-all duration-200
              ${showMore
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-400 dark:text-gray-500 active:text-gray-600'
              }
            `}
          >
            <div className={`p-1.5 rounded-lg ${showMore ? 'bg-blue-50 dark:bg-blue-500/10' : ''}`}>
              <MoreHorizontal className={`w-5 h-5 ${showMore ? 'text-blue-600 dark:text-blue-400' : ''}`} />
            </div>
            <span className={`font-mono text-[10px] ${showMore ? 'font-bold text-gray-900 dark:text-white' : 'font-medium'}`}>
              More
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
