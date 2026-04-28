import type { ReactNode } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { UserListItem } from "@/lib/db/users";
import { cn } from "@/lib/utils";

export type UserCardView = "grid" | "list";

const ROLE_STYLES: Record<UserListItem["role"], string> = {
  ADMIN: "bg-brand/10 text-brand ring-brand/20",
  USER: "bg-muted text-muted-foreground ring-border",
};

const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return DATE_FMT.format(date);
}

function getInitials(user: UserListItem): string {
  const source = user.name?.trim() || user.email;
  return source
    .split(/[\s@.]+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function RoleBadge({ role }: { role: UserListItem["role"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ring-1 ring-inset",
        ROLE_STYLES[role],
      )}
    >
      {role}
    </span>
  );
}

const CARD_BASE =
  "bg-card text-card-foreground border-border rounded-lg border transition-all duration-200";

type CommonProps = {
  user: UserListItem;
  action?: ReactNode;
};

function GridCard({ user, action }: CommonProps) {
  return (
    <article
      className={cn(
        CARD_BASE,
        "flex flex-col gap-4 p-5 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/40",
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="size-10 shrink-0">
            <AvatarFallback className="bg-brand text-brand-foreground text-xs font-medium">
              {getInitials(user)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold leading-tight">
              {user.name ?? user.email}
            </h3>
            <p className="text-muted-foreground truncate text-xs">
              {user.email}
            </p>
          </div>
        </div>
        <RoleBadge role={user.role} />
      </header>

      <div className="text-muted-foreground mt-auto flex items-center justify-between gap-3 text-xs">
        <span>Joined {formatDate(user.createdAt)}</span>
        {action}
      </div>
    </article>
  );
}

function ListCard({ user, action }: CommonProps) {
  return (
    <article
      className={cn(
        CARD_BASE,
        "flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3 hover:shadow-md hover:shadow-black/30 sm:flex-nowrap",
      )}
    >
      <Avatar className="size-9 shrink-0">
        <AvatarFallback className="bg-brand text-brand-foreground text-xs font-medium">
          {getInitials(user)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="truncate text-sm font-semibold">
            {user.name ?? user.email}
          </h3>
          <span className="text-muted-foreground truncate text-xs">
            {user.email}
          </span>
        </div>
      </div>

      <span className="text-muted-foreground hidden text-xs sm:inline">
        Joined {formatDate(user.createdAt)}
      </span>

      <RoleBadge role={user.role} />

      {action}
    </article>
  );
}

export function UserCard({
  user,
  view = "grid",
  action,
}: CommonProps & { view?: UserCardView }) {
  return view === "list" ? (
    <ListCard user={user} action={action} />
  ) : (
    <GridCard user={user} action={action} />
  );
}
