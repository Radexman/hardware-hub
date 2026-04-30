# AI Semantic Search — MVP

## Overview

Introduce an AI-powered search mode that allows users to find hardware using natural language queries.

This feature extends the existing search bar by adding a second mode:

- Basic search (existing fuzzy search)
- AI search (natural language → filtered inventory)

The AI does not replace the existing system. It acts as a **query interpreter**, translating user intent into a filtered subset of the existing inventory.

This is intentionally a lightweight implementation designed for clarity, usability, and demo value.

---

## Requirements

## Search Modes

Add a toggle to the existing search UI:

- Basic Search (default)
- AI Search

Behavior:

- Basic → existing fuzzy search logic
- AI → triggers AI-powered filtering

---

## AI Search Behavior

When AI mode is active:

1. User enters natural language query  
   Example:
    - "I want to test on mobile"
    - "Need a laptop for development"
    - "Something for meetings"

2. On search:
    - Send query + inventory to server action
    - Call OpenAI API
    - Receive matching item IDs

3. Filter inventory list based on returned IDs

4. Display results using existing UI

---

## Data Flow

Client:

- Sends:
    - `query: string`
    - current inventory (subset of fields)

Server:

- Calls OpenAI
- Returns:
    - `string[]` (item IDs)

Client:

- Filters items:
    - `items.filter(item => ids.includes(item.id))`

---

## Inventory Payload

Send minimal data required for reasoning:

- id
- name
- brand
- status
- notes (if present)

Limit payload size if needed (e.g. max 50 items).

---

## OpenAI Integration

Use OpenAI Chat API.

Server-side only (never expose API key to client).

---

## Prompt Requirements

Prompt should:

- Explain task clearly
- Include inventory data
- Include user query
- Enforce strict output format

Expected output:

```json
["item_1", "item_2"]
```

Rules:

- Return ONLY JSON array
- No explanations
- Prefer AVAILABLE items
- Match based on intent, not exact keywords

---

## Server Action

Create server action:

- `aiSearchItems(query, items)`

Responsibilities:

- Validate input
- Call OpenAI
- Parse response
- Return safe result

Fallback:

- On failure → return empty array

---

## UI Behavior

- Add toggle (Basic / AI)
- Show loading state during AI call
- Disable input while loading (optional)
- Show results using existing list component

Empty state:

- If no results:
    - "No AI matches found"

---

## Error Handling

- If OpenAI fails:
    - Do not crash UI
    - Return empty results
    - Optionally show toast or silent fallback

---

## Technical Expectations

- Use Next.js Server Actions
- Keep AI logic isolated (no coupling to UI)
- Do not modify existing fuzzy search logic
- Do not introduce new database queries
- Keep implementation simple and readable

---

## Out of Scope (MVP)

- Embeddings / vector search
- Semantic indexing
- Chat interface
- Query memory/history
- Caching AI results
- Ranking/scoring system

---

## Testing (Manual)

- Query: "mobile testing" → returns phones
- Query: "work laptop" → returns laptops
- Query: "random nonsense" → returns empty list

---

## References

- OpenAI API docs
- Existing HardwareList search implementation
- @context/project-overview.md
- @src/lib/db/items.ts
