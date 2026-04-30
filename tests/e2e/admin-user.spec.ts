import { expect, test } from "@playwright/test";

import { ADMIN, login, logout } from "./helpers/auth";

test("admin creates a new user and that user can log in", async ({ page }) => {
  const runId = Date.now();
  const newUser = {
    name: "Test User",
    email: `test.user.e2e+${runId}@booksy.com`,
    password: "test1234",
  };

  // 1-2. Log in as admin and visit /admin.
  await login(page, ADMIN);
  await page.goto("/admin");
  await expect(
    page.getByRole("heading", { name: "Admin Panel" }),
  ).toBeVisible();

  // 3. Open Create User dialog.
  await page.getByRole("button", { name: "Create User" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  // 4. Fill the form — Name, Email, Password, Role (default USER).
  await dialog.getByLabel("Name").fill(newUser.name);
  await dialog.getByLabel("Email").fill(newUser.email);
  await dialog.getByLabel("Password").fill(newUser.password);

  // 5. Submit.
  await dialog.getByRole("button", { name: "Create" }).click();

  // 6. Modal closes + success toast visible.
  await expect(dialog).toBeHidden();
  await expect(
    page
      .locator("[data-sonner-toast]")
      .filter({ hasText: `${newUser.name} added` }),
  ).toBeVisible();

  // 7. New user appears in the users list (revalidatePath('/admin') already fired).
  await expect(
    page.locator("article", { hasText: newUser.email }).first(),
  ).toBeVisible();

  // 8. Log out.
  await logout(page);

  // 9-10. Log in as the newly-created user → /hardware.
  await login(page, { email: newUser.email, password: newUser.password });
  await expect(
    page.getByRole("heading", { name: "Hardware List" }),
  ).toBeVisible();
});
