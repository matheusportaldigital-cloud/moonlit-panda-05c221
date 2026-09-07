export default function PromptsPage() {
  return (
    <div className="space-y-1">
      <h1 className="text-lg font-semibold">Prompts</h1>
      <p className="text-sm text-muted-foreground">
        A biblioteca de prompts e o Prompt Builder chegam na Fase 4.
      </p>
      <div className="mt-6 flex flex-col items-center justify-center rounded border border-dashed border-border py-16 text-center">
        <p className="text-sm">Nenhum prompt criado ainda.</p>
      </div>
    </div>
  );
}
