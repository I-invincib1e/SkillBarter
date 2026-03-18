import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Lock,
  Star,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import {
  Card,
  Button,
  Avatar,
  Badge,
  Modal,
  Textarea,
  StarRating,
  Skeleton,
} from '../components/ui';
import type { SessionWithDetails } from '../types/database';

export function SessionDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, refreshWallet, refreshProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [session, setSession] = useState<SessionWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      if (!id || !user) return;

      const { data } = await supabase
        .from('sessions')
        .select(`
          *,
          provider:profiles!sessions_provider_id_profiles_fkey(*),
          requester:profiles!sessions_requester_id_profiles_fkey(*),
          listing:listings(*),
          request:requests(*)
        `)
        .eq('id', id)
        .maybeSingle();

      if (data) {
        setSession(data as SessionWithDetails);

        const { data: review } = await supabase
          .from('reviews')
          .select('id')
          .eq('session_id', id)
          .eq('reviewer_id', user.id)
          .maybeSingle();

        setHasReviewed(!!review);
      }
      setLoading(false);
    };

    fetchSession();
  }, [id, user]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="w-32 h-8" />
        <Skeleton className="w-full h-64" />
      </div>
    );
  }

  if (!session || !user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Session not found
        </h2>
        <Link to="/sessions">
          <Button variant="secondary">Back to Sessions</Button>
        </Link>
      </div>
    );
  }

  const isProvider = session.provider_id === user.id;
  const otherUser = isProvider ? session.requester : session.provider;
  const scheduledDate = new Date(session.scheduled_time);
  const canConfirm = scheduledDate < new Date(Date.now() - 10 * 60 * 1000);
  const hasConfirmed = isProvider ? session.provider_confirmed : session.requester_confirmed;
  const bothConfirmed = session.provider_confirmed && session.requester_confirmed;

  const handleConfirm = async () => {
    setConfirming(true);

    const updateField = isProvider
      ? { provider_confirmed: true, provider_confirmed_at: new Date().toISOString() }
      : { requester_confirmed: true, requester_confirmed_at: new Date().toISOString() };

    await supabase
      .from('sessions')
      .update(updateField)
      .eq('id', session.id);

    const { data: updatedSession } = await supabase
      .from('sessions')
      .select('provider_confirmed, requester_confirmed')
      .eq('id', session.id)
      .single();

    if (updatedSession?.provider_confirmed && updatedSession?.requester_confirmed) {
      await supabase
        .from('sessions')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', session.id);

      const { data: creditLock } = await supabase
        .from('credit_locks')
        .select('*')
        .eq('session_id', session.id)
        .eq('status', 'locked')
        .maybeSingle();

      if (creditLock) {
        await supabase
          .from('credit_locks')
          .update({ status: 'transferred', released_at: new Date().toISOString() })
          .eq('id', (creditLock as { id: string }).id);

        const { data: requesterWallet } = await supabase
          .from('wallets')
          .select('*')
          .eq('user_id', session.requester_id)
          .single();

        if (requesterWallet) {
          const rw = requesterWallet as { locked_credits: number; total_spent: number };
          await supabase
            .from('wallets')
            .update({
              locked_credits: rw.locked_credits - session.credits_amount,
              total_spent: rw.total_spent + session.credits_amount,
            })
            .eq('user_id', session.requester_id);
        }

        const { data: providerWallet } = await supabase
          .from('wallets')
          .select('*')
          .eq('user_id', session.provider_id)
          .single();

        if (providerWallet) {
          const pw = providerWallet as { balance: number; total_earned: number };
          await supabase
            .from('wallets')
            .update({
              balance: pw.balance + session.credits_amount,
              total_earned: pw.total_earned + session.credits_amount,
            })
            .eq('user_id', session.provider_id);
        }

        await supabase.from('transactions').insert([
          {
            user_id: session.requester_id,
            other_user_id: session.provider_id,
            session_id: session.id,
            credits: session.credits_amount,
            type: 'spend',
            description: `Session with ${session.provider.name}`,
          },
          {
            user_id: session.provider_id,
            other_user_id: session.requester_id,
            session_id: session.id,
            credits: session.credits_amount,
            type: 'earn',
            description: `Session with ${session.requester.name}`,
          },
        ]);

        await supabase
          .from('profiles')
          .update({ sessions_completed: session.provider.sessions_completed + 1 })
          .eq('id', session.provider_id);

        await supabase
          .from('profiles')
          .update({ sessions_completed: session.requester.sessions_completed + 1 })
          .eq('id', session.requester_id);
      }

      showToast('Session completed! Credits transferred.', 'success');
      setShowReviewModal(true);
    } else {
      showToast('Confirmed! Waiting for the other party.', 'success');
    }

    await refreshWallet();
    setSession((prev) =>
      prev
        ? {
            ...prev,
            ...updateField,
            status: updatedSession?.provider_confirmed && updatedSession?.requester_confirmed ? 'completed' : prev.status,
          }
        : null
    );
    setConfirming(false);
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this session?')) return;

    setCancelling(true);

    await supabase
      .from('sessions')
      .update({ status: 'cancelled' })
      .eq('id', session.id);

    const { data: creditLock } = await supabase
      .from('credit_locks')
      .select('*')
      .eq('session_id', session.id)
      .eq('status', 'locked')
      .maybeSingle();

    if (creditLock) {
      await supabase
        .from('credit_locks')
        .update({ status: 'released', released_at: new Date().toISOString() })
        .eq('id', creditLock.id);

      const { data: wallet } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', session.requester_id)
        .single();

      if (wallet) {
        await supabase
          .from('wallets')
          .update({
            balance: wallet.balance + session.credits_amount,
            locked_credits: wallet.locked_credits - session.credits_amount,
          })
          .eq('user_id', session.requester_id);

        await supabase.from('transactions').insert({
          user_id: session.requester_id,
          session_id: session.id,
          credits: session.credits_amount,
          type: 'unlock',
          description: 'Session cancelled - credits refunded',
        });
      }
    }

    await refreshWallet();
    showToast('Session cancelled. Credits refunded.', 'success');
    navigate('/sessions');
  };

  const handleAccept = async () => {
    setConfirming(true);

    await supabase
      .from('sessions')
      .update({ status: 'accepted' })
      .eq('id', session.id);

    showToast('Session accepted!', 'success');
    setSession((prev) => (prev ? { ...prev, status: 'accepted' } : null));
    setConfirming(false);
  };

  const handleDecline = async () => {
    if (!confirm('Are you sure you want to decline this session?')) return;

    setCancelling(true);

    await supabase
      .from('sessions')
      .update({ status: 'cancelled' })
      .eq('id', session.id);

    const { data: creditLock } = await supabase
      .from('credit_locks')
      .select('*')
      .eq('session_id', session.id)
      .eq('status', 'locked')
      .maybeSingle();

    if (creditLock) {
      await supabase
        .from('credit_locks')
        .update({ status: 'released', released_at: new Date().toISOString() })
        .eq('id', creditLock.id);

      const { data: wallet } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', session.requester_id)
        .single();

      if (wallet) {
        await supabase
          .from('wallets')
          .update({
            balance: wallet.balance + session.credits_amount,
            locked_credits: wallet.locked_credits - session.credits_amount,
          })
          .eq('user_id', session.requester_id);
      }
    }

    showToast('Session declined.', 'info');
    navigate('/sessions');
  };

  const handleSubmitReview = async () => {
    setSubmittingReview(true);

    const reviewedUserId = isProvider ? session.requester_id : session.provider_id;

    const { error: reviewError } = await supabase.from('reviews').insert({
      session_id: session.id,
      reviewer_id: user.id,
      reviewed_user_id: reviewedUserId,
      rating: reviewRating,
      comment: reviewComment,
    });

    if (reviewError) {
      showToast('Failed to submit review', 'error');
      setSubmittingReview(false);
      return;
    }

    await refreshProfile();
    showToast('Review submitted!', 'success');
    setShowReviewModal(false);
    setHasReviewed(true);
    setSubmittingReview(false);
  };

  const statusConfig = {
    pending: { color: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400', icon: AlertCircle, label: 'Pending Approval' },
    accepted: { color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400', icon: Clock, label: 'Scheduled' },
    in_progress: { color: 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400', icon: Clock, label: 'In Progress' },
    completed: { color: 'bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400', icon: CheckCircle, label: 'Completed' },
    cancelled: { color: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400', icon: XCircle, label: 'Cancelled' },
  };

  const status = statusConfig[session.status];
  const StatusIcon = status.icon;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
            Session Details
          </h1>
          <Badge className={status.color}>
            <StatusIcon className="w-4 h-4" />
            {status.label}
          </Badge>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-dark-surface mb-6">
          <Avatar src={otherUser.avatar_url} name={otherUser.name} size="lg" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isProvider ? 'Helping' : 'Getting help from'}
            </p>
            <Link
              to={`/profile/${otherUser.id}`}
              className="text-lg font-bold text-gray-800 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {otherUser.name}
            </Link>
            <StarRating rating={otherUser.rating} size="sm" showValue />
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <h2 className="font-bold text-gray-800 dark:text-white">
            {session.listing?.title || session.request?.title || 'Help Session'}
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-dark-surface">
              <Calendar className="w-5 h-5 text-primary-500" />
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="font-medium text-gray-800 dark:text-white">
                  {scheduledDate.toLocaleDateString(undefined, {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-dark-surface">
              <Clock className="w-5 h-5 text-primary-500" />
              <div>
                <p className="text-xs text-gray-500">Time</p>
                <p className="font-medium text-gray-800 dark:text-white">
                  {scheduledDate.toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-dark-surface">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Duration</p>
                <p className="font-medium text-gray-800 dark:text-white">
                  {session.duration_minutes} minutes
                </p>
              </div>
            </div>

            <div className={`flex items-center gap-3 p-3 rounded-xl ${isProvider ? 'bg-success-50 dark:bg-success-900/20' : 'bg-accent-50 dark:bg-accent-900/20'}`}>
              <Zap className={`w-5 h-5 ${isProvider ? 'text-success-500' : 'text-accent-500'}`} />
              <div>
                <p className="text-xs text-gray-500">Credits</p>
                <p className={`font-semibold ${isProvider ? 'text-success-600' : 'text-accent-600'}`}>
                  {isProvider ? '+' : '-'}{session.credits_amount}
                </p>
              </div>
            </div>
          </div>

          {session.message && (
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-dark-surface">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <MessageSquare className="w-4 h-4" />
                Message
              </div>
              <p className="text-gray-800 dark:text-gray-200">{session.message}</p>
            </div>
          )}
        </div>

        {session.status === 'pending' && isProvider && (
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={handleDecline}
              loading={cancelling}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Decline
            </Button>
            <Button
              className="flex-1"
              onClick={handleAccept}
              loading={confirming}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Accept
            </Button>
          </div>
        )}

        {session.status === 'accepted' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20">
              <h3 className="font-medium text-primary-800 dark:text-primary-300 mb-3">
                Confirmation Status
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${session.provider_confirmed ? 'bg-success-500' : 'bg-gray-300'}`} />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {session.provider.name} {session.provider_confirmed ? 'confirmed' : 'not confirmed'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${session.requester_confirmed ? 'bg-success-500' : 'bg-gray-300'}`} />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {session.requester.name} {session.requester_confirmed ? 'confirmed' : 'not confirmed'}
                  </span>
                </div>
              </div>
            </div>

            {!canConfirm && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400">
                <Lock className="w-5 h-5 shrink-0" />
                <p className="text-sm">
                  You can confirm completion 10 minutes after the scheduled time
                </p>
              </div>
            )}

            {canConfirm && !hasConfirmed && (
              <Button className="w-full" onClick={handleConfirm} loading={confirming}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm Session Completed
              </Button>
            )}

            {hasConfirmed && !bothConfirmed && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-400">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm">
                  You've confirmed. Waiting for {isProvider ? session.requester.name : session.provider.name} to confirm.
                </p>
              </div>
            )}

            {!bothConfirmed && (
              <Button
                variant="secondary"
                className="w-full"
                onClick={handleCancel}
                loading={cancelling}
              >
                Cancel Session
              </Button>
            )}
          </div>
        )}

        {session.status === 'completed' && !hasReviewed && (
          <Button className="w-full" onClick={() => setShowReviewModal(true)}>
            <Star className="w-4 h-4 mr-2" />
            Leave a Review
          </Button>
        )}

        {session.status === 'completed' && hasReviewed && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-400">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">You've already reviewed this session</p>
          </div>
        )}
      </Card>

      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="Leave a Review"
        size="md"
      >
        <div className="space-y-4">
          <div className="text-center">
            <Avatar
              src={otherUser.avatar_url}
              name={otherUser.name}
              size="lg"
              className="mx-auto mb-2"
            />
            <p className="font-medium text-gray-800 dark:text-white">
              {otherUser.name}
            </p>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">How was your experience?</p>
            <StarRating
              rating={reviewRating}
              size="lg"
              interactive
              onChange={setReviewRating}
              className="justify-center"
            />
          </div>

          <Textarea
            label="Comment (optional)"
            placeholder="Share your experience..."
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            rows={3}
          />

          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowReviewModal(false)}
            >
              Skip
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmitReview}
              loading={submittingReview}
            >
              Submit Review
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
