"use client";

import { useState } from "react";

import { AdminUserActions } from "@/components/admin/admin-user-actions";
import { CreateUserDialog } from "@/components/admin/create-user-dialog";
import { UserCard, type UserCardView } from "@/components/admin/user-card";
import { ViewToggle } from "@/components/items/view-toggle";
import type { UserListItem } from "@/lib/db/users";

export function UsersList({
  users,
  currentUserId,
}: {
  users: UserListItem[];
  currentUserId: string;
}) {
  const [view, setView] = useState<UserCardView>("list");

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-mono text-xl font-bold tracking-tight">
            User Management
          </h2>
          <p className="text-muted-foreground text-sm">
            Review and create user accounts
          </p>
        </div>
        <CreateUserDialog />
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
          {users.length} {users.length === 1 ? "user" : "users"}
        </span>
        <ViewToggle value={view} onChange={setView} />
      </div>

      {users.length === 0 ? (
        <div className="text-muted-foreground border-border rounded-lg border border-dashed p-8 text-center text-sm">
          No users found.
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              view="grid"
              action={
                <AdminUserActions user={user} currentUserId={currentUserId} />
              }
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              view="list"
              action={
                <AdminUserActions user={user} currentUserId={currentUserId} />
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
