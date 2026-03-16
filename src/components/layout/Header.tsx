import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Wallet, ChevronDown, LogOut, User, Settings, Menu, X, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Avatar, Button } from '../ui';

const navLinks = [
  { path: '/discover', label: 'Discover', icon: '01' },
  { path: '/requests', label: 'Requests', icon: '02' },
  { path: '/sessions', label: 'Sessions', icon: '03' },
];

export function Header() {
  const { user, profile, wallet, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled
          ? 'bg-white/95 dark:bg-dark-bg/95 backdrop-blur-xl shadow-lg border-b-2 border-gray-900 dark:border-cyan-400/50'
          : 'bg-transparent'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-6 md:gap-10">
            <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-900 dark:bg-white flex items-center justify-center transition-all duration-200 group-hover:rotate-3 border-3 border-gray-900 dark:border-white shadow-[3px_3px_0px_0px_rgba(0,212,170,1)]">
                  <Zap className="w-5 h-5 md:w-6 md:h-6 text-cyan-400 dark:text-gray-900" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
              </div>
              <div className="hidden sm:block">
                <span className="font-space font-bold text-xl md:text-2xl text-gray-900 dark:text-white tracking-tight">
                  Skill<span className="text-cyan-500">Barter</span>
                </span>
                <div className="text-[10px] font-mono text-gray-400 dark:text-gray-500 tracking-widest uppercase">
                  Learn & Earn
                </div>
              </div>
            </Link>

            {user && (
              <nav className="hidden md:flex items-center">
                <div className="flex items-center bg-gray-100 dark:bg-dark-surface rounded-none border-2 border-gray-900 dark:border-white/20">
                  {navLinks.map((link, index) => {
                    const isActive = location.pathname === link.path;
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`
                          relative px-5 py-2.5 font-space font-semibold text-sm transition-all duration-200
                          ${index !== navLinks.length - 1 ? 'border-r-2 border-gray-900 dark:border-white/20' : ''}
                          ${isActive
                            ? 'bg-gray-900 dark:bg-cyan-500 text-white dark:text-gray-900'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-card'
                          }
                        `}
                      >
                        <span className="font-mono text-[10px] text-gray-400 dark:text-gray-500 mr-1.5">{link.icon}</span>
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </nav>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 md:p-3 bg-gray-100 dark:bg-dark-surface border-2 border-gray-900 dark:border-white/30 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-dark-card transition-all duration-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4 md:w-5 md:h-5" /> : <Sun className="w-4 h-4 md:w-5 md:h-5" />}
            </button>

            {user ? (
              <>
                <Link
                  to="/wallet"
                  className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-cyan-400 dark:bg-cyan-500 text-gray-900 font-space font-bold text-sm border-2 border-gray-900 dark:border-gray-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-150"
                >
                  <Wallet className="w-4 h-4" />
                  <span className="font-mono">{wallet?.balance ?? 0}</span>
                  <span className="text-xs opacity-70">CR</span>
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1.5 border-2 border-gray-900 dark:border-white/30 bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-dark-surface transition-all duration-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]"
                  >
                    <Avatar src={profile?.avatar_url} name={profile?.name || 'User'} size="sm" />
                    <ChevronDown className={`w-4 h-4 text-gray-400 hidden sm:block transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {showUserMenu && (
                    <>
                      <div className="fixed inset-0" onClick={() => setShowUserMenu(false)} />
                      <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-dark-card border-3 border-gray-900 dark:border-white/50 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] animate-scale-in overflow-hidden">
                        <div className="px-4 py-4 border-b-2 border-gray-900 dark:border-white/20 bg-gray-50 dark:bg-dark-surface">
                          <p className="font-space font-bold text-gray-900 dark:text-white">{profile?.name}</p>
                          <p className="text-xs font-mono text-gray-500 truncate mt-1">{user.email}</p>
                        </div>
                        <div className="py-2">
                          {[
                            { to: '/profile', icon: User, label: 'Profile', code: 'USR' },
                            { to: '/settings', icon: Settings, label: 'Settings', code: 'SET' },
                          ].map((item) => (
                            <Link
                              key={item.to}
                              to={item.to}
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-3 px-4 py-3 text-sm font-space font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors border-l-4 border-transparent hover:border-cyan-400"
                            >
                              <span className="font-mono text-[10px] text-gray-400">[{item.code}]</span>
                              <item.icon className="w-4 h-4" />
                              {item.label}
                            </Link>
                          ))}
                          <Link
                            to="/wallet"
                            onClick={() => setShowUserMenu(false)}
                            className="flex sm:hidden items-center gap-3 px-4 py-3 text-sm font-space font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors border-l-4 border-transparent hover:border-cyan-400"
                          >
                            <span className="font-mono text-[10px] text-gray-400">[WAL]</span>
                            <Wallet className="w-4 h-4" />
                            <span>Wallet</span>
                            <span className="ml-auto font-mono text-cyan-500">{wallet?.balance ?? 0} CR</span>
                          </Link>
                        </div>
                        <div className="border-t-2 border-gray-900 dark:border-white/20 py-2">
                          <button
                            onClick={() => { setShowUserMenu(false); signOut(); }}
                            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-space font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-l-4 border-transparent hover:border-red-500"
                          >
                            <span className="font-mono text-[10px] text-red-400">[END]</span>
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="md:hidden p-2.5 bg-gray-100 dark:bg-dark-surface border-2 border-gray-900 dark:border-white/30 text-gray-700 dark:text-gray-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]"
                >
                  {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 md:gap-3">
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-space font-semibold border-2 border-transparent hover:border-gray-900 dark:hover:border-white/30"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <button className="px-4 md:px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-space font-bold text-sm border-2 border-gray-900 dark:border-white shadow-[3px_3px_0px_0px_rgba(0,212,170,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,212,170,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-150">
                    Get Started
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {showMobileMenu && user && (
          <nav className="md:hidden py-4 border-t-2 border-gray-900 dark:border-white/20 animate-slide-down bg-white dark:bg-dark-bg">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setShowMobileMenu(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 font-space font-semibold text-sm transition-all duration-200 border-l-4
                    ${location.pathname === link.path
                      ? 'border-cyan-400 bg-gray-100 dark:bg-dark-surface text-gray-900 dark:text-white'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-surface hover:border-gray-300'
                    }
                  `}
                >
                  <span className="font-mono text-[10px] text-gray-400">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
