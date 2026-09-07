import Link from "next/link";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "./theme-toggle";
import { MobileSidebar } from "./mobile-sidebar";
import { LogoutButton } from "@/components/auth/logout-button";

export function Topbar({ userInitial }: { userInitial: string }) {
  return (
    <header className="flex h-14 items-center gap-3 border-b border-border px-4">
      <MobileSidebar />

      <button
        className="flex flex-1 max-w-sm items-center gap-2 rounded border border-border bg-surface px-3 py-1.5 text-sm text-muted-foreground hover:border-accent/40"
        aria-label="Buscar (Ctrl+K)"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Buscar sites, prompts, tarefas…</span>
        <kbd className="ml-auto rounded border border-border px-1.5 py-0.5 font-mono text-[11px]">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <Button asChild size="sm">
          <Link href="/dashboard/new">
            <Plus className="h-4 w-4" /> Novo Site
          </Link>
        </Button>
        <ThemeToggle />
        <Avatar>
          <AvatarFallback>{userInitial}</AvatarFallback>
        </Avatar>
        <LogoutButton />
      </div>
    </header>
  );
}
