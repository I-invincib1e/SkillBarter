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

**Project Status**: Fully functional production-ready application
**Total Codebase**: ~5,800 lines of TypeScript/React
**Database**: Supabase PostgreSQL with 11 core tables
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
3. **Safe Booking** - Session confirmation system prevents fraud
4. **Trackable Progress** - Badges, streaks, and ratings motivate users
5. **Flexible Scheduling** - Online and offline session options

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
│  │ Layout: Header, MobileNav, Layout wrapper         │   │
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
│  │ Triggers & Functions                             │   │
│  │ ├─ handle_new_user() - signup bonus              │   │
│  │ ├─ update_user_rating() - review aggregation     │   │
│  │ └─ PostgreSQL indexes for optimization           │   │
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

**Backend:**
- Supabase (PostgreSQL database)
- Supabase Authentication
- PostgreSQL with RLS
- Row Level Security (RLS) policies

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
- created_at (Timestamp) - Account creation date
- updated_at (Timestamp) - Last profile update

Indexes:
- PRIMARY KEY: id
- No additional indexes (small table)

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

Constraints:
- balance >= 0 (validated in application)
- locked_credits >= 0
- total_earned = balance + total_spent + locked_credits

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

Indexes:
- PRIMARY KEY: id
- FOREIGN KEY: listing_id, request_id, provider_id, requester_id
- INDEX: provider_id, requester_id, status

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
- created_at (Timestamp) - Lock creation date
- released_at (Timestamp) - When lock released/transferred

Purpose:
- Prevents user from spending credits that are pending in sessions
- When session pending: status = 'locked'
- When session cancelled: status = 'released'
- When session completed: status = 'transferred'

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

Constraints:
- rating: CHECK (rating >= 1 AND rating <= 5)
- One review per session (enforced at application level)
- Can only review after session completed

Triggers:
- ON INSERT: update_user_rating() recalculates profile.rating & total_reviews

Security:
- RLS: Public SELECT (anyone can view reviews)
- RLS: Authenticated INSERT (reviewer_id = auth.uid())

Indexes:
- PRIMARY KEY: id
- INDEX: reviewed_user_id (find reviews for a user)
- INDEX: session_id
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

### Key Database Constraints

| Constraint | Purpose | Implementation |
|-----------|---------|-----------------|
| Min/Max Credits | Prevent price exploits | CHECK in listings INSERT/UPDATE |
| Location Type | Limit session types | CHECK in listings (online/offline/both) |
| Session Status Flow | Enforce workflow | Application-level validation |
| Credit Balance | Prevent overdraft | Check balance before locking |
| Unique Email | User uniqueness | UNIQUE in auth.users |
| Streak Calculation | Automatic streak tracking | PostgreSQL trigger |
| Rating Aggregation | Auto-update ratings | PostgreSQL trigger |
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

The most critical atomic operation is **session completion with credit transfer**, which involves 7+ database operations:

```
1. UPDATE sessions SET status = 'completed'
2. UPDATE wallets (requester) - deduct balance
3. UPDATE wallets (provider) - add balance
4. UPDATE credit_locks SET status = 'transferred'
5. INSERT transactions (requester spend record)
6. INSERT transactions (provider earn record)
7. UPDATE profiles (sessions_completed, streak)
```

**Current approach:** These operations are executed as sequential Supabase client calls from the frontend. If any step fails mid-sequence, the database can be left in an inconsistent state (e.g., credits deducted but not credited).

