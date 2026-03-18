import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, Wallet, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Transaction } from '../../types/database';

interface SettingsTransactionsProps {
  userId: string;
}

type FilterType = 'all' | 'earn' | 'spend';

export function SettingsTransactions({ userId }: SettingsTransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);
      setTransactions((data || []) as Transaction[]);
      setLoading(false);
    };
    fetch();
  }, [userId]);

  const filtered = transactions.filter((tx) => {
    if (filter === 'earn') return tx.type === 'earn' || tx.type === 'signup_bonus' || tx.type === 'unlock';
    if (filter === 'spend') return tx.type === 'spend' || tx.type === 'lock';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-1">
            Transaction History
          </h2>
          <p className="text-xs text-gray-400">
            Recent credit movements
          </p>
        </div>
        <Link
          to="/wallet"
          className="text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline flex items-center gap-1"
        >
          Full Wallet
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="flex gap-2">
        {(['all', 'earn', 'spend'] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md border-2 transition-all duration-150 capitalize ${
              filter === f
                ? 'border-gray-900 dark:border-white/50 bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                : 'border-gray-200 dark:border-dark-border text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 rounded-lg bg-gray-100 dark:bg-dark-surface animate-pulse" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="max-h-[420px] overflow-y-auto space-y-1 pr-1">
          {filtered.map((tx) => {
            const isPositive = tx.type === 'earn' || tx.type === 'signup_bonus' || tx.type === 'unlock';
            return (
              <div
                key={tx.id}
                className="flex items-center justify-between py-3 px-3 -mx-1 hover:bg-gray-50 dark:hover:bg-dark-surface rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isPositive
                      ? 'bg-accent-50 dark:bg-accent-900/20 text-accent-600'
                      : 'bg-red-50 dark:bg-red-900/20 text-red-500'
                  }`}>
                    {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                      {tx.description || tx.type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(tx.created_at).toLocaleDateString(undefined, {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <span className={`font-bold text-sm flex-shrink-0 ml-3 ${
                  isPositive ? 'text-accent-600' : 'text-red-500'
                }`}>
                  {isPositive ? '+' : '-'}{Math.abs(tx.credits)}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-dark-surface flex items-center justify-center mx-auto mb-3">
            <Wallet className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-sm text-gray-400">No transactions found</p>
        </div>
      )}
    </div>
  );
}
