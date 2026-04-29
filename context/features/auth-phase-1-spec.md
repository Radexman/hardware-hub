# Auth Setup — NextAuth Credentials Foundation

## Overview

Set up authentication using NextAuth v5 with Prisma adapter and Credentials provider using seeded users only (no self-registration). This phase focuses on authentication infrastructure, session handling, and route protection before building custom login UI.

Use split auth config pattern for App Router compatibility and protect application routes by default. Unauthenticated users should be redirected to login, while authenticated users gain access based on existing seeded roles.

## Requirements

- Install and configure:
    - NextAuth v5 (`next-auth@beta`)
    - `@auth/prisma-adapter`

- Configure credentials authentication:
    - Email/password provider only
    - Validate credentials against seeded users in database
    - Use existing bcrypt hashed passwords from seed
    - Use JWT session strategy

- Set up split auth config pattern:
    - Edge-compatible provider config
    - Full auth config with Prisma adapter
    - Session includes user id and role

- Protect routes:
    - Redirect unauthenticated users to login
    - Protect:
        - `/hardware`
        - `/my-rentals`
        - `/admin`
    - Root route should redirect based on auth state

- Role groundwork:
    - Support USER and ADMIN roles in session typing
    - Full role-based route restrictions handled in later spec

## Files to Create

1. `src/auth.config.ts`

- Edge-compatible auth config
- Credentials provider placeholder

2. `src/auth.ts`

- Full NextAuth config
- Prisma adapter
- Credentials validation with bcrypt
- JWT + session callbacks for id/role

3. `src/app/api/auth/[...nextauth]/route.ts`

- Export auth handlers

4. `src/proxy.ts`

- Route protection and redirect logic

5. `src/types/next-auth.d.ts`

- Extend Session and User types with:
    - user.id
    - user.role

## Seed Assumptions

Use existing seeded accounts only:

- admin@booksy.com
- j.doe@booksy.com
- a.smith@booksy.com

- No registration flow
- No public signup routes
- Passwords already hashed in seed

## Key Gotchas

Use Context7 to verify latest Auth.js v5 conventions.

- Use `next-auth@beta` (not v4 package)
- Use split config pattern for edge compatibility
- `src/proxy.ts` placement and export conventions matter
- Use JWT session strategy
- Credentials provider in split config should use placeholder authorize, override in full auth config
- Use Prisma adapter with existing schema, no auth schema rewrites
- Do not add custom login page yet (handled in next spec)

## Environment Variables

```env
AUTH_SECRET=
AUTH_URL=
DATABASE_URL=
```

## Testing

1. Visiting protected routes while logged out redirects to auth flow
2. Sign in with seeded credentials succeeds
3. Session persists across refresh
4. Session includes user id and role
5. Authenticated users can access `/hardware`
6. Authenticated users can access `/my-rentals`
7. `/` redirects based on auth state

## References

- @context/project-overview.md
- @src/lib/auth.ts
- @src/lib/prisma.ts
- Prisma schema user model
- https://authjs.dev/getting-started/installation#edge-compatibility
- https://authjs.dev/getting-started/adapters/prisma
- https://authjs.dev/getting-started/authentication/credentials
