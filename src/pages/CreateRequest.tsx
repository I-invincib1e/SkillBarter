import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import { Card, Button, Input, Textarea, Select } from '../components/ui';
import type { Category } from '../types/database';

export function CreateRequest() {
  const { user, wallet } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [creditsOffered, setCreditsOffered] = useState(5);
  const [duration, setDuration] = useState(30);

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const hasEnoughCredits = wallet && wallet.balance >= creditsOffered;

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('*').order('name');
      setCategories(data || []);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setCreditsOffered(Math.round((selectedCategory.min_credits + selectedCategory.max_credits) / 2));
    }
  }, [selectedCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !categoryId || !hasEnoughCredits) return;

    setLoading(true);

    const { error } = await supabase.from('requests').insert({
      user_id: user.id,
      category_id: categoryId,
      title,
      description,
      credits_offered: creditsOffered,
      duration_minutes: duration,
    });

    if (error) {
      showToast('Failed to create request', 'error');
      setLoading(false);
      return;
    }

    showToast('Request posted successfully!', 'success');
    navigate('/requests');
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
          Post a Request
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Let others know what help you need
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 dark:text-white">
              Your Balance
            </h2>
            <div className="flex items-center gap-2 text-primary-600">
              <Zap className="w-5 h-5" />
              <span className="text-xl font-bold">{wallet?.balance ?? 0}</span>
              <span className="text-sm text-gray-500">credits</span>
            </div>
          </div>

          {!hasEnoughCredits && selectedCategory && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">
                You don't have enough credits. You need at least {creditsOffered} credits.
              </p>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="font-bold text-gray-800 dark:text-white mb-4">
            Category & Credits
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
                    Credits to offer
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {creditsOffered}
                  </span>
                </div>
                <input
                  type="range"
                  min={selectedCategory.min_credits}
                  max={Math.min(selectedCategory.max_credits, wallet?.balance || 0)}
                  value={creditsOffered}
                  onChange={(e) => setCreditsOffered(Number(e.target.value))}
                  className="w-full accent-primary-600"
                  disabled={!hasEnoughCredits}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{selectedCategory.min_credits}</span>
                  <span>{Math.min(selectedCategory.max_credits, wallet?.balance || 0)}</span>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="font-bold text-gray-800 dark:text-white mb-4">
            Request Details
          </h2>

          <div className="space-y-4">
            <Input
              label="Title"
              placeholder="e.g., Need help with calculus homework"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={100}
            />

            <Textarea
              label="Description"
              placeholder="Describe what you need help with in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />

            <Select
              label="Estimated Duration"
              value={duration.toString()}
              onChange={(e) => setDuration(Number(e.target.value))}
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
              <option value="90">90 minutes</option>
            </Select>
          </div>
        </Card>

        <Card className="bg-gray-50 dark:bg-dark-surface">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
            Summary
          </h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent-500" />
              <span className="font-semibold">{creditsOffered} credits offered</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{duration} min</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Credits will be locked when someone accepts your request
          </p>
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
            disabled={!title || !categoryId || !hasEnoughCredits}
          >
            Post Request
          </Button>
        </div>
      </form>
    </div>
  );
}
