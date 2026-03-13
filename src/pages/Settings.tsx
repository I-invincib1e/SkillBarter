import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Save, X, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import { Card, Button, Input, Textarea, Avatar } from '../components/ui';

export function Settings() {
  const { user, profile, refreshProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(profile?.name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [university, setUniversity] = useState(profile?.university || '');
  const [skills, setSkills] = useState<string[]>(profile?.skills_offered || []);
  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        name,
        bio,
        university,
        skills_offered: skills,
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

  if (!profile) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">
          Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your profile and preferences
        </p>
      </div>

      <Card>
        <h2 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          Profile Information
        </h2>

        <div className="flex items-center gap-4 mb-6">
          <Avatar src={profile.avatar_url} name={profile.name} size="xl" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Profile photo is synced from your account
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />

          <Textarea
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell others about yourself..."
            rows={3}
          />

          <Input
            label="University / School"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            placeholder="e.g., Stanford University"
          />

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Skills
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="p-0.5 hover:bg-primary-200 dark:hover:bg-primary-800/50 rounded-full transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <Button variant="secondary" onClick={addSkill} disabled={!newSkill.trim()}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex gap-4">
        <Button variant="secondary" className="flex-1" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button className="flex-1" onClick={handleSave} loading={saving}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
