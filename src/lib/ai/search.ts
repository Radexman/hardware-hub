import "server-only";

import OpenAI from "openai";

export type AiSearchItem = {
  id: string;
  name: string;
  brand: string;
  status: "AVAILABLE" | "IN_USE" | "REPAIR";
  notes: string | null;
};

export const AI_SEARCH_MAX_ITEMS = 50;
export const AI_SEARCH_MAX_QUERY_LENGTH = 200;

const MODEL = "gpt-5-nano";

const SYSTEM_PROMPT = `You are a hardware-search assistant for an internal company tool.
You receive a JSON catalog of hardware items and a user query expressing intent.
Return ONLY a JSON object of the shape { "ids": string[] } where ids are item ids from the catalog that best match the user's intent.

Rules:
- Match by intent, not exact keyword.
- Prefer items with status "AVAILABLE" over items "IN_USE" or "REPAIR".
- Return an empty array if nothing matches.
- Return ONLY the JSON object — no prose, no code fences.`;

let cachedClient: OpenAI | null = null;
function getClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  if (cachedClient) return cachedClient;
  cachedClient = new OpenAI({ apiKey });
  return cachedClient;
}

function parseIdsFromContent(raw: string, validIds: Set<string>): string[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!parsed || typeof parsed !== "object") return [];
  const ids = (parsed as { ids?: unknown }).ids;
  if (!Array.isArray(ids)) return [];
  return ids
    .filter((id): id is string => typeof id === "string")
    .filter((id) => validIds.has(id));
}

export async function aiSearchItemIds(
  query: string,
  items: AiSearchItem[],
): Promise<string[]> {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return [];

  const client = getClient();
  if (!client) {
    console.warn(
      "[ai-search] OPENAI_API_KEY missing; returning empty result",
    );
    return [];
  }

  const queryForApi = trimmedQuery.slice(0, AI_SEARCH_MAX_QUERY_LENGTH);
  const itemsForApi = items.slice(0, AI_SEARCH_MAX_ITEMS);
  const validIds = new Set(itemsForApi.map((item) => item.id));

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: JSON.stringify({
            query: queryForApi,
            catalog: itemsForApi,
          }),
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) return [];
    return parseIdsFromContent(raw, validIds);
  } catch (err) {
    console.error("[ai-search] OpenAI call failed", err);
    return [];
  }
}
