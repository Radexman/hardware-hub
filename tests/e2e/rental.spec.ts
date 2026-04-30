import { expect, test } from "@playwright/test";

import { REGULAR_USER, login } from "./helpers/auth";

test("rental workflow: rent an item, see it in My Rentals, return it", async ({
  page,
}) => {
  await login(page, REGULAR_USER);

  await page.goto("/hardware");
  await expect(
    page.getByRole("heading", { name: "Hardware List" }),
  ).toBeVisible();

  // Pick the first card whose action shows a "Rent" button (i.e. status === AVAILABLE).
  const rentTrigger = page.getByRole("button", { name: "Rent" }).first();
  await expect(rentTrigger).toBeVisible();

  // Capture the item name from the same card so we can find it again on /my-rentals.
  const rentingCard = page
    .locator("article", { has: rentTrigger })
    .first();
  const itemName = (await rentingCard.locator("h3").first().innerText()).trim();

  await rentTrigger.click();

  // Rent confirmation dialog opens with the item name in its title.
  const rentDialog = page.getByRole("dialog");
  await expect(rentDialog).toBeVisible();
  await expect(rentDialog.getByRole("heading", { level: 2 })).toContainText(
    itemName,
  );

  await rentDialog.getByRole("button", { name: "Confirm Rent" }).click();

  // Success toast.
  await expect(
    page
      .locator("[data-sonner-toast]")
      .filter({ hasText: `${itemName} rented` }),
  ).toBeVisible();

  // Optimistic UI flips status: the item's specific Rent button is gone.
  // (Other AVAILABLE items may still expose a "Rent" button — match by card.)
  await expect(
    page.locator("article", { hasText: itemName }).getByRole("button", {
      name: "Rent",
    }),
  ).toHaveCount(0);

  // Item now shows up on /my-rentals.
  await page.goto("/my-rentals");
  await expect(
    page.getByRole("heading", { name: "My Rentals" }),
  ).toBeVisible();
  const rentalCard = page
    .locator("article", { hasText: itemName })
    .first();
  await expect(rentalCard).toBeVisible();

  // Return it.
  await rentalCard.getByRole("button", { name: "Return" }).click();

  const returnDialog = page.getByRole("dialog");
  await expect(returnDialog).toBeVisible();
  await expect(returnDialog.getByRole("heading", { level: 2 })).toContainText(
    itemName,
  );

  await returnDialog.getByRole("button", { name: "Confirm Return" }).click();

  // Success toast and the card is removed from /my-rentals.
  await expect(
    page
      .locator("[data-sonner-toast]")
      .filter({ hasText: `${itemName} returned` }),
  ).toBeVisible();
  await expect(
    page.locator("article", { hasText: itemName }),
  ).toHaveCount(0);
});
