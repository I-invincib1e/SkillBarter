import { BookOpen, GraduationCap, Target, Lightbulb } from 'lucide-react';

interface Props {
  name?: string;
  onPrompt: (text: string) => void;
}

const SUGGESTIONS = [
  {
    icon: Target,
    title: 'What skills should I learn next?',
    prompt:
      'Based on what I already teach and want to learn on SkillBarter, what skills should I focus on next and why?',
  },
  {
    icon: GraduationCap,
    title: 'Summarize my activity',
    prompt: 'Give me a quick summary of my activity on SkillBarter and suggest one thing to improve.',
  },
  {
    icon: BookOpen,
    title: 'Help me prep a session',
    prompt: 'Help me prepare for my next teaching session. What should I have ready?',
  },
  {
    icon: Lightbulb,
    title: 'Teach me something new',
    prompt: 'Pick one skill I want to learn and give me a 5-minute crash course on the fundamentals.',
  },
];

export function WelcomeScreen({ name, onPrompt }: Props) {
  const firstName = name?.split(' ')[0] || 'there';
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-8 max-w-2xl mx-auto">
      <h1 className="font-space text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white tracking-tight text-center">
        Hi {firstName}, I'm Zeno
      </h1>
      <p className="mt-3 text-center text-gray-500 dark:text-gray-400 text-[15px]">
        Your AI study companion. How can I help you today?
      </p>
      <div className="grid sm:grid-cols-2 gap-2 mt-10 w-full">
        {SUGGESTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.title}
              onClick={() => onPrompt(s.prompt)}
              className="text-left px-4 py-3 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors flex items-start gap-3"
            >
              <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400 shrink-0 mt-0.5" />
              <div className="text-sm text-gray-800 dark:text-gray-200 leading-snug">
                {s.title}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
