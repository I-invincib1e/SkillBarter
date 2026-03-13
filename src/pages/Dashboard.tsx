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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Welcome back, {profile.name.split(' ')[0]}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Here's what's happening with your account
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
          <Card hover className="h-full bg-gradient-to-br from-primary-600 via-primary-500 to-blue-500 text-white border-0 dark:border-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-lg" />
            <div className="relative flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-white/70 mb-1.5">
                  <Wallet className="w-4 h-4" />
                  <span className="text-sm font-medium">Wallet Balance</span>
                </div>
                <p className="text-4xl font-extrabold mb-4 tracking-tight">
                  {wallet?.balance ?? 0}
                  <span className="text-lg ml-1.5 opacity-70 font-semibold">credits</span>
                </p>
                <div className="flex items-center gap-1.5 text-sm">
                  <Lock className="w-3.5 h-3.5 opacity-60" />
                  <span className="opacity-70">Locked:</span>
                  <span className="font-semibold">{wallet?.locked_credits ?? 0}</span>
                </div>
              </div>
              <RingChart
                percentage={earnedPercentage}
                size={80}
                strokeWidth={6}
                color="#ffffff"
                bgColor="rgba(255,255,255,0.2)"
                showLabel={false}
              />
            </div>
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/15 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-300" />
                <span className="opacity-70">Earned:</span>
                <span className="font-bold">{wallet?.total_earned ?? 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowDownRight className="w-4 h-4 text-red-300" />
                <span className="opacity-70">Spent:</span>
                <span className="font-bold">{wallet?.total_spent ?? 0}</span>
              </div>
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
                <div>
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
              <p className="text-gray-400 text-sm mb-3">No upcoming sessions</p>
              <Link to="/discover">
                <Button size="sm" variant="secondary">Find Help</Button>
              </Link>
            </div>
          )}
        </Card>

        <Card className="h-full">
          <Link to="/listings" className="block h-full">
            <div className="flex items-center gap-2 text-gray-400 mb-3">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">My Listings</span>
            </div>
            <p className="text-3xl font-extrabold text-gray-800 dark:text-white mb-1 tracking-tight">
              {myListingsCount}
            </p>
            <p className="text-sm text-gray-400 mb-4">Active listings</p>
            <Button size="sm" variant="secondary" className="w-full">
              <Plus className="w-4 h-4" />
              Create Listing
            </Button>
          </Link>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-warning-400/10 to-transparent dark:from-warning-500/5" />
          <div className="relative">
            <div className="flex items-center gap-2 text-gray-400 mb-3">
              <Flame className="w-4 h-4 text-warning-500" />
              <span className="text-sm font-medium">Current Streak</span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-extrabold text-gray-800 dark:text-white tracking-tight">
                {profile.current_streak}
              </span>
              <span className="text-lg text-gray-400">days</span>
            </div>
            {profile.current_streak >= 7 && (
              <Badge variant="clay" color="#F59E0B" icon="Flame">On Fire!</Badge>
            )}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-gray-400">
              <Award className="w-4 h-4" />
              <span className="text-sm font-medium">Badges</span>
            </div>
            <Link to="/badges" className="text-sm text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              View All
            </Link>
          </div>
          {userBadges.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {userBadges.map((ub) => (
                <Badge key={ub.id} variant="clay" color={ub.badges.color} size="sm">{ub.badges.name}</Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">Complete sessions to earn badges</p>
          )}
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 dark:text-white">Recent Activity</h3>
            <Link to="/wallet" className="text-sm text-primary-600 dark:text-primary-400 font-semibold hover:underline flex items-center gap-1">
              View All
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {recentTransactions.length > 0 ? (
            <div className="space-y-1">
              {recentTransactions.map((tx) => {
                const isPositive = tx.type === 'earn' || tx.type === 'signup_bonus' || tx.type === 'unlock';
                return (
                  <div key={tx.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-dark-border last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isPositive ? 'bg-accent-50 dark:bg-accent-900/20 text-accent-600' : 'bg-red-50 dark:bg-red-900/20 text-red-500'}`}>
                        {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                          {tx.description || tx.type.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(tx.created_at).toLocaleDateString(undefined, {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    <span className={`font-bold text-sm ${isPositive ? 'text-accent-600' : 'text-red-500'}`}>
                      {isPositive ? '+' : '-'}{Math.abs(tx.credits)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-8">No transactions yet</p>
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
