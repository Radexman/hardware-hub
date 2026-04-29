"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Monitor, Package, Shield, Wrench } from "lucide-react";

import { UserNav, type UserNavUser } from "@/components/auth/user-nav";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const NAV_ITEMS = [
  { label: "Hardware List", href: "/hardware", icon: Monitor },
  { label: "My Rentals", href: "/my-rentals", icon: Package },
  { label: "Admin Panel", href: "/admin", icon: Shield },
] as const;

export function AppSidebar({ user }: { user: UserNavUser }) {
  const pathname = usePathname();
  const navItems = NAV_ITEMS.filter(
    (item) => item.href !== "/admin" || user.role === "ADMIN",
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:justify-center">
          <Link
            href="/hardware"
            className="flex items-center gap-2 px-2 py-1.5 group-data-[collapsible=icon]:hidden"
          >
            <Wrench className="text-brand size-5 shrink-0" />
            <span className="font-mono text-base font-bold tracking-tight">
              Hardware Hub
            </span>
          </Link>
          <SidebarTrigger className="shrink-0" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.label}
                      render={<Link href={item.href} />}
                    >
                      <Icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <UserNav user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
