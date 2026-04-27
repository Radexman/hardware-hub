import { HardwareList } from "@/components/dashboard/hardware-list";
import { items } from "@/lib/mock-data";

export default function DashboardPage() {
  return <HardwareList items={items} />;
}
