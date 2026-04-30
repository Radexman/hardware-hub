"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth";
import {
  USER_MUTATION_ERROR_MESSAGE,
  createUser,
} from "@/lib/db/user-mutations";

export type ActionResult<T = undefined> =
  | (T extends undefined ? { success: true } : { success: true; data: T })
  | { success: false; error: string };

const createUserSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.email("Enter a valid email").trim().toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["USER", "ADMIN"]),
});

export async function createUserAction(input: {
  name: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN";
}): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();

  const parsed = createUserSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid request.",
    };
  }

  const result = await createUser(parsed.data);

  if (!result.ok) {
    return {
      success: false,
      error: USER_MUTATION_ERROR_MESSAGE[result.error],
    };
  }

  revalidatePath("/admin");
  return { success: true, data: result.data };
}
