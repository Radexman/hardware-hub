import { Skeleton } from "@/components/ui/skeleton";

export function InventorySkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72" />
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-9 w-36" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Skeleton key={idx} className="h-44 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
