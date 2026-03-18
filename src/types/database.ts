export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          bio: string;
          university: string;
          avatar_url: string;
          skills_offered: string[];
          skills_wanted: string[];
          tagline: string;
          github_url: string;
          linkedin_url: string;
          website_url: string;
          timezone: string;
          preferred_communication: 'discord' | 'zoom' | 'in_platform';
          availability_status: 'active' | 'busy';
          rating: number;
          total_reviews: number;
          sessions_completed: number;
          current_streak: number;
          longest_streak: number;
          last_session_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string;
          email?: string | null;
          bio?: string;
          university?: string;
          avatar_url?: string;
          skills_offered?: string[];
          skills_wanted?: string[];
          tagline?: string;
          github_url?: string;
          linkedin_url?: string;
          website_url?: string;
          timezone?: string;
          preferred_communication?: 'discord' | 'zoom' | 'in_platform';
          availability_status?: 'active' | 'busy';
          rating?: number;
          total_reviews?: number;
          sessions_completed?: number;
          current_streak?: number;
          longest_streak?: number;
          last_session_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string | null;
          bio?: string;
          university?: string;
          avatar_url?: string;
          skills_offered?: string[];
          skills_wanted?: string[];
          tagline?: string;
          github_url?: string;
          linkedin_url?: string;
          website_url?: string;
          timezone?: string;
          preferred_communication?: 'discord' | 'zoom' | 'in_platform';
          availability_status?: 'active' | 'busy';
          rating?: number;
          total_reviews?: number;
          sessions_completed?: number;
          current_streak?: number;
          longest_streak?: number;
          last_session_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      wallets: {
        Row: {
          id: string;
          user_id: string;
          balance: number;
          locked_credits: number;
          total_earned: number;
          total_spent: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          balance?: number;
          locked_credits?: number;
          total_earned?: number;
          total_spent?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          balance?: number;
          locked_credits?: number;
          total_earned?: number;
          total_spent?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          min_credits: number;
          max_credits: number;
          icon_name: string;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string;
          min_credits?: number;
          max_credits?: number;
          icon_name?: string;
          color?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          min_credits?: number;
          max_credits?: number;
          icon_name?: string;
          color?: string;
          created_at?: string;
        };
      };
      listings: {
        Row: {
          id: string;
          user_id: string;
          category_id: string;
          title: string;
          description: string;
          price_credits: number;
          duration_minutes: number;
          location_type: 'online' | 'offline' | 'both';
          availability: string;
          status: 'active' | 'paused' | 'deleted';
          views_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id: string;
          title: string;
          description?: string;
          price_credits: number;
          duration_minutes?: number;
          location_type?: 'online' | 'offline' | 'both';
          availability?: string;
          status?: 'active' | 'paused' | 'deleted';
          views_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category_id?: string;
          title?: string;
          description?: string;
          price_credits?: number;
          duration_minutes?: number;
          location_type?: 'online' | 'offline' | 'both';
          availability?: string;
          status?: 'active' | 'paused' | 'deleted';
          views_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      requests: {
        Row: {
          id: string;
          user_id: string;
          category_id: string;
          title: string;
          description: string;
          credits_offered: number;
          duration_minutes: number;
          status: 'open' | 'accepted' | 'completed' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id: string;
          title: string;
          description?: string;
          credits_offered: number;
          duration_minutes?: number;
          status?: 'open' | 'accepted' | 'completed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category_id?: string;
          title?: string;
          description?: string;
          credits_offered?: number;
          duration_minutes?: number;
          status?: 'open' | 'accepted' | 'completed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
      };
      sessions: {
        Row: {
          id: string;
          listing_id: string | null;
          request_id: string | null;
          provider_id: string;
          requester_id: string;
          scheduled_time: string;
          duration_minutes: number;
          credits_amount: number;
          status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
          provider_confirmed: boolean;
          requester_confirmed: boolean;
          provider_confirmed_at: string | null;
          requester_confirmed_at: string | null;
          message: string;
          cancellation_reason: string | null;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          listing_id?: string | null;
          request_id?: string | null;
          provider_id: string;
          requester_id: string;
          scheduled_time: string;
          duration_minutes?: number;
          credits_amount: number;
          status?: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
          provider_confirmed?: boolean;
          requester_confirmed?: boolean;
          provider_confirmed_at?: string | null;
          requester_confirmed_at?: string | null;
          message?: string;
          cancellation_reason?: string | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          listing_id?: string | null;
          request_id?: string | null;
          provider_id?: string;
          requester_id?: string;
          scheduled_time?: string;
          duration_minutes?: number;
          credits_amount?: number;
          status?: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
          provider_confirmed?: boolean;
          requester_confirmed?: boolean;
          provider_confirmed_at?: string | null;
          requester_confirmed_at?: string | null;
          message?: string;
          cancellation_reason?: string | null;
          created_at?: string;
          completed_at?: string | null;
        };
      };
      credit_locks: {
        Row: {
          id: string;
          user_id: string;
          session_id: string;
          credits: number;
          status: 'locked' | 'released' | 'transferred';
          created_at: string;
          released_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_id: string;
          credits: number;
          status?: 'locked' | 'released' | 'transferred';
          created_at?: string;
          released_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_id?: string;
          credits?: number;
          status?: 'locked' | 'released' | 'transferred';
          created_at?: string;
          released_at?: string | null;
        };
      };
      reviews: {
        Row: {
          id: string;
          session_id: string;
          reviewer_id: string;
          reviewed_user_id: string;
          rating: number;
          comment: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          reviewer_id: string;
          reviewed_user_id: string;
          rating: number;
          comment?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          reviewer_id?: string;
          reviewed_user_id?: string;
          rating?: number;
          comment?: string;
          created_at?: string;
        };
      };
      badges: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          icon: string;
          color: string;
          requirement_type: string;
          requirement_value: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string;
          icon?: string;
          color?: string;
          requirement_type: string;
          requirement_value?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          icon?: string;
          color?: string;
          requirement_type?: string;
          requirement_value?: number;
          created_at?: string;
        };
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          earned_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_id: string;
          earned_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          badge_id?: string;
          earned_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          other_user_id: string | null;
          session_id: string | null;
          credits: number;
          type: 'signup_bonus' | 'earn' | 'spend' | 'refund' | 'lock' | 'unlock';
          description: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          other_user_id?: string | null;
          session_id?: string | null;
          credits: number;
          type: 'signup_bonus' | 'earn' | 'spend' | 'refund' | 'lock' | 'unlock';
          description?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          other_user_id?: string | null;
          session_id?: string | null;
          credits?: number;
          type?: 'signup_bonus' | 'earn' | 'spend' | 'refund' | 'lock' | 'unlock';
          description?: string;
          created_at?: string;
        };
      };
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Wallet = Database['public']['Tables']['wallets']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Listing = Database['public']['Tables']['listings']['Row'];
export type HelpRequest = Database['public']['Tables']['requests']['Row'];
export type Session = Database['public']['Tables']['sessions']['Row'];
export type CreditLock = Database['public']['Tables']['credit_locks']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type Badge = Database['public']['Tables']['badges']['Row'];
export type UserBadge = Database['public']['Tables']['user_badges']['Row'];
export type Transaction = Database['public']['Tables']['transactions']['Row'];

export type ListingWithDetails = Listing & {
  profiles: Profile;
  categories: Category;
};

export type RequestWithDetails = HelpRequest & {
  profiles: Profile;
  categories: Category;
};

export type SessionWithDetails = Session & {
  provider: Profile;
  requester: Profile;
  listing?: Listing | null;
  request?: HelpRequest | null;
};

export type BadgeWithEarned = Badge & {
  earned?: boolean;
  earned_at?: string;
};
