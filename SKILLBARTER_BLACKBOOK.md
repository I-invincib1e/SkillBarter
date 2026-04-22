# SkillBarter - Final Year Project Black Book

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Project Overview](#project-overview)
3. [Team Roles & Responsibilities](#team-roles--responsibilities)
4. [System Architecture](#system-architecture)
5. [Database Design & ER Diagrams](#database-design--er-diagrams)
   - [Normalization Analysis](#database-normalization-analysis)
   - [ACID Properties & Transaction Handling](#acid-properties--transaction-handling)
   - [Indexing Strategy](#indexing-strategy)
   - [Referential Integrity & Constraints](#referential-integrity--constraints)
   - [Denormalization Decisions](#denormalization-decisions)
   - [Database Triggers & Functions](#database-triggers--functions)
   - [Entity Relationship Cardinalities](#entity-relationship-cardinalities)
   - [Data Dictionary](#data-dictionary)
6. [Data Flow & Workflows](#data-flow--workflows)
7. [Feature Specifications](#feature-specifications)
8. [Technology Stack](#technology-stack)
9. [Component Architecture](#component-architecture)
10. [API & Database Operations](#api--database-operations)
11. [Security & RLS Policies](#security--rls-policies)
12. [Installation & Deployment](#installation--deployment)
13. [Testing & QA](#testing--qa)
14. [Troubleshooting Guide](#troubleshooting-guide)
15. [Real-World Improvement Analysis](#real-world-improvement-analysis)

---

## Executive Summary

**SkillBarter** is a peer-to-peer student skill exchange platform that enables university students to offer and request help from peers using a credit-based currency system. The platform eliminates monetary transactions by using "Time Credits" as a medium of exchange, making skill-sharing accessible to all students regardless of financial status.

**Project Status**: Production-ready with atomic server-side operations, comprehensive database constraints, full accessibility support, and an integrated AI tutor (LIZA)
**Total Codebase**: ~9,500+ lines of TypeScript/React + PostgreSQL functions + Supabase Edge Function
**Database**: Supabase PostgreSQL with 11 core tables plus 7 LIZA AI tables, 5 atomic RPC functions, 6 CHECK constraints, composite indexes
**Edge Functions**: 1 Deno-based function (`liza-ai`) proxying chat, flashcard, and quiz generation to free models on OpenRouter
**Migrations**: 12 migration files tracking complete schema evolution
**Team Size**: 4 developers with specialized roles

---

## Project Overview

### Problem Statement

University students often struggle to:
- Find affordable tutoring and help with studies
- Monetize their skills without formal tutoring platforms
- Build professional experience in a collaborative environment
- Track their learning progress and achievements

### Solution

SkillBarter provides a decentralized platform where:
- Students can list skills they're willing to teach
- Students can request help from peers for specific needs
- Transactions happen using "Time Credits" (not money)
- Comprehensive rating and badge systems build trust and motivation
- Streak tracking gamifies regular participation

### Core Value Propositions

1. **No Money Required** - Use time/credits instead of cash
2. **Peer-to-Peer** - Direct connection between students
3. **Safe Booking** - Atomic server-side operations with database-level constraints prevent fraud and data corruption
4. **Trackable Progress** - Fully functional badge auto-awards, streaks with grace period, and auto-calculated ratings
5. **Flexible Scheduling** - Online and offline session options with date/time pickers
6. **Accessible** - WCAG-compliant with ARIA landmarks, keyboard navigation, reduced-motion support, and mobile-optimized navigation
7. **AI Tutor On Demand** - LIZA, a personalized AI assistant integrated into the platform, generates flashcards and MCQ quizzes from prompts, PDFs, or ongoing conversations, and answers study questions using the user's profile context

### Target Users

- University students (all years, all majors)
- Primary motivation: Free skill acquisition
- Secondary motivation: Community participation and gamification

---

## Team Roles & Responsibilities

### 1. Project Lead & System Architect
**Assigned to: Rushikesh**

**Core Duties:**
- Overall project management and system design
- Database schema design and optimization
- Core business logic implementation
- Version control and code review oversight
- Architecture decisions and technical direction

**Technical Tasks:**
- Design ER diagrams and data flow diagrams
- Implement credit transfer logic and security
- Write PostgreSQL triggers and functions
- Set up Supabase project and migrations
- Oversee GitHub repository management
- Implement Row Level Security (RLS) policies

**Key Responsibilities:**
- Database performance optimization
- System scalability planning
- Integration of frontend and backend
- Security audit and compliance
- Documentation of architectural decisions

---

### 2. Frontend Developer
**Assigned to: Sandesh**

**Core Duties:**
- Build user-facing web application (React + TypeScript)
- Implement responsive UI/UX design
- Handle state management and real-time updates
- Create smooth animations and micro-interactions

**Technical Tasks:**
- Develop React components using Tailwind CSS
- Implement routing with React Router v7
- Build forms for listings, requests, and bookings
- Handle authentication flow (Login/Signup)
- Implement dark/light mode toggle
- Create responsive mobile design

**Key Responsibilities:**
- UI component library development
- Page layout and navigation
- Form validation and error handling
- Real-time wallet balance updates
- Loading states and skeleton screens
- Cross-browser compatibility testing

---

### 3. Backend & Database Administrator
**Assigned to: Rutuja**

**Core Duties:**
- Database management and optimization
- User security and authentication
- Data integrity and backup procedures
- Query optimization and indexing

**Technical Tasks:**
- Set up Firebase Authentication (Email/Password & OAuth)
- Manage Supabase/PostgreSQL database
- Create and manage database migrations
- Implement RLS security rules
- Write validation logic for credit transactions
- Handle credit locks and transfers

**Key Responsibilities:**
- Database schema validation
- User data protection
- Prevention of credit inflation attacks
- Transaction audit logging
- Database backup and disaster recovery
- Performance monitoring and optimization

---

### 4. UI/UX Designer & QA Tester
**Assigned to: Pavankumar**

**Core Duties:**
- Design high-fidelity wireframes and prototypes
- Comprehensive testing across all features
- Quality assurance and bug reporting
- User experience optimization

**Technical Tasks:**
- Create Figma/Miro prototypes
- Develop design system and style guide
- Conduct functional testing
- Perform regression testing
- Test edge cases and error scenarios
- Validate accessibility standards
- Create test cases and QA documentation

**Key Responsibilities:**
- Visual design consistency
- Responsive design validation (mobile/tablet/desktop)
- User flow testing
- Performance testing (page load times)
- Accessibility compliance (WCAG)
- Bug triage and severity assessment
- User acceptance testing (UAT)

---

## System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   FRONTEND (React + TypeScript)          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Pages:                                           │   │
│  │ Home, Login, Signup, Dashboard, Discover,        │   │
│  │ ListingDetail, MyListings, Requests, Sessions,   │   │
│  │ Wallet, Badges, Profile, Settings, About, FAQ   │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Components: UI Library (Button, Card, Avatar, etc)   │
│  │ Layout: Header, Sidebar, MobileNav, Layout wrapper │   │
│  │ Contexts: AuthContext, ThemeContext              │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼ (Supabase JS Client)
┌─────────────────────────────────────────────────────────┐
│                    SUPABASE BACKEND                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Authentication (Email/Password + Google OAuth)   │   │
│  │ ├─ auth.users table                              │   │
│  │ └─ Session management                            │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │ PostgreSQL Database (11 Tables)                  │   │
│  │ ├─ profiles, wallets, categories                 │   │
│  │ ├─ listings, requests, sessions                  │   │
│  │ ├─ credit_locks, reviews                         │   │
│  │ ├─ badges, user_badges                           │   │
│  │ └─ transactions                                  │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Row Level Security (RLS) Policies                │   │
│  │ ├─ Public read: listings, requests, badges       │   │
│  │ ├─ Private: wallets, transactions                │   │
│  │ └─ Service role: credit transfers                │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Triggers & Atomic Functions                      │   │
│  │ ├─ handle_new_user() - signup bonus              │   │
│  │ ├─ update_user_rating() - review aggregation     │   │
│  │ ├─ book_session() - atomic booking RPC           │   │
│  │ ├─ complete_session() - atomic completion RPC    │   │
│  │ ├─ cancel_session() - atomic cancellation RPC    │   │
│  │ ├─ accept_request() - atomic request accept RPC  │   │
│  │ ├─ award_badges() - badge eligibility checker    │   │
│  │ └─ Composite indexes for optimization            │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- React 18.3.1 with TypeScript 5.5
- React Router v7.13 for navigation
- Tailwind CSS v3.4 for styling
- Lucide React for icons
- Vite v5.4 as build tool
- pdfjs-dist for client-side PDF text extraction (LIZA file uploads)

**Backend:**
- Supabase (PostgreSQL database)
- Supabase Authentication
- PostgreSQL with RLS
- Row Level Security (RLS) policies
- Supabase Edge Functions (Deno runtime) -- `liza-ai` function proxies chat and study-material generation

**AI:**
- OpenRouter API (fallback-routed across free models: `nvidia/nemotron-3-super-120b-a12b:free` primary, `google/gemma-4-31b-it:free` fallback)
- Server-Sent Events for streaming chat tokens
- Strict JSON response format for structured flashcard and quiz output

**State Management:**
- React Context API (AuthContext, ThemeContext)
- Component-level useState hooks
- Direct Supabase queries

**Development Tools:**
- TypeScript for type safety
- ESLint for code quality
- PostCSS + Autoprefixer
- Node.js & npm

---

## Database Design & ER Diagrams

### Entity Relationship Diagram (ER Diagram)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          USER AUTHENTICATION                            │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │ auth.users (Supabase Built-in)                                │     │
│  │ ├─ id (UUID, Primary Key)                                    │     │
│  │ ├─ email (Text, Unique)                                      │     │
│  │ ├─ raw_user_meta_data (JSONB)                                │     │
│  │ ├─ created_at (Timestamp)                                    │     │
│  │ └─ (Google OAuth integration)                                │     │
│  └────────────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────────┘
              │
              ├─────────────────────────┬──────────────────────────┐
              ▼                         ▼                          ▼
      ┌──────────────────┐    ┌──────────────────┐     ┌──────────────────┐
      │ profiles         │    │ wallets          │     │ transactions     │
      ├──────────────────┤    ├──────────────────┤     ├──────────────────┤
      │ id (FK)          │◄───┤ id (PK)          │     │ id (PK)          │
      │ name             │    │ user_id (FK/U)   │────►│ user_id (FK)     │
      │ email            │    │ balance          │     │ other_user_id(FK)│
      │ bio              │    │ locked_credits   │     │ session_id (FK)  │
      │ university       │    │ total_earned     │     │ credits          │
      │ avatar_url       │    │ total_spent      │     │ type             │
      │ skills_offered[] │    │ created_at       │     │ description      │
      │ rating           │    │ updated_at       │     │ created_at       │
      │ total_reviews    │    └──────────────────┘     └──────────────────┘
      │ sessions_completed│
      │ current_streak   │
      │ longest_streak   │
      │ last_session_date│
      │ created_at       │
      │ updated_at       │
      └──────────────────┘
              │
              └────────────────────────┬───────────────────────────────┐
                                       ▼                               ▼
                        ┌──────────────────────────┐   ┌──────────────────────┐
                        │ listings                 │   │ requests             │
                        ├──────────────────────────┤   ├──────────────────────┤
                        │ id (PK)                  │   │ id (PK)              │
                        │ user_id (FK)            │   │ user_id (FK)         │
                        │ category_id (FK)        │   │ category_id (FK)     │
                        │ title                    │   │ title                │
                        │ description              │   │ description          │
                        │ price_credits           │   │ credits_offered      │
                        │ duration_minutes        │   │ duration_minutes     │
                        │ location_type           │   │ status               │
                        │ availability            │   │ created_at           │
                        │ status                  │   │ updated_at           │
                        │ views_count             │   └──────────────────────┘
                        │ created_at              │
                        │ updated_at              │
                        └──────────────────────────┘
                                  │
                                  └──────┬───────────────────────────────┐
                                         ▼                               ▼
                            ┌──────────────────────────┐   ┌──────────────────┐
                            │ categories               │   │ sessions         │
                            ├──────────────────────────┤   ├──────────────────┤
                            │ id (PK)                  │   │ id (PK)          │
                            │ name (Unique)            │   │ listing_id (FK)  │
                            │ slug (Unique)            │   │ request_id (FK)  │
                            │ description              │   │ provider_id (FK) │
                            │ min_credits              │   │ requester_id(FK) │
                            │ max_credits              │   │ scheduled_time   │
                            │ icon_name                │   │ duration_minutes │
                            │ color                    │   │ credits_amount   │
                            │ created_at               │   │ status           │
                            └──────────────────────────┘   │ provider_conf... │
                                                           │ requester_conf...│
                                                           │ message          │
                                                           │ cancellation_... │
                                                           │ created_at       │
                                                           │ completed_at     │
                                                           └──────────────────┘
                                                                    │
                        ┌───────────────────────────────────────┬──┼───┐
                        ▼                                        ▼  ▼   ▼
            ┌──────────────────────┐        ┌──────────────────┐  │
            │ credit_locks         │        │ reviews          │  │
            ├──────────────────────┤        ├──────────────────┤  │
            │ id (PK)              │        │ id (PK)          │  │
            │ user_id (FK)         │        │ session_id (FK)◄─┘  │
            │ session_id (FK)      │        │ reviewer_id (FK) │   │
            │ credits              │        │ reviewed_user...(FK)│
            │ status               │        │ rating           │   │
            │ created_at           │        │ comment          │   │
            │ released_at          │        │ created_at       │   │
            └──────────────────────┘        └──────────────────┘   │
                                                                    ▼
                            ┌─────────────────────────────────┐
                            │ badges                          │
                            ├─────────────────────────────────┤
                            │ id (PK)                         │
                            │ name (Unique)                   │
                            │ slug (Unique)                   │
                            │ description                     │
                            │ icon                            │
                            │ color                           │
                            │ requirement_type                │
                            │ requirement_value               │
                            │ created_at                      │
                            └─────────────────────────────────┘
                                      │
                                      │ (M:N Relationship)
                                      ▼
                            ┌─────────────────────────────────┐
                            │ user_badges                     │
                            ├─────────────────────────────────┤
                            │ id (PK)                         │
                            │ user_id (FK)                    │
                            │ badge_id (FK)                   │
                            │ earned_at                       │
                            └─────────────────────────────────┘
```

### Database Tables Specification

#### 1. **profiles** (User Extended Data)
```sql
Relationships:
- FK: auth.users(id) - CASCADE
- Referenced by: listings, requests, sessions, reviews, user_badges, transactions

Columns:
- id (UUID, PK) - Foreign key to auth.users
- name (Text) - User's display name
- email (Text) - User's email address
- bio (Text) - User's biography/description
- university (Text) - University affiliation
- avatar_url (Text) - Profile picture URL
- skills_offered (Text[]) - Array of skill tags
- rating (Numeric 3,2) - Average rating from reviews (0-5)
- total_reviews (Integer) - Count of reviews received
- sessions_completed (Integer) - Count of completed sessions
- current_streak (Integer) - Current consecutive active days
- longest_streak (Integer) - Longest streak achieved
- last_session_date (Date) - Date of last completed session
- streak_freeze_used_at (Date) - Last streak freeze date (one freeze per month allowed)
- created_at (Timestamp) - Account creation date
- updated_at (Timestamp) - Last profile update

Indexes:
- PRIMARY KEY: id

Security:
- RLS: Public SELECT (anyone can view profiles)
- RLS: Authenticated UPDATE/INSERT (users modify own profile)
```

#### 2. **wallets** (Credit System)
```sql
Relationships:
- FK: auth.users(id) UNIQUE - CASCADE
- Referenced by: credit_locks, sessions

Columns:
- id (UUID, PK) - Wallet unique identifier
- user_id (UUID, FK UNIQUE) - One wallet per user
- balance (Integer) - Available credits (default: 10)
- locked_credits (Integer) - Credits reserved in pending sessions
- total_earned (Integer) - Lifetime earned credits (includes signup bonus)
- total_spent (Integer) - Lifetime spent credits
- created_at (Timestamp) - Wallet creation date
- updated_at (Timestamp) - Last wallet update

Indexes:
- PRIMARY KEY: id
- UNIQUE: user_id
- AUTO_INSERT: Triggered on new user signup with 10 credit bonus

Constraints (enforced at database level via CHECK):
- wallets_balance_non_negative: balance >= 0
- wallets_locked_non_negative: locked_credits >= 0
- wallets_earned_non_negative: total_earned >= 0
- wallets_spent_non_negative: total_spent >= 0

Security:
- RLS: Authenticated SELECT/UPDATE (users view/modify own wallet only)
- Service role: INSERT for system operations
```

#### 3. **categories** (Skill Categories)
```sql
Relationships:
- Referenced by: listings, requests

Columns:
- id (UUID, PK) - Category unique identifier
- name (Text, UNIQUE) - Category name (e.g., "Quick Help")
- slug (Text, UNIQUE) - URL-friendly identifier
- description (Text) - Category description
- min_credits (Integer) - Minimum price for listings (default: 1)
- max_credits (Integer) - Maximum price for listings (default: 20)
- icon_name (Text) - Lucide icon name for UI
- color (Text) - Hex color code for UI
- created_at (Timestamp) - Creation date

Predefined Categories:
1. Quick Help (2-5 credits) - Zap icon, orange
2. Teaching Session (8-12 credits) - GraduationCap, indigo
3. Notes Creation (10-15 credits) - FileText, green
4. Resume Review (4-7 credits) - FileCheck, blue
5. Mock Interview (6-10 credits) - Users, purple
6. Project Collaboration (5-10 credits) - Code, pink

Indexes:
- PRIMARY KEY: id
- UNIQUE: name, slug

Security:
- RLS: Public SELECT (anyone can browse categories)
- No INSERT/UPDATE/DELETE for users (admin only)
```

#### 4. **listings** (Help Offerings)
```sql
Relationships:
- FK: auth.users(id) - CASCADE
- FK: categories(id) - RESTRICT
- Referenced by: sessions

Columns:
- id (UUID, PK) - Listing unique identifier
- user_id (UUID, FK) - Provider (offer creator)
- category_id (UUID, FK) - Skill category
- title (Text) - Listing title
- description (Text) - Detailed description of what's offered
- price_credits (Integer) - Cost in credits (validated: min ≤ price ≤ max)
- duration_minutes (Integer) - Estimated session duration
- location_type (Text) - 'online' | 'offline' | 'both'
- availability (Text) - Availability description
- status (Text) - 'active' | 'paused' | 'deleted'
- views_count (Integer) - Listing view count
- created_at (Timestamp) - Creation date
- updated_at (Timestamp) - Last update date

Indexes:
- PRIMARY KEY: id
- FOREIGN KEY: user_id
- FOREIGN KEY: category_id
- INDEX: user_id (find user's listings)
- INDEX: category_id (find listings by category)
- INDEX: status (find active listings)

Constraints:
- price_credits: BETWEEN category.min_credits AND category.max_credits
- location_type: CHECK (online/offline/both)
- status: CHECK (active/paused/deleted)

Security:
- RLS: Public SELECT (status = 'active' OR user_id = auth.uid())
- RLS: Authenticated INSERT/UPDATE/DELETE (own listings only)
```

#### 5. **requests** (Help Requests)
```sql
Relationships:
- FK: auth.users(id) - CASCADE
- FK: categories(id) - RESTRICT
- Referenced by: sessions

Columns:
- id (UUID, PK) - Request unique identifier
- user_id (UUID, FK) - Requester
- category_id (UUID, FK) - Help category needed
- title (Text) - Request title
- description (Text) - Detailed request description
- credits_offered (Integer) - Credits offered for help
- duration_minutes (Integer) - Estimated help duration
- status (Text) - 'open' | 'accepted' | 'completed' | 'cancelled'
- created_at (Timestamp) - Creation date
- updated_at (Timestamp) - Last update date

Indexes:
- PRIMARY KEY: id
- FOREIGN KEY: user_id
- FOREIGN KEY: category_id
- INDEX: user_id
- INDEX: status

Constraints:
- credits_offered > 0
- status: CHECK (open/accepted/completed/cancelled)

Security:
- RLS: Public SELECT (status = 'open' OR user_id = auth.uid())
- RLS: Authenticated INSERT/UPDATE/DELETE (own requests only)
```

#### 6. **sessions** (Booked Sessions)
```sql
Relationships:
- FK: listings(id) NULL - SET NULL
- FK: requests(id) NULL - SET NULL
- FK: auth.users(id) as provider_id - CASCADE
- FK: auth.users(id) as requester_id - CASCADE
- Referenced by: credit_locks, reviews, transactions

Columns:
- id (UUID, PK) - Session unique identifier
- listing_id (UUID, FK NULLABLE) - Source listing (if from listing)
- request_id (UUID, FK NULLABLE) - Source request (if from request)
- provider_id (UUID, FK) - User offering help
- requester_id (UUID, FK) - User requesting help
- scheduled_time (Timestamp) - Session scheduled time
- duration_minutes (Integer) - Session duration
- credits_amount (Integer) - Credits for this session
- status (Text) - 'pending'|'accepted'|'in_progress'|'completed'|'cancelled'
- provider_confirmed (Boolean) - Provider marked complete
- requester_confirmed (Boolean) - Requester marked complete
- provider_confirmed_at (Timestamp) - When provider confirmed
- requester_confirmed_at (Timestamp) - When requester confirmed
- message (Text) - Session notes/message
- cancellation_reason (Text) - Reason if cancelled
- created_at (Timestamp) - Booking creation date
- completed_at (Timestamp) - Completion date

Status Flow:
pending → accepted → [in_progress] → completed
                   ↘ cancelled

Constraints (enforced at database level):
- sessions_no_self_booking: CHECK (provider_id != requester_id)

Indexes:
- PRIMARY KEY: id
- FOREIGN KEY: listing_id, request_id, provider_id, requester_id
- COMPOSITE INDEX: idx_sessions_provider_status (provider_id, status)
- COMPOSITE INDEX: idx_sessions_requester_status (requester_id, status)
- INDEX: idx_sessions_scheduled_time (scheduled_time)

Security:
- RLS: Authenticated SELECT (only session participants)
- RLS: Authenticated INSERT (requester creates session)
- RLS: Authenticated UPDATE (participants can update)

Business Logic:
- Credits locked when session created (in credit_locks table)
- Both users must confirm for completion
- Credits transferred when both confirm
- Review eligible only after completion
```

#### 7. **credit_locks** (Credit Reservation)
```sql
Relationships:
- FK: auth.users(id) - CASCADE
- FK: sessions(id) - CASCADE

Columns:
- id (UUID, PK) - Lock unique identifier
- user_id (UUID, FK) - User whose credits are locked
- session_id (UUID, FK) - Associated session
- credits (Integer) - Amount of credits locked
- status (Text) - 'locked' | 'released' | 'transferred'
- expires_at (Timestamp) - Auto-expiry time (default: 72 hours from creation)
- created_at (Timestamp) - Lock creation date
- released_at (Timestamp) - When lock released/transferred

Purpose:
- Prevents user from spending credits that are pending in sessions
- When session pending: status = 'locked'
- When session cancelled: status = 'released'
- When session completed: status = 'transferred'

Indexes:
- PRIMARY KEY: id
- COMPOSITE INDEX: idx_credit_locks_session_status (session_id, status)

Security:
- RLS: Authenticated SELECT/INSERT/UPDATE (own locks only)

Constraint:
- Exactly one active lock per session
```

#### 8. **reviews** (Session Feedback)
```sql
Relationships:
- FK: sessions(id) - CASCADE
- FK: auth.users(id) as reviewer_id - CASCADE
- FK: auth.users(id) as reviewed_user_id - CASCADE

Columns:
- id (UUID, PK) - Review unique identifier
- session_id (UUID, FK) - Associated session
- reviewer_id (UUID, FK) - User writing review
- reviewed_user_id (UUID, FK) - User being reviewed
- rating (Integer) - 1-5 star rating
- comment (Text) - Optional review comment
- created_at (Timestamp) - Review creation date

Constraints (enforced at database level):
- rating: CHECK (rating >= 1 AND rating <= 5)
- reviews_session_reviewer_unique: UNIQUE (session_id, reviewer_id) - prevents duplicate reviews per session
- Can only review after session completed (7-day review window enforced in UI)

Triggers:
- ON INSERT: update_user_rating() recalculates profile.rating & total_reviews

Security:
- RLS: Public SELECT (anyone can view reviews)
- RLS: Authenticated INSERT (reviewer_id = auth.uid())

Indexes:
- PRIMARY KEY: id
- INDEX: reviewed_user_id (find reviews for a user)
- INDEX: session_id
- COMPOSITE INDEX: idx_reviews_session_reviewer (session_id, reviewer_id)
```

#### 9. **badges** (Achievement Definitions)
```sql
Relationships:
- Referenced by: user_badges

Columns:
- id (UUID, PK) - Badge unique identifier
- name (Text, UNIQUE) - Badge name
- slug (Text, UNIQUE) - URL-friendly identifier
- description (Text) - Achievement description
- icon (Text) - Lucide icon name
- color (Text) - Hex color code
- requirement_type (Text) - 'sessions_completed'|'streak'|'rating'|'early_adopter'
- requirement_value (Integer) - Value to unlock (depends on type)
- created_at (Timestamp) - Creation date

Predefined Badges:
1. First Session - sessions_completed: 1
2. Helper 10 - sessions_completed: 10
3. Helper 50 - sessions_completed: 50
4. 7 Day Streak - streak: 7
5. 30 Day Streak - streak: 30
6. Rising Star - rating: 45 (4.5 rating)
7. Top Rated - rating: 48 (4.8 rating)
8. Early Adopter - early_adopter: 1

Security:
- RLS: Public SELECT (anyone can view badges)
- No INSERT/UPDATE/DELETE for users (admin only)
```

#### 10. **user_badges** (Earned Achievements)
```sql
Relationships:
- FK: auth.users(id) - CASCADE
- FK: badges(id) - CASCADE

Columns:
- id (UUID, PK) - User badge unique identifier
- user_id (UUID, FK) - User who earned badge
- badge_id (UUID, FK) - Badge earned
- earned_at (Timestamp) - When badge was earned

Constraints:
- UNIQUE(user_id, badge_id) - User can't earn same badge twice

Auto-Award Conditions:
- On session completion: Check sessions_completed ≥ requirement
- On review: Check rating ≥ requirement
- On streak: Check current_streak ≥ requirement

Security:
- RLS: Public SELECT (anyone can view earned badges)
- RLS: Service role INSERT (automatic award system)
```

#### 11. **transactions** (Credit History)
```sql
Relationships:
- FK: auth.users(id) as user_id - CASCADE
- FK: auth.users(id) as other_user_id NULL - SET NULL
- FK: sessions(id) NULL - SET NULL

Columns:
- id (UUID, PK) - Transaction unique identifier
- user_id (UUID, FK) - User whose wallet affected
- other_user_id (UUID, FK NULLABLE) - Other party (if peer transaction)
- session_id (UUID, FK NULLABLE) - Associated session
- credits (Integer) - Amount (positive: earning, negative: spending)
- type (Text) - 'signup_bonus'|'earn'|'spend'|'refund'|'lock'|'unlock'
- description (Text) - Transaction description
- created_at (Timestamp) - Transaction date

Transaction Types:
- signup_bonus: Initial 10 credits (type: 'signup_bonus', credits: +10)
- earn: Completed session payment (type: 'earn', credits: +X)
- spend: Paid for session (type: 'spend', credits: -X)
- refund: Session cancelled (type: 'refund', credits: varies)
- lock: Credits locked for pending session (type: 'lock', credits: -X)
- unlock: Released from lock (type: 'unlock', credits: +X)

Audit Trail:
- Complete history of credit movements
- Prevents fraud through transparency
- Tracks who transferred credits to whom

Indexes:
- PRIMARY KEY: id
- INDEX: user_id (find user transactions)

Security:
- RLS: Authenticated SELECT (users view own transactions)
- RLS: Authenticated INSERT (system records transactions)
```

#### 12. **liza_conversations, liza_messages, liza_flashcard_sets, liza_flashcards, liza_quizzes, liza_quiz_questions, liza_quiz_attempts** (LIZA AI Tutor)

```
liza_conversations
- id (uuid, PK, default gen_random_uuid())
- user_id (uuid, FK -> auth.users.id, ON DELETE CASCADE)
- title (text, NOT NULL, default 'New chat')
- created_at (timestamptz, default now())
- updated_at (timestamptz, default now())

liza_messages
- id (uuid, PK)
- conversation_id (uuid, FK -> liza_conversations, CASCADE)
- role (text, CHECK role IN ('user','assistant','system'))
- content (text, NOT NULL)
- created_at (timestamptz, default now())

liza_flashcard_sets
- id (uuid, PK)
- user_id (uuid, FK -> auth.users, CASCADE)
- conversation_id (uuid, FK -> liza_conversations, ON DELETE SET NULL, nullable)
- title (text, default 'Flashcards')
- source_type (text, CHECK IN ('prompt','pdf','chat'))
- source_filename (text)
- created_at (timestamptz)

liza_flashcards
- id (uuid, PK)
- set_id (uuid, FK -> liza_flashcard_sets, CASCADE)
- front (text, NOT NULL), back (text, NOT NULL)
- position (integer, default 0)

liza_quizzes
- id (uuid, PK)
- user_id (uuid, FK -> auth.users, CASCADE)
- conversation_id (uuid, FK -> liza_conversations, SET NULL)
- title (text), source_type (text, CHECK), source_filename (text)
- question_count (integer, default 5)

liza_quiz_questions
- id (uuid, PK)
- quiz_id (uuid, FK -> liza_quizzes, CASCADE)
- question (text, NOT NULL)
- options (jsonb, NOT NULL)   -- array of 4 strings
- correct_index (integer, CHECK 0-3)
- explanation (text)
- position (integer)

liza_quiz_attempts
- id (uuid, PK)
- quiz_id (uuid, FK -> liza_quizzes, CASCADE)
- user_id (uuid, FK -> auth.users, CASCADE)
- answers (jsonb, default '[]')
- score (integer), total (integer)
- completed_at (timestamptz)

Indexes:
- (user_id, created_at DESC) on conversations, flashcard_sets, quizzes
- (conversation_id, created_at) on messages
- (set_id, position) on flashcards
- (quiz_id, position) on quiz_questions
- (user_id, completed_at DESC) on quiz_attempts

Security:
- RLS enabled on all 7 LIZA tables
- Owner-only SELECT/INSERT/UPDATE/DELETE via auth.uid() = user_id
- Nested tables (messages, flashcards, quiz_questions) enforce ownership through EXISTS subqueries on the parent row
```

### Key Database Constraints

| Constraint | Purpose | Implementation |
|-----------|---------|-----------------|
| Min/Max Credits | Prevent price exploits | CHECK in listings INSERT/UPDATE |
| Location Type | Limit session types | CHECK in listings (online/offline/both) |
| Session Status Flow | Enforce workflow | Atomic PostgreSQL RPC functions |
| Credit Balance Non-Negative | Prevent overdraft | CHECK constraint: `wallets_balance_non_negative` |
| Locked Credits Non-Negative | Prevent negative locks | CHECK constraint: `wallets_locked_non_negative` |
| No Self-Booking | Prevent booking own listings | CHECK constraint: `sessions_no_self_booking` |
| Unique Review Per Session | Prevent duplicate reviews | UNIQUE constraint: `reviews_session_reviewer_unique` |
| Unique Email | User uniqueness | UNIQUE in auth.users |
| Streak Calculation | Automatic streak tracking (2-day grace) | PostgreSQL trigger within `complete_session` |
| Rating Aggregation | Auto-update ratings | PostgreSQL trigger `update_user_rating()` |
| Badge Auto-Award | Earn badges on milestones | `award_badges()` function called by completion RPC |
| Credit Lock Expiry | Prevent permanent lock-ups | `expires_at` column with 72-hour default |
| RLS Policies | Data access control | 20+ RLS policies across tables |

### Database Normalization Analysis

Database normalization is the process of organizing a relational database to reduce data redundancy and improve data integrity. The SkillBarter schema follows normalization principles up to **Third Normal Form (3NF)** with intentional denormalization where performance demands it.

#### First Normal Form (1NF)

A table is in 1NF when:
- All columns contain atomic (indivisible) values
- Each row is uniquely identifiable by a primary key
- No repeating groups exist

**SkillBarter Compliance:**

| Table | 1NF Status | Notes |
|-------|-----------|-------|
| profiles | Partial | `skills_offered` is a PostgreSQL `TEXT[]` array. While arrays violate strict 1NF (non-atomic), PostgreSQL natively supports array types with indexing and querying. A separate `user_skills` junction table would be the fully normalized alternative. |
| wallets | Compliant | All columns are atomic; one row per user enforced by `UNIQUE(user_id)`. |
| listings | Compliant | All columns are scalar values. `location_type` stores a single enum-like string, not multiple values. |
| sessions | Compliant | All columns are atomic. Status is a single string value at any point in time. |
| categories | Compliant | All columns are atomic and each row is uniquely identified. |
| transactions | Compliant | All columns contain single values. Transaction type is a single enum string. |

**Design Decision - `skills_offered` Array:**
The `skills_offered TEXT[]` column in the `profiles` table is a deliberate trade-off. A fully normalized design would require:
```
profiles (id, name, email, ...)
skills (id, name)
user_skills (user_id FK, skill_id FK)
```
The array approach was chosen because:
- Skills are free-text tags, not from a controlled vocabulary
- No queries join on individual skills
- Simpler writes (single UPDATE vs. DELETE + re-INSERT on junction table)
- PostgreSQL GIN indexes support efficient array containment queries (`@>` operator)

#### Second Normal Form (2NF)

A table is in 2NF when:
- It satisfies 1NF
- Every non-key column depends on the **entire** primary key (no partial dependencies)

Since all SkillBarter tables use single-column surrogate primary keys (`id UUID`), partial dependencies are structurally impossible. 2NF violations only occur with composite primary keys where a non-key column depends on part of the key.

**SkillBarter Compliance:** All tables satisfy 2NF. The only table with a composite unique constraint is `user_badges(user_id, badge_id)`, but its primary key remains the single `id` column, and `earned_at` depends on the full combination of user and badge.

#### Third Normal Form (3NF)

A table is in 3NF when:
- It satisfies 2NF
- No non-key column depends on another non-key column (no transitive dependencies)

**SkillBarter Analysis:**

| Table | 3NF Status | Transitive Dependency | Justification |
|-------|-----------|----------------------|---------------|
| profiles | Violation | `rating` and `total_reviews` are derived from the `reviews` table. They transitively depend on `id` through the reviews data. | **Intentional denormalization.** Calculating AVG(rating) and COUNT(*) from reviews on every profile view would require expensive aggregate queries. The trigger `update_user_rating()` keeps these derived fields in sync automatically. |
| profiles | Violation | `sessions_completed` is a count derivable from `sessions` WHERE status = 'completed'. | **Intentional denormalization.** Same rationale as rating: avoids COUNT queries on every profile/badge check. Updated atomically during session completion. |
| profiles | Violation | `current_streak` and `longest_streak` are derived from session completion dates. | **Intentional denormalization.** Streak calculation requires scanning ordered session dates. Storing the computed value avoids this on every page load. |
| wallets | Violation | `total_earned` and `total_spent` are derivable from SUM of transactions. `locked_credits` is derivable from SUM of active credit_locks. | **Intentional denormalization.** Wallet balance queries happen on nearly every authenticated page load. Aggregating transactions each time is impractical. |
| listings | Compliant | `views_count` could be argued as derived, but it is a direct counter with no source table. | Fully dependent on the listing entity itself. |
| all others | Compliant | No transitive dependencies detected. | Clean 3NF structure. |

#### Boyce-Codd Normal Form (BCNF)

A table is in BCNF when:
- It satisfies 3NF
- Every determinant is a candidate key

All SkillBarter tables that satisfy 3NF also satisfy BCNF, because each table has a single candidate key (the `id` column) and no non-trivial functional dependencies where a non-key determines another column.

The `wallets` table has `UNIQUE(user_id)`, making `user_id` an alternate candidate key. Since `user_id` determines all other columns (just like `id` does), this does not violate BCNF.

#### Normalization Summary Table

| Normal Form | Requirement | SkillBarter Status |
|-------------|------------|-------------------|
| 1NF | Atomic values, unique rows | Met (with noted `TEXT[]` exception) |
| 2NF | No partial dependencies | Fully met (single-column PKs) |
| 3NF | No transitive dependencies | Met with intentional denormalization in `profiles` and `wallets` |
| BCNF | Every determinant is a candidate key | Met for all 3NF-compliant tables |

### ACID Properties & Transaction Handling

ACID (Atomicity, Consistency, Isolation, Durability) properties guarantee reliable database transactions. Here is how SkillBarter addresses each:

#### Atomicity

> A transaction is all-or-nothing. Either every operation in the transaction succeeds, or none of them take effect.

**Implementation in SkillBarter:**

All critical multi-step operations are wrapped in **atomic PostgreSQL `SECURITY DEFINER` functions** that execute within a single database transaction. The frontend calls these via `supabase.rpc()` -- if any step fails, the entire operation rolls back automatically.

**Five atomic RPC functions handle all credit-sensitive operations:**

1. **`book_session()`** -- Creates session + locks credits + updates wallet + records transaction atomically
2. **`complete_session()`** -- Handles dual confirmation, credit transfer (requester to provider), profile stat updates, streak calculation, and badge awards all in one transaction
3. **`cancel_session()`** -- Cancels session + releases locked credits + refunds wallet + records refund transaction
4. **`accept_request()`** -- Accepts help request + creates session + locks requester credits + updates request status
5. **`award_badges()`** -- Checks all badge requirement types (sessions_completed, streak, rating) and awards eligible badges using `ON CONFLICT DO NOTHING`

**Row-level locking** (`SELECT ... FOR UPDATE`) is used within these functions to prevent race conditions on concurrent wallet modifications:
```sql
SELECT * INTO v_wallet FROM wallets WHERE user_id = p_requester_id FOR UPDATE;
-- Wallet row is locked until transaction completes
```

**If any step fails** (e.g., CHECK constraint violation on negative balance), PostgreSQL automatically rolls back the entire function. No partial state is ever committed.

#### Consistency

> A transaction brings the database from one valid state to another. All constraints, triggers, and rules are satisfied.

**Enforced through:**
- **Foreign key constraints**: CASCADE and RESTRICT rules prevent orphaned records
- **CHECK constraints**: `rating BETWEEN 1 AND 5`, status enums
- **UNIQUE constraints**: One wallet per user, one badge earned per user per badge type
- **NOT NULL constraints**: Required fields enforced at database level
- **Triggers**: `handle_new_user()` ensures every auth user gets a profile, wallet, and welcome bonus atomically
- **RLS policies**: Prevent unauthorized state mutations

#### Isolation

> Concurrent transactions do not interfere with each other. Each transaction sees a consistent snapshot of the database.

**PostgreSQL default isolation level:** `READ COMMITTED` -- each statement within a transaction sees only data committed before that statement began.

**Relevance to SkillBarter:**
- **Credit balance reads**: A user checking their balance while another transaction is modifying it will see the committed balance, not a partial update
- **Concurrent bookings**: Atomic RPC functions use `SELECT ... FOR UPDATE` row-level locks on wallet rows, preventing concurrent modifications from causing double-spending or negative balances
- **Review triggers**: The `update_user_rating()` trigger recalculates the average within the same transaction as the INSERT, ensuring consistency
- **Session completion**: The `complete_session()` function locks both the session and wallet rows before transferring credits, ensuring no concurrent call can interfere

#### Durability

> Once a transaction is committed, it remains committed even in the event of a system failure.

**Handled by Supabase/PostgreSQL:**
- Write-ahead logging (WAL) ensures committed transactions survive crashes
- Supabase provides automated backups (daily for free tier, point-in-time recovery on paid plans)
- PostgreSQL `fsync` ensures data is written to disk before reporting commit success

### Indexing Strategy

Indexes accelerate query performance at the cost of additional storage and slower writes. SkillBarter uses indexes strategically on columns that appear in WHERE, JOIN, and ORDER BY clauses.

#### Index Inventory

| Table | Indexed Column(s) | Index Type | Rationale |
|-------|-------------------|-----------|-----------|
| profiles | `id` (PK) | B-tree (unique) | Primary key lookups for every profile fetch |
| wallets | `id` (PK) | B-tree (unique) | Primary key |
| wallets | `user_id` (UNIQUE) | B-tree (unique) | Wallet lookup by authenticated user on every page load |
| listings | `id` (PK) | B-tree (unique) | Listing detail page lookups |
| listings | `user_id` | B-tree | "My Listings" page filters by owner |
| listings | `category_id` | B-tree | Discover page filters by category |
| listings | `status` | B-tree | Discover page filters active listings |
| requests | `id` (PK) | B-tree (unique) | Request detail lookups |
| requests | `user_id` | B-tree | "My Requests" filtering |
| requests | `status` | B-tree | Browse open requests |
| sessions | `id` (PK) | B-tree (unique) | Session detail page |
| sessions | `(provider_id, status)` | B-tree (composite) | Provider's session list filtered by status tab |
| sessions | `(requester_id, status)` | B-tree (composite) | Requester's session list filtered by status tab |
| sessions | `scheduled_time` | B-tree | Sort and filter by scheduled time |
| reviews | `reviewed_user_id` | B-tree | Profile page loads all reviews for a user |
| reviews | `session_id` | B-tree | Check if review exists for a session |
| reviews | `(session_id, reviewer_id)` | B-tree (composite) | Fast duplicate check within atomic functions |
| credit_locks | `(session_id, status)` | B-tree (composite) | Fast lock lookup during session operations |
| transactions | `user_id` | B-tree | Wallet page loads transaction history |
| user_badges | `user_id` | B-tree | Profile/badges page loads earned badges |
| user_badges | `(user_id, badge_id)` | B-tree (unique) | Prevent duplicate badge awards |

#### Index Type Selection

- **B-tree (default)**: Used for equality (`=`) and range (`<`, `>`, `BETWEEN`) queries. Suitable for all current SkillBarter queries.
- **GIN (Generalized Inverted Index)**: Would be appropriate for `profiles.skills_offered` if array containment queries (`@>`) are added for skill-based search.
- **GiST / Full-text**: Not currently needed. Could be added for fuzzy text search on listing titles/descriptions if the search feature evolves beyond simple `ILIKE` patterns.

### Referential Integrity & Constraints

Referential integrity ensures that relationships between tables remain consistent. Every foreign key reference must point to an existing row in the parent table.

#### Foreign Key Actions

| Child Table | Foreign Key | Parent Table | ON DELETE | ON UPDATE | Rationale |
|-------------|------------|-------------|-----------|-----------|-----------|
| profiles | `id` | auth.users | CASCADE | CASCADE | Deleting an auth user removes their profile |
| wallets | `user_id` | auth.users | CASCADE | CASCADE | User deletion cleans up wallet |
| listings | `user_id` | profiles | CASCADE | CASCADE | User deletion removes their listings |
| listings | `category_id` | categories | RESTRICT | CASCADE | Cannot delete a category that has listings |
| requests | `user_id` | profiles | CASCADE | CASCADE | User deletion removes their requests |
| requests | `category_id` | categories | RESTRICT | CASCADE | Cannot delete a category with active requests |
| sessions | `listing_id` | listings | SET NULL | CASCADE | Listing deletion does not destroy session history |
| sessions | `request_id` | requests | SET NULL | CASCADE | Request deletion does not destroy session history |
| sessions | `provider_id` | profiles | CASCADE | CASCADE | Provider deletion cascades |
| sessions | `requester_id` | profiles | CASCADE | CASCADE | Requester deletion cascades |
| credit_locks | `user_id` | auth.users | CASCADE | CASCADE | Clean up locks on user deletion |
| credit_locks | `session_id` | sessions | CASCADE | CASCADE | Session deletion releases locks |
| reviews | `session_id` | sessions | CASCADE | CASCADE | Session deletion removes its reviews |
| reviews | `reviewer_id` | profiles | CASCADE | CASCADE | Reviewer deletion removes their reviews |
| reviews | `reviewed_user_id` | profiles | CASCADE | CASCADE | Reviewed user deletion removes reviews about them |
| user_badges | `user_id` | auth.users | CASCADE | CASCADE | User deletion removes earned badges |
| user_badges | `badge_id` | badges | CASCADE | CASCADE | Badge deletion removes all awards of that badge |
| transactions | `user_id` | auth.users | CASCADE | CASCADE | User deletion removes transaction history |
| transactions | `other_user_id` | auth.users | SET NULL | CASCADE | Other user deletion preserves transaction but nullifies reference |
| transactions | `session_id` | sessions | SET NULL | CASCADE | Session deletion preserves transaction record |

#### Cascade Deletion Chain

When an `auth.users` record is deleted, the following cascade occurs:
```
auth.users DELETE
  ├─ profiles CASCADE
  │    ├─ listings CASCADE
  │    │    └─ sessions SET NULL (listing_id becomes NULL)
  │    ├─ requests CASCADE
  │    │    └─ sessions SET NULL (request_id becomes NULL)
  │    ├─ sessions CASCADE (as provider or requester)
  │    │    ├─ credit_locks CASCADE
  │    │    ├─ reviews CASCADE
  │    │    └─ transactions SET NULL (session_id becomes NULL)
  │    └─ reviews CASCADE (as reviewer or reviewed_user)
  ├─ wallets CASCADE
  ├─ user_badges CASCADE
  └─ transactions CASCADE (as user_id)
      └─ transactions SET NULL (as other_user_id for counterparty records)
```

### Denormalization Decisions

While normalization reduces redundancy, SkillBarter intentionally denormalizes specific fields for performance. Each decision is documented below with its trade-off analysis.

| Denormalized Field | Table | Normalized Alternative | Read Frequency | Write Frequency | Trade-off |
|-------------------|-------|----------------------|----------------|-----------------|-----------|
| `rating` | profiles | `SELECT AVG(rating) FROM reviews WHERE reviewed_user_id = ?` | Every profile view, listing card, search result | Only on new review (trigger) | Avoids aggregate query on high-traffic pages |
| `total_reviews` | profiles | `SELECT COUNT(*) FROM reviews WHERE reviewed_user_id = ?` | Same as rating | Same as rating | Bundled with rating update |
| `sessions_completed` | profiles | `SELECT COUNT(*) FROM sessions WHERE (provider_id = ? OR requester_id = ?) AND status = 'completed'` | Profile view, badge checks, dashboard | On session completion only | Avoids scanning sessions table |
| `current_streak` / `longest_streak` | profiles | Compute from ordered session dates | Profile view, badge checks | On session completion | Complex date arithmetic avoided on reads |
| `balance` / `locked_credits` / `total_earned` / `total_spent` | wallets | Compute from SUM of transactions grouped by type | Every authenticated page (header balance) | On booking, completion, cancellation | Most frequently read data in the system |
| `views_count` | listings | Separate `listing_views` table with COUNT | Every listing card render | On each listing detail page visit | Avoids JOIN + COUNT for browse pages |

**Consistency Mechanism:** All denormalized fields are kept in sync through PostgreSQL triggers (`update_user_rating()`, `handle_new_user()`) and **atomic server-side RPC functions** (`complete_session()`, `cancel_session()`, `book_session()`). The triggers execute within the same transaction as the triggering INSERT/UPDATE, and the RPC functions update all related denormalized fields atomically within a single transaction -- ensuring the denormalized values are never stale after a committed write.

### Database Triggers & Functions

PostgreSQL triggers and SECURITY DEFINER functions automate critical operations that must happen reliably without depending on application code. All credit-sensitive operations run as atomic server-side functions called via `supabase.rpc()`.

#### `handle_new_user()` -- Signup Automation (Trigger)

```
Event:    AFTER INSERT ON auth.users
Timing:   Fires once per new user registration
Security: SECURITY DEFINER (runs with table owner privileges)

Operations:
  1. INSERT INTO profiles (id, name, email) using auth metadata
  2. INSERT INTO wallets (user_id, balance: 10, total_earned: 10)
  3. INSERT INTO transactions (type: 'signup_bonus', credits: +10)
  4. INSERT INTO user_badges (badge: 'early-adopter')
```

This trigger ensures that every authenticated user has a complete set of associated records regardless of whether the frontend correctly executes post-signup logic.

#### `update_user_rating()` -- Rating Aggregation (Trigger)

```
Event:    AFTER INSERT ON reviews
Timing:   Fires once per new review
Security: SECURITY DEFINER

Operations:
  1. SELECT AVG(rating), COUNT(*) FROM reviews WHERE reviewed_user_id = NEW.reviewed_user_id
  2. UPDATE profiles SET rating = avg_result, total_reviews = count_result
```

This trigger maintains the denormalized `rating` and `total_reviews` fields in the `profiles` table.

#### `book_session()` -- Atomic Session Booking (RPC Function)

```
Called via: supabase.rpc('book_session', { p_listing_id, p_provider_id, p_requester_id, ... })
Security:  SECURITY DEFINER
Returns:   UUID (new session ID)

Operations (all atomic):
  1. SELECT wallet FOR UPDATE (lock requester wallet row)
  2. Validate balance >= credits_amount
  3. INSERT INTO sessions (status: 'pending')
  4. INSERT INTO credit_locks (status: 'locked', expires_at: NOW() + 72h)
  5. UPDATE wallets SET locked_credits += credits_amount
  6. INSERT INTO transactions (type: 'lock')
```

Prevents race conditions via row-level locking. If balance check fails, entire operation rolls back.

#### `complete_session()` -- Atomic Session Completion (RPC Function)

```
Called via: supabase.rpc('complete_session', { p_session_id, p_user_id })
Security:  SECURITY DEFINER
Returns:   TEXT ('confirmed' | 'completed')

Operations (all atomic):
  1. SELECT session FOR UPDATE (lock session row)
  2. Set caller's confirmation flag (provider_confirmed or requester_confirmed)
  3. If both confirmed:
     a. UPDATE sessions SET status = 'completed', completed_at = NOW()
     b. SELECT requester wallet FOR UPDATE, deduct credits
     c. SELECT provider wallet FOR UPDATE, add credits
     d. UPDATE credit_locks SET status = 'transferred'
     e. INSERT transactions for both users (spend + earn)
     f. UPDATE profiles: sessions_completed++, streak calculation (2-day grace)
     g. CALL award_badges() for provider
```

Handles the full dual-confirmation flow. Credits only transfer when both parties confirm.

#### `cancel_session()` -- Atomic Session Cancellation (RPC Function)

```
Called via: supabase.rpc('cancel_session', { p_session_id, p_user_id })
Security:  SECURITY DEFINER
Returns:   TEXT ('cancelled')

Operations (all atomic):
  1. SELECT session FOR UPDATE
  2. UPDATE sessions SET status = 'cancelled', cancellation_reason
  3. SELECT credit_lock FOR UPDATE
  4. UPDATE credit_locks SET status = 'released'
  5. UPDATE wallets: locked_credits -= credits, balance += credits (refund)
  6. INSERT transactions (type: 'refund')
```

#### `accept_request()` -- Atomic Request Acceptance (RPC Function)

```
Called via: supabase.rpc('accept_request', { p_request_id, p_provider_id, p_scheduled_time })
Security:  SECURITY DEFINER
Returns:   UUID (new session ID)

Operations (all atomic):
  1. SELECT request FOR UPDATE
  2. Validate request status = 'open'
  3. SELECT requester wallet FOR UPDATE, validate balance
  4. INSERT INTO sessions (provider = caller, requester = request owner)
  5. INSERT INTO credit_locks
  6. UPDATE wallets (lock requester credits)
  7. INSERT INTO transactions (type: 'lock')
  8. UPDATE requests SET status = 'accepted'
```

#### `award_badges()` -- Badge Eligibility Checker (RPC Function)

```
Called by: complete_session() internally
Security:  SECURITY DEFINER

Operations:
  1. Fetch user's current sessions_completed, current_streak, rating
  2. For each badge in badges table:
     - Compare requirement_type and requirement_value against user stats
     - INSERT INTO user_badges ON CONFLICT DO NOTHING (idempotent)
  3. Handles all badge types: sessions_completed, streak, rating, early_adopter
```

### Entity Relationship Cardinalities

| Relationship | Cardinality | Description |
|-------------|-------------|-------------|
| auth.users : profiles | 1 : 1 | Each user has exactly one profile |
| auth.users : wallets | 1 : 1 | Each user has exactly one wallet |
| profiles : listings | 1 : N | A user can create many listings |
| profiles : requests | 1 : N | A user can create many requests |
| profiles : sessions (as provider) | 1 : N | A user can provide many sessions |
| profiles : sessions (as requester) | 1 : N | A user can request many sessions |
| listings : sessions | 1 : N | A listing can generate many sessions |
| requests : sessions | 1 : N | A request can generate many sessions |
| categories : listings | 1 : N | A category contains many listings |
| categories : requests | 1 : N | A category contains many requests |
| sessions : reviews | 1 : N | A session can have up to 2 reviews (one per participant) |
| sessions : credit_locks | 1 : 1 | Each session has exactly one credit lock |
| sessions : transactions | 1 : N | A session generates multiple transaction records |
| badges : user_badges | 1 : N | A badge can be earned by many users |
| profiles : user_badges | 1 : N | A user can earn many badges |
| user_badges | M : N | Junction table resolving the many-to-many between profiles and badges |

### Data Dictionary

A complete reference of all columns across all tables, their data types, constraints, and business meaning.

#### Core Data Types Used

| PostgreSQL Type | Usage | Example |
|----------------|-------|---------|
| `UUID` | All primary keys and foreign keys | `gen_random_uuid()` |
| `TEXT` | Variable-length strings | names, descriptions, emails |
| `TEXT[]` | Array of strings | `skills_offered` in profiles |
| `INTEGER` | Whole numbers | credits, counts, durations |
| `NUMERIC(3,2)` | Fixed-precision decimal | rating (e.g., 4.75) |
| `TIMESTAMPTZ` | Timestamp with timezone | created_at, scheduled_time |
| `DATE` | Calendar date without time | last_session_date |
| `BOOLEAN` | True/false | provider_confirmed, requester_confirmed |

#### Status Enums (Application-Level)

Rather than PostgreSQL ENUM types, SkillBarter uses TEXT columns with application-level validation for flexibility in adding new statuses without migrations.

| Entity | Status Values | Lifecycle |
|--------|--------------|-----------|
| Listing | `active`, `paused`, `deleted` | active -> paused -> active (toggle) or active -> deleted |
| Request | `open`, `accepted`, `completed`, `cancelled` | open -> accepted -> completed, or open -> cancelled |
| Session | `pending`, `accepted`, `in_progress`, `completed`, `cancelled` | pending -> accepted -> in_progress -> completed, or any -> cancelled |
| Credit Lock | `locked`, `released`, `transferred` | locked -> released (cancel) or locked -> transferred (complete) |
| Transaction | `signup_bonus`, `earn`, `spend`, `refund`, `lock`, `unlock` | Immutable once created (append-only ledger) |

---

## Data Flow & Workflows

### 1. User Signup Flow

```
User visits app
    ↓
Clicks "Sign Up"
    ↓
Enters: email, password, name, university
    ↓
Frontend validation (email format, password strength)
    ↓
supabase.auth.signUp({email, password, data: {name}})
    ↓
Supabase creates auth.users record
    ↓
Trigger: handle_new_user()
    ├─ INSERT profiles table (id, name, email)
    ├─ INSERT wallets table (balance: 10, total_earned: 10)
    ├─ INSERT transactions (type: 'signup_bonus', credits: +10)
    └─ INSERT user_badges (badge: 'early-adopter')
    ↓
Frontend receives auth.session
    ↓
AuthContext updates:
  - user = auth user
  - profile = profile data
  - wallet = wallet data
    ↓
Redirect to /dashboard
    ↓
Welcome message: "You received 10 welcome credits!"
```

### 2. Create Listing Flow

```
Authenticated user on /create-listing
    ↓
Select category → Display category min/max credit range
    ↓
Enter:
  - Title
  - Description
  - Price (default: middle of range)
  - Duration (minutes)
  - Location type (online/offline/both)
  - Availability
    ↓
Frontend validation
    ├─ Price >= category.min AND Price <= category.max
    ├─ Title not empty
    ├─ Description length check
    └─ Duration > 0
    ↓
Click "Create Listing"
    ↓
INSERT into listings:
  {
    user_id: auth.uid(),
    category_id: selected_category,
    title, description, price_credits, duration_minutes,
    location_type, availability,
    status: 'active'
  }
    ↓
RLS Policy Check: auth.uid() = user_id ✓
    ↓
Database INSERT succeeds
    ↓
Toast: "Listing created successfully!"
    ↓
Redirect to /my-listings
    ↓
Listing appears in:
  - User's /my-listings page
  - /discover page (browsable by others)
```

### 3. Browse & Book Session Flow

```
User on /discover (listing browse with search, filters, pagination)
    ↓
Query: SELECT * FROM listings WHERE status = 'active'
  + search (ILIKE on title AND description, debounced 300ms)
  + filters: category, location_type (online/in_person/both)
  + sort: newest, price_low, price_high, rating
  + pagination: 18 results per page with "Load More"
    ↓
Display listing cards with:
  - Provider name & rating (or "New Provider" label if < 3 reviews)
  - Category & icon
  - Price (in credits)
  - Duration
  - Location type
    ↓
User clicks listing → Navigate to /listing-detail/[id]
    ↓
Load listing data + provider profile + reviews
    ↓
User clicks "Book Now"
    ↓
Modal opens:
  - Date picker (future dates only)
  - Time picker
  - Optional message
    ↓
Frontend validation:
  - scheduled_time > now() ✓
  - wallet.balance >= price_credits ✓
  - user not self-booking ✓ (also enforced by DB CHECK constraint)
    ↓
ATOMIC RPC CALL:
  supabase.rpc('book_session', {
    p_listing_id, p_provider_id, p_requester_id,
    p_scheduled_time, p_duration_minutes,
    p_credits_amount, p_message
  })
    ↓
Server-side (all atomic in one transaction):
  1. Lock requester wallet row (FOR UPDATE)
  2. Validate balance >= credits
  3. INSERT session (status: 'pending')
  4. INSERT credit_lock (status: 'locked', expires_at: +72h)
  5. UPDATE wallet (locked_credits += credits)
  6. INSERT transaction (type: 'lock')
    ↓
Toast: "Booking request sent!"
    ↓
Session status: PENDING → Awaits provider acceptance
    ↓
If rejected/cancelled by either party:
  supabase.rpc('cancel_session', { p_session_id, p_user_id })
  → Atomically: cancel session + release lock + refund wallet
```

### 4. Session Completion & Credit Transfer

```
Session scheduled_time + duration_minutes passes
    ↓
User visits /session-detail/[id]
    ↓
Shows: "Confirm Completion" button (enabled after scheduled_time + duration)
    ↓
Either user clicks "Confirm Completion"
    ↓
ATOMIC RPC CALL:
  supabase.rpc('complete_session', { p_session_id, p_user_id })
    ↓
Server-side (all atomic in one transaction):
  1. Lock session row (FOR UPDATE)
  2. Set caller's confirmation flag:
     - Provider call → provider_confirmed = true, provider_confirmed_at = now()
     - Requester call → requester_confirmed = true, requester_confirmed_at = now()
  3. If only one confirmed → return 'confirmed' (waiting for other party)
  4. If BOTH now confirmed → execute full completion:
     a. UPDATE sessions SET status = 'completed', completed_at = now()
     b. Lock requester wallet (FOR UPDATE):
        - locked_credits -= credits_amount
        - balance -= credits_amount
        - total_spent += credits_amount
     c. Lock provider wallet (FOR UPDATE):
        - balance += credits_amount
        - total_earned += credits_amount
     d. UPDATE credit_locks SET status = 'transferred'
     e. INSERT transactions for requester (type: 'spend')
     f. INSERT transactions for provider (type: 'earn')
     g. UPDATE profiles (provider):
        - sessions_completed += 1
        - Streak calculation with 2-day grace period:
          IF last_session_date >= today - 2 days → current_streak += 1
          ELSE → current_streak = 1
          IF current_streak > longest_streak → update longest_streak
          last_session_date = today()
     h. CALL award_badges(provider_id):
        - Check all badge types (sessions_completed, streak, rating)
        - INSERT ... ON CONFLICT DO NOTHING for eligible badges
  5. Return 'completed'
    ↓
UI refreshes:
  - "Session Complete!" toast
  - Review section appears (7-day review window)
  - Updated wallet balance
  - "New Provider" label removed once provider has 3+ reviews
```

### 5. Review & Rating Flow

```
Session status = 'completed'
    ↓
Both users can post review
    ↓
User clicks "Write Review"
    ↓
Modal: Rate (1-5 stars) + Optional comment
    ↓
User submits
    ↓
INSERT review:
  {
    session_id,
    reviewer_id: auth.uid(),
    reviewed_user_id: [other user],
    rating,
    comment
  }
    ↓
RLS Check: reviewer_id = auth.uid() ✓
    ↓
Trigger: update_user_rating()
  UPDATE profiles (reviewed_user)
    SET rating = AVG(all reviews),
        total_reviews = COUNT(reviews)
    ↓
Provider's profile updated:
  - New average rating displayed
  - Review count updated
  - New rating affects badge eligibility
    ↓
Check badges:
  - rating >= 4.5? → Award "Rising Star"
  - rating >= 4.8? → Award "Top Rated"
    ↓
Toast: "Review posted!"
```

### 6. Accept Help Request Flow

```
User posts help request on /create-request:
  {
    title: "Help with Python Assignment",
    description: "Need guidance on OOP concepts",
    category_id: "teaching-session",
    credits_offered: 10,
    duration_minutes: 60,
    status: 'open'
  }
    ↓
Other user browses /requests (with debounced search on title + description)
    ↓
Sees open requests with:
  - Requester name
  - Category & credits offered
  - "Accept Request" button
    ↓
Helper clicks "Accept Request"
    ↓
Modal opens with date + time picker for scheduling
    ↓
ATOMIC RPC CALL:
  supabase.rpc('accept_request', {
    p_request_id, p_provider_id, p_scheduled_time
  })
    ↓
Server-side (all atomic in one transaction):
  1. Lock request row (FOR UPDATE), validate status = 'open'
  2. Lock requester wallet (FOR UPDATE), validate balance >= credits_offered
  3. INSERT session (provider = caller, requester = request owner)
  4. INSERT credit_lock (status: 'locked')
  5. UPDATE wallet (lock requester credits)
  6. INSERT transaction (type: 'lock')
  7. UPDATE request SET status = 'accepted'
    ↓
Return: new session UUID
    ↓
Toast: "Request accepted! Session scheduled."
```

---

## Feature Specifications

### Core Features Implemented

#### 1. User Management
- **Sign Up**: Email/password registration with welcome bonus
- **Sign In**: Email/password + Google OAuth
- **Profile**: Editable name, bio, university, skills, avatar
- **Public Profiles**: View other users' stats, reviews, badges
- **Settings**: Password change, notification preferences

#### 2. Skill Marketplace
- **Create Listings**: Offer skills with pricing, duration, location
- **Browse Listings**: Search, filter by category, sort by price/rating
- **Listing Management**: Edit, pause, delete own listings
- **Category System**: 6 predefined categories with auto-set min/max prices
- **Pricing Logic**: Frontend validation ensures prices within category bounds

#### 3. Help Request System
- **Post Requests**: Request help with credit offer
- **Browse Requests**: Browse open requests by category
- **Accept Requests**: Helpers can claim open requests
- **Request Lifecycle**: open → accepted → completed → closed

#### 4. Session Management
- **Atomic Booking**: Select date/time/message; entire booking (session + credit lock + wallet update) executes atomically via server-side RPC
- **Status Tracking**: pending → accepted → in_progress → completed
- **Dual Confirmation**: Both users must confirm completion; credits transfer only when both confirm (atomic)
- **Cancellation**: Either user can cancel with reason; credits released atomically via RPC
- **Session History**: View all sessions by status
- **Confirmation Timing**: Confirm button enabled only after scheduled_time + session duration has passed

#### 5. Credit System
- **Signup Bonus**: 10 credits on account creation
- **Atomic Credit Locking**: Credits reserved when booking via server-side RPC with row-level locks
- **Atomic Credit Transfer**: Automatic transfer on dual confirmation via `complete_session()` RPC
- **Ledger View**: Transaction history with pagination (30 per page) and "Load More"
- **Balance Display**: Available + locked + earned/spent stats
- **Locked Credits Breakdown**: Expandable section showing each active lock with session details and expiry warnings
- **Lock Expiry**: Credit locks auto-expire after 72 hours (configurable via `expires_at` column)
- **Database Constraints**: CHECK constraints prevent negative balances at the database level

#### 6. Wallet & Transactions
- **Real-time Balance**: Immediate wallet updates after RPC calls
- **Transaction Types**: signup_bonus, earn, spend, refund, lock, unlock
- **Detailed History**: Track all credit movements with descriptions, paginated (30 per page)
- **Stats Display**: Total earned, total spent, current balance
- **Locked Credits Panel**: Shows active credit locks with session title, counterparty name, scheduled time, and "Expiring soon" warnings for locks within 12 hours of expiry

#### 7. Review & Rating System
- **Post Reviews**: Rate (1-5 stars) + comment after session (7-day review window)
- **Automatic Aggregation**: Profile rating auto-calculated from reviews via trigger
- **Duplicate Prevention**: UNIQUE constraint on (session_id, reviewer_id) at database level
- **Review Count**: Display on profile
- **Review Visibility**: Public reviews visible on provider profile
- **"New Provider" Label**: Providers with < 3 reviews show "New Provider" instead of rating stars

#### 8. Gamification
- **Badges**: 8 achievement badges for milestones
- **Badge Types**: Sessions completed, streak days, rating, early adopter
- **Auto-Award**: All badges automatically awarded via `award_badges()` RPC function called during session completion (not just early adopter -- all badge types are now functional)
- **Badge Display**: Show earned badges on profile
- **Progress**: Display locked badges with progress toward unlock
- **Idempotent Awards**: Uses `INSERT ... ON CONFLICT DO NOTHING` to safely attempt awards without errors

#### 9. Streak System
- **Current Streak**: Days of consecutive session activity
- **Longest Streak**: All-time streak record
- **Auto-Calculate**: Calculated atomically within `complete_session()` RPC
- **2-Day Grace Period**: Streak only resets after 2 consecutive inactive days (not 1), making streaks achievable for real student schedules
- **Streak Freeze**: `streak_freeze_used_at` column supports one monthly freeze to protect long streaks during exams

#### 10. Search & Discovery
- **Debounced Search**: Text search by title AND description with 300ms debounce (Discover and Requests pages)
- **Filter**: By category, location type (online/in_person/both)
- **Sort**: By price (low/high), rating, newest
- **Pagination**: 18 results per page with "Load More" button and total count display
- **Clear Filters**: One-click filter reset
- **Browse Requests**: Similar search/filter capability with debounced search on title + description

#### 11. Mobile Responsiveness
- **Responsive Design**: Works on mobile, tablet, desktop
- **Mobile Navigation**: Bottom nav bar with 4 primary items + expandable "More" menu for secondary pages (Wallet, Badges, Listings, Requests, Settings)
- **Touch-Friendly**: Minimum 48px touch targets on mobile nav, 44px on sidebar
- **Optimized Layouts**: Single-column on mobile, multi-column on desktop
- **Accessibility**: ARIA landmarks, `aria-current="page"`, `aria-expanded` on menus, skip-to-content link

#### 12. Theme System
- **Dark Mode**: Full dark theme support
- **Light Mode**: Bright theme
- **Persistent**: Theme preference saved locally
- **System Match**: Respects system theme preference

#### 13. LIZA -- AI Learning Assistant
- **Personalized Chat**: Streaming conversational AI that uses the user's profile (name, skills offered, skills wanted, sessions, rating, streak) as live system context on every request. No model or vendor name is exposed in the UI -- the assistant presents simply as LIZA.
- **Conversation History**: Chats persist in Supabase and are grouped by Today / This Week / Older in a left sidebar. Users can create, select, and delete conversations; auto-generated titles are produced server-side after the first reply.
- **Flashcard Generation**: Generates 3-20 flip-card decks from three sources -- a user-written prompt, an uploaded PDF/TXT (up to 2 MB, parsed client-side via pdfjs-dist), or the current chat context. Cards store `front`, `back`, and position in `liza_flashcards`.
- **Flashcard Viewer**: Modal with flip animation, progress bar, prev/next navigation, shuffle, and restart controls.
- **Quiz Generation**: Generates 3-30 multiple-choice questions with exactly 4 options, a correct index, and a written explanation per question. Same three source modes as flashcards.
- **Quiz Runner**: One-question-at-a-time UI with A-D options, progress bar, disabled-Next until selection, and a final results screen showing every correct answer with its explanation. Attempts are stored in `liza_quiz_attempts` with score, total, and the user's answer array.
- **File Upload Pipeline**: Files validated to ≤ 2 MB client-side. PDFs are extracted in-browser using `pdfjs-dist` with its worker loaded via a Vite `?url` import. Text is truncated to 30,000 characters before transmission to keep Edge Function payloads small.
- **Server-Side AI Proxy**: A single Supabase Edge Function (`liza-ai`) handles three actions (`chat`, `generate_flashcards`, `generate_quiz`) using OpenRouter's fallback routing across free models (`nvidia/nemotron-3-super-120b-a12b:free` primary, `google/gemma-4-31b-it:free` fallback). The function verifies the caller's JWT, builds a persona prompt from the profile, calls OpenRouter, and either streams tokens back via Server-Sent Events (chat) or validates strict JSON output and persists to the database (flashcards/quizzes).
- **Security**: OpenRouter API key stored as Edge Function secret (never reaches the browser). All seven LIZA tables have RLS enabled with per-user policies; nested tables (messages, flashcards, quiz questions) use EXISTS subqueries to verify ownership through the parent row.

### Dashboard Features
- **Overview Cards**: Quick stats (balance, sessions, requests)
- **Upcoming Sessions**: Next scheduled sessions
- **Recent Activity**: Latest bookings, reviews, streaks
- **Quick Actions**: Create listing, browse, make request

### Advanced Features
- **Atomic Booking**: Single RPC call handles session creation, credit locking, and wallet updates atomically
- **Real-time Updates**: Wallet balance updates immediately after RPC calls
- **Smart Notifications**: Toast alerts for key actions
- **Error Boundaries**: React class component catches rendering errors with recovery UI
- **Shimmer Skeletons**: Loading states use shimmer animation effect for visual polish
- **Password UX**: Show/hide toggle on all password fields; strength indicator on signup (4 levels: Too short, Weak, Medium, Strong)
- **Reduced Motion**: All animations disabled automatically for users with `prefers-reduced-motion` OS setting
- **Form Accessibility**: ARIA roles on error messages, helper text support, proper label associations

---

## Technology Stack

### Frontend Technologies

```
React 18.3.1
├─ Component framework
├─ 18 page components
├─ 14+ reusable UI components
└─ Hooks & Context API for state

TypeScript 5.5
├─ Type safety
├─ Database type generation
└─ Component prop types

React Router v7.13
├─ Page navigation
├─ Public/Private route guards
├─ URL-based state

Tailwind CSS v3.4
├─ Utility-first styling
├─ Dark mode support
├─ Responsive design
└─ Custom theme configuration

Lucide React
├─ Icon library
├─ 300+ icons available
└─ Consistent design

Vite v5.4
├─ Build tool
├─ Hot module replacement (HMR)
├─ Optimized production builds
└─ Fast development server
```

### Backend Technologies

```
Supabase
├─ PostgreSQL database
├─ Managed infrastructure
└─ Real-time capabilities

PostgreSQL
├─ Relational database
├─ 11 core tables
├─ Triggers & functions
├─ Indexes for performance
└─ Foreign key constraints

Supabase Auth
├─ Email/password authentication
├─ Google OAuth integration
├─ Session management
├─ User management

Row Level Security (RLS)
├─ 20+ security policies
├─ User data isolation
├─ Public/authenticated rules
└─ Service role for system operations

PostgreSQL Triggers
├─ handle_new_user() - signup bonus
└─ update_user_rating() - rating aggregation

Atomic RPC Functions (SECURITY DEFINER)
├─ book_session() - atomic session booking with credit lock
├─ complete_session() - dual confirmation + credit transfer + streak + badges
├─ cancel_session() - atomic cancellation with credit refund
├─ accept_request() - atomic request acceptance with session creation
└─ award_badges() - check all badge types and award eligible
```

### State Management

```
React Context API
├─ AuthContext
│  ├─ user (auth user)
│  ├─ profile (extended data)
│  ├─ wallet (credit balance)
│  └─ loading state
│
└─ ThemeContext
   ├─ isDark (theme mode)
   └─ toggle function

Component State
├─ useState for local state
├─ Form inputs
├─ Modal/dropdown open states
└─ Loading states

Direct Queries
├─ Supabase queries in useEffect
├─ Real-time subscriptions
└─ Manual cache invalidation
```

### Development Tools

```
ESLint
├─ Code quality linting
├─ React hooks rules
└─ TypeScript support

TypeScript Compiler (tsc)
├─ Type checking
├─ No emit mode for verification
└─ Strict mode enabled

PostCSS
├─ CSS processing
├─ Autoprefixer for compatibility
└─ Tailwind integration

npm/Node.js
├─ Package management
├─ Build scripts
└─ Development server
```

---

## Component Architecture

### Component Hierarchy

```
App (Root with Router, wrapped in ErrorBoundary)
├─ PrivateRoute (Protected pages)
│  ├─ Layout wrapper (skip link, ARIA landmarks, ErrorBoundary)
│  │  ├─ Sidebar (desktop nav with aria-labels)
│  │  ├─ Header
│  │  ├─ MobileNav (4 items + "More" expandable menu)
│  │  └─ Page Component (wrapped in ErrorBoundary)
│  │     ├─ Dashboard
│  │     ├─ Discover
│  │     ├─ CreateListing
│  │     ├─ MyListings
│  │     ├─ Requests
│  │     ├─ CreateRequest
│  │     ├─ Sessions
│  │     ├─ SessionDetail
│  │     ├─ ListingDetail
│  │     ├─ Wallet
│  │     ├─ Badges
│  │     ├─ Profile
│  │     ├─ Settings
│  │     └─ [others]
│  │
│  └─ UI Components (as needed)
│     ├─ Button
│     ├─ Card
│     ├─ Avatar
│     ├─ Badge
│     ├─ Modal
│     ├─ Input
│     ├─ Textarea
│     ├─ Select
│     ├─ Toast
│     ├─ StarRating
│     ├─ RingChart
│     ├─ Skeleton
│     └─ GlassPanel
│
└─ PublicRoute (Auth pages)
   ├─ Home
   ├─ Login
   ├─ Signup
   ├─ About
   └─ FAQ
```

### Component Patterns

#### Page Components
- One per major feature
- Fetch own data in useEffect
- Composition of smaller components
- Handle loading/error states

#### UI Components
- Single responsibility
- Reusable across pages
- Props-driven configuration
- Consistent styling

#### Layout Components
- Wrapper pattern
- Persistent header/nav
- Responsive breakpoints
- Theme context integration

#### Hooks
- Custom hooks for reusable logic
- useInView for scroll animations
- useCountUp for number animations
- React hooks (useState, useEffect, useContext)

---

## API & Database Operations

### Query Patterns

#### Listing Browse (Discover Page)
```typescript
// Get active listings with provider details, paginated
const { data: listings, count } = await supabase
  .from('listings')
  .select('*, profiles!listings_user_id_profiles_fkey(*), categories(*)', { count: 'exact' })
  .eq('status', 'active')
  .ilike('title', `%${search}%`)       // debounced search
  .order('created_at', { ascending: false })
  .range(0, PAGE_SIZE - 1)             // pagination
```

#### User Profile Fetch
```typescript
// Get profile with related data
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .maybeSingle()

// Get user's badges
const { data: badges } = await supabase
  .from('user_badges')
  .select('*, badges(*)')
  .eq('user_id', userId)
```

#### Session Management
```typescript
// Get user's sessions
const { data: sessions } = await supabase
  .from('sessions')
  .select('*, provider:provider_id(*), requester:requester_id(*)')
  .or(`provider_id.eq.${userId},requester_id.eq.${userId}`)
  .order('scheduled_time', { ascending: false })
```

#### Wallet Query
```typescript
// Get wallet
const { data: wallet } = await supabase
  .from('wallets')
  .select('*')
  .eq('user_id', userId)
  .maybeSingle()

// Get transactions
const { data: transactions } = await supabase
  .from('transactions')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
  .limit(50)
```

#### Atomic Session Booking (via RPC)
```typescript
// Single atomic call replaces 4 separate queries
const { data: sessionId, error } = await supabase.rpc('book_session', {
  p_listing_id: listing.id,
  p_provider_id: listing.user_id,
  p_requester_id: user.id,
  p_scheduled_time: scheduledTime.toISOString(),
  p_duration_minutes: listing.duration_minutes,
  p_credits_amount: listing.price_credits,
  p_message: bookingMessage,
});
// Server-side: creates session + credit_lock + updates wallet + records transaction atomically
```

#### Atomic Session Completion (via RPC)
```typescript
// Single atomic call replaces 7+ separate queries
const { data: result, error } = await supabase.rpc('complete_session', {
  p_session_id: session.id,
  p_user_id: user.id,
});
// Returns 'confirmed' (waiting for other party) or 'completed' (both confirmed, credits transferred)
```

#### Atomic Session Cancellation (via RPC)
```typescript
const { data, error } = await supabase.rpc('cancel_session', {
  p_session_id: session.id,
  p_user_id: user.id,
});
// Server-side: cancels session + releases lock + refunds wallet atomically
```

#### Atomic Request Acceptance (via RPC)
```typescript
const { data: sessionId, error } = await supabase.rpc('accept_request', {
  p_request_id: request.id,
  p_provider_id: user.id,
  p_scheduled_time: scheduledTime.toISOString(),
});
// Server-side: accepts request + creates session + locks requester credits atomically
```

### Atomic Server-Side Operations

All multi-step operations are now handled by atomic PostgreSQL functions. The frontend makes a single `supabase.rpc()` call; the server executes all steps within one transaction.

#### Session Completion (`complete_session` RPC)
1. Lock session row (FOR UPDATE)
2. Set caller's confirmation flag
3. If both confirmed: transfer credits, update profiles, calculate streak, award badges
4. All 9+ operations execute atomically -- no partial state possible

#### Session Booking (`book_session` RPC)
1. Lock wallet row (FOR UPDATE)
2. Validate balance
3. Create session, credit lock, wallet update, transaction record
4. All 4 operations execute atomically

#### Request Acceptance (`accept_request` RPC)
1. Lock request and wallet rows
2. Validate request is open and requester has sufficient balance
3. Create session, lock credits, update request status
4. All 7 operations execute atomically

### Real-time Subscriptions
```typescript
// Listen for wallet changes
const subscription = supabase
  .from('wallets')
  .on('*', payload => {
    // Update wallet display
  })
  .subscribe()
```

---

## Security & RLS Policies

### Authentication Flow

1. **User Sign Up**
   - Email/password → Supabase Auth
   - Google OAuth → Supabase Auth
   - Session created automatically
   - Trigger creates profile, wallet, badges

2. **User Sign In**
   - Email/password → Session token
   - Token stored in localStorage
   - Supabase client auto-includes in requests
   - Session persists across page reloads

3. **Protected Routes**
   - PrivateRoute checks `auth.user`
   - Redirects to /login if no session
   - Shows loading spinner during check

### RLS Policy Structure

#### Profiles Table
```sql
-- Public Read
CREATE POLICY "Public profiles are viewable"
  ON profiles FOR SELECT
  USING (true);

-- Authenticated Write (Own Only)
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
```

#### Wallets Table
```sql
-- Authenticated Read Only
CREATE POLICY "Users can view own wallet"
  ON wallets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Authenticated Update
CREATE POLICY "Users can update own wallet"
  ON wallets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Authenticated Insert
CREATE POLICY "System can insert wallets"
  ON wallets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
```

#### Listings Table
```sql
-- Public Read (Active Only)
CREATE POLICY "Active listings viewable"
  ON listings FOR SELECT
  USING (status = 'active' OR auth.uid() = user_id);

-- Authenticated Write (Own Only)
CREATE POLICY "Users can insert own listings"
  ON listings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own listings"
  ON listings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own listings"
  ON listings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
```

#### Sessions Table
```sql
-- Authenticated Read (Participants Only)
CREATE POLICY "Users can view own sessions"
  ON sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = provider_id OR auth.uid() = requester_id);

-- Authenticated Insert (Requester or Provider via request acceptance)
CREATE POLICY "Users can insert sessions as requester"
  ON sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Providers can insert sessions when accepting requests"
  ON sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = provider_id);

-- Authenticated Update (Participants)
CREATE POLICY "Session participants can update"
  ON sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = provider_id OR auth.uid() = requester_id)
  WITH CHECK (auth.uid() = provider_id OR auth.uid() = requester_id);
```

#### Transactions Table
```sql
-- Authenticated Read (Own Only)
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Authenticated Insert
CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
```

### Security Best Practices Implemented

1. **No Plaintext Secrets** - All secrets in .env, never committed
2. **RLS on All Tables** - Default deny unless explicitly allowed
3. **Row-level Isolation** - Users only access own data (except public profiles)
4. **Credit Validation** - Category min/max constraints enforced
5. **Atomic RPC Functions** - All credit-sensitive operations (booking, completion, cancellation, request acceptance) execute as single PostgreSQL transactions via SECURITY DEFINER functions with FOR UPDATE row locks
6. **Database-Level CHECK Constraints** - Non-negative wallet balances, no self-booking, valid ratings enforced at database level (not just frontend)
7. **Unique Constraints** - Email, category names, (session_id, reviewer_id) prevent duplicates
8. **Service Role** - Only for system operations, not exposed to client
9. **Foreign Keys** - CASCADE/RESTRICT constraints prevent data orphans
10. **Type Safety** - TypeScript prevents many runtime errors
11. **Error Boundaries** - React error boundaries prevent cascading UI failures
12. **ARIA Accessibility** - Landmarks, labels, keyboard navigation support

### Attack Prevention

#### Credit Inflation
- CHECK constraints enforce `balance >= 0` and `locked_credits >= 0` at database level
- Credit locks with FOR UPDATE row locks prevent double-spending
- Atomic RPC functions prevent partial transfers (all-or-nothing)
- Self-booking prevented by CHECK constraint `provider_id != requester_id`

#### Session Fraud
- Dual confirmation required (atomic via `complete_session()`)
- Both users must confirm separately
- Credits only transfer when both confirm within the same atomic transaction
- Confirmation button disabled until scheduled_time + duration has passed

#### Review Manipulation
- UNIQUE constraint on (session_id, reviewer_id) prevents duplicate reviews at database level
- Rating auto-calculated via trigger (can't be set directly)
- 7-day review window enforced in UI

#### Profile Manipulation
- Users can only update own profiles (RLS)
- Rating, sessions_completed, streak all updated only by atomic server-side functions (can't fake)
- Badge awards controlled by `award_badges()` SECURITY DEFINER function

#### Cross-User Access
- RLS policies check auth.uid()
- No public access to wallets/transactions
- Sessions visible only to participants

---

## Installation & Deployment

### Local Development Setup

#### Prerequisites
- Node.js 18+ and npm
- Git for version control
- Supabase account (free tier available)

#### Steps

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd skillbarter
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```
   Create .env file:
   VITE_SUPABASE_URL=<your-supabase-url>
   VITE_SUPABASE_ANON_KEY=<your-anon-key>
   ```

4. **Start Dev Server**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5173`

5. **Run Type Checking**
   ```bash
   npm run typecheck
   ```

6. **Build for Production**
   ```bash
   npm run build
   ```

### Database Setup

1. **Create Supabase Project**
   - Go to supabase.com
   - Create new project
   - Get VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

2. **Run Migrations**
   ```
   Use Supabase dashboard → SQL Editor
   Execute migration files in order:
   - 20260313165019_create_skillbarter_schema.sql
   - 20260313174030_fix_handle_new_user_trigger.sql
   - 20260313174052_add_service_role_policies.sql
   - 20260313174927_add_review_and_streak_triggers.sql
   - 20260313195313_20260313_fix_database_performance_and_security.sql
   - 20260318062659_add_extended_profile_fields.sql
   - 20260318072923_add_sessions_profile_fkeys.sql
   - 20260401100254_add_requests_listings_profile_fkeys.sql
   - 20260408070705_add_reviews_reviewer_id_profiles_fkey.sql
   - 20260408080335_fix_sessions_insert_policy_for_providers.sql
   - 20260408210108_add_database_integrity_and_atomic_functions.sql
   ```

3. **Enable Google OAuth (Optional)**
   - Supabase dashboard → Authentication → Providers
   - Enable Google OAuth
   - Add redirect URL: `http://localhost:5173/auth/callback`

### Deployment

#### Vercel (Recommended)

1. Push code to GitHub
2. Go to vercel.com
3. Import repository
4. Add environment variables
5. Deploy (auto-deploys on git push)

#### Other Platforms

- **Netlify**: Similar process to Vercel
- **Docker**: Create Dockerfile, build image
- **Traditional Server**: `npm run build`, serve dist folder with nginx

---

## Testing & QA

### Test Scenarios by Feature

#### Authentication
- [ ] Sign up with email/password
- [ ] Sign up with Google OAuth
- [ ] Sign in with correct credentials
- [ ] Sign in with wrong password (error)
- [ ] Sign in with non-existent email (error)
- [ ] Logout functionality
- [ ] Redirect to login if not authenticated
- [ ] Redirect to dashboard if already authenticated

#### Profile Management
- [ ] Create profile on signup
- [ ] View own profile
- [ ] View other user profiles
- [ ] Edit profile (name, bio, university)
- [ ] Upload avatar
- [ ] See profile stats (rating, reviews, sessions)

#### Listing Creation
- [ ] Select category, price within bounds
- [ ] Create listing with required fields
- [ ] Price validation (min/max)
- [ ] Edit own listing
- [ ] Pause listing
- [ ] Delete listing
- [ ] View listing not in category bounds (error)

#### Listing Browse
- [ ] Browse all active listings
- [ ] Search listings
- [ ] Filter by category
- [ ] Filter by price range
- [ ] Sort by price (asc/desc)
- [ ] Sort by rating (asc/desc)
- [ ] View listing detail page
- [ ] See provider profile from listing

#### Booking Session
- [ ] Click "Book Now" on listing
- [ ] Select future date/time
- [ ] Verify credits sufficient
- [ ] Submit booking
- [ ] Credits locked in wallet
- [ ] Session appears in "Sessions" page

#### Session Management
- [ ] View all sessions
- [ ] View upcoming sessions
- [ ] View completed sessions
- [ ] Accept session (provider)
- [ ] Cancel session with reason
- [ ] Credit lock released on cancel
- [ ] See confirmation buttons when time passed

#### Session Completion
- [ ] Both confirm completion
- [ ] Credits transferred to provider
- [ ] Credits deducted from requester
- [ ] Transaction recorded
- [ ] Session count updated
- [ ] Streak updated

#### Reviews & Ratings
- [ ] Post review after completion
- [ ] Submit 1-5 star rating
- [ ] Write optional comment
- [ ] See reviews on profile
- [ ] See auto-calculated average rating
- [ ] See review count

#### Wallet & Credits
- [ ] See balance breakdown (available/locked/earned/spent)
- [ ] See transaction history
- [ ] Filter transactions by type
- [ ] See credit locks for pending sessions
- [ ] Credit balance updates in real-time

#### Badges & Achievements
- [ ] View all badges
- [ ] See earned badges on profile
- [ ] See progress for locked badges
- [ ] Earn "First Session" badge
- [ ] Earn "Helper 10" badge
- [ ] Earn "Rising Star" badge
- [ ] Earn "7 Day Streak" badge

#### Mobile Responsiveness
- [ ] Mobile view on 375px width
- [ ] Tablet view on 768px width
- [ ] Desktop view on 1920px width
- [ ] Bottom nav on mobile
- [ ] Single column layout on mobile
- [ ] Touch-friendly buttons (48px min)
- [ ] Form inputs responsive

#### Dark Mode
- [ ] Toggle dark/light theme
- [ ] Theme persists on reload
- [ ] All components styled in both themes
- [ ] Text readable in both themes
- [ ] Images visible in both themes

#### Error Handling
- [ ] Network error displays gracefully
- [ ] Invalid form input shows error message
- [ ] Insufficient credits prevents booking
- [ ] Expired session (past scheduled_time) shows closed
- [ ] Loading states display during fetch
- [ ] 404 page for non-existent listing

---

## Troubleshooting Guide

### Common Issues

#### Issue: "Cannot read property 'user' of null"
**Cause**: AuthContext not properly initialized
**Solution**:
1. Ensure AuthProvider wraps entire App
2. Check Supabase credentials in .env
3. Check browser console for auth errors

#### Issue: Credits not updating in real-time
**Cause**: Real-time subscription not established
**Solution**:
1. Check Realtime is enabled in Supabase
2. Verify RLS policies allow subscription
3. Reload page to fetch fresh data

#### Issue: "RLS policy violation" error
**Cause**: User trying to access data they don't own
**Solution**:
1. Check RLS policies in migration files
2. Verify auth.uid() matches expected user
3. Check browser console for policy details

#### Issue: Booking not creating session
**Cause**: Credit lock or RLS policy issue
**Solution**:
1. Check wallet has sufficient credits
2. Verify wallet.balance >= credits_amount
3. Check RLS policy on sessions table
4. Ensure user is authenticated (check auth.uid())

#### Issue: Price validation fails
**Cause**: Price outside category bounds
**Solution**:
1. Check category.min_credits and max_credits
2. Verify input price is within range
3. Select correct category before setting price

#### Issue: Badges not showing earned
**Cause**: Badge award trigger not fired
**Solution**:
1. Check sessions_completed count
2. Verify trigger function exists
3. Manually award badge in database for testing

#### Issue: "Listing not found" (404)
**Cause**: Listing status is not 'active' or doesn't exist
**Solution**:
1. Check listing.status in database
2. Verify user_id matches auth.uid() for private listings
3. Refresh page to clear cache

#### Issue: Session can't confirm (button disabled)
**Cause**: Session time hasn't passed yet
**Solution**:
1. Check scheduled_time in database
2. Verify system time is after scheduled_time
3. In testing, update scheduled_time to past

#### Issue: Review form not appearing
**Cause**: Session not completed or already reviewed
**Solution**:
1. Verify session.status = 'completed'
2. Check if review already exists
3. Ensure both users have confirmed

#### Issue: Mobile layout broken
**Cause**: Tailwind responsive classes not working
**Solution**:
1. Check Tailwind config includes mobile breakpoints
2. Rebuild CSS with `npm run build`
3. Clear browser cache
4. Test on actual device or DevTools mobile mode

---

## Development Workflow

### Git Workflow

1. **Feature Branches**
   ```bash
   git checkout -b feature/user-auth
   ```

2. **Commit Messages**
   ```
   Format: [Type] Description
   Types: feat, fix, refactor, docs, test, style
   Example: feat: add credit transfer logic
   ```

3. **Pull Request**
   - Create PR with description
   - Request code review
   - Run tests before merge
   - Squash commits before merge

### Code Organization

#### Frontend Structure
```
src/
├── pages/          # One component per page
├── components/     # Reusable UI components
│   ├── layout/    # Layout components
│   └── ui/        # UI component library
├── contexts/      # React Context
├── hooks/         # Custom hooks
├── lib/           # Utilities & Supabase client
├── types/         # TypeScript interfaces
├── App.tsx        # Router & main layout
└── index.css      # Global styles
```

#### Database Structure
```
supabase/
└── migrations/           # SQL migration files (11 total)
    ├── create_skillbarter_schema.sql     # Core tables, RLS, triggers
    ├── fix_handle_new_user_trigger.sql   # Signup trigger fix
    ├── add_service_role_policies.sql     # Service role RLS
    ├── add_review_and_streak_triggers.sql # Rating & streak triggers
    ├── fix_database_performance_and_security.sql
    ├── add_extended_profile_fields.sql   # Profile field additions
    ├── add_sessions_profile_fkeys.sql    # FK constraints
    ├── add_requests_listings_profile_fkeys.sql
    ├── add_reviews_reviewer_id_profiles_fkey.sql
    ├── fix_sessions_insert_policy_for_providers.sql
    └── add_database_integrity_and_atomic_functions.sql  # CHECK constraints, atomic RPCs
```

### Code Standards

#### TypeScript
- Use strict mode
- Type all props
- Use interfaces for complex objects
- Avoid `any` types

#### React
- Functional components
- Custom hooks for logic
- Use const for components
- Proper dependency arrays in useEffect

#### Tailwind CSS
- Use utility classes
- Avoid inline styles
- Consistent spacing (8px grid)
- Dark mode support with dark: prefix

#### Database
- Use migrations for schema changes
- Add comments to functions
- Include indexes on FK columns
- Test RLS policies

---

## Performance Optimization

### Frontend

1. **Code Splitting**: React Router lazy load pages
2. **Images**: Use next-gen formats, optimize size
3. **Bundle**: Tree-shake unused code
4. **Caching**: Browser cache static assets
5. **Hydration**: Minimize JS sent to client

### Backend

1. **Indexes**: On user_id, category_id, status
2. **Queries**: Select only needed columns
3. **Pagination**: Limit results per page
4. **Connection Pooling**: Supabase handles this
5. **RLS**: Minimal overhead for small tables

### Database

1. **Query Optimization**: Use EXPLAIN ANALYZE
2. **Denormalization**: Store calculated fields (rating)
3. **Archive**: Move old transactions to archive table
4. **Monitoring**: Check slow query log

---

## Real-World Improvement Analysis

This section identifies concrete weaknesses in the current system by examining how each existing feature would behave under real-world conditions -- actual students using this on a university campus. These are not new modules; they are areas where what we already have can be made significantly more robust, trustworthy, and useful.

> **Implementation Status Note**: Items marked with [RESOLVED] have been implemented in the codebase. Items marked [PARTIALLY RESOLVED] have been partially addressed. Remaining items are documented as future improvement opportunities.

### 1. Credit Economy: The Inflation & Cold-Start Problem

**The Real Problem:**
Every new user receives 10 free credits. Credits are transferred peer-to-peer. No credits ever leave the system. As the user base grows, total credits in circulation grow linearly with signups. This is classic **monetary inflation** -- credits lose perceived value because supply increases without bound.

Simultaneously, new users who spend their 10 credits quickly hit a **cold-start wall**: they have 0 credits, no listings, and no way to earn. The platform becomes unusable for them unless someone books their listing first.

**Where It Breaks:**
- A campus with 500 signups has 5,000 credits circulating. Power users accumulate hundreds of credits while new users run out.
- Users who only want to learn (not teach) will exhaust credits and churn.
- No mechanism exists to rebalance wealth. The Gini coefficient of the credit economy will skew heavily over time.

**What Would Make It Better (Within Current System):**
- **Credit decay**: Idle credits lose 1-2% value per month. This encourages spending and prevents hoarding. Implemented as a scheduled database function, not a new module.
- **Earning floor**: Award 1-2 credits for completing a session as a requester (participation reward), funded by system issuance rather than the provider's payment. This keeps learners engaged.
- **Wallet cap**: Maximum balance of 100 credits. Beyond this, users must spend to earn more. Prevents whale accumulation.
- **Dynamic signup bonus**: Instead of flat 10 credits, scale the bonus based on current platform credit velocity. If the economy is sluggish, increase it; if inflated, reduce it.

**Database Impact:** All achievable with a CHECK constraint on wallet balance, a scheduled PostgreSQL function for decay, and a small modification to the completion trigger.

---

### 2. Transaction Atomicity: The Silent Corruption Risk [RESOLVED]

**The Real Problem:**
The session completion flow previously executed 7+ sequential Supabase client calls from the browser. If a user's internet drops after step 3 (requester wallet debited) but before step 4 (provider wallet credited), credits vanish. The requester lost credits, the provider never received them, and the credit_lock is stuck in 'locked' status permanently.

This is not hypothetical. On a university campus with unreliable WiFi, this will happen.

**Where It Breaks:**
- Partial wallet updates create phantom credit loss
- Orphaned credit_locks permanently reduce a user's available balance
- No reconciliation mechanism exists to detect or repair inconsistencies
- Transaction records may be incomplete, making manual debugging nearly impossible

**Resolution Implemented:**
- **Server-side atomic functions**: All credit-sensitive operations are now wrapped in PostgreSQL `SECURITY DEFINER` functions: `book_session()`, `complete_session()`, `cancel_session()`, `accept_request()`. Each executes within a single database transaction with `SELECT ... FOR UPDATE` row-level locking to prevent race conditions.
- **Credit lock expiry**: Added `expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '72 hours')` column to `credit_locks` table, preventing permanent lock-ups.
- **CHECK constraints**: `wallets_balance_non_negative`, `wallets_locked_non_negative` ensure the database rejects any operation that would create negative balances.

**Remaining opportunities:**
- **Idempotency key**: A `completion_token UUID` column could further protect against network-timeout retries causing double-transfers.
- **Orphan detection**: A scheduled query to auto-release stale credit_locks older than the `expires_at` threshold.

---

### 3. Trust & Safety: The Fake Session Problem [PARTIALLY RESOLVED]

**The Real Problem:**
Two users can collude: User A creates a listing, User B books it, both instantly confirm completion. Credits transfer. They reverse roles and repeat. This is **credit laundering** -- it lets users inflate their session count, boost their rating, earn badges fraudulently, and manipulate streaks.

There is zero cost to creating a fake session beyond the credits, which transfer back to the colluding partner.

**Where It Breaks:**
- Sessions can be confirmed the moment the scheduled time passes (10-minute window). Two users can schedule a session 11 minutes from now and confirm immediately.
- No verification that a session actually occurred
- Reviews between colluding users inflate ratings artificially
- Badge system rewards volume, not quality -- fake sessions count toward "Helper 50"
- Profiles with inflated ratings crowd out honest users in discovery

**What Would Make It Better (Within Current System):**
- **Minimum session gap**: Enforce at least 30 minutes between a user's scheduled sessions. Prevents rapid-fire fake sessions. Implemented as a CHECK on session INSERT.
- **Confirmation cooldown [RESOLVED]**: Confirmation now requires `duration_minutes` to pass after `scheduled_time` before the button is enabled. A 60-minute session requires 60 minutes to pass.
- **Velocity limits**: Flag accounts that complete more than 3 sessions per day or 10 per week for manual review. Stored as a database view, not a new table.
- **Review weight decay**: If User A reviews User B, and User B reviews User A in the same week, weight both reviews at 50% in the rating calculation. Reciprocal reviews are the strongest signal of collusion.
- **Unique partner ratio**: Track what percentage of a user's sessions are with unique partners. A healthy ratio is 60%+. A ratio below 30% (same 2-3 people over and over) triggers reduced badge progression.

**Database Impact:** Modifications to existing triggers, one new database view, adjustment to the rating aggregation function.

---

### 4. Session Scheduling: The No-Show & Timezone Problem [PARTIALLY RESOLVED]

**The Real Problem:**
Sessions are scheduled using a browser datetime picker with no timezone awareness. If a provider in IST schedules availability and a requester in a different timezone books it, both see different times. On a single campus this is unlikely, but for online sessions it is a real failure mode.

More critically: there is no consequence for no-shows. A provider can accept a session, not show up, and the requester's credits stay locked indefinitely until someone manually cancels. The requester bears all the risk.

**Where It Breaks:**
- No automatic expiration for sessions that are past their scheduled time and neither party has taken action
- Credits locked in "accepted" sessions with no activity drain the requester's available balance
- The provider has no skin in the game -- their credits are never at risk
- No mechanism distinguishes between "session happened and wasn't confirmed" vs. "nobody showed up"
- Sessions can sit in 'pending' status forever if the provider never responds

**What Would Make It Better (Within Current System):**
- **Auto-expire pending sessions**: If a provider doesn't accept within 48 hours, automatically cancel and release credits. Implemented as a scheduled database function.
- **Auto-expire stale sessions**: If a session is 'accepted' but neither party confirms within 24 hours after the scheduled time, auto-cancel with credits returned to requester.
- **Provider stake**: When a provider accepts a session, lock a small collateral (2 credits) from their wallet too. If the session completes, the collateral is returned. If the provider cancels or no-shows, the collateral transfers to the requester as compensation. This creates symmetric accountability.
- **Cancellation penalty**: Free cancellation up to 2 hours before scheduled time. Cancellations within 2 hours forfeit 20% of the locked credits to the other party. This discourages last-minute flaking.
- **Store timezone offset**: Save the user's UTC offset at booking time alongside `scheduled_time`. Display times with explicit timezone labels in the UI.

**Partial Resolution:** Credit locks now have `expires_at` column (72-hour default). Request acceptance now includes a date/time picker instead of hardcoded scheduling. Remaining items (auto-expiry scheduled function, provider collateral, cancellation penalty, timezone storage) are future improvements.

**Database Impact:** Two scheduled functions (pending expiry, stale expiry), one new column on sessions (`timezone_offset`), modification to the credit lock flow for provider collateral.

---

### 5. Discovery & Matching: The Relevance Problem [PARTIALLY RESOLVED]

**The Real Problem:**
The Discover page queries `SELECT * FROM listings WHERE status = 'active' ORDER BY created_at DESC`. This means the newest listings always appear first, regardless of quality, relevance, or the searcher's needs. A brilliant tutor with a 4.9 rating who posted their listing 3 months ago is buried under a flood of new, unreviewed listings.

Search only checks listing titles with `ILIKE '%query%'`. Searching "python help" will not match a listing titled "Programming Tutoring" even though the description mentions Python extensively.

**Where It Breaks:**
- High-quality providers become invisible over time as new listings push them down
- No way to sort by rating, price, or completed sessions
- Search misses relevant results because it only checks titles
- No pagination -- loading hundreds of listings at once degrades mobile performance
- Category filtering exists but cannot combine with other filters (price range, location type, provider rating)

**What Would Make It Better (Within Current System):**
- **Relevance scoring**: Replace `ORDER BY created_at` with a composite score: `(provider_rating * 0.4) + (sessions_completed * 0.1) + (recency_factor * 0.3) + (views_count * 0.2)`. This can be a computed column or a database view. Quality rises to the top.
- **Search description + title**: Change `ILIKE` to search across `title || ' ' || description`. Immediate improvement in recall with zero new infrastructure.
- **Pagination**: Add `.range(offset, offset + 20)` to the Supabase query. Show 20 results per page with "Load More" button. Reduces initial payload from potentially hundreds of records to 20.
- **Multi-filter support**: Allow combining category + price range + location type + minimum rating in a single query. All of these are existing columns with existing indexes.
- **Sort options**: Let users sort by price (low-to-high, high-to-low), rating (highest first), or newest. These are trivial `ORDER BY` changes on the existing query.

**Resolution Status:**
- **Search across title + description [RESOLVED]**: Search now uses `.or()` to match both title and description with ILIKE, with 300ms debounce.
- **Pagination [RESOLVED]**: 18 results per page with "Load More" button and total count using `{ count: 'exact' }`.
- **Multi-filter support [RESOLVED]**: Category + location type filters can be combined in a single query.
- **Sort options [RESOLVED]**: Users can sort by newest, price (low/high), or rating.
- **Relevance scoring**: Composite scoring view remains a future improvement.

**Database Impact:** One database view for relevance scoring (remaining improvement), no schema changes needed for the rest.

---

### 6. Streak System: The Midnight Cliff & Fairness Problem [PARTIALLY RESOLVED]

**The Real Problem:**
The streak system uses `CURRENT_DATE` (server timezone) to determine consecutive days. A student who completes a session at 11:55 PM and another at 12:05 AM has been continuously active for 10 minutes but gets credit for 2 different days. Conversely, a student who completes sessions at 8 AM Monday and 8 AM Wednesday (missing Tuesday) loses their entire streak despite being regularly active.

Additionally, completing 5 sessions on Saturday and 0 on Sunday resets the streak. The system penalizes rest days, which is counterproductive for a student platform where weekends matter.

**Where It Breaks:**
- Streaks reset after a single missed day with no grace period
- Server timezone may differ from user's local timezone by hours
- Same-day multiple sessions don't strengthen the streak (5 sessions = same as 1)
- Students with irregular schedules (labs on MWF only) can never build meaningful streaks
- No visibility into when the streak will break (no "streak expires in X hours" warning)

**What Would Make It Better (Within Current System):**
- **Grace period**: Allow one "skip day" per streak. The trigger checks if `CURRENT_DATE - last_session_date <= 2` instead of `<= 1`. Streaks only break after 2 consecutive inactive days. This single change makes streaks 3x more achievable for real students.
- **Weekly streak alternative**: Track "active weeks" alongside daily streaks. A week counts as active if the user completed at least one session. Weekly streaks are more meaningful for students with variable schedules.
- **Timezone-aware calculation**: Store `last_session_date` using the user's local date (derived from a stored timezone preference) rather than server `CURRENT_DATE`.
- **Streak freeze**: Allow users to "freeze" their streak once per month (stored as `streak_freeze_used_at DATE` on the profiles table). During exams or holidays, one freeze prevents losing a long streak.

**Resolution Status:**
- **Grace period [RESOLVED]**: The `complete_session()` function now checks `CURRENT_DATE - last_session_date <= 2` (2-day gap) instead of requiring consecutive days. Streaks only break after 2+ missed days.
- **Streak freeze [RESOLVED]**: Added `streak_freeze_used_at DATE` column to profiles table for monthly streak freeze capability.
- **Weekly streak / Timezone-aware calculation**: Remain as future improvements.

**Database Impact:** Modification to the existing streak trigger, two new columns on profiles (`streak_freeze_used_at`, `active_weeks`).

---

### 7. Review System: The Cold-Start & Manipulation Problem [PARTIALLY RESOLVED]

**The Real Problem:**
New providers have 0 reviews and a 0.00 rating. In a sorted-by-rating discovery view, they are invisible. In an unsorted view, users see the 0-star rating and skip them. This creates a chicken-and-egg problem: you need reviews to get bookings, but you need bookings to get reviews.

Additionally, there is no uniqueness constraint at the database level preventing multiple reviews for the same session. The application checks in code, but a direct API call could bypass it.

**Where It Breaks:**
- New providers cannot compete with established ones, reducing platform growth
- No distinction between "0 rating (never reviewed)" and "0 rating (terrible)"
- Reciprocal reviews between the same two users repeatedly inflate ratings
- No mechanism to dispute or report a malicious review
- Reviews have no time limit -- a user could review a session from 6 months ago

**What Would Make It Better (Within Current System):**
- **"New" badge for unreviewed providers**: Display a "New Provider" indicator instead of showing 0 stars. This reframes "unproven" as "new opportunity" rather than "bad."
- **Review window**: Allow reviews only within 7 days of session completion. After that, the review opportunity expires. Prevents stale grievance reviews.
- **Database uniqueness constraint**: Add `UNIQUE(session_id, reviewer_id)` to the reviews table. This is a one-line migration that closes the bypass vulnerability.
- **Minimum reviews for rating display**: Only show numeric rating after 3+ reviews. Before that, show "New" or "Building reputation." This prevents a single 1-star review from destroying a new user's profile.
- **Review response**: Allow the reviewed user to post a single text response (not a counter-rating). This exists on Google Maps, Airbnb, and every mature review platform. Stored as `response TEXT` and `response_at TIMESTAMPTZ` columns on the reviews table.

**Resolution Status:**
- **"New Provider" badge [RESOLVED]**: Providers with < 3 reviews display "New Provider" label instead of rating stars on listing cards and session detail pages.
- **Review window [RESOLVED]**: UI enforces 7-day review window after session completion.
- **Database uniqueness constraint [RESOLVED]**: Added `UNIQUE(session_id, reviewer_id)` constraint via migration.
- **Minimum reviews for rating display [RESOLVED]**: Rating shown only after 3+ reviews; otherwise "New Provider" indicator.
- **Review response**: Remains a future improvement.

**Database Impact:** One unique constraint (done), two new columns on reviews (future), modification to the profile display logic (done).

---

### 8. Credit Lock System: The Deadlock & Visibility Problem [RESOLVED]

**The Real Problem:**
When credits are locked for a pending session, the user's wallet shows reduced "available balance" but there is no clear explanation of why. A user with 10 credits who books a 5-credit session sees "5 available, 5 locked" but cannot easily see which session is holding their credits or how to release them.

Worse, if a session gets stuck (provider never responds, both parties forget about it), those credits are locked permanently until someone manually cancels.

**Where It Breaks:**
- Users see reduced balance with no clear link to which session holds the credits
- No automatic timeout releases orphaned locks
- Multiple pending sessions can lock all credits, leaving zero available even when no sessions are confirmed
- The wallet page shows transaction history but not a breakdown of current locks by session

**What Would Make It Better (Within Current System):**
- **Lock visibility**: On the wallet page, show a dedicated "Locked Credits" section listing each active lock with the session title, counterparty name, scheduled date, and a "Cancel & Release" action button. All this data already exists in the credit_locks and sessions tables -- it just needs to be displayed.
- **Lock expiry**: Add `expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '72 hours')` to credit_locks. A scheduled function releases any lock past its expiry. This prevents permanent lock-ups.
- **Lock limit**: Prevent users from having more than 3 concurrent locked sessions. This is a simple COUNT check before creating a new lock. Prevents a user from locking all their credits in speculative bookings.
- **Lock notification**: When credits are about to expire (12 hours before), surface a warning on the dashboard. Frontend-only change using existing data.

**Resolution Status:**
- **Lock visibility [RESOLVED]**: Wallet page now shows a dedicated "Locked Credits" expandable section listing each active lock with session title, counterparty name, scheduled date, and credits amount.
- **Lock expiry [RESOLVED]**: Added `expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '72 hours')` column to credit_locks table.
- **Lock notification [RESOLVED]**: Locks expiring within 12 hours show an "Expiring soon" warning badge on the wallet page.
- **Lock limit**: COUNT-based validation to limit concurrent locks remains a future improvement.

**Database Impact:** One new column on credit_locks (`expires_at`) [done], one scheduled function [future], one COUNT-based validation [future].

---

### 9. Badge System: The Incomplete Award Logic [RESOLVED]

**The Real Problem:**
The database contains 8 badge definitions, but the automatic award trigger only handles the "Early Adopter" badge (awarded during signup). All other badges (First Session, Helper 10, Helper 50, 7 Day Streak, 30 Day Streak, Rising Star, Top Rated) are defined but never automatically awarded. Users can complete 50 sessions and still not receive the "Helper 50" badge because the trigger logic does not check for it.

**Where It Breaks:**
- The badges page shows all badges with "locked" status but users cannot earn them through normal activity
- The gamification system -- a core motivational feature -- is effectively non-functional beyond the signup badge
- Streak badges are particularly broken because the streak trigger updates counts but never checks badge eligibility

**What Would Make It Better (Within Current System):**
- **Extend the session completion trigger**: After updating `sessions_completed` and streak values, the existing trigger should query the badges table and INSERT into user_badges for any badges whose `requirement_type` and `requirement_value` are now met. This is 15-20 lines of additional SQL in the existing trigger function.
- **Extend the review trigger**: After recalculating the rating, check if the new rating meets any rating-based badge requirements (Rising Star at 4.5, Top Rated at 4.8). Award if eligible.
- **Idempotent awards**: The `UNIQUE(user_id, badge_id)` constraint already prevents duplicate awards. Use `INSERT ... ON CONFLICT DO NOTHING` so the trigger can safely attempt the award every time without error handling.

**Resolution Implemented:**
- **`award_badges()` function**: Created a dedicated PostgreSQL function that checks all badge requirement types (`sessions_completed`, `streak`, `rating`, `early_adopter`) against the user's current stats and awards eligible badges.
- **Called by `complete_session()`**: The `award_badges()` function is called automatically at the end of session completion, ensuring badges are checked every time a session completes.
- **Idempotent awards**: Uses `INSERT INTO user_badges ... ON CONFLICT DO NOTHING` so the function can safely attempt awards without error handling.
- **All badge types functional**: First Session, Helper 10, Helper 50, 7 Day Streak, 30 Day Streak, Rising Star, and Top Rated are all now automatically awarded when conditions are met.

**Database Impact:** One new function (`award_badges`), called by `complete_session()`. No new tables or columns.

---

### 10. Data Integrity: The Missing Constraints [RESOLVED]

**The Real Problem:**
Several critical business rules are enforced only in frontend JavaScript code. Anyone with browser dev tools or a direct Supabase client connection can bypass them. The database itself does not enforce:

- `wallets.balance >= 0` (negative balance possible)
- `wallets.locked_credits >= 0` (negative locked credits possible)
- `listings.price_credits BETWEEN category.min_credits AND category.max_credits` (price outside bounds possible)
- `sessions.scheduled_time > NOW()` at INSERT time (past sessions can be created)
- `reviews.rating BETWEEN 1 AND 5` (0 or 6+ star reviews possible)

**Where It Breaks:**
- A malicious user could construct a Supabase client call that sets their wallet balance to 999999
- Price manipulation bypasses category economics
- Past-dated sessions could be used to game streak calculations
- Review bombing with invalid ratings corrupts the aggregation trigger

**What Would Make It Better (Within Current System):**
- **CHECK constraints on wallets**:
  ```sql
  ALTER TABLE wallets ADD CONSTRAINT balance_non_negative CHECK (balance >= 0);
  ALTER TABLE wallets ADD CONSTRAINT locked_non_negative CHECK (locked_credits >= 0);
  ```
- **CHECK constraint on reviews**:
  ```sql
  ALTER TABLE reviews ADD CONSTRAINT valid_rating CHECK (rating >= 1 AND rating <= 5);
  ```
- **Unique review per session per reviewer**:
  ```sql
  ALTER TABLE reviews ADD CONSTRAINT unique_review_per_session UNIQUE (session_id, reviewer_id);
  ```
- **Self-booking prevention**:
  ```sql
  ALTER TABLE sessions ADD CONSTRAINT no_self_booking CHECK (provider_id != requester_id);
  ```

**Resolution Implemented (migration: `20260408210108_add_database_integrity_and_atomic_functions.sql`):**
All of the above constraints have been added:
- `wallets_balance_non_negative`: CHECK (balance >= 0)
- `wallets_locked_non_negative`: CHECK (locked_credits >= 0)
- `wallets_earned_non_negative`: CHECK (total_earned >= 0)
- `wallets_spent_non_negative`: CHECK (total_spent >= 0)
- `reviews_session_reviewer_unique`: UNIQUE (session_id, reviewer_id)
- `sessions_no_self_booking`: CHECK (provider_id != requester_id)

The database now enforces its own rules regardless of frontend behavior. These constraints are layered on top of the atomic RPC functions that already validate before modifying data.

---

### Summary: Improvement Priority Matrix

| Improvement | Impact | Effort | Risk if Ignored | Status |
|------------|--------|--------|-----------------|--------|
| Transaction atomicity (server-side function) | Critical | Medium | Data corruption, credit loss | RESOLVED |
| Missing CHECK constraints | Critical | Low | Security bypass, data integrity | RESOLVED |
| Badge award trigger completion | High | Low | Core gamification non-functional | RESOLVED |
| Session auto-expiry | High | Low | Permanent credit locks, unusable wallets | Partial (expires_at added) |
| Discovery relevance scoring | High | Medium | Good providers invisible, poor matching | Partial (sort/filter/search done) |
| Provider collateral / no-show penalty | High | Medium | One-sided risk, provider abuse | Remaining |
| Review uniqueness constraint | Medium | Trivial | Rating manipulation | RESOLVED |
| Streak grace period | Medium | Trivial | Streaks too fragile, user frustration | RESOLVED |
| Credit economy balancing (decay/caps) | Medium | Medium | Long-term inflation, new user churn | Remaining |
| Lock visibility on wallet page | Medium | Low | User confusion, support burden | RESOLVED |
| Search across title + description | Medium | Trivial | Missed relevant results | RESOLVED |
| Pagination on discovery | Medium | Trivial | Mobile performance degradation | RESOLVED |
| Review window (7-day limit) | Low | Trivial | Stale reviews, reduced trust | RESOLVED |
| Confirmation cooldown (match duration) | Low | Trivial | Fake session exploit | RESOLVED |

**10 of 14 improvements have been fully resolved.** 2 are partially resolved (auto-expiry infrastructure added, discovery filters implemented). 2 remain as future opportunities (provider collateral, credit economy balancing).

---

## Contact & Support

**Project Repository**: [GitHub URL]

**Team Contacts**:
- **Project Lead**: Rushikesh [email/contact]
- **Frontend Dev**: Sandesh [email/contact]
- **Backend/DB**: Rutuja [email/contact]
- **UI/UX & QA**: Pavankumar [email/contact]

**Documentation Files**:
- This BlackBook: `SKILLBARTER_BLACKBOOK.md`
- Database Schema: `supabase/migrations/`
- Component Guide: `/src/components/`
- Type Definitions: `/src/types/database.ts`

---

## License & Acknowledgments

**License**: [Specify your license]

**Built With**:
- React, TypeScript, Tailwind CSS
- Supabase, PostgreSQL
- Vite, ESLint
- Team effort and dedication

**Last Updated**: April 8, 2026

---

**END OF SKILLBARTER BLACK BOOK**

This comprehensive guide contains everything needed to understand, maintain, and extend the SkillBarter platform. For questions or clarifications, refer to the specific team lead for each domain.
