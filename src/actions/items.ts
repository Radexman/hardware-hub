"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth";
import {
  ITEM_MUTATION_ERROR_MESSAGE,
  createItem,
  toggleRepair,
  updateItem,
} from "@/lib/db/item-mutations";

export type ActionResult<T = undefined> =
  | (T extends undefined ? { success: true } : { success: true; data: T })
  | { success: false; error: string };

const editableStatusSchema = z.enum(["AVAILABLE", "REPAIR"]);

const isoDateSchema = z
  .string()
  .trim()
  .refine(
    (v) => v === "" || !Number.isNaN(new Date(v).getTime()),
    "Invalid date",
  );

const createSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  brand: z.string().trim().min(1, "Brand is required"),
  purchaseDate: isoDateSchema,
  status: editableStatusSchema,
  notes: z.string().trim().optional().default(""),
});

const updateSchema = z.object({
  itemId: z.string().min(1, "Missing item id"),
  name: z.string().trim().min(1, "Name is required"),
  brand: z.string().trim().min(1, "Brand is required"),
  purchaseDate: isoDateSchema,
  status: editableStatusSchema.optional(),
  notes: z.string().trim().optional().default(""),
});

const toggleSchema = z.object({
  itemId: z.string().min(1, "Missing item id"),
});

function parsePurchaseDate(value: string): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function revalidateInventoryViews() {
  revalidatePath("/admin");
  revalidatePath("/hardware");
}

export async function createItemAction(input: {
  name: string;
  brand: string;
  purchaseDate: string;
  status: "AVAILABLE" | "REPAIR";
  notes?: string;
}): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();

  const parsed = createSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid request." };
  }

  const result = await createItem({
    name: parsed.data.name,
    brand: parsed.data.brand,
    purchaseDate: parsePurchaseDate(parsed.data.purchaseDate),
    status: parsed.data.status,
    notes: parsed.data.notes ? parsed.data.notes : null,
  });

  if (!result.ok) {
    return {
      success: false,
      error: ITEM_MUTATION_ERROR_MESSAGE[result.error],
    };
  }

  revalidateInventoryViews();
  return { success: true, data: result.data };
}

export async function updateItemAction(input: {
  itemId: string;
  name: string;
  brand: string;
  purchaseDate: string;
  status?: "AVAILABLE" | "REPAIR";
  notes?: string;
}): Promise<ActionResult> {
  await requireAdmin();

  const parsed = updateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid request." };
  }

  const result = await updateItem({
    itemId: parsed.data.itemId,
    name: parsed.data.name,
    brand: parsed.data.brand,
    purchaseDate: parsePurchaseDate(parsed.data.purchaseDate),
    notes: parsed.data.notes ? parsed.data.notes : null,
    status: parsed.data.status,
  });

  if (!result.ok) {
    return {
      success: false,
      error: ITEM_MUTATION_ERROR_MESSAGE[result.error],
    };
  }

  revalidateInventoryViews();
  return { success: true };
}

export async function toggleRepairAction(input: {
  itemId: string;
}): Promise<ActionResult<{ status: "AVAILABLE" | "REPAIR" | "IN_USE" }>> {
  await requireAdmin();

  const parsed = toggleSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid request." };
  }

  const result = await toggleRepair({ itemId: parsed.data.itemId });

  if (!result.ok) {
    return {
      success: false,
      error: ITEM_MUTATION_ERROR_MESSAGE[result.error],
    };
  }

  revalidateInventoryViews();
  return { success: true, data: result.data };
}
