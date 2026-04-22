import { useEffect, useState } from 'react';
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
  MessageSquare,
  Layers,
  Sparkles,
  BookOpen,
  FileText,
  Brain,
} from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { useCountUp } from '../hooks/useCountUp';

function ScrollReveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useInView(0.1);
  return (
    <div
      ref={ref}
      className={`scroll-reveal ${isVisible ? 'visible' : ''} ${delay ? `scroll-reveal-delay-${delay}` : ''} ${className}`}
    >
      {children}
    </div>
  );
}

function AnimatedCounter({ target, suffix = '', label }: { target: number; suffix?: string; label: string }) {
  const { ref, isVisible } = useInView(0.3);
  const count = useCountUp(target, 2000, isVisible);

  return (
    <div ref={ref} className="text-center p-6 bg-white dark:bg-dark-card border-3 border-gray-900 dark:border-white/20 hover:border-blue-600 dark:hover:border-blue-400 transition-all shadow-[4px_4px_0px_0px_rgba(37,99,235,1)] dark:shadow-[4px_4px_0px_0px_rgba(96,165,250,0.4)]">
      <p className="text-4xl md:text-5xl font-mono font-bold text-gray-900 dark:text-white mb-1">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-gray-500 dark:text-gray-400 font-mono text-xs uppercase tracking-wider">{label}</p>
    </div>
  );
}

