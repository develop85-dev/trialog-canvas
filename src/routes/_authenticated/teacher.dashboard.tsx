import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, PageTitle } from "@/components/app/AppShell";
import { TEACHER_NAV } from "@/components/app/navs";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/lib/i18n";
import { getModules } from "@/lib/modules";

export const Route = createFileRoute("/_authenticated/teacher/dashboard")({
  head: () => ({ meta: [{ title: "O‘qituvchi paneli / Панель преподавателя — TRIALOG" }] }),
  component: Page,
});

const MODS = ["soz", "matn", "munozara", "oyna"] as const;
type Row = { id: string; full_name: string; email: string | null; p: Record<string, number> };

function Page() {
  const { lang } = useLanguage();
  const isRu = lang === "ru";
  const [rows, setRows] = useState<Row[]>([]);
  const [acts, setActs] = useState<{ title: string; created_at: string; user_id: string }[]>([]);

  useEffect(() => {
    (async () => {
      const [{ data: pr }, { data: mp }, { data: al }] = await Promise.all([
        supabase.from("profiles").select("id,full_name,email"),
        supabase.from("module_progress").select("user_id,module,percent"),
        supabase
          .from("activity_log")
          .select("title,created_at,user_id")
          .order("created_at", { ascending: false })
          .limit(15),
      ]);
      setRows(
        (pr ?? []).map((p) => ({
          ...p,
          p: Object.fromEntries(
            (mp ?? []).filter((m) => m.user_id === p.id).map((m) => [m.module, m.percent]),
          ),
        })),
      );
      setActs(al ?? []);
    })();
  }, []);

  const name = (id: string) => rows.find((r) => r.id === id)?.full_name || "—";
  const modulesList = getModules(lang);

  return (
    <AppShell nav={TEACHER_NAV}>
      <PageTitle
        title={isRu ? "Панель преподавателя" : "O‘qituvchi paneli"}
        sub={
          isRu
            ? "Прогресс студентов и последняя активность"
            : "Talabalar progressi va so‘nggi faollik"
        }
      />
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="p-3">{isRu ? "Студент" : "Talaba"}</th>
              {MODS.map((m) => {
                const loc = modulesList.find((x) => x.key === m);
                return (
                  <th key={m} className="p-3 uppercase">
                    {loc?.name ?? m}
                  </th>
                );
              })}
              <th className="p-3">{isRu ? "Среднее" : "O‘rtacha"}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const avg = Math.round(MODS.reduce((s, m) => s + (r.p[m] ?? 0), 0) / 4);
              return (
                <tr key={r.id} className="border-t border-border">
                  <td className="p-3">
                    <div className="font-medium">{r.full_name || "—"}</div>
                    <div className="text-xs text-muted-foreground">{r.email}</div>
                  </td>
                  {MODS.map((m) => (
                    <td key={m} className="p-3">
                      {r.p[m] ?? 0}%
                    </td>
                  ))}
                  <td className="p-3 font-semibold">{avg}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <h2 className="mt-8 mb-3 font-display text-xl">
        {isRu ? "Последняя активность" : "So‘nggi faollik"}
      </h2>
      <ul className="space-y-2">
        {acts.map((a, i) => (
          <li key={i} className="rounded-lg border border-border bg-card p-3 text-sm">
            <b>{name(a.user_id)}</b> — {a.title}{" "}
            <span className="text-muted-foreground">
              · {new Date(a.created_at).toLocaleString(isRu ? "ru-RU" : "uz-UZ")}
            </span>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
