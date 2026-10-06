import type { TrialogModule } from "@/lib/modules";

export function ModuleCard({ m, index }: { m: TrialogModule; index: number }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-lift">
      <div className={`absolute inset-x-0 top-0 h-1 ${m.bg}`} />
      <div className="flex items-center justify-between">
        <span className={`rounded-md px-2.5 py-1 text-xs font-medium ${m.soft} ${m.text}`}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="text-xs text-muted-foreground">{m.block}</span>
      </div>
      <h3 className={`mt-6 text-2xl font-semibold tracking-wider ${m.text}`}>{m.name}</h3>
      <p className="mt-1 text-sm font-medium text-foreground">{m.component}</p>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{m.description}</p>
    </article>
  );
}
