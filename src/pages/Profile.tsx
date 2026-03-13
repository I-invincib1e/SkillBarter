import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Star, Award, Flame, CheckCircle, CreditCard as Edit2 } from 'lucide-react';
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
import type { Profile as ProfileType, ListingWithDetails, Review, UserBadge, Badge as BadgeType } from '../types/database';

interface ReviewWithUser extends Review {
  profiles: { name: string; avatar_url: string };
}

interface BadgeWithDetails extends UserBadge {
  badges: BadgeType;
}

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
          .select(`*, profiles!listings_user_id_fkey(*), categories!listings_category_id_fkey(*)`)
          .eq('user_id', profileId)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(4),
        supabase
          .from('reviews')
          .select(`*, profiles!reviews_reviewer_id_fkey(name, avatar_url)`)
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

  const reliabilityScore = profile.sessions_completed > 0 ?
    Math.min(100, (profile.sessions_completed / (profile.sessions_completed + 5)) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <Card>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="text-center md:text-left">
            <Avatar
              src={profile.avatar_url}
              name={profile.name}
              size="xl"
              className="mx-auto md:mx-0"
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                {profile.name}
              </h1>
              {isOwnProfile && (
                <Link to="/settings">
                  <Button variant="ghost" size="sm">
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </Link>
              )}
            </div>

            {profile.university && (
              <p className="text-gray-500 dark:text-gray-400 mb-3">
                <MapPin className="w-4 h-4 inline mr-1" />
                {profile.university}
              </p>
            )}

            {profile.bio && (
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {profile.bio}
              </p>
            )}

            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
              {profile.skills_offered.map((skill) => (
                <Badge key={skill} variant="primary" size="sm">
                  {skill}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <div>
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {profile.rating.toFixed(1)}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">
                    ({profile.total_reviews} reviews)
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success-500" />
                <span className="font-semibold text-gray-800 dark:text-white">
                  {profile.sessions_completed}
                </span>
                <span className="text-gray-500 dark:text-gray-400">sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-500" />
                <span className="text-gray-500 dark:text-gray-400">
                  Joined {new Date(profile.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col items-center justify-center gap-4 md:gap-6">
            <div className="text-center">
              <RingChart
                percentage={reliabilityScore}
                size={80}
                strokeWidth={6}
                color="#22C55E"
                label="Reliability"
              />
            </div>
            {profile.current_streak > 0 && (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full gradient-accent flex items-center justify-center shadow-clay mx-auto mb-1">
                  <Flame className="w-8 h-8 text-white" />
                </div>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  {profile.current_streak} days
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {badges.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5" />
              Badges
            </h2>
            <Link to="/badges" className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline">
              View All
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {badges.map((ub) => (
              <Badge
                key={ub.id}
                variant="clay"
                color={ub.badges.color}
              >
                {ub.badges.name}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {listings.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 dark:text-white">
              Active Listings
            </h2>
            {isOwnProfile && (
              <Link to="/listings" className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline">
                Manage
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                to={`/listings/${listing.id}`}
                className="p-4 rounded-xl bg-gray-50 dark:bg-dark-surface hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors"
              >
                <Badge
                  size="sm"
                  style={{ backgroundColor: listing.categories.color + '20', color: listing.categories.color }}
                  className="mb-2"
                >
                  {listing.categories.name}
                </Badge>
                <h3 className="font-medium text-gray-800 dark:text-white mb-1">
                  {listing.title}
                </h3>
                <p className="text-sm text-accent-600 font-semibold">
                  {listing.price_credits} credits
                </p>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {reviews.length > 0 && (
        <Card>
          <h2 className="font-bold text-gray-800 dark:text-white mb-4">
            Recent Reviews
          </h2>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="pb-4 border-b border-gray-100 dark:border-dark-border last:border-0 last:pb-0"
              >
                <div className="flex items-start gap-3">
                  <Avatar
                    src={review.profiles.avatar_url}
                    name={review.profiles.name}
                    size="sm"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-800 dark:text-white">
                        {review.profiles.name}
                      </p>
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                    {review.comment && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {review.comment}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
