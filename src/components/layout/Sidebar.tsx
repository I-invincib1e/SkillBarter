import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Bell,
  Zap,
  Wallet,
  User,
  Settings,
  LogOut,
  Sun,
  Moon,
  Award,
  FileText,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Avatar } from '../ui';

const mainNav = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/discover', label: 'Discover', icon: Search },
  { path: '/listings', label: 'Listings', icon: FileText },
  { path: '/requests', label: 'Requests', icon: Bell },
  { path: '/sessions', label: 'Sessions', icon: Zap },
];

const bottomNav = [
  { path: '/wallet', label: 'Wallet', icon: Wallet },
  { path: '/badges', label: 'Badges', icon: Award },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const { profile, wallet, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <aside
      className="fixed top-0 left-0 bottom-0 z-40 hidden md:flex flex-col w-[220px] lg:w-[260px] glass-sidebar"
      role="complementary"
      aria-label="Main navigation"
    >
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-gray-200/60 dark:border-white/10">
        <Link to="/dashboard" className="flex items-center gap-2.5 group" aria-label="SkillBarter home">
          <div className="w-8 h-8 bg-gray-900 dark:bg-white flex items-center justify-center rounded-lg border-2 border-gray-900 dark:border-white shadow-[2px_2px_0px_0px_rgba(37,99,235,1)] group-hover:shadow-[3px_3px_0px_0px_rgba(37,99,235,1)] group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
            <Zap className="w-4 h-4 text-blue-400 dark:text-gray-900" />
          </div>
          <span className="font-mono font-bold text-sm text-gray-900 dark:text-white tracking-tight">
            Skill<span className="text-blue-600">Barter</span>
          </span>
        </Link>
      </div>

      <div className="px-3 py-4 border-b border-gray-200/60 dark:border-white/10">
        <Link
          to="/profile"
          className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-gray-100/80 dark:hover:bg-white/5 transition-colors"
        >
          <Avatar src={profile?.avatar_url} name={profile?.name || 'User'} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="font-mono font-semibold text-xs text-gray-900 dark:text-white truncate">
              {profile?.name || 'User'}
            </p>
            <p className="font-mono text-[10px] text-gray-400 dark:text-gray-500 truncate">
              {wallet?.balance ?? 0} credits
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Primary">
        {mainNav.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              aria-current={isActive ? 'page' : undefined}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg font-mono text-xs font-medium transition-all duration-150 min-h-[40px]
                ${isActive
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-[3px_3px_0px_0px_rgba(37,99,235,1)]'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                }
              `}
            >
              <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-gray-200/60 dark:border-white/10 space-y-1">
        {bottomNav.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              aria-current={isActive ? 'page' : undefined}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg font-mono text-[11px] font-medium transition-all duration-150 min-h-[36px]
                ${isActive
                  ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-500 hover:bg-gray-100/80 dark:hover:bg-white/5 hover:text-gray-700 dark:hover:text-gray-300'
                }
              `}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="px-3 py-3 border-t border-gray-200/60 dark:border-white/10 flex items-center gap-1">
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          className="flex-1 flex items-center justify-center gap-2 px-2 py-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-white/5 transition-colors font-mono text-[11px] min-h-[36px]"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          {theme === 'light' ? 'Dark' : 'Light'}
        </button>
        <button
          onClick={signOut}
          aria-label="Sign out"
          className="flex-1 flex items-center justify-center gap-2 px-2 py-2 rounded-lg text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors font-mono text-[11px] min-h-[36px]"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
