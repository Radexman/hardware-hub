import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

function section(title: string) {
  console.log("\n" + "=".repeat(60));
  console.log(title);
  console.log("=".repeat(60));
}

async function main() {
  section("Users");
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      emailVerified: true,
    },
  });
  console.table(
    users.map((u) => ({
      email: u.email,
      name: u.name,
      role: u.role,
      verified: u.emailVerified ? "yes" : "no",
      id: u.id,
    })),
  );

  section("Items");
  const items = await prisma.item.findMany({
    orderBy: { id: "asc" },
    select: {
      id: true,
      name: true,
      brand: true,
      status: true,
      assignedTo: true,
      purchaseDate: true,
      notes: true,
    },
  });
  console.table(
    items.map((i) => ({
      id: i.id,
      name: i.name,
      brand: i.brand,
      status: i.status,
      assignedTo: i.assignedTo ?? "-",
      purchased: i.purchaseDate?.toISOString().slice(0, 10) ?? "-",
      notes: i.notes ?? "-",
    })),
  );

  section("Rental history");
  const history = await prisma.rentalHistory.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { email: true } },
      item: { select: { name: true } },
    },
  });
  console.table(
    history.map((h) => ({
      id: h.id,
      action: h.action,
      item: h.item.name,
      user: h.user.email,
      when: h.createdAt.toISOString(),
      note: h.note ?? "-",
    })),
  );

  section("Counts");
  const [userCount, itemCount, historyCount] = await Promise.all([
    prisma.user.count(),
    prisma.item.count(),
    prisma.rentalHistory.count(),
  ]);
  console.log(
    `users=${userCount}  items=${itemCount}  rentalHistory=${historyCount}`,
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
