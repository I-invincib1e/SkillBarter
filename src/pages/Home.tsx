import { Link } from 'react-router-dom';
import {
  Sparkles,
  Users,
  Zap,
  TrendingUp,
  CheckCircle,
  Star,
  ArrowRight,
  Award,
  Clock,
  Shield,
  Zap as ZapIcon,
} from 'lucide-react';
import { Button, Card, Avatar, StarRating } from '../components/ui';

export function Home() {
  const features = [
    {
      icon: Users,
      title: 'Connect with Peers',
      description: 'Find and connect with students in your community who share your interests',
    },
    {
      icon: Zap,
      title: 'Earn Credits',
      description: 'Help others and earn credits for every session completed',
    },
    {
      icon: Shield,
      title: 'Verified Community',
      description: 'All members are verified to ensure a safe and trustworthy environment',
    },
    {
      icon: TrendingUp,
      title: 'Build Reputation',
      description: 'Earn badges and ratings as you complete sessions and help others',
    },
    {
      icon: Clock,
      title: 'Flexible Schedule',
      description: 'Book sessions at times that work best for you',
    },
    {
      icon: Award,
      title: 'Unlock Achievements',
      description: 'Complete challenges and unlock special badges and rewards',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Engineering Student',
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
      text: 'SkillBarter helped me find the perfect tutor for calculus. The process was seamless and affordable!',
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
      text: 'Finally found a way to get affordable tutoring while helping my classmates. Best platform!',
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Active Members' },
    { number: '50,000+', label: 'Sessions Completed' },
    { number: '4.8★', label: 'Average Rating' },
    { number: '99%', label: 'Satisfaction Rate' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-dark-bg dark:to-dark-card">
      <nav className="glass-nav sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center group-hover:shadow-glow-blue transition-all">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-extrabold text-xl text-gray-900 dark:text-white">SkillBarter</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors font-medium">
              Features
            </a>
            <a href="#testimonials" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors font-medium">
              Testimonials
            </a>
            <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors font-medium">
              Pricing
            </a>
            <a href="#faq" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors font-medium">
              FAQ
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="secondary" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <section className="max-w-7xl mx-auto px-4 py-20 md:py-32 animate-fade-in">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                Share Knowledge, Earn Credits
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Connect with peers, learn new skills, and build your reputation in a community-driven platform where everyone benefits.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Learning Today
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <a href="#features" className="px-8 py-3 rounded-xl font-semibold text-gray-900 dark:text-white border-2 border-gray-200 dark:border-dark-border hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all text-center">
                  Learn More
                </a>
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-3xl opacity-20" />
              <div className="relative bg-gradient-primary rounded-3xl p-8 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                <div className="relative space-y-6">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm">
                    <Zap className="w-8 h-8 text-accent-300" />
                    <div>
                      <p className="font-semibold">Quick Sessions</p>
                      <p className="text-sm opacity-80">30 min - 2 hours</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm">
                    <Users className="w-8 h-8 text-accent-300" />
                    <div>
                      <p className="font-semibold">Expert Help</p>
                      <p className="text-sm opacity-80">From verified members</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm">
                    <TrendingUp className="w-8 h-8 text-accent-300" />
                    <div>
                      <p className="font-semibold">Earn & Learn</p>
                      <p className="text-sm opacity-80">Credits for helping others</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-20 border-t border-gray-200 dark:border-dark-border">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-extrabold text-primary-600 mb-2">{stat.number}</p>
                <p className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
              Why Choose SkillBarter?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A modern platform built for students by students
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Card key={i} hover className="group">
                  <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-900/30 transition-colors mb-4">
                    <Icon className="w-7 h-7 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </section>

        <section id="testimonials" className="max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
              Loved by Students
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join thousands of students already using SkillBarter
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <StarRating rating={testimonial.rating} size="sm" />
                <p className="text-gray-700 dark:text-gray-300 mt-4 flex-1">
                  "{testimonial.text}"
                </p>
              </Card>
            ))}
          </div>
        </section>

        <section id="cta" className="max-w-7xl mx-auto px-4 py-20 md:py-32">
          <Card className="gradient-primary text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="relative text-center py-12">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                Ready to Transform Your Learning?
              </h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Join SkillBarter today and start earning credits while helping others
              </p>
              <Link to="/signup">
                <Button
                  size="lg"
                  className="bg-white text-primary-600 hover:bg-gray-50 hover:text-primary-700 font-bold"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </Card>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-20 md:py-32 border-t border-gray-200 dark:border-dark-border">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
              All the Tools You Need
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
              Everything is included in your free account
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto text-left">
              {[
                'Browse thousands of tutors and learners',
                'Book and manage sessions easily',
                'Earn credits for every completed session',
                'Build your reputation with ratings and reviews',
                'Access exclusive learning resources',
                'Join a supportive community',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-success-500 shrink-0" />
                  <span className="text-gray-800 dark:text-gray-200 font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 dark:bg-black text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4 group">
                <Sparkles className="w-6 h-6 text-primary-500 group-hover:text-primary-400" />
                <span className="font-extrabold text-white">SkillBarter</span>
              </Link>
              <p className="text-sm leading-relaxed">
                Empowering students to learn, teach, and grow together.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-primary-400 transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-primary-400 transition-colors">Pricing</a></li>
                <li><Link to="/login" className="hover:text-primary-400 transition-colors">Login</Link></li>
                <li><Link to="/signup" className="hover:text-primary-400 transition-colors">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#faq" className="hover:text-primary-400 transition-colors">FAQ</a></li>
                <li><a href="/blog" className="hover:text-primary-400 transition-colors">Blog</a></li>
                <li><a href="/about" className="hover:text-primary-400 transition-colors">About</a></li>
                <li><a href="/contact" className="hover:text-primary-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-primary-400 transition-colors">Terms of Service</a></li>
                <li><a href="/contact" className="hover:text-primary-400 transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 SkillBarter. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
