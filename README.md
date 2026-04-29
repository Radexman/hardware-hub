# Hardware Hub

AI-assisted internal hardware rental and inventory management platform built for the Booksy recruitment assignment.

Hardware Hub manages:
- Company equipment inventory
- Employee rental workflows
- Repair lifecycle tracking
- Role-based admin management
- AI-assisted hardware discovery (MVP semantic search planned)

> This repository is submitted as a recruitment task and intentionally includes demo fixtures, seeded users, structured AI collaboration artifacts, and phased implementation documentation for review.

---

# Overview

Hardware Hub is designed as an internal equipment management platform where employees can browse and rent devices while administrators manage inventory, repairs, and user onboarding.

The project emphasizes:

- AI-native product thinking
- Spec-driven development
- Role-based system design
- Incremental delivery through documented feature phases
- Human + AI collaborative engineering workflow

Core MVP includes:

## Employee Flows
- Browse hardware inventory
- Search, sort and filter devices
- Rent available equipment
- Return assigned equipment
- View active rentals and due dates

## Admin Flows
- Admin inventory management
- Create and edit devices
- Repair state toggling
- Admin user onboarding
- Protected admin controls

## Platform
- Credentials authentication
- Role-based route protection
- Server actions + optimistic mutations
- Database-backed inventory and rental history

---

# Demo Accounts

The seeded database includes three review accounts:

| Role  | Email                | Password   | Notes |
|------|----------------------|------------|------|
| Admin | `admin@booksy.com` | `admin123` | Full admin access |
| User | `j.doe@booksy.com` | `user123` | Active rental seeded |
| User | `a.smith@booksy.com` | `user123` | Active rental seeded |

> Demo credentials exist solely for assignment review and are not intended for production use.

---

# Tech Stack

### Frontend
- Next.js 16 (App Router + Turbopack)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Lucide Icons

### Backend
- Prisma 7
- Neon Postgres
- Auth.js v5 (NextAuth)
- Server Actions
- bcryptjs

### Tooling
- ESLint v9
- Vitest (planned)
- Playwright (planned critical-path coverage)

---

# Implemented Features

## Inventory Management
- Hardware catalog from Prisma-backed DB
- Grid and Google-Drive-style list views
- Search + sort controls
- Status-aware device cards
- Repair lifecycle states

## Rental Workflow
- Rent flow with confirmation dialog
- Return flow with confirmation dialog
- 7 / 14 / 30 day rental presets
- Due-date classification
- Optimistic updates
- Rental history writes via transactions

## Admin Panel
- Inventory administration
- Create / edit devices
- Repair toggle actions
- Admin user onboarding UI
- Admin-only protected routes

## Authentication & Access Control
- Credentials login
- Session-based protected routes
- Role-based admin authorization
- Session-scoped rentals

## UX
- Responsive dashboard
- shadcn dialog-driven workflows
- Sonner feedback toasts
- Skeleton loading states
- Shared reusable card architecture

---

# Architecture Notes / Key Decisions

Selected tradeoffs made intentionally for MVP scope:

- Prioritized repair lifecycle over destructive inventory delete flows
- Scoped user management to onboarding only (edit/deactivation deferred)
- Used server actions rather than separate REST endpoints for mutations
- Chose phased feature delivery over broad one-shot implementation
- Simplified complex CRUD edge cases to prioritize AI feature + testing coverage

---

# AI-Assisted Development Workflow

Development was organized around a structured spec-driven collaboration model with Claude Code.

## Feature Lifecycle

Work was driven through a custom feature command workflow:

```bash
feature load
feature start
feature complete
```

Feature lifecycle:

```text
load → analyze → implement → complete
```

## AI Context System

AI collaboration was structured through a dedicated `/context` architecture:

```text
context/
  project-overview.md
  coding-standards.md
  current-feature.md
  features/*.md
  screenshots/*
```

### Context Roles

## `project-overview.md`
Persistent architectural context:
- Tech stack
- Schema/domain model
- project constraints
- coding patterns

