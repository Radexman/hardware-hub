# Password UX Improvements: Confirm + Visibility Toggle

## Overview

Small UX enhancement to improve password handling across the app.

**This phase implements:**

- Confirm password field in the Create User flow
- Show/hide password toggle (eye icon) for all password inputs

---

## Scope

- Create User dialog
- Login form

> **No backend changes.**

---

## Confirm Password (Create User)

### Requirements

- Add `confirmPassword` field
- Validate:
  - Required
  - Must match `password`

### Behavior

- Block submit if passwords do not match
- Show inline error message

### Implementation

Extend the Zod schema:

```ts
z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
```

> **Note:** Do not send `confirmPassword` to the server.

---

## Password Visibility Toggle

### Requirements

- Add an eye icon to all password inputs
- Toggle between `type="password"` and `type="text"`

### Affected Areas

- Create User dialog
- Login form

### Implementation

Use Lucide icons (`Eye` / `EyeOff`) with local component state:

```ts
const [showPassword, setShowPassword] = useState(false);
```

### Behavior

- Clicking the icon toggles visibility
- Default state: hidden (`type="password"`)

---

## Files to Update

| # | File |
|---|------|
| 1 | Create User dialog |
| 2 | Login form |
| 3 | Shared input component (optional) |

---

## Testing Checklist

1. Cannot submit mismatched passwords
2. Password visibility toggle works on the Create User dialog
3. Password visibility toggle works on the Login form
