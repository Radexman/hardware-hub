import { expect, type Page } from "@playwright/test";

export const ADMIN = {
  email: "admin@booksy.com",
  password: "admin123",
} as const;

export const REGULAR_USER = {
  email: "j.doe@booksy.com",
  password: "user123",
} as const;

export async function login(
  page: Page,
  credentials: { email: string; password: string },
  expectedLandingUrl: string | RegExp = /\/hardware/,
) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(credentials.email);
  await page.getByLabel("Password").fill(credentials.password);
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(expectedLandingUrl);
}

export async function logout(page: Page) {
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/login/);
}
