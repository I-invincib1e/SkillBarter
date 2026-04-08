import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Zap,
  Clock,
  MapPin,
  Calendar,
  MessageSquare,
  CheckCircle,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import {
  Card,
  Button,
  Avatar,
  Badge,
  StarRating,
  Modal,
  Input,
  Textarea,
  Skeleton,
} from '../components/ui';
import type { ListingWithDetails, Review } from '../types/database';

interface ReviewWithUser extends Review {
  profiles: { name: string; avatar_url: string };
}

export function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, wallet, refreshWallet } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [listing, setListing] = useState<ListingWithDetails | null>(null);
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;

      const { data: listingData } = await supabase
        .from('listings')
        .select(`
          *,
          profiles!listings_user_id_profiles_fkey(*),
          categories!listings_category_id_fkey(*)
        `)
        .eq('id', id)
        .maybeSingle();

      if (listingData) {
        setListing(listingData as ListingWithDetails);

        const { data: reviewsData } = await supabase
          .from('reviews')
          .select(`
            *,
            profiles!reviews_reviewer_id_profiles_fkey(name, avatar_url)
          `)
          .eq('reviewed_user_id', listingData.user_id)
          .order('created_at', { ascending: false })
          .limit(5);

        setReviews((reviewsData || []) as ReviewWithUser[]);
      }
      setLoading(false);
    };

    fetchListing();
  }, [id]);

  const handleBookSession = async () => {
    if (!user || !listing || !wallet) return;

    if (wallet.balance < listing.price_credits) {
      showToast('Insufficient credits', 'error');
      return;
    }

    const scheduledTime = new Date(`${bookingDate}T${bookingTime}`);
    if (scheduledTime <= new Date()) {
      showToast('Please select a future date and time', 'error');
      return;
    }

    setSubmitting(true);

    const { data, error } = await supabase.rpc('book_session', {
      p_listing_id: listing.id,
      p_provider_id: listing.user_id,
      p_requester_id: user.id,
      p_scheduled_time: scheduledTime.toISOString(),
      p_duration_minutes: listing.duration_minutes,
      p_credits_amount: listing.price_credits,
      p_message: bookingMessage,
    });

    if (error || data?.error) {
      showToast(data?.error || 'Failed to create session', 'error');
      setSubmitting(false);
      return;
    }

    await refreshWallet();
    showToast('Session requested successfully!', 'success');
    setShowBookingModal(false);
    navigate('/sessions');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="w-32 h-8" />
        <Skeleton className="w-full h-64" />
        <Skeleton className="w-full h-48" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Listing not found
        </h2>
        <Link to="/discover">
          <Button variant="secondary">Back to Discover</Button>
        </Link>
      </div>
    );
  }

  const isOwnListing = user?.id === listing.user_id;
  const canBook = user && !isOwnListing && wallet && wallet.balance >= listing.price_credits;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <Link
        to="/discover"
        className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Discover
      </Link>

      <Card>
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="flex-1">
            <Badge
              size="sm"
              style={{ backgroundColor: listing.categories.color + '20', color: listing.categories.color }}
              className="mb-3"
            >
              {listing.categories.name}
            </Badge>

            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">
              {listing.title}
            </h1>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {listing.description || 'No description provided'}
            </p>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <div className="p-2 rounded-lg bg-accent-100 dark:bg-accent-900/20">
                  <Zap className="w-4 h-4 text-accent-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Price</p>
                  <p className="font-semibold text-gray-800 dark:text-white">
                    {listing.price_credits} credits
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/20">
                  <Clock className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="font-semibold text-gray-800 dark:text-white">
                    {listing.duration_minutes} minutes
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <div className="p-2 rounded-lg bg-success-100 dark:bg-success-900/20">
                  <MapPin className="w-4 h-4 text-success-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="font-semibold text-gray-800 dark:text-white capitalize">
                    {listing.location_type}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-64 shrink-0">
            <Card className="bg-gray-50 dark:bg-dark-surface">
              <div className="text-center mb-4">
                <Avatar
                  src={listing.profiles.avatar_url}
                  name={listing.profiles.name}
                  size="xl"
                  className="mx-auto mb-3"
                />
                <Link
                  to={`/profile/${listing.profiles.id}`}
                  className="text-lg font-bold text-gray-800 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {listing.profiles.name}
                </Link>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <StarRating rating={listing.profiles.rating} size="sm" showValue />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {listing.profiles.sessions_completed} sessions completed
                </p>
              </div>

              {user ? (
                isOwnListing ? (
                  <Link to={`/listings/${listing.id}/edit`}>
                    <Button variant="secondary" className="w-full">
                      Edit Listing
                    </Button>
                  </Link>
                ) : canBook ? (
                  <Button className="w-full" onClick={() => setShowBookingModal(true)}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Request Session
                  </Button>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-red-500 mb-2">
                      Insufficient credits
                    </p>
                    <Link to="/wallet">
                      <Button variant="secondary" className="w-full">
                        Add Credits
                      </Button>
                    </Link>
                  </div>
                )
              ) : (
                <Link to="/login">
                  <Button className="w-full">Sign in to Book</Button>
                </Link>
              )}
            </Card>
          </div>
        </div>
      </Card>

      {reviews.length > 0 && (
        <Card>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            Reviews
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

      <Modal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title="Request Session"
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20">
            <Avatar
              src={listing.profiles.avatar_url}
              name={listing.profiles.name}
              size="md"
            />
            <div>
              <p className="font-medium text-gray-800 dark:text-white">
                {listing.title}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                with {listing.profiles.name}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-accent-50 dark:bg-accent-900/20">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent-500" />
              <span className="font-medium text-gray-800 dark:text-white">
                {listing.price_credits} credits will be locked
              </span>
            </div>
            <CheckCircle className="w-5 h-5 text-success-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              label="Date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
            <Input
              type="time"
              label="Time"
              value={bookingTime}
              onChange={(e) => setBookingTime(e.target.value)}
              required
            />
          </div>

          <Textarea
            label="Message (optional)"
            placeholder="Tell them what you need help with..."
            value={bookingMessage}
            onChange={(e) => setBookingMessage(e.target.value)}
            rows={3}
          />

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowBookingModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleBookSession}
              loading={submitting}
              disabled={!bookingDate || !bookingTime}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
