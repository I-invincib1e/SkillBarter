import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Target, Lightbulb, Users, Zap } from 'lucide-react';
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
      code: '01',
    },
    {
      icon: Target,
      title: 'Accessibility',
      description: 'Education should be accessible to everyone. We make quality tutoring affordable through our credit system.',
      code: '02',
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We continuously innovate to make learning more effective, engaging, and rewarding.',
      code: '03',
    },
    {
      icon: Users,
      title: 'Inclusivity',
      description: 'Every student deserves respect and support. We foster an inclusive community for all learners.',
      code: '04',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-space font-semibold mb-12 px-4 py-2 rounded-lg border-2 border-transparent hover:border-gray-900 dark:hover:border-white/30">
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-dark-surface border-2 border-gray-900 dark:border-white/20 text-xs font-mono text-gray-600 dark:text-gray-400 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ABOUT US
            </div>
            <h1 className="text-5xl md:text-6xl font-space font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Our Mission
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed font-space">
              At SkillBarter, we're reimagining education. We believe that students are the best teachers, and that learning should be accessible, affordable, and empowering.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Founded in 2024, SkillBarter has grown into a thriving community where thousands of students connect, learn, and grow together. Our mission is to democratize education by making quality tutoring and mentorship available to everyone.
            </p>
            <div className="flex gap-4">
              <Link to="/signup">
                <Button>Join Our Community</Button>
              </Link>
              <a href="#team" className="px-6 py-3 rounded-lg border-2 border-gray-900 dark:border-white/30 text-gray-900 dark:text-white font-space font-semibold hover:bg-gray-100 dark:hover:bg-dark-surface transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5">
                Meet the Team
              </a>
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="relative bg-gray-900 dark:bg-black rounded-xl border-3 border-gray-900 dark:border-white/30 p-12 overflow-hidden h-96 flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,212,170,1)]">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,212,170,0.15)_1px,transparent_1px),linear-gradient(rgba(0,212,170,0.15)_1px,transparent_1px)] bg-[size:40px_40px]" />
              </div>
              <div className="absolute top-4 left-4 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="relative text-center">
                <div className="w-20 h-20 rounded-xl bg-white flex items-center justify-center mx-auto mb-6 border-3 border-white shadow-[4px_4px_0px_0px_rgba(0,212,170,1)]">
                  <Zap className="w-10 h-10 text-gray-900" />
                </div>
                <p className="text-2xl font-space font-bold text-white">Founded 2024</p>
                <p className="text-sm font-mono text-gray-400 mt-2 tracking-wider">LEARN // EARN // GROW</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-20 py-20 border-t-2 border-gray-900 dark:border-white/20">
          <div className="text-center mb-12">
            <span className="font-mono text-xs text-gray-400 tracking-wider">// VALUES</span>
            <h2 className="text-4xl md:text-5xl font-space font-bold text-gray-900 dark:text-white mt-2">
              Our Values
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <Card key={i} hover>
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-lg bg-gray-100 dark:bg-dark-surface flex items-center justify-center border-2 border-gray-900 dark:border-white/20 flex-shrink-0">
                      <Icon className="w-7 h-7 text-gray-900 dark:text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-[10px] text-gray-400">[{value.code}]</span>
                        <h3 className="text-xl font-space font-bold text-gray-900 dark:text-white">
                          {value.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <div id="team" className="mb-20 py-20 border-t-2 border-gray-900 dark:border-white/20">
          <div className="text-center mb-12">
            <span className="font-mono text-xs text-gray-400 tracking-wider">// TEAM</span>
            <h2 className="text-4xl md:text-5xl font-space font-bold text-gray-900 dark:text-white mt-2">
              Meet Our Team
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <Card key={i} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-lg object-cover mx-auto mb-4 border-2 border-gray-900 dark:border-white/30 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)]"
                />
                <h3 className="text-xl font-space font-bold text-gray-900 dark:text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-cyan-600 dark:text-cyan-400 font-space font-semibold text-sm mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {member.bio}
                </p>
              </Card>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 dark:bg-black text-white rounded-xl border-3 border-gray-900 dark:border-white/30 p-12 md:p-16 text-center overflow-hidden relative shadow-[8px_8px_0px_0px_rgba(0,212,170,1)]">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,212,170,0.15)_1px,transparent_1px),linear-gradient(rgba(0,212,170,0.15)_1px,transparent_1px)] bg-[size:40px_40px]" />
          </div>
          <div className="relative">
            <span className="font-mono text-xs text-gray-400 tracking-wider">// JOIN US</span>
            <h2 className="text-4xl md:text-5xl font-space font-bold mb-6 mt-2">
              Join Us
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-space">
              Be part of a movement that's transforming education. Join thousands of students already learning and earning on SkillBarter.
            </p>
            <Link to="/signup">
              <button className="px-8 py-4 bg-cyan-400 text-gray-900 font-space font-bold text-lg rounded-lg border-3 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-150">
                Get Started Today
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
