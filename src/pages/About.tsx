import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Target, Lightbulb, Users, Award, TrendingUp } from 'lucide-react';
import { Button, Card } from '../components/ui';

export function About() {
  const team = [
    {
      name: 'Alex Park',
      role: 'Founder & CEO',
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Education technology enthusiast with 5+ years in EdTech',
    },
    {
      name: 'Jordan Smith',
      role: 'Head of Product',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Product designer focused on user-centered learning solutions',
    },
    {
      name: 'Casey Chen',
      role: 'Community Lead',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Community builder passionate about peer-to-peer learning',
    },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Community First',
      description: 'We believe in the power of students helping students. Our platform is built on trust and collaboration.',
    },
    {
      icon: Target,
      title: 'Accessibility',
      description: 'Education should be accessible to everyone. We make quality tutoring affordable through our credit system.',
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We continuously innovate to make learning more effective, engaging, and rewarding.',
    },
    {
      icon: Users,
      title: 'Inclusivity',
      description: 'Every student deserves respect and support. We foster an inclusive community for all learners.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-dark-bg dark:to-dark-card animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Link to="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium mb-12">
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
              Our Mission
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              At SkillBarter, we're reimagining education. We believe that students are the best teachers, and that learning should be accessible, affordable, and empowering.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Founded in 2024, SkillBarter has grown into a thriving community where thousands of students connect, learn, and grow together. Our mission is to democratize education by making quality tutoring and mentorship available to everyone.
            </p>
            <div className="flex gap-4">
              <Link to="/signup">
                <Button>Join Our Community</Button>
              </Link>
              <a href="#team" className="px-6 py-3 rounded-xl border-2 border-primary-600 text-primary-600 dark:text-primary-400 font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all">
                Meet the Team
              </a>
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-3xl opacity-20" />
            <div className="relative bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl p-12 text-white overflow-hidden h-96 flex items-center justify-center">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <div className="relative text-center">
                <Award className="w-24 h-24 mx-auto mb-4 opacity-80" />
                <p className="text-2xl font-extrabold">Founded 2024</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-20 py-20 border-t border-gray-200 dark:border-dark-border">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-12 text-center">
            Our Values
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <Card key={i} hover>
                  <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {value.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>

        <div id="team" className="mb-20 py-20 border-t border-gray-200 dark:border-dark-border">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-12 text-center">
            Meet Our Team
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <Card key={i} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-2xl object-cover mx-auto mb-4"
                />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-primary-600 dark:text-primary-400 font-semibold mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {member.bio}
                </p>
              </Card>
            ))}
          </div>
        </div>

        <div className="bg-gradient-primary text-white rounded-3xl p-12 md:p-16 text-center overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
              Join Us
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Be part of a movement that's transforming education. Join thousands of students already learning and earning on SkillBarter.
            </p>
            <Link to="/signup">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-50 font-bold">
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
