"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Monitor, Package, Shield, Wrench } from "lucide-react";

import { currentUser } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:justify-center">
          <Link
            href="/dashboard"
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
              {NAV_ITEMS.map((item) => {
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
        <div className="flex items-center gap-3 rounded-md p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0">
          <Avatar className="size-9 shrink-0">
            {currentUser.image ? (
              <AvatarImage src={currentUser.image} alt={currentUser.name} />
            ) : null}
            <AvatarFallback className="bg-brand text-brand-foreground text-xs font-medium">
              {getInitials(currentUser.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-medium">
              {currentUser.name}
            </span>
            <span className="text-muted-foreground truncate text-xs uppercase">
              {currentUser.role}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Logout"
            className="group-data-[collapsible=icon]:hidden"
          >
            <LogOut />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