## `coding-standards.md`
Shared implementation standards used during feature generation.

## `current-feature.md`
Primary working memory file and living development log.

Tracks:
- Active feature scope
- implementation goals
- notes / gotchas
- chronological feature history
- AI-assisted incremental "commit-style" progress log

This acts as the prompt-history artifact rather than relying on raw chat transcripts.

## `features/*.md`
Spec files used as structured implementation prompts.

Examples:
- auth phases
- rental workflow phases
- admin CRUD phases
- semantic search planning
- testing phases

Each feature was scoped before implementation and loaded into active context.

## `screenshots/`
UI reference assets used by AI to align generated interfaces with intended designs.

---

## Claude Skills / Commands

Custom Claude skills in `.claude/` orchestrate feature delivery.

Examples:

### `feature load`
Loads a feature spec into active context and updates `current-feature.md`.

### `feature start`
Begins implementation against the loaded feature.

### `feature complete`
Updates feature history and closes the phase.

This created an iterative:

```text
spec → implement → document
```

loop for development.

---

# AI Decision Log (Selected Examples)

AI collaboration contributed to:

- Spec refinement and phased delivery planning
- Auth.js split config architecture
- Prisma mutation patterns
- UI generation using screenshot-driven context
- CRUD scope reduction to protect MVP delivery
- Rental workflow guard modeling
- Repair-state business rule design

Examples of AI-assisted product decisions:

- Removed destructive delete flows from MVP scope
- Prioritized repair lifecycle over full inventory deletion
- Reduced user CRUD to onboarding-only for MVP
- Chose lightweight semantic search MVP over over-engineered vector infrastructure
- Used spec-driven feature sequencing rather than ad hoc prompting

AI was used as a collaborative engineering tool, not code generation alone.

---

# Repository / Commit Strategy

Development followed incremental commits intended to show collaborative evolution rather than a single bulk "initial commit".

Feature phases map closely to commit history and `current-feature.md` history entries.

---

# Quick Start

Prerequisites:
- Node 20.19+
- Neon Postgres database
- `.env` with `DATABASE_URL`
- Auth environment variables

Install:

```bash
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

App:
```bash
http://localhost:3000
```

---

# Useful Scripts

| Script | Description |
|---|---|
| npm run dev | Start Next dev server |
| npm run build | Production build |
| npm run lint | Run ESLint |
| npx prisma migrate dev | Apply migrations |
| npx prisma db seed | Seed demo data |
| npx tsx scripts/test-db.ts | Inspect seeded DB data |
| npm run db:migrate:deploy:prod | Apply prod migrations |
| npm run db:seed:prod | Seed prod branch |
| npm run db:test:prod | Verify prod seed |

---

# Environment Variables

```env
DATABASE_URL=
AUTH_SECRET=
AUTH_URL=
```

---

# Testing (Planned / In Progress)

Critical-path Playwright coverage planned for:

- Rent available item
- Prevent renting repair item
- Admin route protection

Additional DAL unit coverage planned via Vitest.

---

# Deployment

Deployment target:
- Vercel (preferred)
- Neon Postgres

Live demo link:
`[add deployment url here]`

---

# Screenshots

UI references and implementation targets live in:

```text
context/screenshots/
```

Includes:
- login
- hardware list
- my rentals
- admin panel
- create item flow

(Production screenshots to be added in final submission.)

---

# Project Status

Current progress (approx.):

```text
~85% complete toward scoped MVP
```

Remaining:
- Admin User Management persistence
- AI Semantic Search MVP
- Critical-path Playwright tests
- Final polish / documentation

---

# Notes For Reviewers

This assignment intentionally emphasizes:

- Product thinking under time constraints
- AI-assisted engineering workflow
- Structured specification-driven delivery
- Tradeoff decisions and scope management
- Clean incremental collaboration history

Please see:
- `context/current-feature.md`
- `context/features/`
- `.claude/`
for the AI collaboration artifacts and phased development record.
