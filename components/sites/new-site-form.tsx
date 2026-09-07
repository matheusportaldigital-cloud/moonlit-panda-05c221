"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSite, type SiteFormState } from "@/lib/actions/sites";

const initialState: SiteFormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Salvando…" : "Criar site"}
    </Button>
  );
}

export function NewSiteForm() {
  const [state, formAction] = useFormState(createSite, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      toast.success("Site criado.");
      router.push("/dashboard");
    }
  }, [state?.success, router]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Nome do projeto</Label>
        <Input id="name" name="name" placeholder="Barbearia Premium" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="company_name">Nome da empresa</Label>
        <Input id="company_name" name="company_name" placeholder="Barbearia Premium Ltda." />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="description">Descrição</Label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="flex w-full rounded border border-border bg-surface px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          placeholder="Site para gerar agendamentos de uma barbearia premium."
        />
      </div>
      {state?.error && <p className="text-sm text-danger">{state.error}</p>}
      <SubmitButton />
    </form>
  );
}
