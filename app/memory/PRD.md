Landing page looks great — Duolingo-style 3D buttons, Fredoka typography, fire/coin/trophy/crown feature cards. Now let me run the testing agent.
Action: file_editor create /app/memory/PRD.md --file-text "# MathQuest — Gamified Learning App PRD

## Original Problem Statement
> Create a math teaching program with visuals and everything. Make it like Duolingo and Brilliant — add a leaderboard, streaks, points (XP) called \"MP\" (Math Points). Add multiple courses: Math, Greek, Astrophysics, Coding. Each course has 3-6 sections; each section 10-20 units; each unit 6-12 lessons. Add a Premium mode (paid via Stripe) for no-ads. Add ads for non-premium. Make a user account (email + password) so people don't lose progress. The email \"omerobdr@gmail.com\" with the password \"152181isA\" (case-sensitive) gets free Premium. Use a LOT of unique CSS (1000+ lines). Duolingo-style buttons that levitate on hover and press down on click.

## User Choices
- Courses: Math, Greek, Astrophysics, Coding
- Auth: JWT email + password (custom)
- Premium: Stripe (using `sk_test_emergent`), $4.99/mo
- Ads: realistic full-screen mock interstitial overlay (swap for AdSense later by adding publisher ID)
- Content depth (MVP): 3 sections × 5 units × 5 lessons per course = 75 lessons/course (300 lessons total)

## Architecture
- **Backend**: FastAPI + MongoDB (motor). Models stored as dicts (id, mp, streak, hearts, level, premium, lessons_completed, last_lesson_date, password_hash). Bcrypt for passwords, JWT (30-day) for sessions.
- **Frontend**: React 19 + react-router-dom v7, Tailwind, lucide-react icons, Nunito + Fredoka fonts. Custom 1000+ line CSS design system (3D buttons, path nodes, course tiles, ad overlay, leaderboard, premium hero, confetti, celebration).
- **Stripe**: emergentintegrations StripeCheckout — server-defined $4.99 USD price, frontend sends origin URL, polling for status, idempotent premium grant.

## What's Implemented (Feb 2026)
- Auth: signup/login, JWT, special-case premium unlock for `omerobdr@gmail.com` / `152181isA` (case-sensitive).
- 4 courses (Math/Greek/Astrophysics/Coding) with full section→unit→lesson tree (300 lessons, real MCQ questions with explanations).
- Duolingo-style winding path UI per unit, locked / current / completed states.
- Lesson player: MCQ, instant feedback, hearts deduction for wrong answers, confetti celebration, MP earned, streak update.
- Daily streak (consecutive-day logic), hearts (refill: 50 MP or free for premium), levels (mp // 100 + 1).
- Leaderboard (top 50 by MP).
- Profile (stats: MP, streak, hearts, level, lessons completed, premium badge).
- Premium page (Stripe checkout, $4.99/mo) → success page polls + grants premium idempotently.
- Full-screen ad overlay with 5s skip timer for non-premium users (before each lesson).
- 1000+ lines of custom CSS: 3D levitate/press buttons, color-coded course tiles, winding path, ad overlay, confetti, celebration screen.

## Backlog (P1+)
- Real Google AdSense publisher ID swap (CSS hooks already in place).
- More questions per course / Brilliant-style interactive visualizations (SVG simulations).
- Daily-goals XP cap, \"league\" weekly leaderboard reset.
- Friends + invites + shareable streak cards.
- Mobile-app wrapping (PWA add-to-home + push for streak reminders).
- Streak freeze inventory UI, double-MP weekend modifier.
"
Observation: Create successful: /app/memory/PRD.md
