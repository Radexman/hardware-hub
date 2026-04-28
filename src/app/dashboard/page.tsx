import { HardwareList } from "@/components/dashboard/hardware-list";
import { getItems } from "@/lib/db/items";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const items = await getItems();
  return <HardwareList items={items} />;
}
