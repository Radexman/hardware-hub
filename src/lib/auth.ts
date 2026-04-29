import { redirect } from "next/navigation";
import type { Session } from "next-auth";

import { auth } from "@/auth";

export async function getSession(): Promise<Session | null> {
  return auth();
}

export async function requireSession(): Promise<Session> {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login");
  }
  return session;
}

export async function requireAdmin(): Promise<Session> {
  const session = await requireSession();
  if (session.user.role !== "ADMIN") {
    redirect("/hardware");
  }
  return session;
}

export async function getCurrentUserEmail(): Promise<string> {
  const session = await requireSession();
  return session.user.email!;
}
