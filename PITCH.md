# SkillBarter -- Team Pitch Guide

## Presentation Order & Timing

| Order | Speaker | Role | Duration | Covers |
|-------|---------|------|----------|--------|
| 1 | Rushikesh | Project Lead & System Architect | ~3 min | Problem, solution, architecture, database design |
| 2 | Sandesh | Frontend Developer | ~3 min | UI/UX walkthrough, component architecture, live demo |
| 3 | Rutuja | Backend & Database Administrator | ~3 min | Security, atomic operations, data integrity, RLS |
| 4 | Pavankumar | UI/UX Designer & QA Tester | ~3 min | Design decisions, testing, accessibility, quality |

**Total: ~12 minutes + Q&A**

---

## 1. Rushikesh -- Project Lead & System Architect

### Opening (30 seconds)

"Good morning. We are Team SkillBarter. The project we are presenting today addresses a problem every student in this room has faced -- needing help with something and not knowing who to ask, or having a skill but no way to offer it.

SkillBarter is a peer-to-peer skill exchange platform for university students. No money changes hands. Instead, students earn and spend Time Credits -- a virtual currency that keeps the system fair and accessible to everyone."

### The Problem (30 seconds)

"Here is the problem we identified:

- Students need affordable help -- tutoring, resume reviews, mock interviews, project collaboration -- but existing platforms charge money.
- Students who are good at something have no easy way to offer that skill to their peers.
- There is no trust system. If I ask a stranger for help, how do I know they will show up? How do I know the quality will be acceptable?

We needed a platform that solves all three: discovery, trust, and fair exchange."

### The Solution -- Architecture (1 minute)

"Let me walk you through how we built this.

The system is a three-layer architecture:

**First, the frontend** -- built with React 18 and TypeScript. It handles all the user interaction: browsing listings, booking sessions, managing wallets. Sandesh will walk you through this in detail.

**Second, the Supabase backend** -- this is a managed PostgreSQL database with built-in authentication. We have 11 core tables covering profiles, wallets, listings, requests, sessions, credit locks, reviews, badges, user badges, transactions, and categories, plus 7 tables powering Zeno -- our in-app AI tutor -- for conversations, messages, flashcard sets, flashcards, quizzes, quiz questions, and quiz attempts. Zeno runs on a single Supabase Edge Function that proxies to free models on OpenRouter, so no API keys ever touch the browser.

**Third, and this is what I am most proud of -- we have 5 atomic server-side functions** that handle every credit-sensitive operation. When a student books a session, the system does not make 4 separate database calls from the browser. Instead, it makes one call to a PostgreSQL function called `book_session()`. That function locks the wallet row, validates the balance, creates the session, locks the credits, updates the wallet, and records the transaction -- all in a single database transaction. If any step fails, everything rolls back. No partial state. No lost credits.

We built the same pattern for session completion, cancellation, and request acceptance. Rutuja will explain the security implications of this design."

### Database Design Highlights (45 seconds)

"A few design decisions worth mentioning:

**Normalization**: Our schema follows Third Normal Form with intentional denormalization. Fields like `rating`, `sessions_completed`, and `current_streak` on the profiles table are technically derived values. But recalculating them from raw data on every page load would require expensive aggregate queries. So we store them and keep them in sync through triggers and our atomic functions.

**Constraints**: We do not trust the frontend. The database itself enforces non-negative wallet balances, prevents self-booking, prevents duplicate reviews, and validates rating ranges -- all through CHECK and UNIQUE constraints. Even if someone bypasses our UI entirely and calls the API directly, the database rejects invalid operations.

**12 migrations** track the complete evolution of our schema, from the initial table creation through atomic functions and integrity constraints, and finally the Zeno AI tables with their own RLS policies."

### Closing Handoff (15 seconds)

"That is the architecture. Now Sandesh will show you what this looks like from a student's perspective."

---

## 2. Sandesh -- Frontend Developer

### Opening (15 seconds)

"Thank you, Rushikesh. I built the entire user-facing application using React, TypeScript, and Tailwind CSS. Let me walk you through what a student actually experiences."

