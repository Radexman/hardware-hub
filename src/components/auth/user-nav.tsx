"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export type UserNavUser = {
  name: string | null;
  email: string;
  role: "USER" | "ADMIN";
  image?: string | null;
};

function getInitials(value: string) {
  return value
    .split(/[\s@.]+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function UserNav({ user }: { user: UserNavUser }) {
  const displayName = user.name?.trim() || user.email;
  const initials = getInitials(displayName);

  return (
    <div className="flex items-center gap-3 rounded-md p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0">
      <Avatar className="size-9 shrink-0">
        {user.image ? <AvatarImage src={user.image} alt={displayName} /> : null}
        <AvatarFallback className="bg-brand text-brand-foreground text-xs font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden">
        <span className="truncate text-sm font-medium">{displayName}</span>
        <span className="text-muted-foreground truncate text-xs">
          {user.email}
        </span>
        <span className="text-muted-foreground truncate text-[10px] uppercase tracking-wider">
          {user.role}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Sign out"
        className="group-data-[collapsible=icon]:hidden"
        onClick={() => signOut({ redirectTo: "/login" })}
      >
        <LogOut />
      </Button>
    </div>
  );
}
