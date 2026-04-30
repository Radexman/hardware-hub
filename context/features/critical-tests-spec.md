# Critical E2E Tests — Playwright

## Overview

Implement 3 high-value end-to-end tests using Playwright to validate core application behavior across authentication, rental workflow, and admin user management.

Focus on **happy paths** that prove the system works end-to-end.

---

## Test 1 — Authentication & Role-Based Access

### Goal

Verify authentication and route protection.

### Scenario

1. Visit `/hardware` without authentication  
   → expect redirect to `/login`

2. Log in as regular user:
    - Email: `j.doe@booksy.com`
    - Password: `user123`

3. After login  
   → expect redirect to `/hardware`

4. Navigate to `/admin`  
   → expect redirect to `/hardware`

5. Log out

6. Log in as admin:
    - Email: `admin@booksy.com`
    - Password: `admin123`

7. Navigate to `/admin`  
   → expect admin panel visible

---

## Test 2 — Rental Workflow (Rent & Return)

### Goal

Verify full rental lifecycle.

### Scenario

1. Log in as regular user

2. Navigate to `/hardware`

3. Find an AVAILABLE item  
   → click "Rent"

4. Confirm rent (default period)

5. Expect:
    - Success toast
    - Item no longer rentable in `/hardware`

6. Navigate to `/my-rentals`

7. Verify:
    - Item is listed

8. Click "Return"

9. Confirm return

10. Expect:

- Success toast
- Item removed from `/my-rentals`

---

## Test 3 — Admin Creates User

### Goal

Verify admin can create a new user and it becomes usable.

### Scenario

1. Log in as admin

2. Navigate to `/admin`

3. Click "Create User"

4. Fill form:
    - Name: `Test User`
    - Email: `test.user.e2e@booksy.com`
    - Password: `test1234`
    - Role: USER

5. Submit form

6. Expect:
    - Modal closes
    - Success toast visible

7. Verify:
    - New user appears in users list

8. Log out

9. Log in using newly created user:
    - Email: `test.user.e2e@booksy.com`
    - Password: `test1234`

10. Expect:

- Successful login
- Redirect to `/hardware`

---

## Technical Notes

- Use Playwright test runner
- Use seeded DB (no mocks)
- Prefer stable selectors:
    - `getByRole`
    - `getByLabelText`
    - `data-testid` if needed

- Tests should be independent

---

## Future Extensions (Out of Scope)

- Duplicate email validation
- Role editing
- User deletion
- Rental edge cases
- Repair flow tests

---

## References

- Auth specs
- Rental workflow specs
- Admin user spec
- https://playwright.dev