### Live Demo Walkthrough (2 minutes)

*Navigate through the app as you speak. Show each page briefly.*

"When a new student arrives, they see our landing page -- clean, informative, tells them exactly what the platform does.

**Signup flow**: They enter their name, email, university, and password. We have a real-time password strength indicator -- it evaluates length, uppercase, numbers, and special characters and shows four levels: Too short, Weak, Medium, Strong. The moment they sign up, a PostgreSQL trigger creates their profile, wallet with 10 welcome credits, and their first badge -- all automatically.

**Dashboard**: After login, the student lands here. They see their credit balance, active sessions count, upcoming sessions, and quick action buttons. Everything loads with shimmer skeleton animations so the user never stares at a blank screen.

**Discover page**: This is where students browse available help. I built debounced search -- as you type, the search waits 300 milliseconds after you stop typing before querying. This prevents hammering the database with every keystroke. Results are paginated -- 18 per page with a Load More button. You can filter by category and location type, and sort by price, rating, or newest.

**Booking**: When they click a listing, they see full details plus the provider's reviews and rating. The Book Now button opens a modal with date and time pickers. When they submit, it calls the `book_session` RPC that Rushikesh described -- one atomic call handles everything.

**Session Detail**: After booking, both users track the session here. The confirm button is disabled until the scheduled time plus the session duration has passed -- so a 60-minute session requires 60 minutes to elapse. Both users must confirm independently. When the second person confirms, credits transfer instantly.

**Wallet**: Shows available balance, locked credits with an expandable breakdown showing which session holds each lock, and a full transaction history with Load More pagination.

**Zeno -- AI Tutor**: This is a dedicated page inside the app. On the left is a chat history grouped by Today, This Week, and Older. In the center is the chat with streaming responses -- Zeno knows the student's name, skills, sessions, and rating because the Edge Function reads the profile before calling the model. On the right is a Studio panel with two actions: Flashcards and Quiz. A student can generate 3-20 flashcards or 3-30 MCQ questions from a prompt, an uploaded PDF up to 2 MB, or the current conversation. PDFs are parsed in the browser using pdfjs-dist so the extracted text stays under Edge Function payload limits. Flashcards open in a flip-card viewer with shuffle and restart. Quizzes open as an A-D multiple-choice runner with a results screen that shows the correct answer and an explanation for every question, and every attempt is saved to the database so students can track their progress."

### Technical Highlights (30 seconds)

"A few technical points:

- **14 reusable UI components** -- Button, Card, Modal, Input, Select, Toast, StarRating, Skeleton, and more. Each is props-driven and theme-aware.
- **Dark mode** throughout, respecting system preferences and persisting the choice.
- **Mobile navigation** with a bottom bar showing 4 primary items and an expandable More menu for secondary pages.
- **Error boundaries** catch rendering crashes and show a recovery UI instead of a white screen.
- **Reduced motion support** -- all animations automatically disable for users who have that OS setting enabled.

I will hand off to Rutuja who will explain how we protect all this data."

---

## 3. Rutuja -- Backend & Database Administrator

### Opening (15 seconds)

"Thank you, Sandesh. My responsibility was making sure that every piece of data in this system is secure, consistent, and impossible to corrupt -- even if someone tries deliberately."

### Authentication & RLS (1 minute)

"We use Supabase Authentication with email and password. When a user signs up, Supabase creates a record in `auth.users`, and our trigger automatically creates their profile, wallet, and welcome transaction.

Every single table in our database has Row Level Security enabled. This means by default, nobody can read or write anything. We then add specific policies:

- **Profiles**: Anyone can view profiles, but you can only edit your own.
- **Wallets**: You can only see and modify your own wallet. Nobody else can see your balance.
- **Sessions**: Only the two participants can see a session. Nobody else even knows it exists.
- **Transactions**: Only visible to the user they belong to.

We have over 20 RLS policies across 11 tables. The key principle is: default deny, then explicitly allow only what is needed."

### Atomic Operations & Data Integrity (1 minute 15 seconds)

"The most important thing I worked on was making credit operations bulletproof.

