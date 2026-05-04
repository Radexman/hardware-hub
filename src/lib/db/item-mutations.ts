import "server-only";

import { prisma } from "@/lib/prisma";
import type { ItemCategory, ItemStatus } from "@/lib/mock-data";

export type ItemMutationErrorCode =
  | "NOT_FOUND"
  | "IN_USE"
  | "INVALID_STATUS"
  | "RACE";

export type ItemMutationResult<T = void> =
  | (T extends void ? { ok: true } : { ok: true; data: T })
  | { ok: false; error: ItemMutationErrorCode };

export const ITEM_MUTATION_ERROR_MESSAGE: Record<ItemMutationErrorCode, string> =
  {
    NOT_FOUND: "Item not found.",
    IN_USE:
      "This item is currently rented and cannot be modified that way. Have the renter return it first.",
    INVALID_STATUS: "That status isn't allowed for this operation.",
    RACE: "Item state changed, please refresh and try again.",
  };

export type CreateItemInput = {
  name: string;
  brand: string;
  category: ItemCategory;
  purchaseDate: Date | null;
  status: "AVAILABLE" | "REPAIR";
  notes: string | null;
};

export async function createItem(
  input: CreateItemInput,
): Promise<ItemMutationResult<{ id: string }>> {
  const created = await prisma.item.create({
    data: {
      name: input.name,
      brand: input.brand,
      category: input.category,
      purchaseDate: input.purchaseDate,
      status: input.status,
      notes: input.notes,
      assignedTo: null,
      returnDate: null,
    },
    select: { id: true },
  });
  return { ok: true, data: { id: created.id } };
}

export type UpdateItemInput = {
  itemId: string;
  name: string;
  brand: string;
  category: ItemCategory;
  purchaseDate: Date | null;
  notes: string | null;
  status?: "AVAILABLE" | "REPAIR";
};

export async function updateItem(
  input: UpdateItemInput,
): Promise<ItemMutationResult> {
  const { itemId, status, ...rest } = input;

  const item = await prisma.item.findUnique({
    where: { id: itemId },
    select: { status: true },
  });
  if (!item) return { ok: false, error: "NOT_FOUND" };

  if (item.status === "IN_USE" && status !== undefined) {
    return { ok: false, error: "IN_USE" };
  }

  await prisma.item.update({
    where: { id: itemId },
    data: {
      ...rest,
      ...(status !== undefined ? { status } : {}),
    },
  });

  return { ok: true };
}

export async function deleteItem(input: {
  itemId: string;
}): Promise<ItemMutationResult> {
  const { itemId } = input;

  return prisma.$transaction(async (tx) => {
    const result = await tx.item.deleteMany({
      where: { id: itemId, status: { not: "IN_USE" } },
    });
    if (result.count > 0) return { ok: true } as const;

    const item = await tx.item.findUnique({
      where: { id: itemId },
      select: { status: true },
    });
    if (!item) return { ok: false, error: "NOT_FOUND" } as const;
    if (item.status === "IN_USE") return { ok: false, error: "IN_USE" } as const;
    return { ok: false, error: "RACE" } as const;
  });
}

export async function toggleRepair(input: {
  itemId: string;
}): Promise<ItemMutationResult<{ status: ItemStatus }>> {
  const { itemId } = input;

  return prisma.$transaction(async (tx) => {
    const item = await tx.item.findUnique({
      where: { id: itemId },
      select: { status: true },
    });
    if (!item) return { ok: false, error: "NOT_FOUND" } as const;
    if (item.status === "IN_USE")
      return { ok: false, error: "IN_USE" } as const;

    const next: "AVAILABLE" | "REPAIR" =
      item.status === "REPAIR" ? "AVAILABLE" : "REPAIR";

    const updated = await tx.item.updateMany({
      where: { id: itemId, status: item.status },
      data: { status: next },
    });
    if (updated.count === 0) return { ok: false, error: "RACE" } as const;

    return { ok: true, data: { status: next } } as const;
  });
}
