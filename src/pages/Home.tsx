import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Users,
  TrendingUp,
  ArrowRight,
  Award,
  Clock,
  Shield,
  Star,
  ChevronDown,
  Sun,
  Moon,
  Terminal,
  Sparkles,
  Globe,
  MessageSquare,
  Layers,
  Play,
  Check,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function Home() {
  const { theme, toggleTheme } = useTheme();
  const [scrollY, setScrollY] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Users,
      title: 'Peer-to-Peer Learning',
      description: 'Connect with students who excel where you need help. Learn from peers who understand your journey.',
      code: 'CONNECT',
      gradient: 'from-cyan-400 to-emerald-400',
    },
    {
      icon: Zap,
      title: 'Credit Economy',
      description: 'Teach what you know, earn credits. Use credits to learn what you want. Zero cash required.',
      code: 'EARN',
      gradient: 'from-yellow-400 to-orange-400',
    },
    {
      icon: Shield,
      title: 'Verified Network',
      description: 'Every member is verified. Reviews and ratings ensure quality. Trust built into every interaction.',
      code: 'TRUST',
      gradient: 'from-emerald-400 to-cyan-400',
    },
    {
      icon: TrendingUp,
      title: 'Build Reputation',
      description: 'Earn badges for milestones. Climb the leaderboard. Showcase your expertise.',
      code: 'GROW',
      gradient: 'from-pink-400 to-rose-400',
    },
    {
      icon: Clock,
      title: 'Flexible Sessions',
      description: 'Book sessions that fit your schedule. Online or in-person. Your rules.',
      code: 'FLEX',
      gradient: 'from-blue-400 to-cyan-400',
    },
    {
      icon: Award,
      title: 'Achievement System',
      description: 'Complete challenges. Unlock exclusive badges. Stand out from the crowd.',
      code: 'ACHIEVE',
      gradient: 'from-amber-400 to-yellow-400',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Engineering Student',
      university: 'MIT',
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
      text: 'Found the perfect calculus tutor in 10 minutes. The credit system means I can afford all the help I need.',
      stats: { sessions: 47, rating: 4.9 },
    },
    {
      name: 'Marcus Johnson',
      role: 'Design Mentor',
      university: 'RISD',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      text: 'I teach UI/UX and learn programming. It is the perfect exchange. Already earned 500+ credits.',
      stats: { sessions: 89, rating: 5.0 },
    },
    {
      name: 'Emma Rodriguez',
      role: 'Biology Major',
      university: 'Stanford',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      text: 'The verification system gave me confidence. Every tutor I have worked with has been exceptional.',
      stats: { sessions: 32, rating: 4.8 },
    },
  ];

  const stats = [
    { number: '10K+', label: 'Active Students', suffix: '' },
    { number: '50K+', label: 'Sessions Completed', suffix: '' },
    { number: '4.9', label: 'Average Rating', suffix: '/5' },
    { number: '99', label: 'Satisfaction Rate', suffix: '%' },
  ];

  const codeSnippet = `// Start learning in seconds
const session = await skillbarter.book({
  skill: "Advanced Calculus",
  tutor: "sarah_chen",
  credits: 5
});

session.on("complete", () => {
  console.log("Knowledge gained!");
});`;

  const featureShowcase = [
    {
      title: 'Smart Matching',
      description: 'AI-powered algorithm finds your perfect learning partner',
      visual: (
        <div className="relative h-full flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-emerald-400/20 rounded-lg" />
          <div className="relative flex items-center gap-4">
            <div className="w-16 h-16 bg-white dark:bg-dark-card border-3 border-gray-900 dark:border-white/50 flex items-center justify-center">
              <Users className="w-8 h-8 text-cyan-500" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-3 w-32 bg-gray-200 dark:bg-white/20 rounded" />
              <div className="h-3 w-24 bg-cyan-400/50 rounded" />
              <div className="h-3 w-28 bg-emerald-400/50 rounded" />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Instant Sessions',
      description: 'Book and start learning within minutes, not days',
      visual: (
        <div className="relative h-full flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-lg" />
          <div className="relative flex items-center gap-4">
            <div className="w-16 h-16 bg-yellow-400 border-3 border-gray-900 dark:border-white/50 flex items-center justify-center">
              <Play className="w-8 h-8 text-gray-900" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-xs text-gray-500 dark:text-gray-400">SESSION_START</span>
              <span className="font-space font-bold text-2xl text-gray-900 dark:text-white">00:45</span>
              <span className="text-sm text-gray-500">seconds ago</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Real Results',
      description: 'Track your progress with detailed analytics',
      visual: (
        <div className="relative h-full flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 rounded-lg" />
          <div className="relative flex flex-col items-center gap-2">
            <div className="flex items-end gap-2 h-16">
              {[40, 65, 45, 80, 60, 95].map((h, i) => (
                <div
                  key={i}
                  className="w-6 bg-gradient-to-t from-emerald-500 to-cyan-400 border-2 border-gray-900 dark:border-white/50"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <span className="font-mono text-xs text-emerald-500">+47% THIS MONTH</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg overflow-hidden">
      <div className="fixed inset-0 grid-overlay pointer-events-none opacity-40 dark:opacity-20" />

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-radial from-cyan-400/10 via-transparent to-transparent dark:from-cyan-400/5"
          style={{ transform: `translate(${scrollY * 0.05}px, ${scrollY * 0.02}px)` }}
        />
        <div
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-radial from-emerald-400/10 via-transparent to-transparent dark:from-emerald-400/5"
          style={{ transform: `translate(${-scrollY * 0.03}px, ${-scrollY * 0.02}px)` }}
        />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-dark-bg/95 backdrop-blur-xl border-b-3 border-gray-900 dark:border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-18">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gray-900 dark:bg-white flex items-center justify-center border-3 border-gray-900 dark:border-white shadow-[3px_3px_0px_0px_rgba(0,212,170,1)] group-hover:shadow-[4px_4px_0px_0px_rgba(0,212,170,1)] group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                  <Zap className="w-5 h-5 text-cyan-400 dark:text-gray-900" />
                </div>
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 border border-gray-900 dark:border-white animate-pulse" />
              </div>
              <div className="hidden sm:block">
                <span className="font-space font-bold text-xl text-gray-900 dark:text-white tracking-tight">
                  Skill<span className="text-cyan-500">Barter</span>
                </span>
                <div className="text-[9px] font-mono text-gray-400 tracking-[0.2em]">LEARN // EARN // GROW</div>
              </div>
            </Link>

            <div className="hidden md:flex items-center">
              <div className="flex items-center bg-gray-100 dark:bg-dark-surface border-2 border-gray-900 dark:border-white/20">
                {['Features', 'How it Works', 'Testimonials'].map((item, i) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                    className={`px-4 py-2 font-space font-medium text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-card hover:text-gray-900 dark:hover:text-white transition-all ${i !== 2 ? 'border-r-2 border-gray-900 dark:border-white/20' : ''}`}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={toggleTheme}
                className="p-2.5 bg-gray-100 dark:bg-dark-surface border-2 border-gray-900 dark:border-white/30 text-gray-700 dark:text-gray-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>
              <Link to="/login" className="hidden sm:block">
                <button className="px-4 py-2 font-space font-semibold text-sm text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Sign In
                </button>
              </Link>
              <Link to="/signup">
                <button className="px-4 md:px-5 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-space font-bold text-sm border-2 border-gray-900 dark:border-white shadow-[3px_3px_0px_0px_rgba(0,212,170,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,212,170,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section ref={heroRef} className="relative min-h-screen flex items-center pt-20 pb-12 overflow-hidden">
        <div className="hidden lg:block absolute top-32 right-[15%]" style={{ transform: `translateY(${scrollY * -0.15}px) rotate(${scrollY * 0.02}deg)` }}>
          <div className="w-20 h-20 bg-cyan-400 border-3 border-gray-900 dark:border-white shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.2)] flex items-center justify-center">
            <Star className="w-9 h-9 text-gray-900" />
          </div>
        </div>

        <div className="hidden lg:block absolute bottom-40 left-[10%]" style={{ transform: `translateY(${scrollY * -0.1}px) rotate(${-scrollY * 0.015}deg)` }}>
          <div className="w-16 h-16 bg-emerald-400 border-3 border-gray-900 dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-gray-900" />
          </div>
        </div>

        <div className="hidden lg:block absolute top-1/2 left-[5%]" style={{ transform: `translateY(${scrollY * -0.08}px)` }}>
          <div className="w-14 h-14 bg-yellow-400 border-3 border-gray-900 dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)] flex items-center justify-center rotate-12">
            <Globe className="w-6 h-6 text-gray-900" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white/10 border-2 border-gray-900 dark:border-white/30 text-gray-100 dark:text-cyan-400 font-mono text-xs mb-6">
                <span className="w-2 h-2 bg-cyan-400 animate-pulse" />
                <span>V2.0 LIVE // 10,000+ STUDENTS</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-space font-bold text-gray-900 dark:text-white leading-[0.95] tracking-tight mb-6">
                Trade Skills.
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10">Zero</span>
                  <span className="absolute bottom-1 md:bottom-2 left-0 right-0 h-3 md:h-4 bg-cyan-400/60 dark:bg-cyan-400/40 -rotate-1" />
                </span>{' '}
                Cash.
                <br />
                <span className="text-gray-400 dark:text-gray-500">All Growth.</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0 mb-8 font-space leading-relaxed">
                The peer-to-peer learning platform where students teach what they know and learn what they need. No money changes hands - just knowledge and credits.
              </p>

              <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 mb-8">
                <Link to="/signup">
                  <button className="group w-full sm:w-auto px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-space font-bold text-lg border-3 border-gray-900 dark:border-white shadow-[6px_6px_0px_0px_rgba(0,212,170,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,212,170,1)] hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3">
                    Start Learning Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <a href="#how-it-works" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-dark-card text-gray-900 dark:text-white font-space font-bold text-lg border-3 border-gray-900 dark:border-white/40 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  See How It Works
                </a>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-500 dark:text-gray-400 font-space">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Free to join</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>No credit card</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>10 free credits</span>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute -inset-4 bg-gradient-to-br from-cyan-400/20 via-emerald-400/10 to-transparent dark:from-cyan-400/10 dark:via-emerald-400/5 rounded-lg blur-xl" />

              <div className="relative bg-gray-900 dark:bg-black border-3 border-gray-900 dark:border-white/30 shadow-[8px_8px_0px_0px_rgba(0,212,170,1)] overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 dark:bg-dark-surface border-b-2 border-gray-700 dark:border-white/20">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-400 border border-red-500" />
                    <div className="w-3 h-3 bg-yellow-400 border border-yellow-500" />
                    <div className="w-3 h-3 bg-emerald-400 border border-emerald-500" />
                  </div>
                  <div className="flex-1 text-center">
                    <span className="font-mono text-xs text-gray-400">skillbarter.ts</span>
                  </div>
                  <Terminal className="w-4 h-4 text-gray-500" />
                </div>

                <div className="p-6 font-mono text-sm">
                  <pre className="text-gray-300 leading-relaxed">
                    <code>
                      <span className="text-gray-500">// Start learning in seconds</span>
                      {'\n'}
                      <span className="text-cyan-400">const</span> session <span className="text-gray-500">=</span> <span className="text-cyan-400">await</span> skillbarter.<span className="text-yellow-400">book</span>({'{'}
                      {'\n'}  skill: <span className="text-emerald-400">"Advanced Calculus"</span>,
                      {'\n'}  tutor: <span className="text-emerald-400">"sarah_chen"</span>,
                      {'\n'}  credits: <span className="text-orange-400">5</span>
                      {'\n'}{'}'});
                      {'\n\n'}
                      session.<span className="text-yellow-400">on</span>(<span className="text-emerald-400">"complete"</span>, () {'=> {'}
                      {'\n'}  console.<span className="text-yellow-400">log</span>(<span className="text-emerald-400">"Knowledge gained!"</span>);
                      {'\n'}{'}'});
                    </code>
                  </pre>
                </div>

                <div className="px-6 pb-6">
                  <div className="flex items-center gap-3 p-3 bg-emerald-400/10 border-2 border-emerald-400/50">
                    <Check className="w-5 h-5 text-emerald-400" />
                    <span className="font-mono text-sm text-emerald-400">Session booked successfully!</span>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 w-48 p-4 bg-white dark:bg-dark-card border-3 border-gray-900 dark:border-white/40 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)]">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src="https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=100"
                    alt="Sarah"
                    className="w-10 h-10 object-cover border-2 border-gray-900 dark:border-white/40"
                  />
                  <div>
                    <p className="font-space font-bold text-sm text-gray-900 dark:text-white">Sarah C.</p>
                    <p className="font-mono text-[10px] text-gray-500">TUTOR_ONLINE</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  ))}
                  <span className="font-mono text-xs text-gray-500 ml-1">4.9</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <a
          href="#stats"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors animate-bounce"
        >
          <span className="font-mono text-[10px] mb-1 tracking-widest">SCROLL</span>
          <ChevronDown className="w-5 h-5" />
        </a>
      </section>

      <section id="stats" className="relative py-16 bg-gray-900 dark:bg-black border-y-4 border-gray-900 dark:border-cyan-400/30">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,212,170,0.1)_1px,transparent_1px),linear-gradient(rgba(0,212,170,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="group text-center p-6 bg-gray-800/50 dark:bg-white/5 border-2 border-gray-700 dark:border-white/10 hover:border-cyan-400/50 transition-colors">
                <p className="text-4xl md:text-5xl font-space font-bold text-white mb-1">
                  {stat.number}
                  <span className="text-cyan-400">{stat.suffix}</span>
                </p>
                <p className="text-gray-400 font-space text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="relative py-24 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-dark-surface border-2 border-gray-900 dark:border-white/20 font-mono text-xs text-gray-600 dark:text-gray-400 mb-6">
              <Layers className="w-3 h-3" />
              HOW_IT_WORKS
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-space font-bold text-gray-900 dark:text-white mb-4">
              Three Steps to{' '}
              <span className="relative inline-block">
                <span className="relative z-10">Mastery</span>
                <span className="absolute bottom-1 md:bottom-2 left-0 right-0 h-3 md:h-4 bg-emerald-400/50 dark:bg-emerald-400/30 -rotate-1" />
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-space">
              No complicated onboarding. No payment setup. Just learning.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {[
                {
                  step: '01',
                  title: 'Create Your Profile',
                  description: 'List what you can teach and what you want to learn. Our AI matches you with perfect partners.',
                },
                {
                  step: '02',
                  title: 'Book Sessions',
                  description: 'Find available tutors, check their reviews, and book sessions that fit your schedule.',
                },
                {
                  step: '03',
                  title: 'Learn & Earn',
                  description: 'Attend sessions to learn. Teach sessions to earn credits. Use credits to learn more.',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`group p-6 border-3 transition-all cursor-pointer ${
                    activeFeature === i
                      ? 'bg-gray-900 dark:bg-white border-gray-900 dark:border-white shadow-[6px_6px_0px_0px_rgba(0,212,170,1)]'
                      : 'bg-white dark:bg-dark-card border-gray-900 dark:border-white/30 hover:border-gray-900 dark:hover:border-white/50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]'
                  }`}
                  onClick={() => setActiveFeature(i)}
                >
                  <div className="flex items-start gap-4">
                    <span className={`font-mono text-sm ${activeFeature === i ? 'text-cyan-400' : 'text-gray-400'}`}>
                      [{item.step}]
                    </span>
                    <div>
                      <h3 className={`text-xl font-space font-bold mb-2 ${activeFeature === i ? 'text-white dark:text-gray-900' : 'text-gray-900 dark:text-white'}`}>
                        {item.title}
                      </h3>
                      <p className={`font-space text-sm leading-relaxed ${activeFeature === i ? 'text-gray-300 dark:text-gray-600' : 'text-gray-600 dark:text-gray-400'}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-cyan-400/10 to-emerald-400/10 rounded-lg blur-2xl" />
              <div className="relative bg-white dark:bg-dark-card border-3 border-gray-900 dark:border-white/30 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] p-8 min-h-[300px]">
                {featureShowcase[activeFeature].visual}
                <div className="absolute bottom-4 left-4 right-4">
                  <h4 className="font-space font-bold text-gray-900 dark:text-white">{featureShowcase[activeFeature].title}</h4>
                  <p className="font-space text-sm text-gray-500 dark:text-gray-400">{featureShowcase[activeFeature].description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative py-24 md:py-32 bg-gray-100 dark:bg-dark-surface border-y-4 border-gray-900 dark:border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-dark-card border-2 border-gray-900 dark:border-white/20 font-mono text-xs text-gray-600 dark:text-gray-400 mb-6">
              <Sparkles className="w-3 h-3" />
              FEATURES
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-space font-bold text-gray-900 dark:text-white mb-4">
              Built for{' '}
              <span className="relative inline-block">
                <span className="relative z-10">Students</span>
                <span className="absolute bottom-1 md:bottom-2 left-0 right-0 h-3 md:h-4 bg-yellow-400/50 dark:bg-yellow-400/30 -rotate-1" />
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-space">
              Every feature designed with your learning journey in mind
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="group p-6 bg-white dark:bg-dark-card border-3 border-gray-900 dark:border-white/30 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.15)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} border-3 border-gray-900 dark:border-white/50 flex items-center justify-center`}>
                      <Icon className="w-7 h-7 text-gray-900" />
                    </div>
                    <span className="font-mono text-[10px] text-gray-400">[{feature.code}]</span>
                  </div>
                  <h3 className="text-xl font-space font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 font-space text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="testimonials" className="relative py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-dark-surface border-2 border-gray-900 dark:border-white/20 font-mono text-xs text-gray-600 dark:text-gray-400 mb-6">
              <MessageSquare className="w-3 h-3" />
              TESTIMONIALS
            </div>
            <h2 className="text-4xl md:text-5xl font-space font-bold text-gray-900 dark:text-white mb-4">
              Students Love{' '}
              <span className="relative inline-block">
                <span className="relative z-10">SkillBarter</span>
                <span className="absolute bottom-1 md:bottom-2 left-0 right-0 h-3 md:h-4 bg-cyan-400/50 dark:bg-cyan-400/30 -rotate-1" />
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="relative p-6 bg-white dark:bg-dark-card border-3 border-gray-900 dark:border-white/30 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.1)]"
              >
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 object-cover border-3 border-gray-900 dark:border-white/30"
                  />
                  <div>
                    <p className="font-space font-bold text-gray-900 dark:text-white">{testimonial.name}</p>
                    <p className="font-mono text-xs text-gray-500">{testimonial.role}</p>
                    <p className="font-mono text-[10px] text-cyan-500">{testimonial.university}</p>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 font-space text-sm leading-relaxed mb-4">
                  "{testimonial.text}"
                </p>

                <div className="flex items-center gap-4 pt-4 border-t-2 border-gray-200 dark:border-white/10">
                  <div className="text-center">
                    <p className="font-space font-bold text-gray-900 dark:text-white">{testimonial.stats.sessions}</p>
                    <p className="font-mono text-[10px] text-gray-500">SESSIONS</p>
                  </div>
                  <div className="text-center">
                    <p className="font-space font-bold text-gray-900 dark:text-white">{testimonial.stats.rating}</p>
                    <p className="font-mono text-[10px] text-gray-500">RATING</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="relative p-8 md:p-12 bg-gray-900 dark:bg-black border-4 border-gray-900 dark:border-cyan-400 shadow-[10px_10px_0px_0px_rgba(0,212,170,1)] overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,212,170,0.2)_1px,transparent_1px),linear-gradient(rgba(0,212,170,0.2)_1px,transparent_1px)] bg-[size:30px_30px]" />
            </div>

            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl" />

            <div className="relative text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-400/20 border border-cyan-400/50 font-mono text-xs text-cyan-400 mb-6">
                <span className="w-1.5 h-1.5 bg-cyan-400 animate-pulse" />
                READY_TO_START
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-space font-bold text-white mb-4">
                Join 10,000+ Students
              </h2>
              <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto font-space">
                Start with 10 free credits. No credit card required. Begin your learning journey today.
              </p>
              <Link to="/signup">
                <button className="group px-10 py-4 bg-cyan-400 text-gray-900 font-space font-bold text-lg border-3 border-gray-900 shadow-[5px_5px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)] hover:translate-x-1 hover:translate-y-1 transition-all inline-flex items-center gap-3">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 dark:bg-black text-gray-300 py-16 border-t-4 border-gray-900 dark:border-cyan-400/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4 group">
                <div className="w-10 h-10 bg-white flex items-center justify-center border-2 border-white">
                  <Zap className="w-5 h-5 text-gray-900" />
                </div>
                <div>
                  <span className="font-space font-bold text-xl text-white">SkillBarter</span>
                  <div className="text-[9px] font-mono text-gray-500 tracking-[0.2em]">LEARN // EARN // GROW</div>
                </div>
              </Link>
              <p className="text-sm font-space leading-relaxed text-gray-400 mb-4 max-w-xs">
                The peer-to-peer learning platform built for students who want to learn and teach without barriers.
              </p>
              <div className="flex gap-3">
                {['X', 'LI', 'GH'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-8 h-8 bg-gray-800 border border-gray-700 flex items-center justify-center font-mono text-xs text-gray-400 hover:text-white hover:border-cyan-400 transition-colors"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>

            {[
              {
                title: 'Product',
                links: [
                  { label: 'Features', href: '#features' },
                  { label: 'How it Works', href: '#how-it-works' },
                  { label: 'Pricing', href: '#' },
                ],
              },
              {
                title: 'Company',
                links: [
                  { label: 'About', to: '/about' },
                  { label: 'Blog', href: '#' },
                  { label: 'Careers', href: '#' },
                ],
              },
              {
                title: 'Legal',
                links: [
                  { label: 'Privacy', href: '#' },
                  { label: 'Terms', href: '#' },
                  { label: 'Contact', href: '#' },
                ],
              },
            ].map((section) => (
              <div key={section.title}>
                <h4 className="font-space font-bold text-white mb-4 text-sm">{section.title}</h4>
                <ul className="space-y-2 text-sm font-space">
                  {section.links.map((link) =>
                    link.to ? (
                      <li key={link.label}>
                        <Link to={link.to} className="text-gray-400 hover:text-cyan-400 transition-colors">
                          {link.label}
                        </Link>
                      </li>
                    ) : (
                      <li key={link.label}>
                        <a href={link.href} className="text-gray-400 hover:text-cyan-400 transition-colors">
                          {link.label}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm font-mono text-gray-500">
              &copy; 2024 SkillBarter // ALL_RIGHTS_RESERVED
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-gray-600">
              <span>SYSTEM_STATUS: <span className="text-emerald-400">ONLINE</span></span>
              <span>VERSION: <span className="text-cyan-400">2.0.0</span></span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