Consider what happens when a session completes. We need to: mark the session complete, deduct credits from the requester's wallet, add credits to the provider's wallet, update the credit lock status, create two transaction records, update the provider's session count, recalculate their streak, and check if they earned any badges. That is 9 or more operations.

If we did these as separate calls from the browser and the internet dropped halfway through, credits could vanish. The requester loses credits, the provider never receives them. This is not hypothetical -- on university WiFi, this would happen.

So we moved all of this into a single PostgreSQL function called `complete_session()`. It runs inside one database transaction. It uses `SELECT ... FOR UPDATE` to lock the wallet rows so no concurrent operation can interfere. If any step fails -- for example, if a CHECK constraint rejects a negative balance -- PostgreSQL automatically rolls back every change. Nothing is half-done.

We built 5 of these atomic functions: `book_session`, `complete_session`, `cancel_session`, `accept_request`, and `award_badges`. The frontend makes one RPC call. The database handles the complexity.

On top of this, we added CHECK constraints directly on the tables:
- Wallet balance cannot go negative
- Locked credits cannot go negative
- You cannot book a session with yourself
- You cannot submit duplicate reviews for the same session

These constraints are the last line of defense. Even if our application code had a bug, the database would reject the invalid operation."

### Indexing (30 seconds)

"For performance, we added composite indexes on the columns that are queried together most often. For example, `sessions(provider_id, status)` lets the database efficiently find all of a provider's pending sessions without scanning the entire table. We have similar composite indexes on `credit_locks(session_id, status)` and `reviews(session_id, reviewer_id)`.

Pavankumar will now cover how we validated all of this through testing."

---

## 4. Pavankumar -- UI/UX Designer & QA Tester

### Opening (15 seconds)

"Thank you, Rutuja. My role was twofold: designing the user experience from the ground up, and then systematically breaking it to find every possible failure."

### Design Philosophy (1 minute)

"The design principle behind SkillBarter is: a student should be able to sign up, find help, and book a session in under 2 minutes. Every screen has one primary action. We do not overwhelm users with options.

**Visual hierarchy**: We use a consistent 8-pixel spacing grid, a 6-color system with multiple shades, and a maximum of 3 font weights. Dark mode is not an afterthought -- every component was designed for both themes simultaneously.

**Mobile-first**: Over 60% of students access platforms on their phones. Our mobile navigation has 4 primary items at the bottom -- Dashboard, Discover, Sessions, Profile -- with a More menu that expands to reveal Wallet, Badges, Listings, Requests, and Settings. Touch targets are minimum 48 pixels.

**Trust signals**: We display a 'New Provider' label for users with fewer than 3 reviews instead of showing an empty rating. This reframes 'unproven' as 'new opportunity' rather than 'untrustworthy'. Once they reach 3 reviews, the numeric rating appears.

**Accessibility**: We implemented ARIA landmarks on all layout regions, `aria-current='page'` on navigation items, `aria-expanded` on expandable menus, and we support `prefers-reduced-motion` so users who are sensitive to animation see no transitions."

### Testing Approach (1 minute 15 seconds)

"I created a comprehensive test matrix covering every feature. Let me highlight the critical flows I tested:

**Credit integrity testing**: I verified that when a session is booked, the requester's available balance decreases and locked credits increase by exactly the right amount. When cancelled, credits return completely. When completed, the provider receives the exact amount. I tested what happens when a user tries to book a session that costs more than their balance -- the atomic function rejects it cleanly.

**Self-booking prevention**: I verified that the database CHECK constraint prevents a user from booking their own listing, even if someone bypasses the frontend validation.

**Duplicate review prevention**: After posting a review, I attempted to post another for the same session. The UNIQUE constraint blocks it at the database level.

**Dual confirmation**: I tested that credits do not transfer until both users confirm. If only one confirms, the session stays in 'confirmed' state. Only when the second person confirms does the full completion trigger.

**Confirmation timing**: I verified the confirm button is disabled until scheduled_time plus duration has passed. A 60-minute session at 2:00 PM cannot be confirmed until 3:00 PM.

