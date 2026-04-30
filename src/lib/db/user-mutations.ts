import "server-only";

import bcrypt from "bcryptjs";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const SALT_ROUNDS = 12;

export type UserMutationErrorCode = "DUPLICATE_EMAIL";

export type UserMutationResult<T = void> =
  | (T extends void ? { ok: true } : { ok: true; data: T })
  | { ok: false; error: UserMutationErrorCode };

export const USER_MUTATION_ERROR_MESSAGE: Record<UserMutationErrorCode, string> =
  {
    DUPLICATE_EMAIL: "A user with this email already exists.",
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
