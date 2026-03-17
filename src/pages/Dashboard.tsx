import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  Calendar,
  FileText,
  Flame,
  Award,
  ArrowRight,
  Plus,
  Search,
  Zap,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Lock,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Card, Button, Avatar, Badge, RingChart } from '../components/ui';
import type { Session, Transaction, UserBadge, Badge as BadgeType } from '../types/database';

interface SessionWithProvider extends Session {
  provider: { name: string; avatar_url: string };
  requester: { name: string; avatar_url: string };
}

interface BadgeWithDetails extends UserBadge {
  badges: BadgeType;
}

export function Dashboard() {
  const { user, profile, wallet } = useAuth();
  const [upcomingSession, setUpcomingSession] = useState<SessionWithProvider | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [myListingsCount, setMyListingsCount] = useState(0);
  const [userBadges, setUserBadges] = useState<BadgeWithDetails[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      const [sessionsRes, transactionsRes, listingsRes, badgesRes] = await Promise.all([
        supabase
          .from('sessions')
          .select(`*, provider:profiles!sessions_provider_id_fkey(name, avatar_url), requester:profiles!sessions_requester_id_fkey(name, avatar_url)`)
          .or(`provider_id.eq.${user.id},requester_id.eq.${user.id}`)
          .in('status', ['pending', 'accepted'])
          .gte('scheduled_time', new Date().toISOString())
          .order('scheduled_time', { ascending: true })
          .limit(1),
        supabase.from('transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('listings').select('id', { count: 'exact' }).eq('user_id', user.id).eq('status', 'active'),
        supabase.from('user_badges').select('*, badges(*)').eq('user_id', user.id).order('earned_at', { ascending: false }).limit(4),
      ]);

      if (sessionsRes.data?.[0]) setUpcomingSession(sessionsRes.data[0] as SessionWithProvider);
      setRecentTransactions((transactionsRes.data || []) as Transaction[]);
      setMyListingsCount(listingsRes.count || 0);
      setUserBadges((badgesRes.data || []) as BadgeWithDetails[]);
    };

    fetchDashboardData();
  }, [user]);

  if (!user || !profile) return null;

  const earnedPercentage = wallet
    ? Math.min((wallet.total_earned / ((wallet.total_earned + wallet.total_spent) || 1)) * 100, 100)
    : 0;

  const hasStreak = profile.current_streak > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Welcome back, {profile.name?.split(' ')[0]}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <Link to="/discover">
            <Button variant="secondary" size="sm">
              <Search className="w-4 h-4" />
              Browse Help
            </Button>
          </Link>
          <Link to="/listings/create">
            <Button size="sm">
              <Plus className="w-4 h-4" />
              Offer Help
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/wallet" className="lg:col-span-2">
          <Card hover className="h-full bg-gradient-to-br from-primary-600 via-primary-500 to-blue-500 text-white border-0 dark:border-0 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl group-hover:blur-2xl transition-all" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-lg" />

            <div className="relative space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-white/70 mb-1.5">
                    <Wallet className="w-4 h-4" />
                    <span className="text-sm font-medium">Wallet Balance</span>
                  </div>
                  <p className="text-4xl font-extrabold tracking-tight">
                    {wallet?.balance ?? 0}
                    <span className="text-lg ml-1.5 opacity-70 font-semibold">credits</span>
                  </p>
                </div>
                <RingChart
                  percentage={earnedPercentage}
                  size={75}
                  strokeWidth={6}
                  color="#ffffff"
                  bgColor="rgba(255,255,255,0.2)"
                  showLabel={false}
                />
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-white/15">
                <div className="flex items-center gap-2 text-sm">
                  <Lock className="w-3.5 h-3.5 opacity-60" />
                  <span className="opacity-70">Locked:</span>
                  <span className="font-semibold">{wallet?.locked_credits ?? 0}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t border-white/15">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-green-300" />
                    <span className="opacity-70">Earned:</span>
                    <span className="font-bold">{wallet?.total_earned ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ArrowDownRight className="w-3.5 h-3.5 text-red-300" />
                    <span className="opacity-70">Spent:</span>
                    <span className="font-bold">{wallet?.total_spent ?? 0}</span>
                  </div>
                </div>
              </div>

              <Link to="/wallet" className="flex items-center justify-between text-white/80 hover:text-white transition-colors text-xs font-medium group/action pt-2">
                <span>View Transaction History</span>
                <ChevronRight className="w-4 h-4 group-hover/action:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </Card>
        </Link>

        <Card className="h-full">
          {upcomingSession ? (
            <Link to={`/sessions/${upcomingSession.id}`} className="block h-full">
              <div className="flex items-center gap-2 text-gray-400 mb-3">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Upcoming Session</span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <Avatar
                  src={upcomingSession.provider_id === user.id ? upcomingSession.requester.avatar_url : upcomingSession.provider.avatar_url}
                  name={upcomingSession.provider_id === user.id ? upcomingSession.requester.name : upcomingSession.provider.name}
                  size="md"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 dark:text-white text-sm">
                    {upcomingSession.provider_id === user.id ? upcomingSession.requester.name : upcomingSession.provider.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(upcomingSession.scheduled_time).toLocaleDateString(undefined, {
                      weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
              <Badge variant="primary">
                <Zap className="w-3 h-3" />
                {upcomingSession.credits_amount} credits
              </Badge>
            </Link>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-dark-surface flex items-center justify-center mb-3">
                <Calendar className="w-6 h-6 text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-1">No upcoming sessions</p>
              <p className="text-gray-400 text-xs mb-3">Book a session to get started</p>
              <Link to="/discover">
                <Button size="sm" variant="secondary">Find Help</Button>
              </Link>
            </div>
          )}
        </Card>

        <Card className="h-full flex flex-col">
          <div className="flex items-center gap-2 text-gray-400 mb-3">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">My Listings</span>
          </div>
          <div className="flex-1">
            <p className="text-3xl font-extrabold text-gray-800 dark:text-white tracking-tight">
              {myListingsCount}
            </p>
            <p className="text-xs text-gray-400 mt-1">Active offering{myListingsCount !== 1 ? 's' : ''}</p>
          </div>
          <Link to="/listings/create" className="mt-auto">
            <Button size="sm" className="w-full">
              <Plus className="w-4 h-4" />
              Create Listing
            </Button>
          </Link>
        </Card>

        <Card className="relative overflow-hidden h-full flex flex-col">
          <div className="absolute inset-0 bg-gradient-to-br from-warning-400/10 to-transparent dark:from-warning-500/5" />
          <div className="relative flex-1">
            <div className="flex items-center gap-2 text-gray-400 mb-3">
              <Flame className="w-4 h-4 text-warning-500" />
              <span className="text-sm font-medium">Current Streak</span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-extrabold text-gray-800 dark:text-white tracking-tight">
                {profile.current_streak}
              </span>
              <span className="text-sm text-gray-400">days</span>
            </div>
            {hasStreak && profile.longest_streak > 0 ? (
              <p className="text-xs text-gray-400">
                Best: <span className="font-semibold text-gray-600 dark:text-gray-300">{profile.longest_streak} days</span>
              </p>
            ) : (
              <p className="text-xs text-gray-400 leading-relaxed">
                Complete a session to start your streak!
              </p>
            )}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-gray-400">
              <Award className="w-4 h-4" />
              <span className="text-sm font-medium">Badges</span>
            </div>
            <Link to="/badges" className="text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline flex items-center gap-1">
              All
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {userBadges.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {userBadges.map((ub) => (
                <Badge key={ub.id} variant="clay" color={ub.badges.color} size="sm">{ub.badges.name}</Badge>
              ))}
            </div>
          ) : (
            <div className="text-center py-3">
              <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-dark-surface flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-xs text-gray-400">Complete sessions to earn achievements</p>
            </div>
          )}
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <span>Recent Activity</span>
              {recentTransactions.length > 0 && (
                <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full font-medium">
                  {recentTransactions.length}
                </span>
              )}
            </h3>
            <Link to="/wallet" className="text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline flex items-center gap-1 group">
              <span className="group-hover:inline hidden sm:inline">Full History</span>
              <span className="group-hover:hidden sm:hidden">View</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          {recentTransactions.length > 0 ? (
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {recentTransactions.map((tx) => {
                const isPositive = tx.type === 'earn' || tx.type === 'signup_bonus' || tx.type === 'unlock';
                return (
                  <div key={tx.id} className="flex items-center justify-between py-2.5 px-2 -mx-2 hover:bg-gray-50 dark:hover:bg-dark-surface rounded transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isPositive ? 'bg-accent-50 dark:bg-accent-900/20 text-accent-600' : 'bg-red-50 dark:bg-red-900/20 text-red-500'}`}>
                        {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                          {tx.description || tx.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(tx.created_at).toLocaleDateString(undefined, {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    <span className={`font-bold text-sm flex-shrink-0 ml-2 ${isPositive ? 'text-accent-600' : 'text-red-500'}`}>
                      {isPositive ? '+' : '-'}{Math.abs(tx.credits)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-dark-surface flex items-center justify-center mx-auto mb-2">
                <Wallet className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-400">No transactions yet</p>
              <p className="text-xs text-gray-400 mt-1">Your activity will appear here</p>
            </div>
          )}
        </Card>
      </div>

      <div className="sm:hidden flex gap-3">
        <Link to="/discover" className="flex-1">
          <Button variant="secondary" className="w-full">
            <Search className="w-4 h-4" />
            Browse Help
          </Button>
        </Link>
        <Link to="/listings/create" className="flex-1">
          <Button className="w-full">
            <Plus className="w-4 h-4" />
            Offer Help
          </Button>
        </Link>
      </div>
    </div>
  );
}