**Responsive testing**: I tested across three breakpoints -- 375px mobile, 768px tablet, and 1920px desktop. Navigation adapts correctly, forms remain usable, and all content is readable.

**Dark mode**: Every component was checked in both themes. Text contrast ratios meet readability standards in both modes."

### Closing (30 seconds)

"In summary: SkillBarter is not a prototype. It is a production-grade system with atomic server-side operations, database-level integrity constraints, comprehensive RLS security, full accessibility support, and a design that respects students' time.

We are happy to take any questions."

---

## Potential Judge Questions & Answers

### Architecture & Design

**Q: Why did you choose Supabase instead of Firebase or a custom backend?**

A (Rushikesh): "Supabase gives us a real PostgreSQL database with full SQL capabilities -- triggers, functions, transactions, CHECK constraints, Row Level Security. Firebase is a document database that cannot enforce relational integrity or run atomic multi-table operations. Our credit system requires ACID guarantees that only a relational database provides. Supabase also includes authentication and a JavaScript client library, so we get a complete backend without managing servers."

**Q: Why not use a state management library like Redux?**

A (Sandesh): "Our data comes directly from the database via Supabase queries. We use React Context for two pieces of global state: authentication status and theme preference. Everything else is fetched in component-level `useEffect` hooks. Redux would add complexity without benefit because we do not have complex client-side state transformations -- the server is the source of truth."

**Q: How does your system handle concurrent operations? What if two users try to book the same listing at the same time?**

A (Rutuja): "Our atomic functions use `SELECT ... FOR UPDATE` which places a row-level lock on the wallet. If two users try to book simultaneously, the second request waits until the first transaction completes. Then it reads the updated balance and proceeds only if funds are still sufficient. This is standard PostgreSQL concurrency control -- no application-level locking needed."

**Q: What happens if a user closes their browser mid-booking?**

A (Rushikesh): "Because booking is a single RPC call to an atomic PostgreSQL function, it either completes entirely or not at all. If the browser closes before the response returns, the operation already committed on the server, or it rolled back. There is no intermediate state. The user will see the session on their next login."

---

### Security

**Q: What prevents a user from manipulating their wallet balance directly through the API?**

A (Rutuja): "Three layers of protection. First, RLS policies restrict wallet updates to the authenticated user's own wallet. Second, our atomic functions use SECURITY DEFINER and handle all wallet modifications server-side -- the frontend never directly UPDATEs the wallet table for credit operations. Third, CHECK constraints at the database level reject any update that would make the balance negative. Even if someone crafted a raw API call, the database itself would reject invalid values."

**Q: Can users fake reviews or inflate their ratings?**

A (Rutuja): "No. The rating field on profiles is not directly writable by users. It is updated only by the `update_user_rating()` trigger, which fires when a review is inserted. The trigger recalculates the average from all reviews. Reviews require a valid `session_id` pointing to a completed session where the reviewer was a participant. A UNIQUE constraint on `(session_id, reviewer_id)` prevents duplicate reviews. The rating cannot be manipulated without actually completing a legitimate session and receiving a genuine review."

**Q: What if two friends collude to create fake sessions and boost each other's stats?**

A (Rushikesh): "We addressed this partially. The confirmation cooldown requires the full session duration to elapse -- a 60-minute session needs 60 real minutes. The self-booking constraint prevents a user from booking their own listing. For future improvement, we documented velocity limits (flagging users with more than 3 sessions per day), unique partner ratio tracking, and review weight decay for reciprocal reviews. These are documented in our blackbook as identified risks with proposed solutions."

---

### Database

**Q: Explain your normalization decisions. Why store rating on the profiles table?**

A (Rushikesh): "Strictly, storing `rating` and `total_reviews` on the profiles table violates Third Normal Form because these values are derived from the reviews table. We chose intentional denormalization because the profile rating is displayed on every listing card, every search result, and every profile view. Computing `AVG(rating)` from the reviews table on each of these page loads would be expensive. Instead, we maintain the denormalized value through a trigger: every time a review is inserted, `update_user_rating()` recalculates and updates the profile. The value is always consistent because the trigger runs within the same transaction as the INSERT."

