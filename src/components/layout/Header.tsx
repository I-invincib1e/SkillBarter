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
  Menu,
  X,
  Zap,
  Search,
  Bell,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Avatar, Button } from '../ui';

const navLinks = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/discover', label: 'Discover', icon: Search },
  { path: '/requests', label: 'Requests', icon: Bell },
  { path: '/sessions', label: 'Sessions', icon: Zap },
];

export function Header() {
  const { user, profile, wallet, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setShowMobileMenu(false);
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
        ${scrolled
          ? 'bg-white/90 dark:bg-dark-bg/90 backdrop-blur-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] border-b border-gray-200/80 dark:border-white/10'
          : 'bg-white/50 dark:bg-dark-bg/50 backdrop-blur-md border-b border-transparent'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="w-9 h-9 bg-gray-900 dark:bg-white flex items-center justify-center rounded-xl transition-all duration-200 group-hover:scale-105">
                  <Zap className="w-4.5 h-4.5 text-cyan-400 dark:text-gray-900" />
                </div>
              </div>
              <span className="hidden sm:block font-space font-bold text-lg text-gray-900 dark:text-white tracking-tight">
                Skill<span className="text-cyan-500">Barter</span>
              </span>
            </Link>

            {user && (
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`
                        relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200
                        ${isActive
                          ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-white/10'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                      {isActive && (
                        <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-cyan-500 rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-[18px] h-[18px]" /> : <Sun className="w-[18px] h-[18px]" />}
            </button>

            {user ? (
              <>
                <Link
                  to="/wallet"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-500/20 transition-all duration-200 border border-cyan-200/60 dark:border-cyan-500/20"
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span className="font-mono text-sm font-semibold">{wallet?.balance ?? 0}</span>
                  <span className="text-[10px] font-medium text-cyan-500 dark:text-cyan-500 uppercase">cr</span>
                </Link>

                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`
                      flex items-center gap-2 p-1 pr-2 rounded-lg transition-all duration-200
                      ${showUserMenu
                        ? 'bg-gray-100 dark:bg-white/10'
                        : 'hover:bg-gray-100 dark:hover:bg-white/10'
                      }
                    `}
                  >
                    <Avatar src={profile?.avatar_url} name={profile?.name || 'User'} size="sm" />
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-gray-400 hidden sm:block transition-transform duration-200 ${
                        showUserMenu ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-2xl animate-scale-in overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-white/10">
                        <div className="flex items-center gap-3">
                          <Avatar src={profile?.avatar_url} name={profile?.name || 'User'} size="md" />
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                              {profile?.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-1.5">
                        {[
                          { to: '/profile', icon: User, label: 'Your Profile' },
                          { to: '/settings', icon: Settings, label: 'Settings' },
                        ].map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                          >
                            <item.icon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            {item.label}
                          </Link>
                        ))}
                        <Link
                          to="/wallet"
                          onClick={() => setShowUserMenu(false)}
                          className="flex sm:hidden items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                          <Wallet className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                          <span>Wallet</span>
                          <span className="ml-auto font-mono text-sm font-semibold text-cyan-600 dark:text-cyan-400">
                            {wallet?.balance ?? 0} CR
                          </span>
                        </Link>
                      </div>

                      <div className="border-t border-gray-100 dark:border-white/10 p-1.5">
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            signOut();
                          }}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="md:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                  {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <button className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold text-sm rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                    Get Started
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {showMobileMenu && user && (
          <nav className="md:hidden pb-4 pt-2 border-t border-gray-100 dark:border-white/10 animate-slide-down">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                      ${isActive
                        ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-white/10'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
