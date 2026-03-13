import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui';
import type { BadgeWithEarned } from '../types/database';
import { Award, type LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';

export function Badges() {
  const { user, profile } = useAuth();
  const [badges, setBadges] = useState<BadgeWithEarned[]>([]);

  useEffect(() => {
    const fetchBadges = async () => {
      const { data: allBadges } = await supabase
        .from('badges')
        .select('*')
        .order('requirement_value');

      if (!allBadges) {
        return;
      }

      if (user) {
        const { data: userBadges } = await supabase
          .from('user_badges')
          .select('badge_id, earned_at')
          .eq('user_id', user.id);

        const userBadgeMap = new Map<string, string>(
          (userBadges || []).map((ub: { badge_id: string; earned_at: string }) => [ub.badge_id, ub.earned_at])
        );

        const badgesWithEarned = allBadges.map((badge: { id: string }) => ({
          ...badge,
          earned: userBadgeMap.has(badge.id),
          earned_at: userBadgeMap.get(badge.id),
        }));

        setBadges(badgesWithEarned as BadgeWithEarned[]);
      } else {
        setBadges(allBadges.map((b: object) => ({ ...b, earned: false })) as BadgeWithEarned[]);
      }
    };

    fetchBadges();
  }, [user]);

  const getProgress = (badge: BadgeWithEarned): number => {
    if (!profile || badge.earned) return 100;

    switch (badge.requirement_type) {
      case 'sessions_completed':
        return Math.min((profile.sessions_completed / badge.requirement_value) * 100, 100);
      case 'streak':
        return Math.min((profile.current_streak / badge.requirement_value) * 100, 100);
      case 'rating':
        return Math.min((profile.rating * 10 / badge.requirement_value) * 100, 100);
      default:
        return 0;
    }
  };

  const earnedBadges = badges.filter((b) => b.earned);
  const lockedBadges = badges.filter((b) => !b.earned);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">
          Badges & Achievements
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Earn badges by completing sessions and maintaining streaks
        </p>
      </div>

      {earnedBadges.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            Earned ({earnedBadges.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {earnedBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} progress={100} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          {earnedBadges.length > 0 ? `Locked (${lockedBadges.length})` : 'All Badges'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {lockedBadges.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} progress={getProgress(badge)} />
          ))}
        </div>
      </section>
    </div>
  );
}

function BadgeCard({ badge, progress }: { badge: BadgeWithEarned; progress: number }) {
  const IconComponent: LucideIcon = (Icons as unknown as Record<string, LucideIcon>)[badge.icon] || Award;

  return (
    <Card className={`text-center ${!badge.earned ? 'opacity-60' : ''}`}>
      <div
        className={`
          w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center
          ${badge.earned ? 'shadow-clay dark:shadow-clay-dark' : 'bg-gray-100 dark:bg-dark-surface'}
        `}
        style={badge.earned ? { background: `linear-gradient(135deg, ${badge.color}, ${badge.color}dd)` } : {}}
      >
        <IconComponent className={`w-8 h-8 ${badge.earned ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
      </div>

      <h3 className="font-bold text-gray-800 dark:text-white mb-1">
        {badge.name}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
        {badge.description}
      </p>

      {!badge.earned && (
        <div className="space-y-1">
          <div className="h-2 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: badge.color,
              }}
            />
          </div>
          <p className="text-xs text-gray-500">{Math.round(progress)}%</p>
        </div>
      )}

      {badge.earned && badge.earned_at && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Earned {new Date(badge.earned_at).toLocaleDateString()}
        </p>
      )}
    </Card>
  );
}
