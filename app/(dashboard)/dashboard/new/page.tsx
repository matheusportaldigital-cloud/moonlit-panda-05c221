import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NewSiteForm } from "@/components/sites/new-site-form";

export default function NewSitePage() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Meus Sites
      </Link>
      <div>
        <h1 className="text-lg font-semibold">Novo site</h1>
        <p className="text-sm text-muted-foreground">
          Comece com o essencial — o resto do briefing você preenche na página do projeto.
        </p>
      </div>
      <NewSiteForm />
    </div>
  );
}