**Q: How many migrations do you have and why?**

A (Rutuja): "12 migrations. Each represents a logical change to the schema. The first creates the full initial schema. Subsequent migrations fix the signup trigger, add service role policies, add review and streak triggers, optimize indexes, add foreign key constraints between tables, fix RLS policies for specific use cases, add CHECK constraints and all 5 atomic functions, and finally add the 7 Zeno AI tables with their own RLS policies. We follow a strict rule: never modify an existing migration file. Each migration uses `IF NOT EXISTS` and `IF EXISTS` checks so it can be safely re-run."

**Q: What is the `credit_locks` table and why do you need it?**

A (Rushikesh): "When a student books a session, their credits need to be reserved so they cannot spend them elsewhere before the session happens. The `credit_locks` table records this reservation: which user, which session, how many credits, and the lock status (locked, released, or transferred). It has an `expires_at` column that defaults to 72 hours -- if a session gets stuck, the lock eventually expires rather than holding credits permanently. During session completion, the lock status changes to 'transferred'. During cancellation, it changes to 'released' and credits return to the user's available balance."

---

### Frontend

**Q: How do you handle loading states and errors?**

A (Sandesh): "Every page that fetches data shows shimmer skeleton animations during loading -- not spinners, but layout-shaped placeholders that pulse. This gives users a sense of the page structure before data arrives. For errors, we have React error boundaries that catch rendering crashes and display a recovery screen with a retry button. API errors show toast notifications with user-friendly messages. Form validation errors appear inline below each field."

**Q: How does your dark mode work?**

A (Sandesh): "We use React Context to store the theme preference. On first load, we check `localStorage` for a saved preference. If none exists, we check the operating system's `prefers-color-scheme` media query. The theme toggle adds or removes a `dark` class on the HTML element. Tailwind CSS has native dark mode support through the `dark:` prefix -- so `bg-white dark:bg-gray-900` switches automatically. The preference persists in `localStorage` across sessions."

**Q: Why did you build 14 custom UI components instead of using a component library?**

A (Sandesh): "Two reasons. First, bundle size -- a library like Material UI or Chakra adds hundreds of kilobytes of JavaScript. Our entire application is about 250KB gzipped. Second, control -- we needed every component to support dark mode, our specific color system, and our accessibility requirements. Building custom components with Tailwind gave us full control over styling, behavior, and performance."

---

### Testing & QA

**Q: How did you test the credit system?**

A (Pavankumar): "I tested the complete credit lifecycle: signup bonus (10 credits appear), booking (credits lock), cancellation (credits unlock and return), completion (credits transfer to provider), and the review flow after completion. For each step, I verified wallet balances, transaction records, and credit lock statuses matched expected values. I also tested edge cases: booking with insufficient balance, self-booking attempts, duplicate review submissions, and confirming before the session time has elapsed."

**Q: What accessibility standards did you follow?**

A (Pavankumar): "We followed WCAG 2.1 Level AA guidelines. Specifically: all interactive elements have minimum 48px touch targets on mobile, all form inputs have associated labels, error messages use ARIA roles, navigation uses ARIA landmarks and `aria-current` for the active page, expandable menus use `aria-expanded`, and all animations respect the `prefers-reduced-motion` media query. Color contrast ratios were verified to be readable in both light and dark themes."

**Q: What was the most critical bug you found during testing?**

A (Pavankumar): "The most critical issue was that before we added the atomic functions, the session completion flow made 7 separate API calls from the browser. During testing on a slow connection, I was able to reproduce a scenario where credits were deducted from the requester but the provider never received them because the connection dropped mid-sequence. This directly led to the decision to move all credit operations into server-side atomic PostgreSQL functions. After that change, the same test passed reliably because the database guarantees all-or-nothing execution."

---

### Zeno -- AI Tutor

**Q: Why build your own AI tutor instead of pointing students at ChatGPT?**

