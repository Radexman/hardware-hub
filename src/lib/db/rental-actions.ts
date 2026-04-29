import "server-only";

import { prisma } from "@/lib/prisma";

export const DEFAULT_RENTAL_DAYS = 14;

export type RentalErrorCode =
  | "NOT_FOUND"
  | "IN_REPAIR"
  | "ALREADY_RENTED"
  | "NOT_IN_USE"
  | "NOT_ASSIGNED_TO_USER"
  | "RACE";

export type RentalResult =
  | { ok: true }
  | { ok: false; error: RentalErrorCode };

export const RENTAL_ERROR_MESSAGE: Record<RentalErrorCode, string> = {
  NOT_FOUND: "Item not found.",
  IN_REPAIR: "This item is in repair and cannot be rented.",
  ALREADY_RENTED: "This item is already rented.",
  NOT_IN_USE: "This item is not currently rented.",
  NOT_ASSIGNED_TO_USER: "This item is not assigned to you.",
  RACE: "Item state changed, please refresh and try again.",
};

function defaultReturnDate(now: Date = new Date()): Date {
  const due = new Date(now);
  due.setUTCDate(due.getUTCDate() + DEFAULT_RENTAL_DAYS);
  return due;
}

export async function rentItem(input: {
  itemId: string;
  userId: string;
  userEmail: string;
  now?: Date;
}): Promise<RentalResult> {
  const { itemId, userId, userEmail } = input;
  const returnDate = defaultReturnDate(input.now);

  return prisma.$transaction(async (tx) => {
    const item = await tx.item.findUnique({ where: { id: itemId } });
    if (!item) return { ok: false, error: "NOT_FOUND" } as const;
    if (item.status === "REPAIR")
      return { ok: false, error: "IN_REPAIR" } as const;
    if (item.status === "IN_USE")
      return { ok: false, error: "ALREADY_RENTED" } as const;

    const updated = await tx.item.updateMany({
      where: { id: itemId, status: "AVAILABLE" },
      data: {
        status: "IN_USE",
        assignedTo: userEmail,
        returnDate,
      },
    });
    if (updated.count === 0) return { ok: false, error: "RACE" } as const;

    await tx.rentalHistory.create({
      data: { action: "RENT", itemId, userId },
    });

    return { ok: true } as const;
  });
}

export async function returnItem(input: {
  itemId: string;
  userId: string;
  userEmail: string;
}): Promise<RentalResult> {
  const { itemId, userId, userEmail } = input;

  return prisma.$transaction(async (tx) => {
    const item = await tx.item.findUnique({ where: { id: itemId } });
    if (!item) return { ok: false, error: "NOT_FOUND" } as const;
    if (item.status !== "IN_USE")
      return { ok: false, error: "NOT_IN_USE" } as const;
    if (item.assignedTo !== userEmail)
      return { ok: false, error: "NOT_ASSIGNED_TO_USER" } as const;

    const updated = await tx.item.updateMany({
      where: { id: itemId, status: "IN_USE", assignedTo: userEmail },
      data: {
        status: "AVAILABLE",
        assignedTo: null,
        returnDate: null,
      },
    });
    if (updated.count === 0) return { ok: false, error: "RACE" } as const;

    await tx.rentalHistory.create({
      data: { action: "RETURN", itemId, userId },
    });

    return { ok: true } as const;
  });
}
