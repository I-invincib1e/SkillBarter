import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, BookOpen, Award, TrendingUp, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button, Input } from '../components/ui';

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    const { error: signUpError } = await signUp(email, password, name);
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setGoogleLoading(true);
    const { error: googleError } = await signInWithGoogle();
    if (googleError) {
      setError(googleError.message);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex -mt-16">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-900 dark:bg-black">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,212,170,0.15)_1px,transparent_1px),linear-gradient(rgba(0,212,170,0.15)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center border-3 border-white">
              <Zap className="w-6 h-6 text-gray-900" />
            </div>
            <div>
              <span className="text-white font-space font-bold text-2xl">SkillBarter</span>
              <div className="text-[9px] font-mono text-gray-500 tracking-[0.2em]">LEARN // EARN // GROW</div>
            </div>
          </div>

          <h2 className="text-4xl xl:text-5xl font-space font-bold text-white leading-tight mb-6">
            Start your<br />
            <span className="text-emerald-400">learning journey.</span>
          </h2>
          <p className="text-lg text-gray-400 mb-12 max-w-md font-space leading-relaxed">
            Join a thriving community of students who teach, learn, and grow together through skill exchange.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: BookOpen, label: '50+ Categories', desc: 'To explore' },
              { icon: Award, label: 'Earn Badges', desc: 'As you help' },
              { icon: TrendingUp, label: 'Build Streaks', desc: 'Stay active' },
            ].map((item) => (
              <div key={item.label} className="p-4 rounded-xl bg-white/5 border-2 border-white/10 hover:border-emerald-400/30 transition-colors">
                <item.icon className="w-6 h-6 text-emerald-400 mb-2" />
                <p className="text-white font-space font-semibold text-sm">{item.label}</p>
                <p className="text-gray-500 text-xs font-space">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50 dark:bg-dark-bg">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center border-2 border-gray-900 dark:border-white">
              <Zap className="w-5 h-5 text-cyan-400 dark:text-gray-900" />
            </div>
            <span className="font-space font-bold text-xl text-gray-800 dark:text-white">SkillBarter</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-space font-bold text-gray-900 dark:text-white mb-2">
              Create Account
            </h1>
          </div>

          <div className="bg-white dark:bg-dark-card rounded-xl p-8 border-2 border-gray-200 dark:border-dark-border shadow-sm">
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-lg border-2 border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface text-gray-700 dark:text-gray-200 font-space font-semibold hover:bg-gray-50 dark:hover:bg-dark-card transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <GoogleIcon className="w-5 h-5" />
              )}
              Continue with Google
            </button>

            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-dark-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-white dark:bg-dark-card text-gray-400 uppercase tracking-wider font-medium">
                  or sign up with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-lg bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 text-sm font-medium animate-slide-up">
                  {error}
                </div>
              )}

              <Input
                type="text"
                label="Full Name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={<User className="w-5 h-5" />}
                required
              />

              <Input
                type="email"
                label="Email"
                placeholder="you@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-5 h-5" />}
                required
              />

              <Input
                type="password"
                label="Password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-5 h-5" />}
                required
                minLength={6}
              />

              <Button type="submit" className="w-full" loading={loading}>
                Create Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </div>

          <p className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
