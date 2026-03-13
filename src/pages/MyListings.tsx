import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, CreditCard as Edit2, Pause, Play, Trash2, Eye, Zap, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import { Card, Button, Badge, ListingSkeleton } from '../components/ui';
import type { ListingWithDetails } from '../types/database';

export function MyListings() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [listings, setListings] = useState<ListingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'active' | 'paused'>('active');

  useEffect(() => {
    if (!user) return;

    const fetchListings = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('listings')
        .select(`
          *,
          profiles!listings_user_id_fkey(*),
          categories!listings_category_id_fkey(*)
        `)
        .eq('user_id', user.id)
        .eq('status', filter)
        .order('created_at', { ascending: false });

      setListings((data || []) as ListingWithDetails[]);
      setLoading(false);
    };

    fetchListings();
  }, [user, filter]);

  const toggleStatus = async (listing: ListingWithDetails) => {
    const newStatus = listing.status === 'active' ? 'paused' : 'active';
    const { error } = await supabase
      .from('listings')
      .update({ status: newStatus })
      .eq('id', listing.id);

    if (error) {
      showToast('Failed to update listing', 'error');
      return;
    }

    setListings((prev) =>
      prev.map((l) => (l.id === listing.id ? { ...l, status: newStatus } : l))
    );
    showToast(`Listing ${newStatus === 'active' ? 'activated' : 'paused'}`, 'success');
  };

  const deleteListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    const { error } = await supabase
      .from('listings')
      .update({ status: 'deleted' })
      .eq('id', listingId);

    if (error) {
      showToast('Failed to delete listing', 'error');
      return;
    }

    setListings((prev) => prev.filter((l) => l.id !== listingId));
    showToast('Listing deleted', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">
            My Listings
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your help offerings
          </p>
        </div>
        <Link to="/listings/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Listing
          </Button>
        </Link>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setFilter('active')}
          className={`
            px-4 py-2 rounded-xl text-sm font-semibold transition-colors
            ${
              filter === 'active'
                ? 'bg-primary-600 text-white shadow-glow-blue'
                : 'bg-white dark:bg-dark-card text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-border'
            }
          `}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('paused')}
          className={`
            px-4 py-2 rounded-xl text-sm font-semibold transition-colors
            ${
              filter === 'paused'
                ? 'bg-primary-600 text-white shadow-glow-blue'
                : 'bg-white dark:bg-dark-card text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-border'
            }
          `}
        >
          Paused
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <ListingSkeleton key={i} />
          ))}
        </div>
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listings.map((listing) => (
            <Card key={listing.id}>
              <div className="flex items-start justify-between mb-3">
                <Badge
                  size="sm"
                  style={{
                    backgroundColor: listing.categories.color + '20',
                    color: listing.categories.color,
                  }}
                >
                  {listing.categories.name}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Eye className="w-4 h-4" />
                  {listing.views_count}
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                {listing.title}
              </h3>

              <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                {listing.description || 'No description'}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-accent-500" />
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {listing.price_credits}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{listing.duration_minutes}m</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-dark-border">
                <Link to={`/listings/${listing.id}/edit`} className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full">
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => toggleStatus(listing)}
                >
                  {listing.status === 'active' ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => deleteListing(listing.id)}
                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
            No {filter} listings
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {filter === 'active'
              ? 'Create your first listing to start helping others'
              : 'No paused listings'}
          </p>
          {filter === 'active' && (
            <Link to="/listings/create">
              <Button>Create a Listing</Button>
            </Link>
          )}
        </Card>
      )}
    </div>
  );
}
