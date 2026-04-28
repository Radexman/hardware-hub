import { Suspense } from "react";

import { AdminInventory } from "@/components/admin/admin-inventory";
import { InventorySkeleton } from "@/components/admin/inventory-skeleton";
import { getItems } from "@/lib/db/items";

export const dynamic = "force-dynamic";

async function AdminInventoryLoader() {
  const items = await getItems();
  const brandOptions = [...new Set(items.map((item) => item.brand))].sort();
  return <AdminInventory items={items} brandOptions={brandOptions} />;
}

export default function AdminPage() {
  return (
    <Suspense fallback={<InventorySkeleton />}>
      <AdminInventoryLoader />
    </Suspense>
  );
}
