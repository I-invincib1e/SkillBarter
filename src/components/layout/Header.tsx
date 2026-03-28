import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sun,
  Moon,
  Wallet,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Avatar, Button } from '../ui';

export function Header() {
  const { user, profile, wallet, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setShowUserMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${user ? 'md:hidden' : ''}
        ${scrolled
          ? 'bg-white/90 dark:bg-dark-bg/90 backdrop-blur-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] border-b border-gray-200/80 dark:border-white/10'
          : 'bg-white/50 dark:bg-dark-bg/50 backdrop-blur-md border-b border-transparent'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-gray-900 dark:bg-white flex items-center justify-center rounded-lg border-2 border-gray-900 dark:border-white shadow-[2px_2px_0px_0px_rgba(37,99,235,1)] group-hover:shadow-[3px_3px_0px_0px_rgba(37,99,235,1)] group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
              <Zap className="w-4 h-4 text-blue-400 dark:text-gray-900" />
            </div>
            <span className="font-mono font-bold text-sm text-gray-900 dark:text-white tracking-tight">
              Skill<span className="text-blue-600">Barter</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {!user && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon className="w-[18px] h-[18px]" /> : <Sun className="w-[18px] h-[18px]" />}
              </button>
            )}

            {user ? (
              <>
                <Link
                  to="/wallet"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all duration-200 border border-blue-200/60 dark:border-blue-500/20"
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span className="font-mono text-xs font-semibold">{wallet?.balance ?? 0}</span>
                  <span className="text-[9px] font-mono font-medium text-blue-500 uppercase">cr</span>
                </Link>

                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`
                      flex items-center gap-1.5 p-1 pr-2 rounded-lg transition-all duration-200
                      ${showUserMenu
                        ? 'bg-gray-100 dark:bg-white/10'
                        : 'hover:bg-gray-100 dark:hover:bg-white/10'
                      }
                    `}
                  >
                    <Avatar src={profile?.avatar_url} name={profile?.name || 'User'} size="sm" />
                    <ChevronDown
                      className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${
                        showUserMenu ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-2xl animate-scale-in overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-white/10">
                        <div className="flex items-center gap-3">
                          <Avatar src={profile?.avatar_url} name={profile?.name || 'User'} size="md" />
                          <div className="min-w-0">
                            <p className="font-mono font-semibold text-gray-900 dark:text-white text-xs truncate">
                              {profile?.name}
                            </p>
                            <p className="font-mono text-[10px] text-gray-500 dark:text-gray-400 truncate">
                              {wallet?.balance ?? 0} credits
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-1.5">
                        {[
                          { to: '/profile', icon: User, label: 'Profile' },
                          { to: '/wallet', icon: Wallet, label: 'Wallet' },
                          { to: '/settings', icon: Settings, label: 'Settings' },
                        ].map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-mono text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                          >
                            <item.icon className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                            {item.label}
                          </Link>
                        ))}
                      </div>

                      <div className="border-t border-gray-100 dark:border-white/10 p-1.5">
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            signOut();
                          }}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg font-mono text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <button className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-mono font-bold text-xs rounded-lg border-2 border-gray-900 dark:border-white shadow-[3px_3px_0px_0px_rgba(37,99,235,1)] hover:shadow-[1px_1px_0px_0px_rgba(37,99,235,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                    Get Started
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
