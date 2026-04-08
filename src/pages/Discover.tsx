import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Zap, Clock, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Card, Button, Avatar, Badge, Input, StarRating, ListingSkeleton } from '../components/ui';
import type { ListingWithDetails, Category } from '../types/database';

export function Discover() {
  const [listings, setListings] = useState<ListingWithDetails[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('*').order('name');
      setCategories(data || []);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      let query = supabase
        .from('listings')
        .select(`*, profiles!listings_user_id_profiles_fkey(*), categories!listings_category_id_fkey(*)`)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (selectedCategory) query = query.eq('category_id', selectedCategory);
      if (searchQuery) query = query.ilike('title', `%${searchQuery}%`);

      const { data } = await query;
      setListings((data || []) as ListingWithDetails[]);
      setLoading(false);
    };
    fetchListings();
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Discover Help
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Find students who can help you with your needs
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-5 h-5" />}
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`
            px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
            ${!selectedCategory
              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
              : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
            }
          `}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`
              px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
              ${selectedCategory === cat.id
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
              }
            `}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ListingSkeleton key={i} />
          ))}
        </div>
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-300 dark:text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            No listings found
          </h3>
          <p className="text-gray-400 mb-6 max-w-sm mx-auto text-sm">
            {searchQuery ? 'Try adjusting your search terms' : 'Be the first to offer help in this category'}
          </p>
          <Link to="/listings/create">
            <Button>Create a Listing</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}

function ListingCard({ listing }: { listing: ListingWithDetails }) {
  return (
    <Card hover className="flex flex-col h-full group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar src={listing.profiles.avatar_url} name={listing.profiles.name} size="md" />
          <div>
            <p className="font-semibold text-gray-800 dark:text-white text-sm">{listing.profiles.name}</p>
            <div className="flex items-center gap-1">
              <StarRating rating={listing.profiles.rating} size="sm" />
              {listing.profiles.total_reviews > 0 && (
                <span className="text-xs text-gray-400">({listing.profiles.total_reviews})</span>
              )}
            </div>
          </div>
        </div>
        <span
          className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium"
          style={{ backgroundColor: listing.categories.color + '15', color: listing.categories.color }}
        >
          {listing.categories.name}
        </span>
      </div>

      <Link to={`/listings/${listing.id}`} className="flex-1">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1.5 line-clamp-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
          {listing.title}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed">
          {listing.description || 'No description provided'}
        </p>
      </Link>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-cyan-500" />
            <span className="font-semibold text-gray-800 dark:text-white">{listing.price_credits}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{listing.duration_minutes}m</span>
          </div>
          {listing.location_type !== 'online' && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span className="capitalize">{listing.location_type}</span>
            </div>
          )}
        </div>
        <Link to={`/listings/${listing.id}`}>
          <Button size="sm">Request</Button>
        </Link>
      </div>
    </Card>
  );
}
