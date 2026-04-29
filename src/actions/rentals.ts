"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireSession } from "@/lib/auth";
import {
  RENTAL_ERROR_MESSAGE,
  rentItem,
  returnItem,
} from "@/lib/db/rental-actions";
import {
  DEFAULT_RENTAL_PERIOD_DAYS,
  RENTAL_PERIOD_OPTIONS,
} from "@/lib/rental-status";

export type ActionResult = { success: true } | { success: false; error: string };

const rentSchema = z.object({
  itemId: z.string().min(1, "Missing item id"),
  rentalDays: z
    .union(
      RENTAL_PERIOD_OPTIONS.map((value) => z.literal(value)) as [
        z.ZodLiteral<7>,
        z.ZodLiteral<14>,
        z.ZodLiteral<30>,
      ],
    )
    .default(DEFAULT_RENTAL_PERIOD_DAYS),
});

const returnSchema = z.object({
  itemId: z.string().min(1, "Missing item id"),
});

function revalidateRentalViews() {
  revalidatePath("/hardware");
  revalidatePath("/my-rentals");
}

export async function rentItemAction(input: {
  itemId: string;
  rentalDays?: 7 | 14 | 30;
}): Promise<ActionResult> {
  const parsed = rentSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid request." };
  }

  const session = await requireSession();
  const result = await rentItem({
    itemId: parsed.data.itemId,
    userId: session.user.id,
    userEmail: session.user.email!,
    rentalDays: parsed.data.rentalDays,
  });

  if (!result.ok) {
    return { success: false, error: RENTAL_ERROR_MESSAGE[result.error] };
  }

  revalidateRentalViews();
  return { success: true };
}

export async function returnItemAction(input: { itemId: string }): Promise<ActionResult> {
  const parsed = returnSchema.safeParse(input);
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
