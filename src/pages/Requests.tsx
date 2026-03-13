import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Zap, Clock, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import { Card, Button, Avatar, Badge, Input, ListingSkeleton, Modal } from '../components/ui';
import type { RequestWithDetails } from '../types/database';

export function Requests() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [requests, setRequests] = useState<RequestWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RequestWithDetails | null>(null);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      let query = supabase
        .from('requests')
        .select(`
          *,
          profiles!requests_user_id_fkey(*),
          categories!requests_category_id_fkey(*)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      const { data } = await query;
      setRequests((data || []) as RequestWithDetails[]);
      setLoading(false);
    };

    fetchRequests();
  }, [searchQuery]);

  const handleAcceptRequest = async () => {
    if (!user || !selectedRequest) return;

    setAccepting(true);

    const scheduledTime = new Date();
    scheduledTime.setHours(scheduledTime.getHours() + 1);

    const { data: session, error } = await supabase
      .from('sessions')
      .insert({
        request_id: selectedRequest.id,
        provider_id: user.id,
        requester_id: selectedRequest.user_id,
        scheduled_time: scheduledTime.toISOString(),
        duration_minutes: selectedRequest.duration_minutes,
        credits_amount: selectedRequest.credits_offered,
        status: 'accepted',
      })
      .select()
      .single();

    if (error) {
      showToast('Failed to accept request', 'error');
      setAccepting(false);
      return;
    }

    await supabase
      .from('requests')
      .update({ status: 'accepted' })
      .eq('id', selectedRequest.id);

    await supabase.from('credit_locks').insert({
      user_id: selectedRequest.user_id,
      session_id: session.id,
      credits: selectedRequest.credits_offered,
      status: 'locked',
    });

    const { data: requesterWallet } = await supabase
      .from('wallets')
      .select('balance, locked_credits')
      .eq('user_id', selectedRequest.user_id)
      .maybeSingle();

    if (requesterWallet) {
      await supabase
        .from('wallets')
        .update({
          balance: requesterWallet.balance - selectedRequest.credits_offered,
          locked_credits: requesterWallet.locked_credits + selectedRequest.credits_offered,
        })
        .eq('user_id', selectedRequest.user_id);

      await supabase.from('transactions').insert({
        user_id: selectedRequest.user_id,
        session_id: session.id,
        credits: selectedRequest.credits_offered,
        type: 'lock',
        description: `Credits locked for help request: ${selectedRequest.title}`,
      });
    }

    showToast('Request accepted! Session created.', 'success');
    setShowAcceptModal(false);
    setSelectedRequest(null);
    setRequests((prev) => prev.filter((r) => r.id !== selectedRequest.id));
    setAccepting(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">
            Help Requests
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            See what students need help with
          </p>
        </div>
        <Link to="/requests/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Post Request
          </Button>
        </Link>
      </div>

      <Input
        placeholder="Search requests..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        icon={<Search className="w-5 h-5" />}
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ListingSkeleton key={i} />
          ))}
        </div>
      ) : requests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onAccept={() => {
                setSelectedRequest(request);
                setShowAcceptModal(true);
              }}
              isOwnRequest={user?.id === request.user_id}
            />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            No open requests
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchQuery ? 'Try adjusting your search' : 'Be the first to post a request'}
          </p>
          <Link to="/requests/create">
            <Button>Post a Request</Button>
          </Link>
        </Card>
      )}

      <Modal
        isOpen={showAcceptModal}
        onClose={() => {
          setShowAcceptModal(false);
          setSelectedRequest(null);
        }}
        title="Accept Request"
        size="md"
      >
        {selectedRequest && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-dark-surface">
              <Avatar
                src={selectedRequest.profiles.avatar_url}
                name={selectedRequest.profiles.name}
                size="md"
              />
              <div>
                <p className="font-medium text-gray-800 dark:text-white">
                  {selectedRequest.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  by {selectedRequest.profiles.name}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-success-50 dark:bg-success-900/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-success-600" />
                  <span className="font-medium text-success-700 dark:text-success-400">
                    You'll earn {selectedRequest.credits_offered} credits
                  </span>
                </div>
              </div>
              <p className="text-sm text-success-600 dark:text-success-500 mt-1">
                Credits will be transferred after session completion
              </p>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              By accepting, you agree to help {selectedRequest.profiles.name} with their request.
              A session will be created and the requester will be notified.
            </p>

            <div className="flex gap-3 pt-2">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  setShowAcceptModal(false);
                  setSelectedRequest(null);
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleAcceptRequest}
                loading={accepting}
              >
                Accept Request
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function RequestCard({
  request,
  onAccept,
  isOwnRequest,
}: {
  request: RequestWithDetails;
  onAccept: () => void;
  isOwnRequest: boolean;
}) {
  return (
    <Card hover className="flex flex-col h-full">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar
            src={request.profiles.avatar_url}
            name={request.profiles.name}
            size="md"
          />
          <div>
            <p className="font-semibold text-gray-800 dark:text-white">
              {request.profiles.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(request.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Badge
          size="sm"
          style={{
            backgroundColor: request.categories.color + '20',
            color: request.categories.color,
          }}
        >
          {request.categories.name}
        </Badge>
      </div>

      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 flex-1">
        {request.title}
      </h3>

      {request.description && (
        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4">
          {request.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-dark-border">
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-success-500" />
            <span className="font-semibold text-success-600">
              +{request.credits_offered}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{request.duration_minutes}m</span>
          </div>
        </div>
        {!isOwnRequest && (
          <Button size="sm" onClick={onAccept}>
            Accept
          </Button>
        )}
        {isOwnRequest && (
          <Badge variant="primary" size="sm">
            <User className="w-3 h-3" />
            Your Request
          </Badge>
        )}
      </div>
    </Card>
  );
}
