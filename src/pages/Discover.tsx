import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Zap, Clock, MapPin, X, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Card, Button, Avatar, Input, StarRating, ListingSkeleton, Select } from '../components/ui';
import type { ListingWithDetails, Category } from '../types/database';

type SortOption = 'newest' | 'price_low' | 'price_high' | 'rating';

const PAGE_SIZE = 18;

export function Discover() {
  const [listings, setListings] = useState<ListingWithDetails[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [locationType, setLocationType] = useState<string>('');

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('*').order('name');
      setCategories(data || []);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const buildQuery = useCallback(() => {
    let query = supabase
      .from('listings')
      .select(`*, profiles!listings_user_id_profiles_fkey(*), categories!listings_category_id_fkey(*)`, { count: 'exact' })
      .eq('status', 'active');

    if (selectedCategory) query = query.eq('category_id', selectedCategory);
    if (locationType) query = query.eq('location_type', locationType);
    if (debouncedSearch) {
      query = query.or(`title.ilike.%${debouncedSearch}%,description.ilike.%${debouncedSearch}%`);
    }

    switch (sortBy) {
      case 'price_low':
        query = query.order('price_credits', { ascending: true });
        break;
      case 'price_high':
        query = query.order('price_credits', { ascending: false });
        break;
      case 'rating':
        query = query.order('created_at', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    return query;
  }, [selectedCategory, debouncedSearch, sortBy, locationType]);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setPage(0);

      const query = buildQuery().range(0, PAGE_SIZE - 1);
      const { data, count } = await query;
      const results = (data || []) as ListingWithDetails[];

      if (sortBy === 'rating') {
        results.sort((a, b) => b.profiles.rating - a.profiles.rating);
      }

      setListings(results);
      setTotalCount(count || 0);
      setHasMore((count || 0) > PAGE_SIZE);
      setLoading(false);
    };

    fetchListings();
  }, [buildQuery, sortBy]);

  const loadMore = async () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    const from = nextPage * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const query = buildQuery().range(from, to);
    const { data } = await query;
    const results = (data || []) as ListingWithDetails[];

    if (sortBy === 'rating') {
      results.sort((a, b) => b.profiles.rating - a.profiles.rating);
    }

    setListings((prev) => [...prev, ...results]);
    setPage(nextPage);
    setHasMore(from + results.length < totalCount);
    setLoadingMore(false);
  };

  const hasActiveFilters = selectedCategory || locationType || debouncedSearch;

  const clearFilters = () => {
    setSelectedCategory(null);
    setLocationType('');
    setSearchQuery('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">
          Discover Help
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Find students who can help you with your needs
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-5 h-5" />}
          />
        </div>
        <div className="flex gap-3">
          <Select
            value={locationType}
            onChange={(e) => setLocationType(e.target.value)}
            className="w-36"
          >
            <option value="">All Types</option>
            <option value="online">Online</option>
            <option value="in_person">In Person</option>
            <option value="both">Both</option>
          </Select>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="w-40"
          >
            <option value="newest">Newest</option>
            <option value="price_low">Price: Low</option>
            <option value="price_high">Price: High</option>
            <option value="rating">Top Rated</option>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide flex-1">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`
              px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 min-h-[36px]
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
                px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 min-h-[36px]
                ${selectedCategory === cat.id
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                }
              `}
            >
              {cat.name}
            </button>
          ))}
          <div className="w-8 shrink-0 bg-gradient-to-l from-white dark:from-dark-bg pointer-events-none" />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {totalCount} result{totalCount !== 1 ? 's' : ''}
          </span>
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-3 h-3" />
            Clear filters
          </button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ListingSkeleton key={i} />
          ))}
        </div>
      ) : listings.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((listing, idx) => (
              <div
                key={listing.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${Math.min(idx * 50, 300)}ms`, animationFillMode: 'both' }}
              >
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="text-center pt-4">
              <Button
                variant="secondary"
                onClick={loadMore}
                loading={loadingMore}
              >
                Load More
                <ChevronRight className="w-4 h-4" />
              </Button>
              <p className="text-xs text-gray-400 mt-2">
                Showing {listings.length} of {totalCount}
              </p>
            </div>
          )}
        </>
      ) : (
        <Card className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-300 dark:text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            No listings found
          </h3>
          <p className="text-gray-400 mb-6 max-w-sm mx-auto text-sm">
            {debouncedSearch ? 'Try adjusting your search terms' : 'Be the first to offer help in this category'}
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
  const isNewProvider = listing.profiles.total_reviews < 3;

  return (
    <Card hover className="flex flex-col h-full group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar src={listing.profiles.avatar_url} name={listing.profiles.name} size="md" />
          <div>
            <p className="font-semibold text-gray-800 dark:text-white text-sm">{listing.profiles.name}</p>
            {isNewProvider ? (
              <span className="text-xs text-gray-400 font-medium">New Provider</span>
            ) : (
              <div className="flex items-center gap-1">
                <StarRating rating={listing.profiles.rating} size="sm" />
                <span className="text-xs text-gray-400">({listing.profiles.total_reviews})</span>
              </div>
            )}
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
        <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1.5 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {listing.title}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed">
          {listing.description || 'No description provided'}
        </p>
      </Link>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-accent-500" />
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
