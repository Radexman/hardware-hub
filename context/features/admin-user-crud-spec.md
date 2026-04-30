# Admin User Management MVP

## Overview

Extend Admin Panel user management from UI scaffold into minimal functional administration focused on user creation. Scope is intentionally limited to core MVP functionality needed for admin onboarding and access control.

This phase implements:

- Create user persistence
- Role assignment at creation (USER | ADMIN)
- Admin-only access guards

Deferred:

- User editing
- User deletion/deactivation
- Advanced role management

## Requirements

## Create User

Upgrade existing "Create User" modal from scaffold to real create flow.

On create:

- Persist new user in database
- Hash password using existing auth approach

Required fields:

- Name
- Email
- Password
- Role

Rules:

- Email must be unique
- Only ADMIN can create users

On success:

- Close modal
- Refresh users list
- Show success feedback

On failure:

- Show validation or mutation errors

## User Management Behavior

Reuse existing user management UI:

- Existing user cards
- Existing grid/list toggle
- Existing admin user section layout

Display:

- Name
- Email
- Role
- Created date

## Data + Persistence

Use Prisma-backed database as source of truth.

Implement:

- Create user mutation only

Use server-side mutations only.

## Files to Create / Update

1. User create server action
2. Create User modal integration
3. Admin user creation wiring

## Technical Expectations

- Use server actions / App Router patterns
- Reuse auth password hashing logic
- Preserve existing auth and role protections
- Revalidate user list after creation

## Key Gotchas

Use Context7 to verify current Auth.js conventions.

- Enforce email uniqueness
- Hash passwords consistently with auth flow
- Restrict user creation to admins
- Respect migration discipline (no db push)

## Testing

1. Admin can create user
2. Duplicate emails are blocked
3. Non-admin cannot create users

## References

- @context/project-overview.md
- @context/screenshots/admin-panel.png
- Admin Panel Phase 2 spec
- Auth specs
- Prisma User model
- Existing user management UI architecture
- https://ui.shadcn.com/docs/components/dialog
- https://ui.shadcn.com/docs/components/form
