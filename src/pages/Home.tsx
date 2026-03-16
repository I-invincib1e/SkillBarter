import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Award,
  Clock,
  Shield,
  Star,
  ChevronDown,
  Sun,
  Moon,
} from 'lucide-react';
import { Button, StarRating } from '../components/ui';
import { useTheme } from '../contexts/ThemeContext';

export function Home() {
  const { theme, toggleTheme } = useTheme();
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Users,
      title: 'Connect with Peers',
      description: 'Find students in your community who share your interests and expertise',
      code: 'CONN',
    },
    {
      icon: Zap,
      title: 'Earn Credits',
      description: 'Help others and earn credits for every session you complete',
      code: 'EARN',
    },
    {
      icon: Shield,
      title: 'Verified Community',
      description: 'All members are verified for a safe and trustworthy environment',
      code: 'SAFE',
    },
    {
      icon: TrendingUp,
      title: 'Build Reputation',
      description: 'Earn badges and ratings as you complete sessions',
      code: 'RANK',
    },
    {
      icon: Clock,
      title: 'Flexible Schedule',
      description: 'Book sessions at times that work best for you',
      code: 'TIME',
    },
    {
      icon: Award,
      title: 'Unlock Achievements',
      description: 'Complete challenges and unlock special badges',
      code: 'ACHV',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Engineering Student',
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
      text: 'SkillBarter helped me find the perfect tutor for calculus. The process was seamless!',
    },
    {
      name: 'Marcus Johnson',
      role: 'Design Mentor',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
      text: 'I love helping students and earning credits. The community here is incredibly supportive.',
    },
    {
      name: 'Emma Rodriguez',
      role: 'Biology Major',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
      text: 'Finally found a way to get affordable tutoring while helping my classmates!',
    },
  ];

  const stats = [
    { number: '10K+', label: 'Active Members', code: '001' },
    { number: '50K+', label: 'Sessions Done', code: '002' },
    { number: '4.8', label: 'Avg Rating', code: '003' },
    { number: '99%', label: 'Satisfaction', code: '004' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg overflow-hidden">
      <div className="fixed inset-0 grid-overlay pointer-events-none opacity-50 dark:opacity-30" />

      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/90 dark:bg-dark-bg/90 backdrop-blur-xl border-b-3 border-gray-900 dark:border-cyan-400/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 md:w-11 md:h-11 bg-gray-900 dark:bg-white flex items-center justify-center border-3 border-gray-900 dark:border-white shadow-[3px_3px_0px_0px_rgba(0,212,170,1)] group-hover:rotate-3 transition-transform">
                <Zap className="w-5 h-5 md:w-6 md:h-6 text-cyan-400 dark:text-gray-900" />
              </div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <span className="font-space font-bold text-xl text-gray-900 dark:text-white">
                Skill<span className="text-cyan-500">Barter</span>
              </span>
              <div className="text-[9px] font-mono text-gray-400 tracking-widest">LEARN_EARN_GROW</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-dark-surface border-2 border-gray-900 dark:border-white/20">
            {['Features', 'Testimonials', 'FAQ'].map((item, i) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`px-4 py-2 font-space font-medium text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-card transition-colors ${i !== 2 ? 'border-r-2 border-gray-900 dark:border-white/20' : ''}`}
              >
                <span className="font-mono text-[10px] text-gray-400 mr-1">0{i + 1}</span>
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 bg-gray-100 dark:bg-dark-surface border-2 border-gray-900 dark:border-white/30 text-gray-700 dark:text-gray-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <Link to="/login">
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
      </nav>

      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        >
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-400/20 dark:bg-cyan-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-400/20 dark:bg-emerald-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-400/10 dark:bg-yellow-400/5 rounded-full blur-3xl" />
        </div>

        <div
          className="absolute top-32 right-20 hidden lg:block"
          style={{ transform: `translateY(${scrollY * -0.2}px) rotate(${scrollY * 0.02}deg)` }}
        >
          <div className="w-24 h-24 bg-cyan-400 border-3 border-gray-900 dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
            <Star className="w-10 h-10 text-gray-900" />
          </div>
        </div>

        <div
          className="absolute bottom-40 left-20 hidden lg:block"
          style={{ transform: `translateY(${scrollY * -0.15}px) rotate(${-scrollY * 0.03}deg)` }}
        >
          <div className="w-20 h-20 bg-emerald-400 border-3 border-gray-900 dark:border-white shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
            <Users className="w-8 h-8 text-gray-900" />
          </div>
        </div>

        <div
          className="absolute top-60 left-1/4 hidden lg:block"
          style={{ transform: `translateY(${scrollY * -0.1}px)` }}
        >
          <div className="w-16 h-16 bg-yellow-400 border-3 border-gray-900 dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center rotate-12">
            <Zap className="w-7 h-7 text-gray-900" />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-400/10 dark:bg-cyan-400/20 border-2 border-cyan-400 text-cyan-600 dark:text-cyan-400 font-mono text-sm mb-8">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span>BETA_V2.0 // STUDENT_NETWORK</span>
          </div>

          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-space font-bold text-gray-900 dark:text-white mb-6 leading-[0.9] tracking-tight"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          >
            Share Skills
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">Earn</span>
              <span className="absolute bottom-2 left-0 right-0 h-4 md:h-6 bg-cyan-400/50 dark:bg-cyan-400/30 -rotate-1" />
            </span>{' '}
            Credits
          </h1>

          <p
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 font-space"
            style={{ transform: `translateY(${scrollY * 0.05}px)` }}
          >
            Connect with peers, learn new skills, and build your reputation in a community where everyone benefits.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/signup">
              <button className="group px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-space font-bold text-lg border-3 border-gray-900 dark:border-white shadow-[6px_6px_0px_0px_rgba(0,212,170,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,212,170,1)] hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-3">
                Start Learning Today
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <a
              href="#features"
              className="px-8 py-4 bg-white dark:bg-dark-card text-gray-900 dark:text-white font-space font-bold text-lg border-3 border-gray-900 dark:border-white/50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              Learn More
            </a>
          </div>

          <a
            href="#stats"
            className="inline-flex flex-col items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors animate-bounce"
          >
            <span className="font-mono text-xs mb-2">SCROLL_DOWN</span>
            <ChevronDown className="w-6 h-6" />
          </a>
        </div>
      </section>

      <section id="stats" className="relative py-20 bg-gray-900 dark:bg-black border-y-4 border-gray-900 dark:border-cyan-400/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat) => (
              <div
                key={stat.code}
                className="text-center p-6 bg-gray-800 dark:bg-dark-card border-2 border-gray-700 dark:border-white/10"
              >
                <div className="font-mono text-[10px] text-cyan-400 mb-2">[{stat.code}]</div>
                <p className="text-4xl md:text-5xl font-space font-bold text-white mb-2">
                  {stat.number}
                </p>
                <p className="text-gray-400 font-space text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="relative py-24 md:py-32">
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{ transform: `translateY(${(scrollY - 800) * 0.1}px)` }}
        >
          <div className="absolute top-20 right-20 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-dark-surface border-2 border-gray-900 dark:border-white/20 font-mono text-xs text-gray-600 dark:text-gray-400 mb-6">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              FEATURE_SET_V2
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-space font-bold text-gray-900 dark:text-white mb-4">
              Why Choose{' '}
              <span className="relative inline-block">
                <span className="relative z-10">SkillBarter</span>
                <span className="absolute bottom-1 left-0 right-0 h-3 md:h-4 bg-emerald-400/50 dark:bg-emerald-400/30 -rotate-1" />
              </span>
              ?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-space">
              A modern platform built for students by students
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
                    <div className="w-14 h-14 bg-gray-100 dark:bg-dark-surface border-2 border-gray-900 dark:border-white/20 flex items-center justify-center group-hover:bg-cyan-400/20 transition-colors">
                      <Icon className="w-7 h-7 text-gray-700 dark:text-gray-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors" />
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

      <section id="testimonials" className="relative py-24 md:py-32 bg-gray-100 dark:bg-dark-surface border-y-4 border-gray-900 dark:border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-dark-card border-2 border-gray-900 dark:border-white/20 font-mono text-xs text-gray-600 dark:text-gray-400 mb-6">
              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
              USER_FEEDBACK
            </div>
            <h2 className="text-4xl md:text-5xl font-space font-bold text-gray-900 dark:text-white mb-4">
              Loved by Students
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-space">
              Join thousands of students already using SkillBarter
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="p-6 bg-white dark:bg-dark-card border-3 border-gray-900 dark:border-white/30 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.1)]"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 object-cover border-2 border-gray-900 dark:border-white/30"
                  />
                  <div>
                    <p className="font-space font-bold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm font-mono text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <StarRating rating={testimonial.rating} size="sm" />
                <p className="text-gray-700 dark:text-gray-300 mt-4 font-space text-sm leading-relaxed">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="relative p-8 md:p-12 bg-gray-900 dark:bg-black border-4 border-gray-900 dark:border-cyan-400 shadow-[8px_8px_0px_0px_rgba(0,212,170,1)] overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl" />

            <div className="relative text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-400/20 border border-cyan-400/50 font-mono text-xs text-cyan-400 mb-6">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                READY_TO_START
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-space font-bold text-white mb-4">
                Transform Your Learning
              </h2>
              <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto font-space">
                Join SkillBarter today and start earning credits while helping others
              </p>
              <Link to="/signup">
                <button className="px-10 py-4 bg-cyan-400 text-gray-900 font-space font-bold text-lg border-3 border-gray-900 shadow-[5px_5px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)] hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-3 mx-auto">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-t-4 border-gray-900 dark:border-white/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-space font-bold text-gray-900 dark:text-white mb-6">
            All Tools Included
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
            {[
              'Browse thousands of tutors and learners',
              'Book and manage sessions easily',
              'Earn credits for every session',
              'Build reputation with ratings',
              'Access exclusive resources',
              'Join a supportive community',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-dark-surface border-2 border-gray-900 dark:border-white/20">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-gray-800 dark:text-gray-200 font-space text-sm">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 dark:bg-black text-gray-300 py-12 border-t-4 border-gray-900 dark:border-cyan-400/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4 group">
                <div className="w-8 h-8 bg-white flex items-center justify-center border-2 border-white">
                  <Zap className="w-4 h-4 text-gray-900" />
                </div>
                <span className="font-space font-bold text-white">SkillBarter</span>
              </Link>
              <p className="text-sm font-space leading-relaxed text-gray-400">
                Empowering students to learn, teach, and grow together.
              </p>
            </div>
            {[
              {
                title: 'Product',
                links: [
                  { label: 'Features', href: '#features' },
                  { label: 'Pricing', href: '#pricing' },
                  { label: 'Login', to: '/login' },
                  { label: 'Sign Up', to: '/signup' },
                ],
              },
              {
                title: 'Resources',
                links: [
                  { label: 'FAQ', href: '#faq' },
                  { label: 'Blog', href: '/blog' },
                  { label: 'About', to: '/about' },
                  { label: 'Contact', href: '/contact' },
                ],
              },
              {
                title: 'Legal',
                links: [
                  { label: 'Privacy Policy', href: '/privacy' },
                  { label: 'Terms of Service', href: '/terms' },
                  { label: 'Contact Us', href: '/contact' },
                ],
              },
            ].map((section) => (
              <div key={section.title}>
                <h4 className="font-space font-bold text-white mb-4">{section.title}</h4>
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

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm font-mono text-gray-500">
              &copy; 2024 SkillBarter // ALL_RIGHTS_RESERVED
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
