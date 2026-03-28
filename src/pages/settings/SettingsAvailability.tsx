import { Clock, Video, MessageCircle, Zap } from 'lucide-react';
import { Select } from '../../components/ui';

const TIMEZONES = [
  'Asia/Kolkata',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Dubai',
  'Asia/Singapore',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Sao_Paulo',
  'Australia/Sydney',
  'Pacific/Auckland',
];

interface SettingsAvailabilityProps {
  availabilityStatus: 'active' | 'busy';
  timezone: string;
  preferredCommunication: 'discord' | 'zoom' | 'in_platform';
  onChange: (field: string, value: string) => void;
}

export function SettingsAvailability({
  availabilityStatus,
  timezone,
  preferredCommunication,
  onChange,
}: SettingsAvailabilityProps) {
  const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-6">
          Barter Status
        </h2>

        <div className="flex items-center justify-between p-5 rounded-lg border-2 border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${availabilityStatus === 'active' ? 'bg-green-500 animate-pulse-slow' : 'bg-gray-400'}`} />
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-white">
                {availabilityStatus === 'active' ? 'Active for Barter' : 'Currently Busy'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {availabilityStatus === 'active'
                  ? 'Other users can see you as available'
                  : 'You will appear as unavailable to others'}
              </p>
            </div>
          </div>
          <button
            onClick={() => onChange('availability_status', availabilityStatus === 'active' ? 'busy' : 'active')}
            className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
              availabilityStatus === 'active'
                ? 'bg-green-500'
                : 'bg-gray-300 dark:bg-white/30'
            }`}
          >
            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
              availabilityStatus === 'active' ? 'left-6' : 'left-1'
            }`} />
          </button>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-dark-border pt-8">
        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-6">
          Session Logistics
        </h2>

        <div className="space-y-5">
          <div>
            <Select
              label="Timezone"
              value={timezone || detectedTimezone}
              onChange={(e) => onChange('timezone', e.target.value)}
            >
              {!TIMEZONES.includes(detectedTimezone) && (
                <option value={detectedTimezone}>{detectedTimezone} (detected)</option>
              )}
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}{tz === detectedTimezone ? ' (detected)' : ''}
                </option>
              ))}
            </Select>
            <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Auto-detected: {detectedTimezone}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Preferred Communication
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {([
                { value: 'in_platform', label: 'In-Platform', icon: Zap, desc: 'SkillBarter chat' },
                { value: 'zoom', label: 'Zoom', icon: Video, desc: 'Video calls' },
                { value: 'discord', label: 'Discord', icon: MessageCircle, desc: 'Voice & text' },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onChange('preferred_communication', opt.value)}
                  className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                    preferredCommunication === opt.value
                      ? 'border-gray-900 dark:border-white/50 bg-white dark:bg-dark-card shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.15)]'
                      : 'border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface hover:border-gray-300 dark:hover:border-white/20'
                  }`}
                >
                  <opt.icon className={`w-5 h-5 mb-2 ${
                    preferredCommunication === opt.value
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-400'
                  }`} />
                  <p className={`text-sm font-semibold ${
                    preferredCommunication === opt.value
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}>
                    {opt.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