**Recommended improvement:** Wrap multi-step credit operations in a PostgreSQL function using `SECURITY DEFINER` so all steps execute within a single database transaction:
```sql
CREATE OR REPLACE FUNCTION complete_session(p_session_id UUID)
RETURNS VOID AS $$
BEGIN
  -- All operations here are atomic
  UPDATE sessions SET status = 'completed' WHERE id = p_session_id;
  -- ... remaining steps ...
  -- If any step fails, entire function rolls back
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

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
- **Concurrent bookings**: If two users try to book the same listing simultaneously, RLS and application-level balance checks prevent double-spending
- **Review triggers**: The `update_user_rating()` trigger recalculates the average within the same transaction as the INSERT, ensuring consistency

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
| sessions | `provider_id` | B-tree | Provider's session list |
| sessions | `requester_id` | B-tree | Requester's session list |
| sessions | `status` | B-tree | Filter sessions by status tab |
| reviews | `reviewed_user_id` | B-tree | Profile page loads all reviews for a user |
| reviews | `session_id` | B-tree | Check if review exists for a session |
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

**Consistency Mechanism:** All denormalized fields are kept in sync through PostgreSQL triggers (`update_user_rating()`, `handle_new_user()`) and application-level atomic update sequences. The triggers execute within the same transaction as the triggering INSERT/UPDATE, ensuring the denormalized value is never stale after a committed write.

### Database Triggers & Functions

PostgreSQL triggers automate critical operations that must happen reliably without depending on application code.

#### `handle_new_user()` -- Signup Automation

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

#### `update_user_rating()` -- Rating Aggregation

```
Event:    AFTER INSERT ON reviews
Timing:   Fires once per new review
Security: SECURITY DEFINER

Operations:
  1. SELECT AVG(rating), COUNT(*) FROM reviews WHERE reviewed_user_id = NEW.reviewed_user_id
  2. UPDATE profiles SET rating = avg_result, total_reviews = count_result
```

This trigger maintains the denormalized `rating` and `total_reviews` fields in the `profiles` table, keeping them consistent with the actual reviews data.

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
User on /discover (public listing browse)
    ↓
Query: SELECT * FROM listings WHERE status = 'active'
    ↓
Display all active listings with:
  - Provider name & rating
  - Category & icon
  - Price (in credits)
  - Duration
  - Location type
    ↓
User clicks listing
    ↓
Navigate to /listing-detail/[id]
    ↓
Load listing data + provider profile
    ↓
Display:
  - Full listing details
  - Provider bio, rating, reviews
  - "Book Now" button
    ↓
User clicks "Book Now"
    ↓
Modal opens:
  - Date picker (future dates only)
  - Time picker
  - Optional message
    ↓
User submits
    ↓
Frontend validation:
  - scheduled_time > now() ✓
  - wallet.balance >= price_credits ✓
  - user not self-booking ✓
    ↓
CREATE session:
  {
    listing_id: listing.id,
    provider_id: listing.user_id,
    requester_id: auth.uid(),
    scheduled_time,
    credits_amount: listing.price_credits,
    status: 'pending',
    message,
    duration_minutes: listing.duration_minutes
  }
    ↓
RLS Check: requester_id = auth.uid() ✓
    ↓
INSERT credit_lock:
  {
    user_id: auth.uid(),
    session_id: created_session.id,
    credits: listing.price_credits,
    status: 'locked'
  }
    ↓
UPDATE wallets SET locked_credits += price_credits
    ↓
INSERT transaction (type: 'lock')
    ↓
Toast: "Booking request sent!"
    ↓
Session status: PENDING
  - Awaits provider acceptance
    ↓
Provider gets notification → Accept/Reject in /sessions
    ↓
If accepted:
  UPDATE sessions SET status = 'accepted'
    ↓
If rejected:
  UPDATE sessions SET status = 'cancelled'
  UPDATE credit_locks SET status = 'released'
  UPDATE wallets SET locked_credits -= price_credits
  INSERT transaction (type: 'unlock')
```

### 4. Session Completion & Credit Transfer

