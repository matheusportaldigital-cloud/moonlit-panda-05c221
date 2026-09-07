import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth";

export function LogoutButton() {
  return (
    <form action={signOut}>
      <Button variant="ghost" size="icon" aria-label="Sair" type="submit">
        <LogOut className="h-4 w-4" />
      </Button>
    </form>
  );
}
