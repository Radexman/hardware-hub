import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login");
  }

  const sidebarUser = {
    name: session.user.name ?? null,
    email: session.user.email,
    role: session.user.role,
    image: session.user.image ?? null,
  };

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar user={sidebarUser} />
        <SidebarInset>
          <header className="border-border flex h-14 items-center gap-2 border-b px-4 md:hidden">
            <SidebarTrigger />
          </header>
          <div className="flex-1 p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
