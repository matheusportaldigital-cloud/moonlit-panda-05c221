"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { primaryNav, secondaryNav } from "./nav-items";

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  const renderGroup = (label: string, items: typeof primaryNav) => (
    <div>
      <p className="px-3 pb-1 text-xs font-medium text-muted-foreground">{label}</p>
      <ul className="space-y-0.5">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-2.5 rounded px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-accent/15 text-foreground"
                    : "text-muted-foreground hover:bg-border/40 hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <nav className="flex h-full flex-col gap-6 py-2">
      <div className="px-3">
        <span className="text-sm font-semibold tracking-tight">Central de Sites</span>
      </div>
      {renderGroup("Meus Sites", primaryNav)}
      <div className="mt-auto">{renderGroup("Outros", secondaryNav)}</div>
    </nav>
  );
}
