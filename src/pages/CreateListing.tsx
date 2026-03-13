import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import { Card, Button, Input, Textarea, Select } from '../components/ui';
import type { Category } from '../types/database';

export function CreateListing() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [priceCredits, setPriceCredits] = useState(5);
  const [duration, setDuration] = useState(30);
  const [locationType, setLocationType] = useState<'online' | 'offline' | 'both'>('online');

  const selectedCategory = categories.find((c) => c.id === categoryId);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('*').order('name');
      setCategories(data || []);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setPriceCredits(Math.round((selectedCategory.min_credits + selectedCategory.max_credits) / 2));
    }
  }, [selectedCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !categoryId) return;

    setLoading(true);

    const { error } = await supabase.from('listings').insert({
      user_id: user.id,
      category_id: categoryId,
      title,
      description,
      price_credits: priceCredits,
      duration_minutes: duration,
      location_type: locationType,
    });

    if (error) {
      showToast('Failed to create listing', 'error');
      setLoading(false);
      return;
    }

    showToast('Listing created successfully!', 'success');
    navigate('/listings');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">
          Create Listing
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Offer your skills and help other students
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <h2 className="font-bold text-gray-800 dark:text-white mb-4">
            Category & Pricing
          </h2>

          <div className="space-y-4">
            <Select
              label="Category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.min_credits}-{cat.max_credits} credits)
                </option>
              ))}
            </Select>

            {selectedCategory && (
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-dark-surface">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Price (credits)
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {priceCredits}
                  </span>
                </div>
                <input
                  type="range"
                  min={selectedCategory.min_credits}
                  max={selectedCategory.max_credits}
                  value={priceCredits}
                  onChange={(e) => setPriceCredits(Number(e.target.value))}
                  className="w-full accent-primary-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{selectedCategory.min_credits}</span>
                  <span>{selectedCategory.max_credits}</span>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="font-bold text-gray-800 dark:text-white mb-4">
            Listing Details
          </h2>

          <div className="space-y-4">
            <Input
              label="Title"
              placeholder="e.g., React Debugging Help"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={100}
            />

            <Textarea
              label="Description"
              placeholder="Describe what you're offering and how you can help..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Duration"
                value={duration.toString()}
                onChange={(e) => setDuration(Number(e.target.value))}
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
              </Select>

              <Select
                label="Location"
                value={locationType}
                onChange={(e) => setLocationType(e.target.value as 'online' | 'offline' | 'both')}
              >
                <option value="online">Online only</option>
                <option value="offline">In-person only</option>
                <option value="both">Both options</option>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-50 dark:bg-dark-surface">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
            Preview
          </h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent-500" />
              <span className="font-semibold">{priceCredits} credits</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{duration} min</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <CheckCircle className="w-4 h-4" />
              <span className="capitalize">{locationType}</span>
            </div>
          </div>
        </Card>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            loading={loading}
            disabled={!title || !categoryId}
          >
            Create Listing
          </Button>
        </div>
      </form>
    </div>
  );
}
