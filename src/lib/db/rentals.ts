import { prisma } from "@/lib/prisma";
import type { Item } from "@/lib/mock-data";

function toIsoDate(value: Date | null): string | null {
  return value ? value.toISOString().slice(0, 10) : null;
}

export async function getMyRentals(userEmail: string): Promise<Item[]> {
  const rows = await prisma.item.findMany({
    where: {
      assignedTo: userEmail,
      status: "IN_USE",
    },
    orderBy: { returnDate: "asc" },
  });

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category,
    purchaseDate: toIsoDate(row.purchaseDate),
    status: row.status,
    assignedTo: row.assignedTo,
    returnDate: toIsoDate(row.returnDate),
    notes: row.notes,
  }));
}
