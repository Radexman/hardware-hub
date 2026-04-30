import { Suspense } from "react";

import { AdminInventory } from "@/components/admin/admin-inventory";
import { InventorySkeleton } from "@/components/admin/inventory-skeleton";
import { UsersList } from "@/components/admin/users-list";
import { UsersSkeleton } from "@/components/admin/users-skeleton";
import { requireAdmin } from "@/lib/auth";
import { getItems } from "@/lib/db/items";
import { getUsers } from "@/lib/db/users";

export const dynamic = "force-dynamic";

async function AdminInventoryLoader() {
  const items = await getItems();
  const brandOptions = [...new Set(items.map((item) => item.brand))].sort();
  return <AdminInventory items={items} brandOptions={brandOptions} />;
}

async function UsersLoader({ currentUserId }: { currentUserId: string }) {
  const users = await getUsers();
  return <UsersList users={users} currentUserId={currentUserId} />;
}

export default async function AdminPage() {
  const session = await requireAdmin();

  return (
    <div className="flex flex-col gap-12">
      <Suspense fallback={<InventorySkeleton />}>
        <AdminInventoryLoader />
      </Suspense>
      <Suspense fallback={<UsersSkeleton />}>
        <UsersLoader currentUserId={session.user.id} />
      </Suspense>
    </div>
  );
}
