import { expect, test } from "@playwright/test";

import { ADMIN, REGULAR_USER, login, logout } from "./helpers/auth";

test("auth & RBAC: protected redirects, user blocked from /admin, admin allowed", async ({
  page,
}) => {
  // 1. Visiting /hardware unauthenticated redirects to /login.
  await page.goto("/hardware");
  await expect(page).toHaveURL(/\/login/);

  // 2-3. Login as regular user → /hardware.
  await login(page, REGULAR_USER);
  await expect(
    page.getByRole("heading", { name: "Hardware List" }),
  ).toBeVisible();

  // 4. Regular user navigating to /admin is bounced back to /hardware.
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/hardware/);

  // 5. Log out.
  await logout(page);

  // 6-7. Login as admin → /admin lands on the admin panel.
  await login(page, ADMIN);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin/);
  await expect(
    page.getByRole("heading", { name: "Admin Panel" }),
  ).toBeVisible();
});
