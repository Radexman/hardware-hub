# Admin Panel — Phase 2

## Overview

Extend the `/admin` page by adding a **User Management** section below Item Management. This phase focuses on scaffolding the admin-facing user management UI only (no CRUD/backend mutations yet).

Reuse the same design patterns established for item management so both sections feel consistent. Users should support two view modes (grid cards + list view similar to Google Drive), reuse existing toolbar patterns, and load seeded users from the database.

This phase includes:

- User Management section below inventory management
- Reusable user cards + list view toggle
- Per-user admin action affordances (visual only for now)
- "Create User" flow using shadcn Dialog + form
- UI scaffolding only — form submission should log data for now

## Requirements

- Add User Management section below Item Management on `/admin`

- User management list:
    - Fetch and display existing users from DB
    - Support two view modes:
        - Grid user cards
        - List row layout (Google Drive style)
    - Reuse current view toggle pattern
    - Preserve responsive behavior

- User cards/list rows should display:
    - Name
    - Email
    - Role badge
    - Created date (if available)
    - Placeholder admin actions:
        - Edit
        - Delete
    - Actions visual only, not interactive yet

- Create User:
    - Add cyan "Create User" button in user management toolbar
    - Opens shadcn Dialog modal

- Create User modal:
    - Use shadcn dialog + form primitives
    - Include fields:
        - Name — text input
        - Email — email input
        - Password — password input
        - Role — select input
            - USER
            - ADMIN
    - Include Cancel + Create actions
    - Match existing dark theme form styling

- Submission behavior:
    - No real CRUD yet
    - Submit logs form payload to console only
    - Include basic client validation:
        - Required fields
        - Valid email format
        - Role required

- UX:
    - User management should visually mirror item management patterns
    - Keep card-first admin dashboard aesthetic
    - Support loading skeleton state
    - Preserve current micro-interactions and hover patterns

- Technical:
    - Reuse shared patterns/components where practical
    - Favor composition over duplicated view logic
    - No database writes in this phase
    - No auth/permissions implementation changes yet
    - Assume only admin sees this section

- Testing:
    - Users load from DB
    - View toggle works
    - Create User form validates
    - Form submission logs expected payload

## References

- @context/project-overview.md
- @context/screenshots/admin-panel.png
- @context/screenshots/create-user.png
- @src/lib/db/items.ts
- Existing seeded users from Prisma
- Existing hardware list card architecture
- Existing admin item management patterns (Phase 1)
- https://ui.shadcn.com/docs/components/dialog
- https://ui.shadcn.com/docs/components/form
- https://ui.shadcn.com/docs/components/select
