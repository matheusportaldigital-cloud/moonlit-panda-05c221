export default function FilesPage() {
  return (
    <div className="space-y-1">
      <h1 className="text-lg font-semibold">Arquivos</h1>
      <p className="text-sm text-muted-foreground">
        O upload via Supabase Storage chega na Fase 6.
      </p>
      <div className="mt-6 flex flex-col items-center justify-center rounded border border-dashed border-border py-16 text-center">
        <p className="text-sm">Nenhum arquivo enviado ainda.</p>
      </div>
    </div>
  );
}
