import "server-only";

import bcrypt from "bcryptjs";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const SALT_ROUNDS = 12;

export type UserMutationErrorCode =
  | "DUPLICATE_EMAIL"
  | "NOT_FOUND"
  | "SELF_DELETE"
  | "LAST_ADMIN"
  | "ACTIVE_RENTALS";

export type UserMutationResult<T = void> =
  | (T extends void ? { ok: true } : { ok: true; data: T })
  | { ok: false; error: UserMutationErrorCode };

export const USER_MUTATION_ERROR_MESSAGE: Record<UserMutationErrorCode, string> =
  {
    DUPLICATE_EMAIL: "A user with this email already exists.",
    NOT_FOUND: "User no longer exists.",
    SELF_DELETE: "You cannot delete your own account.",
    LAST_ADMIN: "At least one admin must remain.",
    ACTIVE_RENTALS:
      "User has active rentals. Return them before deleting the account.",
  };

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN";
};

export async function createUser(
  input: CreateUserInput,
): Promise<UserMutationResult<{ id: string }>> {
  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  try {
    const created = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: passwordHash,
        role: input.role,
      },
      select: { id: true },
    });
    return { ok: true, data: { id: created.id } };
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return { ok: false, error: "DUPLICATE_EMAIL" };
    }
    throw err;
  }
}

export type UpdateUserInput = {
  userId: string;
  name: string;
  role: "USER" | "ADMIN";
};

export async function updateUser(
  input: UpdateUserInput,
): Promise<UserMutationResult> {
  try {
    await prisma.user.update({
      where: { id: input.userId },
      data: { name: input.name, role: input.role },
    });
    return { ok: true };
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return { ok: false, error: "NOT_FOUND" };
    }
    throw err;
  }
}

export type DeleteUserInput = {
  userId: string;
  currentUserId: string;
};

export async function deleteUser(
  input: DeleteUserInput,
): Promise<UserMutationResult> {
  if (input.userId === input.currentUserId) {
    return { ok: false, error: "SELF_DELETE" };
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const target = await tx.user.findUnique({
        where: { id: input.userId },
        select: { role: true, email: true },
      });

      if (!target) {
        return { ok: false, error: "NOT_FOUND" } as const;
      }

      if (target.role === "ADMIN") {
        const adminCount = await tx.user.count({ where: { role: "ADMIN" } });
        if (adminCount <= 1) {
          return { ok: false, error: "LAST_ADMIN" } as const;
        }
      }

      // Item.assignedTo → User.email has no onDelete, so it RESTRICTs.
      // Reject up-front with a useful error instead of letting the FK throw.
      const activeRentals = await tx.item.count({
        where: { assignedTo: target.email, status: "IN_USE" },
      });
      if (activeRentals > 0) {
        return { ok: false, error: "ACTIVE_RENTALS" } as const;
      }

      await tx.user.delete({ where: { id: input.userId } });
      return { ok: true } as const;
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return { ok: false, error: "NOT_FOUND" };
      }
      if (err.code === "P2003") {
        return { ok: false, error: "ACTIVE_RENTALS" };
      }
    }
    throw err;
  }
}
