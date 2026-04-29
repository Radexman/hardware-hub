export const RENTAL_PERIOD_OPTIONS = [7, 14, 30] as const;
export type RentalPeriodDays = (typeof RENTAL_PERIOD_OPTIONS)[number];
export const DEFAULT_RENTAL_PERIOD_DAYS: RentalPeriodDays = 14;

export const DUE_SOON_THRESHOLD_DAYS = 3;

export type DueState = "normal" | "due-soon" | "overdue";

function startOfTodayUtc(now: Date = new Date()): Date {
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
}

export function classifyDue(
  returnDate: string | null,
  now: Date = new Date(),
): DueState {
  if (!returnDate) return "normal";
  const due = new Date(returnDate);
  if (Number.isNaN(due.getTime())) return "normal";

  const dueUtc = new Date(
    Date.UTC(due.getUTCFullYear(), due.getUTCMonth(), due.getUTCDate()),
  );
  const todayUtc = startOfTodayUtc(now);

  if (dueUtc.getTime() < todayUtc.getTime()) return "overdue";

  const diffDays = Math.round(
    (dueUtc.getTime() - todayUtc.getTime()) / (24 * 60 * 60 * 1000),
  );
  if (diffDays <= DUE_SOON_THRESHOLD_DAYS) return "due-soon";

  return "normal";
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}
