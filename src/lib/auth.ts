import { auth } from "@/auth";

export async function getCurrentUserEmail(): Promise<string> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    throw new Error("getCurrentUserEmail called without an authenticated session");
  }
  return email;
}
