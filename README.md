# SkillBarter v1.p0

A peer-to-peer skill exchange platform for students to trade expertise using a credit-based system.

## What is SkillBarter?

SkillBarter connects students who want to learn with those who can teach. Instead of paying money, users exchange skills using credits:

- **Earn credits** by helping others with your expertise
- **Spend credits** to get help from skilled peers
- **Build streaks** by staying active and consistent
- **Collect badges** as you complete sessions and help others

## Features

- **Skill Listings** - Create listings to offer help in subjects you excel at
- **Help Requests** - Post requests when you need assistance
- **Session Booking** - Schedule 1-on-1 sessions with other students
- **Credit Wallet** - Track your balance, earnings, and spending
- **Badges & Streaks** - Gamification to encourage participation
- **Categories** - Browse by subject area (Programming, Math, Languages, etc.)
- **LIZA -- AI Tutor** - Personalized assistant that chats, generates flashcards, and creates MCQ quizzes from prompts, PDFs, or the current conversation

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with Neo-Brutalism theme
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Email/Password + Google OAuth)
- **Icons**: Lucide React
- **AI**: Supabase Edge Function (`liza-ai`) proxying free OpenRouter models with streaming SSE responses
- **PDF Parsing**: `pdfjs-dist` for in-browser text extraction (2 MB upload cap)

## Design

The app uses a **Neo-Brutalism** design aesthetic featuring:

- Bold black borders (2-3px)
- Hard offset shadows instead of soft glows
- Bright accent colors (cyan, yellow, emerald)
- Monospace code labels for a tech feel
- Space Grotesk + JetBrains Mono typography
- Grid overlay background texture

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env`:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/
│   ├── layout/      # Header, Layout, MobileNav
│   └── ui/          # Reusable UI components
├── contexts/        # React contexts (Auth, Theme)
├── lib/             # Supabase client
├── pages/           # Page components
└── types/           # TypeScript types
```

## Database Schema

The app uses Supabase with the following main tables:

- `profiles` - User profiles with ratings and streaks
- `wallets` - Credit balances and transaction history
- `listings` - Help offerings by users
- `requests` - Help requests from users
- `sessions` - Scheduled 1-on-1 sessions
- `reviews` - Session feedback and ratings
- `badges` - Achievement definitions
- `user_badges` - Earned badges per user
- `categories` - Skill categories

LIZA AI tutor tables:

- `liza_conversations` / `liza_messages` - Chat threads and streaming messages
- `liza_flashcard_sets` / `liza_flashcards` - Generated flip-card decks
- `liza_quizzes` / `liza_quiz_questions` / `liza_quiz_attempts` - MCQ quizzes and scored attempts

All tables use Row Level Security (RLS) for data protection.
