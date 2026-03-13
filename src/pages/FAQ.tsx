import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, HelpCircle } from 'lucide-react';
import { Card, Button } from '../components/ui';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: 'What is SkillBarter?',
      answer:
        'SkillBarter is a peer-to-peer learning platform where students can connect to share knowledge, learn new skills, and earn credits. Instead of paying money, you earn credits by helping others and use those credits to get help in return.',
    },
    {
      question: 'How do I get started?',
      answer:
        'Getting started is simple! Sign up with your email, create your profile, and add the skills you can teach. Then you can browse listings from other students who need help, or post a request for help in an area you want to learn.',
    },
    {
      question: 'How do the credits work?',
      answer:
        'Every completed session earns you credits. You earn credits when you help someone, and you spend credits when you receive help. The number of credits depends on the skill level and duration of the session. Your first signup bonus gives you 10 free credits to get started.',
    },
    {
      question: 'Is it safe to use SkillBarter?',
      answer:
        'Yes! All members are verified before joining the community. We have a review system so you can see ratings from previous sessions. Sessions are scheduled and confirmed by both parties, and we provide detailed information about each tutor and learner.',
    },
    {
      question: 'How do I book a session?',
      answer:
        'Browse the discover page to find listings or requests. Click on one that interests you and propose a time. Once the other person accepts, the session is confirmed. You can also post your own request for help.',
    },
    {
      question: 'What subjects are available?',
      answer:
        'SkillBarter covers a wide range of subjects including Math, Science, Languages, Programming, Writing, Art, Music, and many more. You can browse the categories or search for specific skills you need help with.',
    },
    {
      question: 'Can I cancel a session?',
      answer:
        'Yes, you can cancel a session before the scheduled time. If you cancel before the session starts, any locked credits are refunded. Cancellations after the session starts may result in a fee.',
    },
    {
      question: 'How are disputes handled?',
      answer:
        'We take quality seriously. If there\'s a dispute about a session, our support team reviews the issue and takes appropriate action. We encourage open communication between both parties to resolve issues quickly.',
    },
    {
      question: 'Can I teach multiple subjects?',
      answer:
        'Absolutely! You can create multiple listings for different subjects you\'re skilled in. Each listing has its own pricing in credits based on the complexity and your experience level.',
    },
    {
      question: 'What if I don\'t have enough credits?',
      answer:
        'You can start earning credits immediately by creating listings for skills you can teach. You get a 10 credit signup bonus to get started. As you complete sessions, you\'ll earn more credits to spend on other services.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-dark-bg dark:to-dark-card animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium mb-12">
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <div className="text-center mb-16">
          <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find answers to common questions about SkillBarter
          </p>
        </div>

        <div className="space-y-4 mb-20">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            >
              <button
                className="w-full flex items-center justify-between"
                type="button"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white text-left">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-6 h-6 text-primary-600 transition-transform shrink-0 ml-4 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openIndex === index && (
                <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed pt-4 border-t border-gray-100 dark:border-dark-border">
                  {faq.answer}
                </p>
              )}
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-br from-accent-50 to-transparent dark:from-accent-900/20 text-center py-16">
          <HelpCircle className="w-12 h-12 text-accent-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Can't Find an Answer?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-xl mx-auto">
            Our support team is here to help. Reach out to us with any questions or concerns.
          </p>
          <a
            href="mailto:support@skillbarter.com"
            className="inline-block px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-semibold transition-colors"
          >
            Contact Support
          </a>
        </Card>
      </div>
    </div>
  );
}