```
Session scheduled_time arrives
    ↓
User checks /sessions
    ↓
Shows: "Session time: 2:00 PM - [Confirm Complete] button"
    ↓
Provider confirms completion:
  UPDATE sessions SET
    provider_confirmed = true,
    provider_confirmed_at = now()
    ↓
Requester confirms completion:
  UPDATE sessions SET
    requester_confirmed = true,
    requester_confirmed_at = now()
    ↓
Both confirmed? → Trigger completion
    ↓
Backend transaction (must be atomic):
  1. UPDATE sessions SET
       status = 'completed',
       completed_at = now()
       ↓
  2. UPDATE wallets (REQUESTER)
       locked_credits -= credits_amount
       balance -= credits_amount
       total_spent += credits_amount
       ↓
  3. UPDATE wallets (PROVIDER)
       balance += credits_amount
       total_earned += credits_amount
       ↓
  4. UPDATE credit_locks SET status = 'transferred'
       ↓
  5. INSERT transactions (REQUESTER)
       type: 'spend'
       ↓
  6. INSERT transactions (PROVIDER)
       type: 'earn'
       other_user_id: requester
       ↓
  7. UPDATE profiles (PROVIDER)
       sessions_completed += 1
       ↓
  8. Check & Update Streak (PROVIDER)
       IF last_session_date = yesterday
         current_streak += 1
       ELSE
         current_streak = 1
       IF current_streak > longest_streak
         longest_streak = current_streak
       last_session_date = today()
       ↓
  9. Check Badge Conditions & Award
       - sessions_completed >= 1? → Award "First Session"
       - sessions_completed >= 10? → Award "Helper 10"
       - sessions_completed >= 50? → Award "Helper 50"
       - current_streak >= 7? → Award "7 Day Streak"
       - current_streak >= 30? → Award "30 Day Streak"
       ↓
Both users see:
  - "Session Complete!" toast
  - Review prompt
  - Updated wallet balance
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
Other user browses /requests
    ↓
Sees open requests with:
  - Requester name
  - Category & credits offered
  - "Accept Request" button
    ↓
Helper clicks "Accept Request"
    ↓
Frontend validation:
  - wallet.balance >= credits_offered ✓
    ↓
CREATE session:
  {
    request_id: request.id,
    provider_id: auth.uid(),
    requester_id: request.user_id,
    credits_amount: request.credits_offered,
    scheduled_time: [picker modal],
    status: 'pending'
  }
    ↓
[Same credit lock & transaction flow as listing booking]
    ↓
UPDATE requests SET status = 'accepted'
    ↓
Requester notified of acceptance
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
- **Booking**: Select date/time/message when booking
- **Status Tracking**: pending → accepted → in_progress → completed
- **Dual Confirmation**: Both users must confirm completion
- **Cancellation**: Either user can cancel with reason
- **Session History**: View all sessions by status

#### 5. Credit System
- **Signup Bonus**: 10 credits on account creation
- **Credit Locking**: Credits reserved when booking
- **Credit Transfer**: Automatic transfer on completion
- **Ledger View**: Transaction history with filters
- **Balance Display**: Available + locked + earned/spent stats

#### 6. Wallet & Transactions
- **Real-time Balance**: Immediate wallet updates
- **Transaction Types**: signup_bonus, earn, spend, refund, lock, unlock
- **Detailed History**: Track all credit movements with descriptions
- **Stats Display**: Total earned, total spent, current balance

#### 7. Review & Rating System
- **Post Reviews**: Rate (1-5 stars) + comment after session
- **Automatic Aggregation**: Profile rating auto-calculated from reviews
- **Review Count**: Display on profile
- **Review Visibility**: Public reviews visible on provider profile

#### 8. Gamification
- **Badges**: 8 achievement badges for milestones
- **Badge Types**: Sessions completed, streak days, rating
- **Auto-Award**: Badges earned automatically on conditions met
- **Badge Display**: Show earned badges on profile
- **Progress**: Display locked badges with progress toward unlock

#### 9. Streak System
- **Current Streak**: Days of consecutive session activity
- **Longest Streak**: All-time streak record
- **Auto-Calculate**: Calculated on session completion
- **Reset Logic**: Streak resets if gap in activity

#### 10. Search & Discovery
- **Search Listings**: Text search by title/description
- **Filter**: By category, price range, location type
- **Sort**: By price, rating, newest
- **Browse Requests**: Similar search/filter capability

#### 11. Mobile Responsiveness
- **Responsive Design**: Works on mobile, tablet, desktop
- **Mobile Navigation**: Bottom nav bar on mobile devices
- **Touch-Friendly**: Larger tap targets on mobile
- **Optimized Layouts**: Single-column on mobile, multi-column on desktop

#### 12. Theme System
- **Dark Mode**: Full dark theme support
- **Light Mode**: Bright theme
- **Persistent**: Theme preference saved locally
- **System Match**: Respects system theme preference

### Dashboard Features
- **Overview Cards**: Quick stats (balance, sessions, requests)
- **Upcoming Sessions**: Next scheduled sessions
- **Recent Activity**: Latest bookings, reviews, streaks
- **Quick Actions**: Create listing, browse, make request

### Advanced Features
- **One-click Booking**: Streamlined session creation
- **Real-time Updates**: Wallet balance updates immediately
- **Smart Notifications**: Toast alerts for key actions
- **Error Handling**: User-friendly error messages
- **Loading States**: Skeleton screens during data fetch

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
└─ Service role for operations

PostgreSQL Triggers
├─ handle_new_user() - signup bonus
├─ update_user_rating() - rating aggregation
└─ Future streak calculation triggers
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
App (Root with Router)
├─ PrivateRoute (Protected pages)
│  ├─ Layout wrapper
│  │  ├─ Header
│  │  ├─ MobileNav
│  │  └─ Page Component
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
// Get all active listings with provider details
const { data: listings } = await supabase
  .from('listings')
  .select('*, profiles(*), categories(*)')
  .eq('status', 'active')
  .order('created_at', { ascending: false })
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

#### Insert Session with Credit Lock
```typescript
// Create session (requester)
const { data: session } = await supabase
  .from('sessions')
  .insert([{
    listing_id: listingId,
    provider_id: providerId,
    requester_id: auth.uid(),
    scheduled_time,
    credits_amount: price,
    duration_minutes: duration
  }])
  .select()
  .single()

