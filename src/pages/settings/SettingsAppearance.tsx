import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const options = [
  {
    value: 'auto' as const,
    label: 'System',
    description: 'Follows your device preference',
    icon: Monitor,
    lightBg: 'bg-gradient-to-br from-white via-white to-gray-900',
    previewLight: 'bg-white',
    previewDark: 'bg-gray-900',
    split: true,
  },
  {
    value: 'light' as const,
    label: 'Day',
    description: 'Blue and white theme',
    icon: Sun,
    previewLight: 'bg-white',
    split: false,
  },
  {
    value: 'dark' as const,
    label: 'Night',
    description: 'Blue and black theme',
    icon: Moon,
    previewDark: 'bg-[#09090B]',
    split: false,
  },
];

export function SettingsAppearance() {
  const { preference, setPreference } = useTheme();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-6">
          Appearance
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
          Choose how SkillBarter looks to you. Select a theme below or let your system decide.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {options.map((opt) => {
            const active = preference === opt.value;
            const Icon = opt.icon;

            return (
              <button
                key={opt.value}
                onClick={() => setPreference(opt.value)}
                className={`group relative text-left rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                  active
                    ? 'border-blue-600 dark:border-blue-400 ring-2 ring-blue-600/20 dark:ring-blue-400/20'
                    : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                }`}
              >
                <div className="relative h-28 overflow-hidden">
                  {opt.split ? (
                    <div className="flex h-full">
                      <div className="flex-1 bg-white p-3">
                        <div className="space-y-1.5">
                          <div className="h-2 w-10 rounded bg-blue-600/80" />
                          <div className="h-1.5 w-16 rounded bg-gray-200" />
                          <div className="h-1.5 w-12 rounded bg-gray-200" />
                        </div>
                      </div>
                      <div className="flex-1 bg-[#09090B] p-3">
                        <div className="space-y-1.5">
                          <div className="h-2 w-10 rounded bg-blue-500/80" />
                          <div className="h-1.5 w-16 rounded bg-white/10" />
                          <div className="h-1.5 w-12 rounded bg-white/10" />
                        </div>
                      </div>
                    </div>
                  ) : opt.value === 'light' ? (
                    <div className="h-full bg-white p-3">
                      <div className="h-5 rounded bg-gray-100 border border-gray-200 mb-2 flex items-center px-2">
                        <div className="h-1.5 w-8 rounded bg-gray-900" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="h-2 w-14 rounded bg-blue-600/80" />
                        <div className="h-1.5 w-20 rounded bg-gray-200" />
                        <div className="h-1.5 w-16 rounded bg-gray-200" />
                        <div className="flex gap-1.5 mt-2">
                          <div className="h-6 flex-1 rounded bg-gray-100 border border-gray-200" />
                          <div className="h-6 flex-1 rounded bg-blue-600" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full bg-[#09090B] p-3">
                      <div className="h-5 rounded bg-[#151517] border border-white/10 mb-2 flex items-center px-2">
                        <div className="h-1.5 w-8 rounded bg-white" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="h-2 w-14 rounded bg-blue-500/80" />
                        <div className="h-1.5 w-20 rounded bg-white/10" />
                        <div className="h-1.5 w-16 rounded bg-white/10" />
                        <div className="flex gap-1.5 mt-2">
                          <div className="h-6 flex-1 rounded bg-white/5 border border-white/10" />
                          <div className="h-6 flex-1 rounded bg-blue-600" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-white dark:bg-dark-card border-t border-gray-100 dark:border-white/5">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                    <span className={`font-mono text-xs font-semibold ${active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-gray-200'}`}>
                      {opt.label}
                    </span>
                    {active && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 font-mono">
                    {opt.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
