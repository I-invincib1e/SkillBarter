import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Card, Button, Avatar, Badge, CardSkeleton } from '../components/ui';
import type { SessionWithDetails } from '../types/database';

type SessionStatus = 'upcoming' | 'pending' | 'completed' | 'cancelled';

export function Sessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SessionWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SessionStatus>('upcoming');

  useEffect(() => {
    if (!user) return;

    const fetchSessions = async () => {
      setLoading(true);

      let query = supabase
        .from('sessions')
        .select(`
          *,
          provider:profiles!sessions_provider_id_profiles_fkey(*),
          requester:profiles!sessions_requester_id_profiles_fkey(*),
          listing:listings(*),
          request:requests(*)
        `)
        .or(`provider_id.eq.${user.id},requester_id.eq.${user.id}`);

      if (activeTab === 'upcoming') {
        query = query
          .in('status', ['accepted', 'in_progress'])
          .gte('scheduled_time', new Date().toISOString());
      } else if (activeTab === 'pending') {
        query = query.eq('status', 'pending');
      } else if (activeTab === 'completed') {
        query = query.eq('status', 'completed');
      } else if (activeTab === 'cancelled') {
        query = query.eq('status', 'cancelled');
      }

      query = query.order('scheduled_time', { ascending: activeTab === 'upcoming' });

      const { data } = await query;
      setSessions((data || []) as SessionWithDetails[]);
      setLoading(false);
    };

    fetchSessions();
  }, [user, activeTab]);

  const tabs: { key: SessionStatus; label: string }[] = [
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'pending', label: 'Pending' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          My Sessions
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Manage your help sessions
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
              ${
                activeTab === tab.key
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : sessions.length > 0 ? (
        <div className="space-y-3">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} userId={user!.id} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-300 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            No {activeTab} sessions
          </h3>
          <p className="text-gray-400 mb-6 max-w-sm mx-auto text-sm">
            {activeTab === 'upcoming'
              ? 'Book a session to get started'
              : `You don't have any ${activeTab} sessions`}
          </p>
          {activeTab === 'upcoming' && (
            <Link to="/discover">
              <Button>Browse Listings</Button>
            </Link>
          )}
        </Card>
      )}
    </div>
  );
}

function SessionCard({
  session,
  userId,
}: {
  session: SessionWithDetails;
  userId: string;
}) {
  const isProvider = session.provider_id === userId;
  const otherUser = isProvider ? session.requester : session.provider;
  const scheduledDate = new Date(session.scheduled_time);
  const isPast = scheduledDate < new Date();

  const statusConfig = {
    pending: { color: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400', icon: AlertCircle, label: 'Pending' },
    accepted: { color: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400', icon: Clock, label: 'Upcoming' },
    in_progress: { color: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400', icon: Clock, label: 'In Progress' },
    completed: { color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400', icon: CheckCircle, label: 'Completed' },
    cancelled: { color: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400', icon: XCircle, label: 'Cancelled' },
  };

  const status = statusConfig[session.status];
  const StatusIcon = status.icon;

  return (
    <Link to={`/sessions/${session.id}`}>
      <Card hover>
        <div className="flex items-start gap-4">
          <Avatar src={otherUser.avatar_url} name={otherUser.name} size="lg" />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  {session.listing?.title || session.request?.title || 'Session'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isProvider ? 'Helping' : 'Getting help from'} {otherUser.name}
                </p>
              </div>
              <Badge
                size="sm"
                className={status.color}
              >
                <StatusIcon className="w-3 h-3" />
                {status.label}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {scheduledDate.toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {scheduledDate.toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className={`w-3.5 h-3.5 ${isProvider ? 'text-emerald-500' : 'text-cyan-500'}`} />
                <span className={`font-semibold ${isProvider ? 'text-emerald-600' : 'text-gray-800 dark:text-white'}`}>
                  {isProvider ? '+' : '-'}{session.credits_amount} credits
                </span>
              </div>
            </div>

            {session.status === 'accepted' && isPast && (
              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className={`w-2 h-2 rounded-full ${session.provider_confirmed ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-white/30'}`} />
                  <span className="text-gray-500 dark:text-gray-400">Provider</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className={`w-2 h-2 rounded-full ${session.requester_confirmed ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-white/30'}`} />
                  <span className="text-gray-500 dark:text-gray-400">Requester</span>
                </div>
                {!session.provider_confirmed || !session.requester_confirmed ? (
                  <span className="text-xs text-cyan-600 dark:text-cyan-400 font-medium ml-auto">
                    Confirm completion
                  </span>
                ) : null}
              </div>
            )}
          </div>

          <ArrowRight className="w-5 h-5 text-gray-300 dark:text-gray-500 shrink-0" />
        </div>
      </Card>
    </Link>
  );
}
