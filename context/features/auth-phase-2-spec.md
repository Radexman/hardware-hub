# Auth UI — Login Experience

## Overview

Replace default auth pages with a custom login experience for Hardware Hub using the design direction from `screenshots/login.png`. This phase focuses only on sign-in UI and authenticated user entry flow using the authentication foundation from Phase 1.

This is an internal tool with admin-created accounts only, so no registration flow should exist. Use the base login form as a ground layer for the ui from screenshots

## Requirements

- Create custom `/login` route
- If user is not authenticated, app should open on login by default
- If authenticated, redirect users from `/login` to `/hardware`

## Login UI

Build centered login interface using shadcn components and existing dark theme.

Include:

- Hardware Hub branding/logo
- Email input
- Password input
- Sign In button
- Inline validation + auth error states
- Loading/disabled submit state

Design should:

- Follow `screenshots/login.png`
- Match existing dark dashboard aesthetic
- Use existing typography and cyan brand token
- Feel minimal, clean, internal-tool focused

## Authentication Behavior

- Submit through credentials auth flow from Phase 1
- Successful login redirects to:
    - `/hardware`
- Invalid credentials show inline error state
- Persist session after successful login

## Sidebar User Session UI

Update authenticated sidebar user area:

- Show current user name
- Show user email
- Keep avatar/initial fallback pattern
- Add sign out action in user controls
- Sign out redirects back to login

## Constraints

- No registration page
- No forgot password flow
- No social login providers
- No admin user creation here (handled in Admin Panel)

## Files to Create

1. `src/app/login/page.tsx`

- Login page UI

2. `src/components/auth/login-form.tsx`

- Credentials sign in form

3. `src/components/auth/user-nav.tsx`

- Sidebar user info + sign out controls

## Key Gotchas

Use Context7 to verify latest Auth.js sign-in conventions.

- Use auth helpers from Phase 1 setup
- Avoid duplicating auth logic inside UI layer
- Keep login page public while app routes remain protected
- Handle redirect loops between login and protected routes

## Testing

1. Visiting logged-out app opens login page
2. Login form validates required fields
3. Valid credentials sign user in and redirect to `/hardware`
4. Invalid credentials show error
5. Authenticated users visiting `/login` redirect away
6. Sidebar shows authenticated user details
7. Sign out returns user to login

## References

- @context/project-overview.md
- @context/screenshots/login.png
- Existing sidebar user footer implementation
- https://ui.shadcn.com/docs/components/card
- https://ui.shadcn.com/docs/components/form
- https://ui.shadcn.com/docs/components/input
