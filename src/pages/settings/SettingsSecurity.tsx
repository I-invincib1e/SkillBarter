import { useState } from 'react';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';

export function SettingsSecurity() {
  const { showToast } = useToast();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  const passwordsMatch = newPassword === confirmPassword;
  const isValid = newPassword.length >= 8 && passwordsMatch;

  const handleChangePassword = async () => {
    if (!isValid) return;
    setSaving(true);

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      showToast('Failed to update password', 'error');
    } else {
      showToast('Password updated successfully', 'success');
      setNewPassword('');
      setConfirmPassword('');
    }
    setSaving(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-1">
          Change Password
        </h2>
        <p className="text-xs text-gray-400 mb-6">
          Update your account password. Minimum 8 characters.
        </p>

        <div className="space-y-4">
          <div className="w-full">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-50 dark:bg-dark-surface border-2 border-gray-200 dark:border-dark-border text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-gray-900 dark:focus:border-white/50 focus:bg-white dark:focus:bg-dark-card transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {newPassword.length > 0 && newPassword.length < 8 && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">
                Password must be at least 8 characters
              </p>
            )}
          </div>

          <div className="w-full">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                className={`w-full px-4 py-3 pr-12 rounded-lg bg-gray-50 dark:bg-dark-surface border-2 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:bg-white dark:focus:bg-dark-card transition-all duration-200 ${
                  confirmPassword.length > 0 && !passwordsMatch
                    ? 'border-red-400 focus:border-red-400'
                    : 'border-gray-200 dark:border-dark-border focus:border-gray-900 dark:focus:border-white/50'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">
                Passwords do not match
              </p>
            )}
          </div>

          <Button onClick={handleChangePassword} loading={saving} disabled={!isValid}>
            <Shield className="w-4 h-4" />
            Update Password
          </Button>
        </div>
      </div>
    </div>
  );
}
