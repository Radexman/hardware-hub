# Hardware Hub

AI-assisted internal hardware rental and inventory management platform built for the Booksy recruitment assignment.

Hardware Hub manages:
- Equipment inventory and rentals
- Repair lifecycle tracking
- Role-based admin management
- Admin user onboarding
- AI-assisted development workflows

> This repository intentionally includes seeded demo data, structured AI collaboration artifacts, phased specs, and implementation history for review.

---

# Overview

Hardware Hub is designed as an internal tool where employees browse and rent equipment while administrators manage inventory, repairs, and user access.

The project emphasizes:

- AI-native product thinking
- Spec-driven delivery
- Role-based system design
- Human + AI collaborative engineering workflow

## Core MVP Features

### Inventory & Rentals
- Hardware catalog with grid + list views
- Search, sorting and status filters
- Rent / return workflows
- Rental deadlines and due-state indicators
- Repair state lifecycle

### Admin
- Device management (create/edit/repair)
- Admin inventory controls
- User onboarding (admin only)
- Protected admin routes

### Platform
- Credentials authentication
- Role-based access control
- Server actions + optimistic mutations
- Prisma + Neon backed persistence

---

# Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@booksy.com | admin123 |
| User | j.doe@booksy.com | user123 |
| User | a.smith@booksy.com | user123 |

Demo credentials exist only for reviewer access.

---

# Tech Stack

**Frontend**
- Next.js 16 / React 19 / TypeScript
- Tailwind v4
- shadcn/ui

**Backend**
- Prisma 7
- Neon Postgres
- Auth.js v5
- Server Actions
- bcryptjs

**Tooling**
- ESLint
- Playwright (critical path tests)
- Vitest (planned unit coverage)

---

# AI-Assisted Development Workflow

Development followed a custom spec-driven Claude Code workflow combining planning, implementation, testing, review, and structured documentation in an iterative loop.

Rather than using AI through ad hoc prompting, features were developed through reusable commands, persistent project context, and documented feature phases.

<img width="2421" height="3748" alt="AI Workflow" src="https://github.com/user-attachments/assets/a40c34e3-f5ef-4972-b650-8b7e5007f546" />

## Feature Workflow

Custom Claude skills in:

```text
.claude/skills/feature/
```

drive a structured feature lifecycle:

```text
document → implement → test → review → complete
```

Primary commands:

```bash
feature load
feature start
feature test
feature review
feature complete
```

Typical flow:

1. A feature is first scoped as a markdown spec in:

```text
context/features/
```

2. `feature load` loads the spec and supporting project context into active working context.

3. `feature start` implements the feature against that spec.

4. `feature test` validates behavior through manual QA, TDD, or iterative fixes.

5. `feature review` performs a refinement / review pass before commit.

6. `feature complete` updates documentation and closes the feature lifecycle.

Implementation history and AI collaboration decisions are tracked in:

```text
context/current-feature.md
```

which acts as both the active development log and chronological feature ledger.

## Context Architecture

Structured context used throughout AI collaboration:

```text
context/
  project-overview.md
  coding-standards.md
  current-feature.md
  features/
  screenshots/
```

### Key Artifacts

**`project-overview.md`**  
Product architecture, domain rules, and technical constraints.

**`current-feature.md`**  
Active feature context plus chronological implementation history (used as the primary AI collaboration log).

**`features/`**  
Phased feature specs used as structured implementation prompts.

**`screenshots/`**  
Visual UI references used to guide implementation.

**`.claude/skills/feature/`**  
Custom Claude skill commands supporting the documented workflow above.

Rather than relying on raw prompt history as documentation, the collaboration trail is captured through specs, command workflows, and `current-feature.md`.

---

# MCP Tooling Used

The project also uses MCP tooling as part of the AI workflow:

## Neon MCP
Used for:
- Direct DB inspection
- Seed verification
- Query debugging
- Schema validation during Prisma work

## Playwright MCP
Used for:
- Browser workflow validation
- E2E testing support
- Critical user-flow verification

## Context7
Used to keep AI grounded in current library conventions and updates, especially for:
- Next.js 16
- Auth.js v5
- Prisma 7
- shadcn/ui

This was particularly useful when verifying evolving framework conventions.

---

# Selected Engineering Tradeoffs

Intentional MVP decisions:

- Prioritized repair lifecycle over destructive inventory delete flows
- Reduced user CRUD scope to onboarding-only for MVP
- Used server actions instead of separate API layer for mutations
- Simplified complex CRUD edge cases to prioritize AI feature + testing coverage

These decisions were made intentionally under assignment time constraints.

---

# Repository / AI Log

Incremental commits reflect feature-by-feature AI collaboration rather than one bulk implementation.

Reviewers can inspect deeper artifacts here:

```text
context/current-feature.md
context/features/
.claude/skills/feature/
```

These contain:
- feature specifications
- implementation history
- AI collaboration workflow
- command/skill structure

---

# Quick Start

```bash
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Required environment variables:

```env
DATABASE_URL=
AUTH_SECRET=
AUTH_URL=
```

---

# Useful Scripts

| Script | Description |
|---|---|
| npm run dev | Start dev server |
| npm run build | Production build |
| npm run lint | Run linting |
| npx prisma migrate dev | Apply migrations |
| npx prisma db seed | Seed demo data |
| npm run db:test:prod | Verify production seed |

---

# Testing

Critical-path coverage focuses on:
- Rental workflow protections
- Repair-state constraints
- Admin authorization guards

Additional DAL unit coverage is planned via Vitest.

---

# Reviewer Guide

For deeper review, start with:

```text
context/project-overview.md
context/current-feature.md
context/features/
.claude/skills/feature/
```

These capture most architecture, implementation, and AI-collaboration decisions behind the repository.

---

# Deployment

Live demo:
`[add deployment url]`
