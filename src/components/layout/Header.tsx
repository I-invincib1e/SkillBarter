import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Wallet, ChevronDown, LogOut, User, Settings, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Avatar, Button } from '../ui';

const navLinks = [
  { path: '/discover', label: 'Discover' },
  { path: '/requests', label: 'Requests' },
  { path: '/sessions', label: 'Sessions' },
];

export function Header() {
  const { user, profile, wallet, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center transition-shadow group-hover:shadow-glow-blue">
                <span className="text-white font-bold text-sm">SB</span>
              </div>
              <span className="font-bold text-xl text-gray-800 dark:text-white hidden sm:block tracking-tight">
                SkillBarter
              </span>
            </Link>

            {user && (
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`
                        px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200
                        ${isActive
                          ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-surface'
                        }
                      `}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-surface transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-[18px] h-[18px]" /> : <Sun className="w-[18px] h-[18px]" />}
            </button>

            {user ? (
              <>
                <Link
                  to="/wallet"
                  className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 transition-all duration-200 hover:shadow-glow-blue"
                >
                  <Wallet className="w-4 h-4" />
                  <span>{wallet?.balance ?? 0}</span>
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-surface transition-all duration-200"
                  >
                    <Avatar src={profile?.avatar_url} name={profile?.name || 'User'} size="sm" />
                    <ChevronDown className={`w-4 h-4 text-gray-400 hidden sm:block transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {showUserMenu && (
                    <>
                      <div className="fixed inset-0" onClick={() => setShowUserMenu(false)} />
                      <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-card rounded-2xl shadow-soft-lg border border-gray-100 dark:border-dark-border animate-scale-in overflow-hidden">
                        <div className="px-4 py-3.5 border-b border-gray-100 dark:border-dark-border">
                          <p className="font-semibold text-gray-800 dark:text-white text-sm">{profile?.name}</p>
                          <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                        </div>
                        <div className="py-1.5">
                          {[
                            { to: '/profile', icon: User, label: 'Profile' },
                            { to: '/settings', icon: Settings, label: 'Settings' },
                          ].map((item) => (
                            <Link key={item.to} to={item.to} onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors">
                              <item.icon className="w-4 h-4" />
                              {item.label}
                            </Link>
                          ))}
                          <Link to="/wallet" onClick={() => setShowUserMenu(false)} className="flex sm:hidden items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors">
                            <Wallet className="w-4 h-4" />
                            Wallet ({wallet?.balance ?? 0} credits)
                          </Link>
                        </div>
                        <div className="border-t border-gray-100 dark:border-dark-border py-1.5">
                          <button onClick={() => { setShowUserMenu(false); signOut(); }} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
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
                  className="md:hidden p-2.5 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-surface transition-all duration-200"
                >
                  {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
                <Link to="/signup"><Button size="sm">Get Started</Button></Link>
              </div>
            )}
          </div>
        </div>

        {showMobileMenu && user && (
          <nav className="md:hidden py-3 border-t border-gray-100 dark:border-dark-border animate-slide-down">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setShowMobileMenu(false)}
                className={`
                  block px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200
                  ${location.pathname === link.path
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-surface'
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
