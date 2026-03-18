import {
  Star,
  CheckCircle,
  Flame,
  TrendingUp,
  MapPin,
  Github,
  Linkedin,
  Globe,
} from 'lucide-react';
import { Avatar, Badge, RingChart } from '../../components/ui';
import type { Profile, Wallet } from '../../types/database';

interface SettingsPreviewProps {
  profile: Profile;
  wallet: Wallet | null;
  form: {
    name: string;
    tagline: string;
    university: string;
    availability_status: 'active' | 'busy';
    skills_offered: string[];
    skills_wanted: string[];
    github_url: string;
    linkedin_url: string;
    website_url: string;
  };
}

export function SettingsPreview({ profile, wallet, form }: SettingsPreviewProps) {
  const reliabilityScore = profile.sessions_completed > 0
    ? Math.min(100, (profile.sessions_completed / (profile.sessions_completed + 5)) * 100)
    : 0;

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-xl border-2 border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card">
        <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500 mb-4">
          Public Preview
        </div>

        <div className="flex items-start gap-4 mb-4">
          <div className="relative flex-shrink-0">
            <Avatar src={profile.avatar_url} name={form.name || profile.name} size="lg" />
            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-dark-card ${
              form.availability_status === 'active' ? 'bg-green-500' : 'bg-gray-400'
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate">
              {form.name || 'Your Name'}
            </h3>
            {form.tagline && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                {form.tagline}
              </p>
            )}
            {form.university && (
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {form.university}
              </p>
            )}
          </div>
        </div>

        {(form.github_url || form.linkedin_url || form.website_url) && (
          <div className="flex items-center gap-2 mb-4">
            {form.github_url && (
              <div className="w-7 h-7 rounded-md bg-gray-100 dark:bg-dark-surface flex items-center justify-center">
                <Github className="w-3.5 h-3.5 text-gray-500" />
              </div>
            )}
            {form.linkedin_url && (
              <div className="w-7 h-7 rounded-md bg-gray-100 dark:bg-dark-surface flex items-center justify-center">
                <Linkedin className="w-3.5 h-3.5 text-gray-500" />
              </div>
            )}
            {form.website_url && (
              <div className="w-7 h-7 rounded-md bg-gray-100 dark:bg-dark-surface flex items-center justify-center">
                <Globe className="w-3.5 h-3.5 text-gray-500" />
              </div>
            )}
          </div>
        )}

        {form.skills_offered.length > 0 && (
          <div className="mb-3">
            <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1.5">Offering</p>
            <div className="flex flex-wrap gap-1.5">
              {form.skills_offered.slice(0, 5).map((s) => (
                <Badge key={s} variant="primary" size="sm">{s}</Badge>
              ))}
              {form.skills_offered.length > 5 && (
                <span className="text-xs text-gray-400 self-center">+{form.skills_offered.length - 5}</span>
              )}
            </div>
          </div>
        )}

        {form.skills_wanted.length > 0 && (
          <div className="mb-3">
            <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1.5">Seeking</p>
            <div className="flex flex-wrap gap-1.5">
              {form.skills_wanted.slice(0, 5).map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300"
                >
                  {s}
                </span>
              ))}
              {form.skills_wanted.length > 5 && (
                <span className="text-xs text-gray-400 self-center">+{form.skills_wanted.length - 5}</span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-dark-border">
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500" />
            {profile.rating > 0 ? profile.rating.toFixed(1) : '--'}
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-500" />
            {profile.sessions_completed} sessions
          </span>
        </div>
      </div>

      <div className="p-5 rounded-xl border-2 border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card">
        <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500 mb-4">
          Growth Metrics
        </div>

        <div className="flex items-center justify-center mb-4">
          <RingChart
            percentage={reliabilityScore}
            size={80}
            strokeWidth={6}
            color="#22C55E"
            bgColor="#E5E7EB"
            showLabel={false}
          />
        </div>

        <div className="space-y-3">
          <MetricRow
            icon={<CheckCircle className="w-4 h-4 text-green-500" />}
            label="Total Barters"
            value={String(profile.sessions_completed)}
          />
          <MetricRow
            icon={<Star className="w-4 h-4 text-yellow-500" />}
            label="Avg. Rating"
            value={profile.rating > 0 ? profile.rating.toFixed(1) : '--'}
          />
          <MetricRow
            icon={<Flame className="w-4 h-4 text-warning-500" />}
            label="Current Streak"
            value={`${profile.current_streak} days`}
          />
          <MetricRow
            icon={<TrendingUp className="w-4 h-4 text-primary-500" />}
            label="Credits Earned"
            value={String(wallet?.total_earned ?? 0)}
          />
        </div>
      </div>
    </div>
  );
}

function MetricRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      </div>
      <span className="text-sm font-bold text-gray-800 dark:text-white font-mono">{value}</span>
    </div>
  );
}
