# Auth Access Control — Roles + Protected Data

## Overview

Extend authentication by adding role-based authorization and session-driven data access across Hardware Hub. Replace placeholder user assumptions with real session identity and enforce access rules for standard users versus admins.

This phase focuses on protecting routes, scoping data by logged-in user, and gating admin functionality using the existing `USER` and `ADMIN` roles.

## Requirements

## Role-Based Access

Implement access rules:

### USER

Can access:

- `/hardware`
- `/my-rentals`

Cannot access:

- `/admin`

### ADMIN

Can access:

- `/hardware`
- `/my-rentals`
- `/admin`

Non-admin attempts to access `/admin` should:

- redirect or show forbidden handling

## Route + Navigation Protection

- Restrict `/admin` to ADMIN role only
- Hide Admin navigation item for non-admin users
- Preserve server-side protection in addition to UI hiding
- Keep route guards compatible with App Router auth setup

## Session-Driven Data Access

Replace placeholder current-user logic with session identity.

Update My Rentals:

- Remove hardcoded user placeholder
- Use authenticated session user
- Only show rentals assigned to logged-in user

Update Hardware:

- Keep all users able to browse full hardware catalogue

Update Admin:

- Only render for ADMIN role users

## Session Role Handling

- Ensure session exposes:
    - user.id
    - user.email
    - user.role

- Use role in:
    - route protection
    - navigation visibility
    - server data queries

## Authorization Foundations For Future Actions

Prepare permission checks for later actions:

- Rent actions tied to authenticated user
- Return actions scoped to assignee
- Admin mutations reserved for ADMIN role

Scaffold authorization boundaries even if full action guards evolve later.

## Files to Update

1. `src/proxy.ts`

- Add role-aware route protection

2. `src/auth.ts`

- Ensure role included in session callbacks

3. `src/lib/auth.ts`

- Replace placeholder user helpers with session-based helpers

4. Sidebar navigation components

- Role-aware admin nav visibility

5. `/my-rentals` data layer

- Replace placeholder identity with session user

## Key Gotchas

Use Context7 to verify latest Auth.js role/session conventions.

- Do not rely on client-side role checks alone
- Protect admin routes server-side
- Keep authorization logic centralized
- Avoid duplicated role checks across components
- Ensure session role typing remains consistent across app

## Testing

1. USER can access:

- `/hardware`
- `/my-rentals`

2. USER cannot access:

- `/admin`

3. ADMIN can access:

- `/admin`

4. Admin nav hidden for non-admin users

5. My Rentals shows only logged-in user's rentals

6. Session role available in protected routes and queries

7. Unauthorized admin route access redirects correctly

## References

- @context/project-overview.md
- Existing Prisma Role enum
- Existing seeded users
- Current `/my-rentals` placeholder auth implementation
- Existing sidebar navigation
- https://authjs.dev