A (Rushikesh): "Generic assistants do not know the student. Zeno does. Before every response, our Edge Function pulls the user's profile from the database -- their name, skills they teach, skills they want to learn, sessions completed, and rating -- and builds a system prompt from it. So when a Computer Science student who teaches Java asks for help with recursion, Zeno knows to treat them as experienced. When the same student asks about photography, which they listed as wanting to learn, Zeno scaffolds from fundamentals. It also ties directly into the platform -- flashcards and quizzes are saved to the same Supabase database as the rest of their SkillBarter activity."

**Q: How do you keep the OpenRouter API key safe?**

A (Rutuja): "The key is stored as a Supabase Edge Function secret. The browser never sees it. Every Zeno request goes through our `liza-ai` Edge Function, which verifies the user's Supabase JWT, loads their profile, builds the prompt server-side, calls OpenRouter, and streams tokens back to the browser via Server-Sent Events. The client only sees the user's own JWT and the text stream. If the key ever leaks, we rotate it as a single secret update -- no code redeploy needed."

**Q: What stops a user from reading someone else's flashcards or chat history?**

A (Rutuja): "Row Level Security. Every Zeno table has RLS enabled with policies tied to `auth.uid()`. A user can only SELECT, INSERT, UPDATE, or DELETE rows where they are the owner. For nested tables like flashcards or quiz questions, the policy checks ownership through the parent set or quiz via an EXISTS subquery. Even if someone crafts a raw API call with another user's ID, PostgreSQL rejects the query at the row level."

**Q: Why free models? Is the quality good enough?**

A (Sandesh): "We use OpenRouter's fallback routing across two free models that support structured output -- Nemotron 120B as primary and Gemma 4 31B as fallback. If one hits a rate limit, OpenRouter automatically reroutes. For chat it is more than enough. For flashcards and quizzes we request strict JSON output and validate it server-side before inserting -- any malformed response is rejected with a clear error message. This also keeps our infrastructure cost at zero during the demo phase, which matters for a student-built project."

**Q: How big of a PDF can Zeno handle?**

A (Pavankumar): "We cap file uploads at 2 MB and truncate extracted text at 30,000 characters before sending it to the model. Text extraction happens in the browser using pdfjs-dist -- the user's machine does the heavy lifting, and only clean text crosses the network. We tested with scanned PDFs and surface a clear error explaining that scanned images are not supported. The UI shows the extracted character count in real time so students know what Zeno will actually read."

---

### General / Business

**Q: How is this different from existing platforms like Chegg or Wyzant?**

A (Rushikesh): "Those platforms charge money. A student who cannot afford tutoring is excluded. SkillBarter uses Time Credits -- you earn them by helping others and spend them to get help. This creates a circular economy where participation is the only currency. It also encourages students to teach, which research shows deepens their own understanding of the subject. And between sessions, Zeno -- our built-in AI tutor -- fills the gap. It generates flashcards and quizzes from a student's own material, so they can keep studying when no human tutor is online."

**Q: What would you need to change for a real campus deployment?**

A (Rushikesh): "Three things. First, email verification to ensure only university email addresses can register. Second, a scheduled database function that auto-expires stale sessions and releases locked credits -- we have the infrastructure (the `expires_at` column) but not the scheduled job yet. Third, credit economy monitoring -- tracking total credits in circulation and adjusting the signup bonus if inflation occurs. All three are documented in our blackbook with specific implementation plans."

**Q: How does your system prevent credit inflation over time?**

A (Rushikesh): "Currently, every signup adds 10 credits to the system and credits only transfer between users -- none leave. Over time, total credits grow linearly with signups. We documented this as a known limitation with proposed solutions: credit decay (idle credits lose 1-2% monthly), wallet caps (maximum 100 credits), and dynamic signup bonuses that scale with platform activity. These are future improvements that require monitoring real usage patterns before tuning the parameters."

**Q: What was the biggest technical challenge?**

A (Rutuja): "Making the credit system safe. In any financial system -- even one using virtual currency -- partial failures are unacceptable. Moving from sequential browser-side calls to atomic server-side functions was the most significant architectural change we made. It required rewriting every credit operation as a PostgreSQL function with row-level locking, proper error handling, and rollback guarantees. The result is that our credit system has the same transactional integrity guarantees as a banking application."
