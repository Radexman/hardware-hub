# Rental Workflow — Phase 1

## Overview

Implement the core rent/return workflow that powers Hardware Hub. This phase introduces real rental actions and business rules behind the existing Rent and Return buttons, connecting UI interactions to database state changes and rental history logging.

Focus on the core inventory lifecycle:

Available → In Use → Available

This phase covers functional workflow behavior first, with UX enhancements (confirmations, deadlines polish, advanced feedback) deferred to later phases.

## Requirements

## Rent Action

Enable Rent action for items with `AVAILABLE` status only.

On rent:

- Change item status:
    - `AVAILABLE` → `IN_USE`
- Set:
    - `assignedTo` to current authenticated user
    - `returnDate` (use initial default rental period for now)
- Persist changes in database
- Create RentalHistory entry:
    - action: RENT

## Return Action

Enable Return action for items currently assigned to logged-in user and in `IN_USE`.

On return:

- Change item status:
    - `IN_USE` → `AVAILABLE`
- Clear:
    - `assignedTo`
    - `returnDate`
- Persist changes in database
- Create RentalHistory entry:
    - action: RETURN

## Business Rules

Enforce guards:

Cannot rent:

- Items with status `REPAIR`
- Items already `IN_USE`

Cannot return:

- Items not currently `IN_USE`
- Items not assigned to current user

Guard failures should return clear error states.

## UI Integration

Connect existing UI actions:

- Existing Rent button on hardware cards
- Existing Return button in My Rentals

Update UI after successful mutation:

- Refresh inventory state
- Reflect new item status
- Update My Rentals data

## Data + Persistence

Use Prisma-backed database state as source of truth.

Use existing models:

- Item
- RentalHistory
- User

Reuse existing seeded schema and business lifecycle.

## Files to Create / Update

1. Rental server action(s)

- Rent mutation
- Return mutation

2. Hardware item action integration

- Connect Rent button

3. My Rentals action integration

- Connect Return button

4. Rental history persistence logic

- Write RENT / RETURN records

5. Related data access utilities as needed

## Default Rental Behavior

For this phase:

- Use simple default return deadline (example: +14 days)
- No custom deadline picker yet
- Deadline customization comes in later phase

## Technical Expectations

- Use server actions / current App Router patterns
- Keep mutations guarded server-side
- Revalidate affected views after actions
- Centralize rental business logic, avoid duplicating guards
- Preserve auth/role checks from previous specs

## Key Gotchas

Use Context7 to verify latest server action conventions.

- Enforce business guards server-side, not UI only
- Prevent race-condition style double rentals
- Ensure rental history writes stay consistent with item state updates
- Keep rent + history write atomic if possible
- Respect migration discipline (no db push)

## Testing

Critical tests:

1. Cannot rent item in REPAIR
2. Cannot rent item already IN_USE
3. Cannot return item not in use
4. Renting sets:

- status
- assignee
- return date

5. Returning clears:

- status
- assignee
- return date

6. RENT history entry created
7. RETURN history entry created
8. My Rentals updates after rent/return

## References

- @context/project-overview.md
- Existing item card Rent button
- Existing my-rentals Return button
- Prisma Item model
- Prisma RentalHistory model
- Existing auth/session role access specs
