import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Star,
  Award,
  Flame,
  CheckCircle,
  Settings,
  Github,
  Linkedin,
  Globe,
  Video,
  MessageCircle,
  Zap,
  ExternalLink,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
  Card,
  Button,
  Avatar,
  Badge,
  StarRating,
  RingChart,
  ProfileSkeleton,
} from '../components/ui';
import type {
  Profile as ProfileType,
  ListingWithDetails,
  Review,
  UserBadge,
  Badge as BadgeType,
} from '../types/database';

interface ReviewWithUser extends Review {
  profiles: { name: string; avatar_url: string };
}

interface BadgeWithDetails extends UserBadge {
  badges: BadgeType;
}

const COMM_LABELS: Record<string, { label: string; icon: typeof Zap }> = {
  in_platform: { label: 'In-Platform', icon: Zap },
  zoom: { label: 'Zoom', icon: Video },
  discord: { label: 'Discord', icon: MessageCircle },
};

export function Profile() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [listings, setListings] = useState<ListingWithDetails[]>([]);
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const [badges, setBadges] = useState<BadgeWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const profileId = id || user?.id;
  const isOwnProfile = !id || id === user?.id;

  useEffect(() => {
    if (!profileId) return;

    const fetchProfile = async () => {
      setLoading(true);

      const [profileRes, listingsRes, reviewsRes, badgesRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', profileId).maybeSingle(),
        supabase
          .from('listings')
          .select(`*, profiles!listings_user_id_profiles_fkey(*), categories!listings_category_id_fkey(*)`)
          .eq('user_id', profileId)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(4),
        supabase
          .from('reviews')
          .select(`*, profiles!reviews_reviewer_id_profiles_fkey(name, avatar_url)`)
          .eq('reviewed_user_id', profileId)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('user_badges')
          .select('*, badges(*)')
          .eq('user_id', profileId)
          .order('earned_at', { ascending: false }),
      ]);

      setProfile(profileRes.data);
      setListings((listingsRes.data || []) as ListingWithDetails[]);
      setReviews((reviewsRes.data || []) as ReviewWithUser[]);
      setBadges((badgesRes.data || []) as BadgeWithDetails[]);
      setLoading(false);
    };

    fetchProfile();
  }, [profileId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <ProfileSkeleton />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Profile not found
        </h2>
        <Link to="/">
          <Button variant="secondary">Go Home</Button>
        </Link>
      </div>
    );
  }

  const reliabilityScore =
    profile.sessions_completed > 0
      ? Math.min(100, (profile.sessions_completed / (profile.sessions_completed + 5)) * 100)
      : 0;

  const hasPortfolio = profile.github_url || profile.linkedin_url || profile.website_url;
  const commPref = COMM_LABELS[profile.preferred_communication] || COMM_LABELS.in_platform;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-dark-card">
        <div className="h-32 sm:h-40 bg-gradient-to-br from-cyan-500/20 via-primary-500/10 to-accent-500/20 dark:from-cyan-500/10 dark:via-primary-500/5 dark:to-accent-500/10 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,200,200,0.15),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.1),transparent_60%)]" />
          {isOwnProfile && (
            <Link
              to="/settings"
              className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-dark-card transition-colors border border-gray-200/50 dark:border-white/10"
            >
              <Settings className="w-3.5 h-3.5" />
              Edit Profile
            </Link>
          )}
        </div>

        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-10 mb-4">
            <div className="relative flex-shrink-0">
              <div className="ring-4 ring-white dark:ring-dark-card rounded-full">
                <Avatar src={profile.avatar_url} name={profile.name} size="xl" />
              </div>
              <div
                className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-3 border-white dark:border-dark-card ${
                  profile.availability_status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                }`}
              />
            </div>

            <div className="flex-1 min-w-0 sm:pb-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
                  {profile.name}
                </h1>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${
                    profile.availability_status === 'active'
                      ? 'bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-dark-surface text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      profile.availability_status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                  />
                  {profile.availability_status === 'active' ? 'Available' : 'Busy'}
                </span>
              </div>
              {profile.tagline && (
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{profile.tagline}</p>
              )}
            </div>
          </div>

          {(profile.university || profile.bio) && (
            <div className="mb-4">
              {profile.university && (
                <p className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm mb-2">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  {profile.university}
                </p>
              )}
              {profile.bio && (
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{profile.bio}</p>
              )}
            </div>
          )}

          {(hasPortfolio || commPref) && (
            <div className="flex flex-wrap items-center gap-2 mb-5">
              {profile.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  GitHub
                  <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              )}
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  LinkedIn
                  <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              )}
              {profile.website_url && (
                <a
                  href={profile.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Website
                  <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              )}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5">
                <commPref.icon className="w-3 h-3" />
                {commPref.label}
              </span>
            </div>
          )}

          {profile.skills_offered.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                Teaching
              </p>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills_offered.map((skill) => (
                  <Badge key={skill} variant="primary" size="sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {profile.skills_wanted && profile.skills_wanted.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                Learning
              </p>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills_wanted.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-500/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-white/10 p-4 text-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-yellow-50 dark:bg-yellow-500/10 mx-auto mb-2">
            <Star className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{profile.rating.toFixed(1)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {profile.total_reviews} review{profile.total_reviews !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-white/10 p-4 text-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-50 dark:bg-green-500/10 mx-auto mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{profile.sessions_completed}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Sessions</p>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-white/10 p-4 text-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 mx-auto mb-2">
            <TrendingUp className="w-5 h-5 text-cyan-500" />
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{Math.round(reliabilityScore)}%</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Reliability</p>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-white/10 p-4 text-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-500/10 mx-auto mb-2">
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{profile.current_streak}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Day streak</p>
        </div>
      </div>

      {badges.length > 0 && (
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-white/10 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
              <Award className="w-4 h-4 text-gray-400" />
              Badges
            </h2>
            <Link
              to="/badges"
              className="text-xs text-cyan-600 dark:text-cyan-400 font-medium hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {badges.map((ub) => (
              <Badge key={ub.id} variant="clay" color={ub.badges.color}>
                {ub.badges.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {listings.length > 0 && (
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-white/10 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Active Listings</h2>
            {isOwnProfile && (
              <Link
                to="/listings"
                className="text-xs text-cyan-600 dark:text-cyan-400 font-medium hover:underline"
              >
                Manage
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                to={`/listings/${listing.id}`}
                className="group p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10 transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium"
                    style={{
                      backgroundColor: listing.categories.color + '15',
                      color: listing.categories.color,
                    }}
                  >
                    {listing.categories.name}
                  </span>
                  <span className="flex items-center gap-1 ml-auto text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    {listing.duration_minutes}m
                  </span>
                </div>
                <h3 className="font-medium text-sm text-gray-800 dark:text-white mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  {listing.title}
                </h3>
                <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">
                  {listing.price_credits} credits
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {reviews.length > 0 && (
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-white/10 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Reviews</h2>
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-yellow-500" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {profile.rating.toFixed(1)}
              </span>
              <span className="text-xs text-gray-400">({profile.total_reviews})</span>
            </div>
          </div>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="pb-4 border-b border-gray-100 dark:border-white/5 last:border-0 last:pb-0"
              >
                <div className="flex items-start gap-3">
                  <Avatar src={review.profiles.avatar_url} name={review.profiles.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                        {review.profiles.name}
                      </p>
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                    {review.comment && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {review.comment}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1.5">
                      {new Date(review.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-center py-2">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Member since{' '}
          {new Date(profile.created_at).toLocaleDateString(undefined, {
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </div>
    </div>
  );
}
