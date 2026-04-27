export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full">
      <aside className="bg-sidebar text-sidebar-foreground border-border flex w-64 shrink-0 flex-col border-r p-6">
        <h2 className="text-lg font-semibold">Sidebar</h2>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
