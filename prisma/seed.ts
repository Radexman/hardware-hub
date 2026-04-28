import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";
import { items, rentalHistory } from "../src/lib/mock-data";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 12;

async function main() {
  const now = new Date();

  const [adminPassword, jdoePassword, alicePassword] = await Promise.all([
    bcrypt.hash("admin123", SALT_ROUNDS),
    bcrypt.hash("user123", SALT_ROUNDS),
    bcrypt.hash("user123", SALT_ROUNDS),
  ]);

  const admin = await prisma.user.upsert({
    where: { email: "admin@booksy.com" },
    update: {},
    create: {
      email: "admin@booksy.com",
      name: "Alex Admin",
      password: adminPassword,
      role: "ADMIN",
      emailVerified: now,
    },
  });

  const jdoe = await prisma.user.upsert({
    where: { email: "j.doe@booksy.com" },
    update: {},
    create: {
      email: "j.doe@booksy.com",
      name: "John Doe",
      password: jdoePassword,
      role: "USER",
      emailVerified: now,
    },
  });

  // Alice is needed because mock item_10 is assigned to a.smith@booksy.com
  // and the rental history references userId "user_asmith".
  const alice = await prisma.user.upsert({
    where: { email: "a.smith@booksy.com" },
    update: {},
    create: {
      email: "a.smith@booksy.com",
      name: "Alice Smith",
      password: alicePassword,
      role: "USER",
      emailVerified: now,
    },
  });

  const userIdByMockId: Record<string, string> = {
    user_admin_1: admin.id,
    user_jdoe: jdoe.id,
    user_asmith: alice.id,
  };

  for (const item of items) {
    await prisma.item.upsert({
      where: { id: item.id },
      update: {},
      create: {
        id: item.id,
        name: item.name,
        brand: item.brand,
        purchaseDate: item.purchaseDate ? new Date(item.purchaseDate) : null,
        status: item.status,
        assignedTo: item.assignedTo,
        returnDate: item.returnDate ? new Date(item.returnDate) : null,
        notes: item.notes,
      },
    });
  }

  for (const entry of rentalHistory) {
    const userId = userIdByMockId[entry.userId];
    if (!userId) {
      console.warn(
        `Skipping rental history ${entry.id}: unknown mock userId ${entry.userId}`,
      );
      continue;
    }
    await prisma.rentalHistory.upsert({
      where: { id: entry.id },
      update: {},
      create: {
        id: entry.id,
        action: entry.action,
        itemId: entry.itemId,
        userId,
        note: entry.note,
        createdAt: new Date(entry.createdAt),
      },
    });
  }

  console.log(
    `Seed complete: 3 users, ${items.length} items, ${rentalHistory.length} rental history entries.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
