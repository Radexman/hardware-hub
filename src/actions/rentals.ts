"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireSession } from "@/lib/auth";
import {
  RENTAL_ERROR_MESSAGE,
  rentItem,
  returnItem,
} from "@/lib/db/rental-actions";

export type ActionResult = { success: true } | { success: false; error: string };

const itemIdSchema = z.object({
  itemId: z.string().min(1, "Missing item id"),
});

function revalidateRentalViews() {
  revalidatePath("/hardware");
  revalidatePath("/my-rentals");
}

export async function rentItemAction(input: { itemId: string }): Promise<ActionResult> {
  const parsed = itemIdSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid request." };
  }

  const session = await requireSession();
  const result = await rentItem({
    itemId: parsed.data.itemId,
    userId: session.user.id,
    userEmail: session.user.email!,
  });

  if (!result.ok) {
    return { success: false, error: RENTAL_ERROR_MESSAGE[result.error] };
  }

  revalidateRentalViews();
  return { success: true };
}

export async function returnItemAction(input: { itemId: string }): Promise<ActionResult> {
  const parsed = itemIdSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid request." };
  }

  const session = await requireSession();
  const result = await returnItem({
    itemId: parsed.data.itemId,
    userId: session.user.id,
    userEmail: session.user.email!,
  });

  if (!result.ok) {
    return { success: false, error: RENTAL_ERROR_MESSAGE[result.error] };
  }

  revalidateRentalViews();
  return { success: true };
}
