"use server";

import { z } from "zod";

import { requireSession } from "@/lib/auth";
import { aiSearchItemIds, type AiSearchItem } from "@/lib/ai/search";

const itemSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  brand: z.string(),
  status: z.enum(["AVAILABLE", "IN_USE", "REPAIR"]),
  notes: z.string().nullable(),
});

const inputSchema = z.object({
  query: z.string().trim().min(1).max(200),
  items: z.array(itemSchema).max(200),
});

export async function aiSearchItemsAction(input: {
  query: string;
  items: AiSearchItem[];
}): Promise<string[]> {
  await requireSession();

  const parsed = inputSchema.safeParse(input);
  if (!parsed.success) return [];

  return aiSearchItemIds(parsed.data.query, parsed.data.items);
}
