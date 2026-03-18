import { User, Github, Linkedin, Globe } from 'lucide-react';
import { Input, Textarea, Avatar } from '../../components/ui';
import type { Profile } from '../../types/database';

interface SettingsGeneralProps {
  profile: Profile;
  form: {
    name: string;
    tagline: string;
    university: string;
    bio: string;
    github_url: string;
    linkedin_url: string;
    website_url: string;
  };
  onChange: (field: string, value: string) => void;
}

export function SettingsGeneral({ profile, form, onChange }: SettingsGeneralProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-6">
          Profile Basics
        </h2>

        <div className="flex items-center gap-5 mb-8 p-4 rounded-lg bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
          <Avatar src={profile.avatar_url} name={profile.name} size="xl" />
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
              Profile Photo
            </p>
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Synced from your account provider
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={form.name}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="Your full name"
            />
            <div className="w-full">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Username
              </label>
              <div className="px-4 py-3 rounded-lg bg-gray-100 dark:bg-dark-surface border-2 border-gray-200 dark:border-dark-border text-gray-500 dark:text-gray-400 text-sm font-mono">
                {profile.email?.split('@')[0] || 'user'}
              </div>
            </div>
          </div>

          <Input
            label="University / School"
            value={form.university}
            onChange={(e) => onChange('university', e.target.value)}
            placeholder="e.g., Stanford University"
          />

          <div className="w-full">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Tagline
              </label>
              <span className={`text-xs font-mono ${form.tagline.length > 55 ? 'text-warning-500' : 'text-gray-400'}`}>
                {form.tagline.length}/60
              </span>
            </div>
            <input
              value={form.tagline}
              onChange={(e) => {
                if (e.target.value.length <= 60) onChange('tagline', e.target.value);
              }}
              placeholder="e.g., Full-stack dev looking for UI/UX mentorship"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-dark-surface border-2 border-gray-200 dark:border-dark-border text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-gray-900 dark:focus:border-white/50 focus:bg-white dark:focus:bg-dark-card transition-all duration-200"
            />
          </div>

          <div className="w-full">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Bio
              </label>
              <span className={`text-xs font-mono ${form.bio.length > 450 ? 'text-warning-500' : 'text-gray-400'}`}>
                {form.bio.length}/500
              </span>
            </div>
            <Textarea
              value={form.bio}
              onChange={(e) => {
                if (e.target.value.length <= 500) onChange('bio', e.target.value);
              }}
              placeholder="Tell others about yourself, your background, and what excites you..."
              rows={4}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-dark-border pt-8">
        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-6">
          Portfolio Links
        </h2>
        <div className="space-y-4">
          <Input
            label="GitHub"
            icon={<Github className="w-4 h-4" />}
            value={form.github_url}
            onChange={(e) => onChange('github_url', e.target.value)}
            placeholder="https://github.com/username"
          />
          <Input
            label="LinkedIn"
            icon={<Linkedin className="w-4 h-4" />}
            value={form.linkedin_url}
            onChange={(e) => onChange('linkedin_url', e.target.value)}
            placeholder="https://linkedin.com/in/username"
          />
          <Input
            label="Website"
            icon={<Globe className="w-4 h-4" />}
            value={form.website_url}
            onChange={(e) => onChange('website_url', e.target.value)}
            placeholder="https://yoursite.com"
          />
        </div>
      </div>
    </div>
  );
}
