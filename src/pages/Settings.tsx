import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  User,
  Layers,
  Clock,
  Shield,
  Receipt,
  Eye,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import { Button, Card } from '../components/ui';
import { SettingsGeneral } from './settings/SettingsGeneral';
import { SettingsSkills } from './settings/SettingsSkills';
import { SettingsAvailability } from './settings/SettingsAvailability';
import { SettingsSecurity } from './settings/SettingsSecurity';
import { SettingsTransactions } from './settings/SettingsTransactions';
import { SettingsPreview } from './settings/SettingsPreview';

type SettingsTab = 'general' | 'profile' | 'skills' | 'availability' | 'security' | 'transactions';

const TABS: { id: SettingsTab; label: string; icon: typeof User }[] = [
  { id: 'general', label: 'General', icon: User },
  { id: 'profile', label: 'Public Profile', icon: Eye },
  { id: 'skills', label: 'Skills', icon: Layers },
  { id: 'availability', label: 'Availability', icon: Clock },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'transactions', label: 'Transactions', icon: Receipt },
];

export function Settings() {
  const { user, profile, wallet, refreshProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: profile?.name || '',
    tagline: profile?.tagline || '',
    bio: profile?.bio || '',
    university: profile?.university || '',
    github_url: profile?.github_url || '',
    linkedin_url: profile?.linkedin_url || '',
    website_url: profile?.website_url || '',
    skills_offered: profile?.skills_offered || [] as string[],
    skills_wanted: profile?.skills_wanted || [] as string[],
    timezone: profile?.timezone || '',
    preferred_communication: profile?.preferred_communication || ('in_platform' as const),
    availability_status: profile?.availability_status || ('active' as const),
  });

  const updateField = (field: string, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const hasChanges = profile && (
    form.name !== profile.name ||
    form.tagline !== (profile.tagline || '') ||
    form.bio !== (profile.bio || '') ||
    form.university !== (profile.university || '') ||
    form.github_url !== (profile.github_url || '') ||
    form.linkedin_url !== (profile.linkedin_url || '') ||
    form.website_url !== (profile.website_url || '') ||
    JSON.stringify(form.skills_offered) !== JSON.stringify(profile.skills_offered || []) ||
    JSON.stringify(form.skills_wanted) !== JSON.stringify(profile.skills_wanted || []) ||
    form.timezone !== (profile.timezone || '') ||
    form.preferred_communication !== (profile.preferred_communication || 'in_platform') ||
    form.availability_status !== (profile.availability_status || 'active')
  );

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        name: form.name,
        tagline: form.tagline,
        bio: form.bio,
        university: form.university,
        github_url: form.github_url,
        linkedin_url: form.linkedin_url,
        website_url: form.website_url,
        skills_offered: form.skills_offered,
        skills_wanted: form.skills_wanted,
        timezone: form.timezone,
        preferred_communication: form.preferred_communication,
        availability_status: form.availability_status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) {
      showToast('Failed to save profile', 'error');
    } else {
      await refreshProfile();
      showToast('Profile saved successfully!', 'success');
    }
    setSaving(false);
  };

  const resetForm = () => {
    if (!profile) return;
    setForm({
      name: profile.name || '',
      tagline: profile.tagline || '',
      bio: profile.bio || '',
      university: profile.university || '',
      github_url: profile.github_url || '',
      linkedin_url: profile.linkedin_url || '',
      website_url: profile.website_url || '',
      skills_offered: profile.skills_offered || [],
      skills_wanted: profile.skills_wanted || [],
      timezone: profile.timezone || '',
      preferred_communication: profile.preferred_communication || 'in_platform',
      availability_status: profile.availability_status || 'active',
    });
  };

  if (!profile || !user) return null;

  const showSaveBar = activeTab !== 'security' && activeTab !== 'transactions';

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <SettingsGeneral
            profile={profile}
            form={{
              name: form.name,
              tagline: form.tagline,
              university: form.university,
              bio: form.bio,
              github_url: form.github_url,
              linkedin_url: form.linkedin_url,
              website_url: form.website_url,
            }}
            onChange={updateField}
          />
        );
      case 'profile':
        return (
          <SettingsGeneral
            profile={profile}
            form={{
              name: form.name,
              tagline: form.tagline,
              university: form.university,
              bio: form.bio,
              github_url: form.github_url,
              linkedin_url: form.linkedin_url,
              website_url: form.website_url,
            }}
            onChange={updateField}
          />
        );
      case 'skills':
        return (
          <SettingsSkills
            skillsOffered={form.skills_offered}
            skillsWanted={form.skills_wanted}
            onChangeOffered={(s) => updateField('skills_offered', s)}
            onChangeWanted={(s) => updateField('skills_wanted', s)}
          />
        );
      case 'availability':
        return (
          <SettingsAvailability
            availabilityStatus={form.availability_status}
            timezone={form.timezone}
            preferredCommunication={form.preferred_communication}
            onChange={updateField}
          />
        );
      case 'security':
        return <SettingsSecurity />;
      case 'transactions':
        return <SettingsTransactions userId={user.id} />;
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Settings
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your profile and preferences
            </p>
          </div>
        </div>

        {showSaveBar && hasChanges && (
          <div className="hidden md:block">
            <Button onClick={handleSave} loading={saving} size="sm">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="md:hidden mb-4 -mx-1 overflow-x-auto">
        <div className="flex gap-1.5 px-1 min-w-max">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                activeTab === tab.id
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        <nav className="hidden md:block w-52 flex-shrink-0">
          <div className="sticky top-24 space-y-0.5">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left ${
                  activeTab === tab.id
                    ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6">
            <Card>
              {renderContent()}
            </Card>
            <div className="hidden xl:block">
              <div className="sticky top-24">
                <SettingsPreview
                  profile={profile}
                  wallet={wallet}
                  form={{
                    name: form.name,
                    tagline: form.tagline,
                    university: form.university,
                    availability_status: form.availability_status,
                    skills_offered: form.skills_offered,
                    skills_wanted: form.skills_wanted,
                    github_url: form.github_url,
                    linkedin_url: form.linkedin_url,
                    website_url: form.website_url,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSaveBar && hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 md:bottom-4 md:left-auto md:right-4 md:w-auto z-40">
          <div className="bg-white dark:bg-dark-card border-t md:border border-gray-200 dark:border-white/10 md:rounded-xl shadow-lg p-4 flex items-center gap-4">
            <div className="flex-1 lg:flex-none">
              <p className="text-sm font-semibold text-gray-800 dark:text-white">
                Unsaved changes
              </p>
              <p className="text-xs text-gray-400 hidden sm:block">
                Save to apply your updates
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={resetForm}>
                Discard
              </Button>
              <Button size="sm" onClick={handleSave} loading={saving}>
                <Save className="w-4 h-4" />
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
