import { SidebarNav } from "./sidebar-nav";

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-border bg-surface/60 md:block">
      <SidebarNav />
    </aside>
  );
}
