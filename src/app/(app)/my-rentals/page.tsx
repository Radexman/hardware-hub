import { MyRentalsList } from "@/components/my-rentals/my-rentals-list";
import { getCurrentUserEmail } from "@/lib/auth";
import { getMyRentals } from "@/lib/db/rentals";

export const dynamic = "force-dynamic";

export default async function MyRentalsPage() {
  const email = await getCurrentUserEmail();
  const items = await getMyRentals(email);
  return <MyRentalsList items={items} />;
}
