import { Sparkles, BookOpen, GraduationCap, Target, Lightbulb } from 'lucide-react';

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
    title: 'Summarize my SkillBarter activity',
    prompt: 'Give me a quick summary of my activity on SkillBarter and suggest one thing to improve.',
  },
  {
    icon: BookOpen,
    title: 'Help me prep for a session',
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
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-400 flex items-center justify-center border-3 border-gray-900 dark:border-white/80 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.25)] mb-5">
        <Sparkles className="w-8 h-8 text-white" />
      </div>
      <h1 className="font-space text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight text-center">
        Hi {firstName}, I'm <span className="text-accent-600 dark:text-accent-400">Zeno</span>
      </h1>
      <p className="mt-2 text-center text-gray-600 dark:text-gray-400 text-[15px]">
        Your AI study companion. I know your skills and I'm here to help you grow.
      </p>
      <div className="grid sm:grid-cols-2 gap-3 mt-8 w-full">
        {SUGGESTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.title}
              onClick={() => onPrompt(s.prompt)}
              className="group text-left p-4 rounded-xl glass border border-gray-200/70 dark:border-white/10 hover:border-accent-500/50 hover:shadow-[4px_4px_0px_0px_rgba(16,185,129,0.4)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
            >
              <Icon className="w-5 h-5 text-accent-600 dark:text-accent-400 mb-2" />
              <div className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                {s.title}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
