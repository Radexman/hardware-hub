# Admin User CRUD — Phase 2 (Edit & Delete)

## Overview

Extend Admin User Management MVP with essential administrative controls for managing existing users.

This phase adds:

- Edit user (name, role)
- Delete user (guarded)

The goal is to provide **basic lifecycle control** over users while keeping implementation minimal and aligned with MVP scope.

---

## Requirements

## Edit User

Enable per-user Edit action.

Behavior:

- Edit opens shadcn Dialog
- Prefilled with current user data

Editable fields:

- Name
- Role

Non-editable:

- Email (keep immutable for MVP)
- Password (out of scope)

On save:

- Persist updates in database
- Refresh users list
- Show success toast

---

## Delete User

Enable per-user Delete action.

Behavior:

- Use shadcn AlertDialog (confirmation required)

On confirm:

- Delete user from database
- Refresh users list
- Show success toast

---

## Guards (Minimal but Important)

Must prevent:

- Deleting currently logged-in user
- Deleting the last ADMIN user

Optional (nice-to-have, skip if needed):

- Prevent deleting users with active rentals

On violation:

- Return error
- Show toast feedback

---

## User Management Behavior

Continue using existing UI:

- User cards (grid + list)
- View toggle
- Admin user section layout

Add action buttons to each user:

- Edit
- Delete

---

## Data + Persistence

Use Prisma-backed database.

Add mutations:

- Update user
- Delete user

Server-side only (no client mutations).

---

## Files to Create / Update

1. User update server action
2. User delete server action
3. Edit User dialog
4. Delete confirmation dialog
5. Admin user actions integration

---

## Technical Expectations

- Use server actions (`"use server"`)
- Reuse validation (zod)
- Reuse role enum (USER | ADMIN)
- Revalidate `/admin` after mutations
- Keep logic consistent with createUser flow

---

## Key Gotchas

- Do not allow removing last ADMIN
- Do not allow self-delete
- Keep email immutable (avoid complexity)
- Do not introduce password editing

---

## Testing (Manual)

1. Admin can edit user name
2. Admin can change role (USER ↔ ADMIN)
3. Admin can delete user
4. Cannot delete self
5. Cannot delete last admin

---

## Out of Scope

- Password reset
- Email change
- User deactivation vs delete distinction
- Audit logs
- Rental ownership reassignment

---

## References

- @context/project-overview.md
- @context/screenshots/admin-panel.png
- Admin User Management MVP spec
- Prisma User model
- Auth role guards
- https://ui.shadcn.com/docs/components/dialog
- https://ui.shadcn.com/docs/components/alert-dialog