export function Home() {
  const [activeFeature, setActiveFeature] = useState(0);

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
      span: 'md:col-span-2',
    },
    {
      icon: Zap,
      title: 'Credit Economy',
      description: 'Teach what you know, earn credits. Use credits to learn what you want. Zero cash required.',
      code: 'EARN',
      span: 'md:row-span-2',
    },
    {
      icon: Shield,
      title: 'Verified Network',
      description: 'Every member is verified. Reviews and ratings ensure quality.',
      code: 'TRUST',
      span: '',
    },
    {
      icon: TrendingUp,
      title: 'Build Reputation',
      description: 'Earn badges for milestones. Climb the leaderboard. Showcase your expertise.',
      code: 'GROW',
      span: '',
    },
    {
      icon: Clock,
      title: 'Flexible Sessions',
      description: 'Book sessions that fit your schedule. Online or in-person. Your rules.',
      code: 'FLEX',
      span: '',
    },
    {
      icon: Award,
      title: 'Achievement System',
      description: 'Complete challenges. Unlock exclusive badges. Stand out from the crowd.',
      code: 'ACHIEVE',
      span: '',
    },
    {
      icon: Sparkles,
      title: 'Meet LIZA',
      description: 'Your personal AI tutor that knows your skills. Chat, generate flashcards, and take quizzes instantly.',
      code: 'LIZA',
      span: 'md:col-span-2',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      university: 'MIT',
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
      text: 'Found the perfect calculus tutor in 10 minutes. The credit system means I can afford all the help I need.',
      stats: { sessions: 47, rating: 4.9 },
    },
    {
      name: 'Marcus Johnson',
      university: 'RISD',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      text: 'I teach UI/UX and learn programming. It is the perfect exchange. Already earned 500+ credits.',
      stats: { sessions: 89, rating: 5.0 },
    },
    {
      name: 'Emma Rodriguez',
      university: 'Stanford',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      text: 'The verification system gave me confidence. Every tutor I have worked with has been exceptional.',
      stats: { sessions: 32, rating: 4.8 },
    },
    {
      name: 'David Kim',
      university: 'Carnegie Mellon',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
      text: 'Went from struggling in algorithms to acing my finals. The peer tutors here actually understand the coursework.',
      stats: { sessions: 61, rating: 4.9 },
    },
    {
      name: 'Priya Sharma',
      university: 'UC Berkeley',
      image: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=400',
      text: 'Teaching on SkillBarter helped me master concepts I thought I already knew. Plus the credits fund my own learning.',
      stats: { sessions: 112, rating: 5.0 },
    },
    {
      name: 'James Wright',
      university: 'Caltech',
      image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400',
      text: 'The community is incredible. Found study partners, mentors, and friends all through one platform.',
      stats: { sessions: 38, rating: 4.7 },
    },
  ];

  const featureShowcase = [
    {
      title: 'Smart Matching',
      description: 'AI-powered algorithm finds your perfect learning partner',
      visual: (
        <div className="relative h-full flex items-center justify-center">
          <div className="relative flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-600 border-3 border-gray-900 dark:border-white/50 flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-3 w-32 bg-gray-200 dark:bg-white/20" />
              <div className="h-3 w-24 bg-blue-400/50" />
              <div className="h-3 w-28 bg-blue-300/50" />
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
          <div className="relative flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-900 dark:bg-white border-3 border-gray-900 dark:border-white flex items-center justify-center">
              <Zap className="w-8 h-8 text-blue-400 dark:text-gray-900" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-xs text-gray-500 dark:text-gray-400">SESSION_START</span>
              <span className="font-mono font-bold text-2xl text-gray-900 dark:text-white">00:45</span>
              <span className="font-mono text-sm text-gray-500">seconds ago</span>
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
          <div className="relative flex flex-col items-center gap-2">
            <div className="flex items-end gap-2 h-16">
              {[40, 65, 45, 80, 60, 95].map((h, i) => (
                <div
                  key={i}
                  className="w-6 bg-blue-600 border-2 border-gray-900 dark:border-white/50"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <span className="font-mono text-xs text-blue-600 dark:text-blue-400">+47% THIS MONTH</span>
          </div>
        </div>
      ),
    },
  ];

  const tickerTestimonials = [...testimonials, ...testimonials];

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg overflow-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-dark-bg/95 backdrop-blur-xl border-b-3 border-gray-900 dark:border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gray-900 dark:bg-white flex items-center justify-center border-3 border-gray-900 dark:border-white shadow-[3px_3px_0px_0px_rgba(37,99,235,1)] group-hover:shadow-[4px_4px_0px_0px_rgba(37,99,235,1)] group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                  <Zap className="w-5 h-5 text-blue-400 dark:text-gray-900" />
                </div>
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-600 rounded-full border border-gray-900 dark:border-white animate-pulse" />
              </div>
              <div className="hidden sm:block">
                <span className="font-mono font-bold text-xl text-gray-900 dark:text-white tracking-tight">
                  Skill<span className="text-blue-600">Barter</span>
                </span>
                <div className="text-[9px] font-mono text-gray-400 tracking-[0.2em]">LEARN // EARN // GROW</div>
              </div>
            </Link>

            <div className="flex items-center gap-2 md:gap-3">
              <Link to="/login" className="hidden sm:block">
                <button className="px-4 py-2 font-mono font-semibold text-xs text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Sign In
                </button>
              </Link>
              <Link to="/signup">
                <button className="px-4 md:px-5 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-mono font-bold text-xs border-2 border-gray-900 dark:border-white shadow-[3px_3px_0px_0px_rgba(37,99,235,1)] hover:shadow-[1px_1px_0px_0px_rgba(37,99,235,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center pt-20 pb-12 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(37,99,235,0.04)_1px,transparent_1px),linear-gradient(rgba(37,99,235,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(90deg,rgba(96,165,250,0.04)_1px,transparent_1px),linear-gradient(rgba(96,165,250,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-mono font-bold text-gray-900 dark:text-white leading-[0.95] tracking-tight mb-8">
              Trade Skills.
              <br />
              <span className="relative inline-block">
                <span className="relative z-10">Zero</span>
                <span className="absolute bottom-1 md:bottom-2 left-0 right-0 h-3 md:h-5 bg-blue-600/30 dark:bg-blue-400/30 -rotate-1" />
              </span>{' '}
              Cash.
              <br />
              <span className="text-gray-400 dark:text-gray-500">All Growth.</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 font-mono leading-relaxed">
              The peer-to-peer learning platform where students teach what they know and learn what they need. No money changes hands - just knowledge and credits.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Link to="/signup">
                <button className="group w-full sm:w-auto px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-mono font-bold text-base border-3 border-gray-900 dark:border-white shadow-[6px_6px_0px_0px_rgba(37,99,235,1)] hover:shadow-[3px_3px_0px_0px_rgba(37,99,235,1)] hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3">
                  Start Learning Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-dark-card text-gray-900 dark:text-white font-mono font-bold text-base border-3 border-gray-900 dark:border-white/40 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-2">
                See How It Works
              </a>
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

      <section id="stats" className="relative py-16 bg-white dark:bg-dark-bg border-y-3 border-gray-900 dark:border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <AnimatedCounter target={10000} suffix="+" label="Active Students" />
            <AnimatedCounter target={50000} suffix="+" label="Sessions Done" />
            <AnimatedCounter target={49} suffix="/5" label="Avg Rating" />
            <AnimatedCounter target={99} suffix="%" label="Satisfaction" />
          </div>
        </div>
      </section>

      <section id="how-it-works" className="relative py-24 md:py-32 bg-gray-50 dark:bg-dark-surface overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ScrollReveal className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-dark-card border-2 border-gray-900 dark:border-white/20 font-mono text-xs text-gray-600 dark:text-gray-400 mb-6">
              <Layers className="w-3 h-3" />
              HOW_IT_WORKS
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-mono font-bold text-gray-900 dark:text-white mb-4">
              Three Steps to{' '}
              <span className="relative inline-block">
                <span className="relative z-10">Mastery</span>
                <span className="absolute bottom-1 md:bottom-2 left-0 right-0 h-3 md:h-4 bg-blue-600/30 dark:bg-blue-400/30 -rotate-1" />
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-mono">
              No complicated onboarding. No payment setup. Just learning.
            </p>
          </ScrollReveal>

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
                <ScrollReveal key={i} delay={i + 1}>
                  <div
                    className={`group p-6 border-3 transition-all cursor-pointer ${
                      activeFeature === i
                        ? 'bg-gray-900 dark:bg-white border-gray-900 dark:border-white shadow-[6px_6px_0px_0px_rgba(37,99,235,1)]'
                        : 'bg-white dark:bg-dark-card border-gray-900 dark:border-white/30 hover:border-gray-900 dark:hover:border-white/50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]'
                    }`}
                    onClick={() => setActiveFeature(i)}
                  >
                    <div className="flex items-start gap-4">
                      <span className={`font-mono text-sm ${activeFeature === i ? 'text-blue-400' : 'text-gray-400'}`}>
                        [{item.step}]
                      </span>
                      <div>
                        <h3 className={`text-xl font-mono font-bold mb-2 ${activeFeature === i ? 'text-white dark:text-gray-900' : 'text-gray-900 dark:text-white'}`}>
                          {item.title}
                        </h3>
                        <p className={`font-mono text-sm leading-relaxed ${activeFeature === i ? 'text-gray-300 dark:text-gray-600' : 'text-gray-600 dark:text-gray-400'}`}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal>
              <div className="relative">
                <div className="relative bg-white dark:bg-dark-card border-3 border-gray-900 dark:border-white/30 shadow-[8px_8px_0px_0px_rgba(37,99,235,1)] dark:shadow-[8px_8px_0px_0px_rgba(96,165,250,0.3)] p-8 min-h-[300px]">
                  {featureShowcase[activeFeature].visual}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h4 className="font-mono font-bold text-gray-900 dark:text-white">{featureShowcase[activeFeature].title}</h4>
                    <p className="font-mono text-sm text-gray-500 dark:text-gray-400">{featureShowcase[activeFeature].description}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section id="liza" className="relative py-24 md:py-32 bg-white dark:bg-dark-bg border-y-3 border-gray-900 dark:border-white/20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-20 -left-20 w-72 h-72 bg-accent-400/20 dark:bg-accent-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 -right-20 w-80 h-80 bg-blue-400/20 dark:bg-blue-500/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <ScrollReveal className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-50 dark:bg-accent-500/10 border-2 border-gray-900 dark:border-white/20 font-mono text-xs text-gray-600 dark:text-gray-400 mb-6">
              <Sparkles className="w-3 h-3" />
              MEET_LIZA
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-mono font-bold text-gray-900 dark:text-white mb-4">
              Your AI Tutor Who{' '}
              <span className="relative inline-block">
                <span className="relative z-10">Actually Knows You</span>
                <span className="absolute bottom-1 md:bottom-2 left-0 right-0 h-3 md:h-4 bg-accent-500/40 dark:bg-accent-400/40 -rotate-1" />
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-mono">
              LIZA is your Learning Integrated Zonal Assistant. She reads your profile, your skills, your sessions and tutors you like a peer who has your back.
            </p>
          </ScrollReveal>

          <div className="grid lg:grid-cols-5 gap-6 items-stretch">
            <ScrollReveal delay={1} className="lg:col-span-3">
              <div className="relative h-full bg-white dark:bg-dark-card border-3 border-gray-900 dark:border-white/30 shadow-[8px_8px_0px_0px_rgba(16,185,129,1)] dark:shadow-[8px_8px_0px_0px_rgba(52,211,153,0.4)] p-6 md:p-8 overflow-hidden">
                <div className="flex items-center gap-3 mb-5 pb-5 border-b-2 border-gray-200 dark:border-white/10">
                  <div className="w-10 h-10 bg-accent-500 border-2 border-gray-900 dark:border-white/50 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-mono font-bold text-gray-900 dark:text-white">LIZA</div>
                    <div className="font-mono text-[10px] tracking-wider text-gray-400">ONLINE // READY_TO_HELP</div>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-accent-600 dark:text-accent-400">
                    <span className="w-1.5 h-1.5 bg-accent-500 rounded-full animate-pulse" />
                    LIVE
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-end">
                    <div className="max-w-[80%] px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-mono">
                      Quiz me on data structures, 10 questions.
                    </div>
                  </div>
                  <div className="flex">
                    <div className="max-w-[85%] px-4 py-2.5 bg-accent-50 dark:bg-accent-500/10 border-2 border-accent-500/40 text-gray-800 dark:text-gray-100 text-sm font-mono">
                      On it, Priya. Using what you teach plus your CS notes. Generating a 10-question MCQ set now...
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4 mt-4">
                    <div className="flex -space-x-1.5">
                      <div className="w-6 h-6 bg-accent-500 border-2 border-white dark:border-dark-card" />
                      <div className="w-6 h-6 bg-blue-500 border-2 border-white dark:border-dark-card" />
                      <div className="w-6 h-6 bg-gray-900 dark:bg-white border-2 border-white dark:border-dark-card" />
                    </div>
                    <span className="font-mono text-[11px] text-gray-500 dark:text-gray-400">Question 1 / 10 ready</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t-2 border-gray-200 dark:border-white/10">
                  {[
                    { icon: MessageSquare, label: 'Chat' },
                    { icon: Layers, label: 'Flashcards' },
                    { icon: BookOpen, label: 'Quiz' },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 dark:bg-white/5 border-2 border-gray-200 dark:border-white/10"
                      >
                        <Icon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        <span className="font-mono text-[10px] font-bold text-gray-700 dark:text-gray-200">
                          {item.label.toUpperCase()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </ScrollReveal>

            <div className="lg:col-span-2 flex flex-col gap-4">
              {[
                {
                  icon: Brain,
                  title: 'Knows your profile',
                  text: 'Uses your skills, sessions, and goals to give advice that fits you.',
                  tag: '01',
                },
                {
                  icon: Layers,
                  title: 'Flashcards on demand',
                  text: 'Generate flip-card decks (3-20) from a topic, PDF, or current chat.',
                  tag: '02',
                },
                {
                  icon: BookOpen,
                  title: 'MCQ quizzes with explanations',
                  text: '3 to 30 questions, instant scoring, and reasoning for every answer.',
                  tag: '03',
                },
                {
                  icon: FileText,
                  title: 'Upload a PDF',
                  text: 'Drop in study material up to 2 MB. LIZA reads it and tutors from it.',
                  tag: '04',
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <ScrollReveal key={item.title} delay={Math.min(i + 1, 5)}>
                    <div className="group p-5 bg-white dark:bg-dark-card border-3 border-gray-900 dark:border-white/30 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-[6px_6px_0px_0px_rgba(16,185,129,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(52,211,153,0.45)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-accent-500 border-2 border-gray-900 dark:border-white/50 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-mono font-bold text-gray-900 dark:text-white">
                              {item.title}
                            </h3>
                            <span className="font-mono text-[10px] text-gray-400">[{item.tag}]</span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 font-mono text-xs mt-1 leading-relaxed">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>

          <ScrollReveal className="mt-10 text-center">
            <Link to="/signup">
              <button className="group inline-flex items-center gap-3 px-8 py-4 bg-accent-500 text-white font-mono font-bold text-sm border-3 border-gray-900 dark:border-white/80 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.25)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                <Sparkles className="w-4 h-4" />
                Try LIZA Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <section id="features" className="relative py-24 md:py-32 bg-white dark:bg-dark-bg border-y-3 border-gray-900 dark:border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ScrollReveal className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 border-2 border-gray-900 dark:border-white/20 font-mono text-xs text-gray-600 dark:text-gray-400 mb-6">
              <Sparkles className="w-3 h-3" />
              FEATURES
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-mono font-bold text-gray-900 dark:text-white mb-4">
              Built for{' '}
              <span className="relative inline-block">
                <span className="relative z-10">Students</span>
                <span className="absolute bottom-1 md:bottom-2 left-0 right-0 h-3 md:h-4 bg-blue-600/30 dark:bg-blue-400/30 -rotate-1" />
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-mono">
              Every feature designed with your learning journey in mind
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6 auto-rows-auto">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <ScrollReveal key={i} delay={Math.min(i + 1, 5)} className={feature.span}>
                  <div className="group h-full p-6 bg-white dark:bg-dark-card border-3 border-gray-900 dark:border-white/30 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-[8px_8px_0px_0px_rgba(37,99,235,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(96,165,250,0.3)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 bg-blue-600 border-3 border-gray-900 dark:border-white/50 flex items-center justify-center">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <span className="font-mono text-[10px] text-gray-400">[{feature.code}]</span>
                    </div>
                    <h3 className="text-xl font-mono font-bold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 font-mono text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <section id="testimonials" className="relative py-24 md:py-32 bg-gray-50 dark:bg-dark-surface overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ScrollReveal className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-dark-card border-2 border-gray-900 dark:border-white/20 font-mono text-xs text-gray-600 dark:text-gray-400 mb-6">
              <MessageSquare className="w-3 h-3" />
              TESTIMONIALS
            </div>
            <h2 className="text-4xl md:text-5xl font-mono font-bold text-gray-900 dark:text-white mb-4">
              Students Love{' '}
              <span className="relative inline-block">
                <span className="relative z-10">SkillBarter</span>
                <span className="absolute bottom-1 md:bottom-2 left-0 right-0 h-3 md:h-4 bg-blue-600/30 dark:bg-blue-400/30 -rotate-1" />
              </span>
            </h2>
          </ScrollReveal>
        </div>

        <div className="ticker-fade-left">
          <div className="flex animate-ticker hover:[animation-play-state:paused] w-max">
            {tickerTestimonials.map((testimonial, i) => (
              <div
                key={i}
                className="w-[380px] flex-shrink-0 mx-3 p-6 bg-white dark:bg-dark-card border-3 border-gray-900 dark:border-white/30 shadow-[5px_5px_0px_0px_rgba(37,99,235,1)] dark:shadow-[5px_5px_0px_0px_rgba(96,165,250,0.3)]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 object-cover border-2 border-gray-900 dark:border-white/30"
                    />
                    <div>
                      <p className="font-mono font-bold text-gray-900 dark:text-white text-sm">{testimonial.name}</p>
                      <p className="font-mono text-[10px] text-blue-600 dark:text-blue-400">{testimonial.university}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 font-mono text-sm leading-relaxed mb-4">
                  "{testimonial.text}"
                </p>

                <div className="flex items-center gap-4 pt-3 border-t-2 border-gray-200 dark:border-white/10">
                  <div>
                    <p className="font-mono font-bold text-gray-900 dark:text-white text-sm">{testimonial.stats.sessions}</p>
                    <p className="font-mono text-[10px] text-gray-500">SESSIONS</p>
                  </div>
                  <div>
                    <p className="font-mono font-bold text-gray-900 dark:text-white text-sm">{testimonial.stats.rating}</p>
                    <p className="font-mono text-[10px] text-gray-500">RATING</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 md:py-32 bg-white dark:bg-dark-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="relative p-8 md:p-12 bg-blue-600 dark:bg-blue-700 border-4 border-gray-900 dark:border-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:shadow-[10px_10px_0px_0px_rgba(255,255,255,0.3)] overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:30px_30px]" />
              </div>

              <div className="relative text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 border border-white/40 font-mono text-xs text-white mb-6">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  READY_TO_START
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-mono font-bold text-white mb-4">
                  Join 10,000+ Students
                </h2>
                <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto font-mono">
                  Start with 10 free credits. No credit card required. Begin your learning journey today.
                </p>
                <Link to="/signup">
                  <button className="group px-10 py-4 bg-white text-gray-900 font-mono font-bold text-lg border-3 border-gray-900 shadow-[5px_5px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-1 hover:translate-y-1 transition-all inline-flex items-center gap-3">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <footer className="bg-blue-500 dark:bg-blue-600 text-white py-16 border-t-4 border-blue-600 dark:border-blue-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4 group">
                <div className="w-10 h-10 bg-white flex items-center justify-center border-2 border-white">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <span className="font-mono font-bold text-xl text-white">SkillBarter</span>
                  <div className="text-[9px] font-mono text-blue-200 tracking-[0.2em]">LEARN // EARN // GROW</div>
                </div>
              </Link>
              <p className="text-sm font-mono leading-relaxed text-blue-100 mb-4 max-w-xs">
                The peer-to-peer learning platform built for students who want to learn and teach without barriers.
              </p>
              <div className="flex gap-3">
                {['X', 'LI', 'GH'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-8 h-8 bg-blue-600 border border-blue-400 flex items-center justify-center font-mono text-xs text-blue-200 hover:text-white hover:bg-blue-700 hover:border-white transition-colors"
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
                  { label: 'Meet LIZA', href: '#liza' },
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
                <h4 className="font-mono font-bold text-white mb-4 text-sm">{section.title}</h4>
                <ul className="space-y-2 text-sm font-mono">
                  {section.links.map((link) =>
                    'to' in link && link.to ? (
                      <li key={link.label}>
                        <Link to={link.to} className="text-blue-100 hover:text-white transition-colors">
                          {link.label}
                        </Link>
                      </li>
                    ) : (
                      <li key={link.label}>
                        <a href={'href' in link ? link.href : '#'} className="text-blue-100 hover:text-white transition-colors">
                          {link.label}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-blue-400/40 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm font-mono text-blue-200">
              &copy; 2024 SkillBarter // ALL_RIGHTS_RESERVED
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-blue-200">
              <span>SYSTEM_STATUS: <span className="text-white">ONLINE</span></span>
              <span>VERSION: <span className="text-white">2.0.0</span></span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
