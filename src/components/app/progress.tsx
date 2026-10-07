import { Link } from "@tanstack/react-router";
import { Check, Circle, Loader } from "lucide-react";
import type { TrialogModule } from "@/lib/modules";
import { statusOf } from "@/lib/progress";

type M = TrialogModule & { percent: number };

export function Ring({ value, size = 140 }: { value: number; size?: number }) {
  const r = size / 2 - 10;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-muted)" strokeWidth="10" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-primary)" strokeWidth="10"
        strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (c * value) / 100}
        className="transition-all duration-700"
      />
    </svg>
  );
}

export function Bar({ value, className }: { value: number; className: string }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-muted">
      <div className={`h-full rounded-full ${className} transition-all duration-700`} style={{ width: `${value}%` }} />
    </div>
  );
}

export function StatusBadge({ percent }: { percent: number }) {
  const s = statusOf(percent);
  const Icon = s === "Tugallangan" ? Check : s === "Jarayonda" ? Loader : Circle;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
      <Icon className="h-3 w-3" /> {s}
    </span>
  );
}

export function LearningPath({ modules }: { modules: M[] }) {
  return (
    <ol className="relative space-y-4">
      {modules.map((m, i) => (
        <li key={m.key} className="relative flex gap-5">
          <div className="flex flex-col items-center">
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-semibold text-primary-foreground ${m.bg}`}>{i + 1}</span>
            {i < modules.length - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
          </div>
          <Link
            to={`/student/${m.key}`}
            className="mb-2 flex-1 rounded-xl border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className={`font-semibold tracking-wider ${m.text}`}>{m.name}</h3>
                <p className="text-xs text-muted-foreground">{m.component}</p>
              </div>
              <StatusBadge percent={m.percent} />
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1"><Bar value={m.percent} className={m.bg} /></div>
              <span className="w-10 text-right text-sm font-medium">{m.percent}%</span>
            </div>
          </Link>
        </li>
      ))}
    </ol>
  );
}
