import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownRight,
  Lock,
  TrendingUp,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Card, RingChart, Skeleton } from '../components/ui';
import type { Transaction } from '../types/database';

export function Wallet() {
  const { user, wallet } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'earn' | 'spend'>('all');

  useEffect(() => {
    if (!user) return;

    const fetchTransactions = async () => {
      setLoading(true);
      let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (filter === 'earn') {
        query = query.in('type', ['earn', 'signup_bonus', 'unlock', 'refund']);
      } else if (filter === 'spend') {
        query = query.in('type', ['spend', 'lock']);
      }

      const { data } = await query;
      setTransactions(data || []);
      setLoading(false);
    };

    fetchTransactions();
  }, [user, filter]);

  if (!wallet) {
    return (
      <div className="space-y-6">
        <Skeleton className="w-full h-48" />
        <Skeleton className="w-full h-64" />
      </div>
    );
  }

  const earnedPercentage =
    wallet.total_earned > 0
      ? (wallet.total_earned / (wallet.total_earned + wallet.total_spent)) * 100
      : 50;

  const availablePercentage =
    wallet.balance + wallet.locked_credits > 0
      ? (wallet.balance / (wallet.balance + wallet.locked_credits)) * 100
      : 100;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Wallet
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Manage your credits and transactions
        </p>
      </div>

      <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-900 dark:via-gray-800/90 dark:to-gray-900 text-white overflow-hidden relative border-0 dark:border-white/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-white/60 mb-2">
              <WalletIcon className="w-5 h-5" />
              <span className="font-medium">Available Balance</span>
            </div>
            <p className="text-5xl font-bold mb-6 tracking-tight">
              {wallet.balance}
              <span className="text-xl ml-2 opacity-50 font-medium">credits</span>
            </p>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-white/[0.07]">
                <div className="flex items-center gap-1.5 text-white/50 mb-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span className="text-xs">Locked</span>
                </div>
                <p className="text-lg font-semibold">{wallet.locked_credits}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.07]">
                <div className="flex items-center gap-1.5 text-emerald-400/70 mb-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="text-xs">Earned</span>
                </div>
                <p className="text-lg font-semibold">{wallet.total_earned}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.07]">
                <div className="flex items-center gap-1.5 text-red-400/70 mb-1">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  <span className="text-xs">Spent</span>
                </div>
                <p className="text-lg font-semibold">{wallet.total_spent}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <RingChart
                percentage={earnedPercentage}
                size={90}
                strokeWidth={6}
                color="#22D3EE"
                bgColor="rgba(255,255,255,0.1)"
                showLabel={false}
              />
              <p className="text-xs text-white/50 mt-2">Earned Ratio</p>
            </div>
            <div className="text-center">
              <RingChart
                percentage={availablePercentage}
                size={90}
                strokeWidth={6}
                color="#34D399"
                bgColor="rgba(255,255,255,0.1)"
                showLabel={false}
              />
              <p className="text-xs text-white/50 mt-2">Available</p>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800 dark:text-white">
            Transaction History
          </h2>
          <div className="flex gap-1 p-1 rounded-lg bg-gray-100 dark:bg-white/5">
            {(['all', 'earn', 'spend'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`
                  px-3 py-1.5 text-sm font-medium rounded-md capitalize transition-all duration-200
                  ${
                    filter === f
                      ? 'bg-white dark:bg-dark-card text-gray-800 dark:text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }
                `}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 py-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="w-32 h-4 mb-1" />
                  <Skeleton className="w-20 h-3" />
                </div>
                <Skeleton className="w-16 h-5" />
              </div>
            ))}
          </div>
        ) : transactions.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-white/5">
            {transactions.map((tx) => (
              <TransactionRow key={tx.id} transaction={tx} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <WalletIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No transactions yet
            </p>
          </div>
        )}
      </Card>

      <Card className="bg-gradient-to-br from-emerald-50 to-transparent dark:from-emerald-500/5 dark:to-transparent">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-500/15">
            <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 dark:text-white">
              Earn More Credits
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Help others and earn credits for every completed session
            </p>
          </div>
          <Link
            to="/listings/create"
            className="px-4 py-2 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium transition-colors text-sm"
          >
            Create Listing
          </Link>
        </div>
      </Card>
    </div>
  );
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const isPositive = ['earn', 'signup_bonus', 'unlock', 'refund'].includes(transaction.type);

  const typeConfig = {
    signup_bonus: { icon: TrendingUp, label: 'Signup Bonus', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' },
    earn: { icon: ArrowUpRight, label: 'Earned', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' },
    spend: { icon: ArrowDownRight, label: 'Spent', color: 'text-red-500 bg-red-50 dark:bg-red-500/10' },
    lock: { icon: Lock, label: 'Locked', color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-500/10' },
    unlock: { icon: ArrowUpRight, label: 'Unlocked', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' },
    refund: { icon: ArrowUpRight, label: 'Refund', color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' },
  };

  const config = typeConfig[transaction.type];
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-3 py-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800 dark:text-white truncate text-sm">
          {transaction.description || config.label}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(transaction.created_at).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
      <span
        className={`
          text-sm font-semibold
          ${isPositive ? 'text-emerald-600' : 'text-red-500'}
        `}
      >
        {isPositive ? '+' : '-'}{Math.abs(transaction.credits)}
      </span>
    </div>
  );
}
