# Admin Item CRUD — Phase 2 (Delete)

## Overview

Extend Admin Item Management MVP with device deletion capability.

This phase completes the basic inventory lifecycle by adding:

- Delete device action
- Safety guards for active rentals

The goal is to provide **minimal but safe deletion behavior** without introducing unnecessary complexity.

---

## Requirements

## Delete Device

Enable per-item Delete action.

Behavior:

- Add Delete button to `AdminItemActions`
- Use shadcn `AlertDialog` for confirmation

Dialog content:

- Title: "Delete Device"
- Description: "This action cannot be undone."

Actions:

- Cancel
- Confirm Delete

---

## Delete Flow

On confirm:

- Call server action
- Delete item from database

On success:

- Refresh inventory list
- Show success toast

On failure:

- Show error toast

---

## Guards (Critical)

Must prevent:

- Deleting items with status `IN_USE`

Optional (skip if needed):

- Prevent deleting items in `REPAIR`

On violation:

- Return error (`IN_USE`)
- Show user-friendly message

---

## UI Behavior

- Delete button visible on each item (admin only)
- Button should use destructive styling
- Disable button for `IN_USE` items (optional but recommended)
- Tooltip or hint for disabled state (optional)

---

## Data + Persistence

Use Prisma-backed database.

Add mutation:

- Delete item

Server-side only.

---

## Server Action

Create:

- `deleteItemAction(itemId)`

Responsibilities:

- `requireAdmin()`
- Validate input
- Check item status
- Perform delete
- Return `{ success, error? }`

---

## DAL (Data Layer)

Add function:

- `deleteItem(itemId)`

Behavior:

- Fetch item
- If `IN_USE` → return error
- Otherwise → delete

Optional:

- Wrap in transaction if needed

---

## Files to Create / Update

1. Item delete server action
2. Item delete DAL function
3. Delete confirmation dialog
4. Admin item actions integration

---

## Technical Expectations

- Use server actions (`"use server"`)
- Keep mutation logic centralized
- Revalidate `/admin` and `/hardware`
- Follow existing error handling patterns

---

## Key Gotchas

- Do not allow deleting rented items
- Ensure UI stays in sync after deletion
- Avoid accidental double submissions
- Keep behavior consistent with existing mutation flows

---

## Testing (Manual)

1. Admin can delete AVAILABLE device
2. Admin can delete REPAIR device (if allowed)
3. Cannot delete IN_USE device
4. Inventory updates after deletion

---

## Out of Scope

- Soft delete / archival
- Audit logs
- Rental history cleanup
- Bulk delete

---

## References

- @context/project-overview.md
- @context/screenshots/admin-panel.png
- Admin Item Management MVP spec
- Rental Workflow specs
- Prisma Item model
- https://ui.shadcn.com/docs/components/alert-dialog
