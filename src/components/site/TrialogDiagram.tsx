import { getModules } from "@/lib/modules";
import { useLanguage } from "@/lib/i18n";

const POS = [
  "left-1/2 top-0 -translate-x-1/2",
  "right-0 top-1/2 -translate-y-1/2",
  "left-1/2 bottom-0 -translate-x-1/2",
  "left-0 top-1/2 -translate-y-1/2",
];

export function TrialogDiagram() {
  const { lang, t } = useLanguage();
  const modules = getModules(lang);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
        <circle
          cx="200"
          cy="200"
          r="150"
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="1.5"
          strokeDasharray="4 6"
        />
        <circle cx="200" cy="200" r="95" fill="none" stroke="var(--color-border)" strokeWidth="1" />
      </svg>
      <div className="absolute left-1/2 top-1/2 flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-primary text-center text-primary-foreground shadow-lift">
        <span className="text-xs uppercase tracking-[0.2em] opacity-70 px-2 leading-tight">
          {t.home.diagramCenter}
        </span>
        <span className="mt-1 text-lg font-semibold tracking-[0.18em]">
          {t.home.diagramCenterSubtitle}
        </span>
      </div>
      {modules.map((m, i) => (
        <div
          key={m.key}
          className={`absolute ${POS[i]} animate-rise rounded-xl border bg-card px-4 py-3 shadow-card`}
          style={{ animationDelay: `${i * 120}ms` }}
        >
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${m.bg}`} />
            <span className={`text-sm font-semibold tracking-wider ${m.text}`}>{m.name}</span>
          </div>
          <p className="mt-0.5 text-[11px] text-muted-foreground">{m.component}</p>
        </div>
      ))}
    </div>
  );
}