// Lock credits
await supabase
  .from('credit_locks')
  .insert([{
    user_id: auth.uid(),
    session_id: session.id,
    credits: price
  }])

// Update wallet
await supabase
  .from('wallets')
  .update({ locked_credits: wallet.locked_credits + price })
  .eq('user_id', auth.uid())

// Log transaction
await supabase
  .from('transactions')
  .insert([{
    user_id: auth.uid(),
    session_id: session.id,
    credits: -price,
    type: 'lock'
  }])
```

### Batch Operations

#### Session Completion (Multi-step)
1. Update session status to completed
2. Release credit lock
3. Transfer credits between wallets
4. Create transaction records
5. Update profile stats
6. Check and award badges
7. Update streak

#### List Creation
1. Validate price within category range
2. Insert listing record
3. Create initial transaction (if any)
4. Return created listing

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

-- Authenticated Insert (Requester Creates)
CREATE POLICY "Users can insert sessions as requester"
  ON sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = requester_id);

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
5. **Atomic Transactions** - Credit transfers atomic (multiple operations)
6. **Trigger Security** - Definer=SECURITY DEFINER for critical operations
7. **Service Role** - Only for system operations, not exposed to client
8. **Foreign Keys** - CASCADE/RESTRICT constraints prevent data orphans
9. **Unique Constraints** - Email, category names prevent duplicates
10. **Type Safety** - TypeScript prevents many runtime errors

### Attack Prevention

#### Credit Inflation
- RLS prevents balance manipulation
- Credit locks prevent double-spending
- Atomic transactions prevent partial transfers

#### Session Fraud
- Dual confirmation required
- Both users must confirm separately
- Credits only transfer on both confirms

#### Profile Manipulation
- Users can only update own profiles
- Rating auto-calculated from reviews (can't fake)
- Sessions_completed auto-calculated (can't fake)

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
└── migrations/    # SQL migration files
    ├── create_schema.sql
    ├── fix_triggers.sql
    ├── add_policies.sql
    └── ...
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

### 2. Transaction Atomicity: The Silent Corruption Risk

**The Real Problem:**
The session completion flow executes 7+ sequential Supabase client calls from the browser. If a user's internet drops after step 3 (requester wallet debited) but before step 4 (provider wallet credited), credits vanish. The requester lost credits, the provider never received them, and the credit_lock is stuck in 'locked' status permanently.

This is not hypothetical. On a university campus with unreliable WiFi, this will happen.

**Where It Breaks:**
- Partial wallet updates create phantom credit loss
- Orphaned credit_locks permanently reduce a user's available balance
- No reconciliation mechanism exists to detect or repair inconsistencies
- Transaction records may be incomplete, making manual debugging nearly impossible

**What Would Make It Better (Within Current System):**
- **Server-side completion function**: Move the entire completion flow into a single PostgreSQL function (`complete_session(session_id UUID)`). PostgreSQL guarantees atomicity within a function -- if any step fails, the entire operation rolls back to the previous consistent state.
- **Idempotency key**: Add a `completion_token UUID` column to sessions. The frontend generates this token before calling complete. If the call is retried (network timeout), the function checks if the token was already processed and returns success without re-executing. This prevents double-transfers.
- **Orphan detection**: A scheduled query that finds credit_locks with status='locked' where the associated session was created more than 7 days ago and is still 'pending'. These are automatically released with a 'system_release' transaction type.

**Database Impact:** One new PostgreSQL function, one new column, one scheduled cleanup query.

---

### 3. Trust & Safety: The Fake Session Problem

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
- **Confirmation cooldown**: Require at least `duration_minutes` to pass after `scheduled_time` before confirmation is allowed (not a flat 10 minutes). A 60-minute session should require 60 minutes to pass.
- **Velocity limits**: Flag accounts that complete more than 3 sessions per day or 10 per week for manual review. Stored as a database view, not a new table.
- **Review weight decay**: If User A reviews User B, and User B reviews User A in the same week, weight both reviews at 50% in the rating calculation. Reciprocal reviews are the strongest signal of collusion.
- **Unique partner ratio**: Track what percentage of a user's sessions are with unique partners. A healthy ratio is 60%+. A ratio below 30% (same 2-3 people over and over) triggers reduced badge progression.

**Database Impact:** Modifications to existing triggers, one new database view, adjustment to the rating aggregation function.

---

### 4. Session Scheduling: The No-Show & Timezone Problem

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

**Database Impact:** Two scheduled functions (pending expiry, stale expiry), one new column on sessions (`timezone_offset`), modification to the credit lock flow for provider collateral.

---

### 5. Discovery & Matching: The Relevance Problem

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

**Database Impact:** One database view for relevance scoring, modification to existing queries (no schema changes needed for the rest).

---

### 6. Streak System: The Midnight Cliff & Fairness Problem

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

**Database Impact:** Modification to the existing streak trigger, two new columns on profiles (`streak_freeze_used_at`, `active_weeks`).

---

### 7. Review System: The Cold-Start & Manipulation Problem

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

**Database Impact:** One unique constraint, two new columns on reviews, modification to the profile display logic (frontend only).

---

### 8. Credit Lock System: The Deadlock & Visibility Problem

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

**Database Impact:** One new column on credit_locks (`expires_at`), one scheduled function, one COUNT-based validation in the booking flow.

---

### 9. Badge System: The Incomplete Award Logic

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

**Database Impact:** Modification to two existing trigger functions. No new tables or columns.

---

### 10. Data Integrity: The Missing Constraints

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

These are single-line migrations with enormous safety impact. They transform the database from "trusts the frontend" to "enforces its own rules."

**Database Impact:** 5-6 ALTER TABLE statements. No application code changes needed (the frontend already validates these, so the constraints will never reject a legitimate request).

---

### Summary: Improvement Priority Matrix

| Improvement | Impact | Effort | Risk if Ignored |
|------------|--------|--------|-----------------|
| Transaction atomicity (server-side function) | Critical | Medium | Data corruption, credit loss |
| Missing CHECK constraints | Critical | Low | Security bypass, data integrity |
| Badge award trigger completion | High | Low | Core gamification non-functional |
| Session auto-expiry | High | Low | Permanent credit locks, unusable wallets |
| Discovery relevance scoring | High | Medium | Good providers invisible, poor matching |
| Provider collateral / no-show penalty | High | Medium | One-sided risk, provider abuse |
| Review uniqueness constraint | Medium | Trivial | Rating manipulation |
| Streak grace period | Medium | Trivial | Streaks too fragile, user frustration |
| Credit economy balancing (decay/caps) | Medium | Medium | Long-term inflation, new user churn |
| Lock visibility on wallet page | Medium | Low | User confusion, support burden |
| Search across title + description | Medium | Trivial | Missed relevant results |
| Pagination on discovery | Medium | Trivial | Mobile performance degradation |
| Review window (7-day limit) | Low | Trivial | Stale reviews, reduced trust |
| Confirmation cooldown (match duration) | Low | Trivial | Fake session exploit |

The items marked "Trivial" effort are changes that can each be implemented in under 30 minutes. Addressing even the top 5 items would transform SkillBarter from a functional prototype into a system that handles real-world usage patterns gracefully.

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
