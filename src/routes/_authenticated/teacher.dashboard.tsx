import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell, PageTitle } from "@/components/app/AppShell";
import { TEACHER_NAV } from "@/components/app/navs";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/teacher/dashboard")({
  head: () => ({ meta: [{ title: "O‘qituvchi paneli — TRIALOG" }] }),
  component: Page,
});

const MODS = ["soz", "matn", "munozara", "oyna"];
type Row = { id: string; full_name: string; email: string | null; p: Record<string, number> };

function Page() {
  const [rows, setRows] = useState<Row[]>([]);
  const [acts, setActs] = useState<{ title: string; created_at: string; user_id: string }[]>([]);
  useEffect(() => {
    (async () => {
      const [{ data: pr }, { data: mp }, { data: al }] = await Promise.all([
        supabase.from("profiles").select("id,full_name,email"),
        supabase.from("module_progress").select("user_id,module,percent"),
        supabase.from("activity_log").select("title,created_at,user_id").order("created_at", { ascending: false }).limit(15),
      ]);
      setRows((pr ?? []).map((p) => ({ ...p, p: Object.fromEntries((mp ?? []).filter((m) => m.user_id === p.id).map((m) => [m.module, m.percent])) })));
      setActs(al ?? []);
    })();
  }, []);
  const name = (id: string) => rows.find((r) => r.id === id)?.full_name || "—";
  return (
    <AppShell nav={TEACHER_NAV}>
      <PageTitle title="O‘qituvchi paneli" sub="Talabalar progressi va so‘nggi faollik" />
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left"><tr><th className="p-3">Talaba</th>{MODS.map((m) => <th key={m} className="p-3 uppercase">{m}</th>)}<th className="p-3">O‘rtacha</th></tr></thead>
          <tbody>
            {rows.map((r) => {
              const avg = Math.round(MODS.reduce((s, m) => s + (r.p[m] ?? 0), 0) / 4);
              return (
                <tr key={r.id} className="border-t border-border">
                  <td className="p-3"><div className="font-medium">{r.full_name || "—"}</div><div className="text-xs text-muted-foreground">{r.email}</div></td>
                  {MODS.map((m) => <td key={m} className="p-3">{r.p[m] ?? 0}%</td>)}
                  <td className="p-3 font-semibold">{avg}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <h2 className="mt-8 mb-3 font-display text-xl">So‘nggi faollik</h2>
      <ul className="space-y-2">
        {acts.map((a, i) => <li key={i} className="rounded-lg border border-border bg-card p-3 text-sm"><b>{name(a.user_id)}</b> — {a.title} <span className="text-muted-foreground">· {new Date(a.created_at).toLocaleString()}</span></li>)}
      </ul>
    </AppShell>
  );
}

export function ContentForms() {
  const [v, setV] = useState({ word: "", definition: "", cultural_note: "", example: "" });
  const [t, setT] = useState({ title: "", description: "" });
  const [x, setX] = useState({ title: "", source: "", body: "" });
  const save = async (table: "vocab_items" | "discussion_topics" | "texts", data: Record<string, string>, reset: () => void) => {
    const { error } = await supabase.from(table).insert(data as never);
    if (error) toast.error(error.message); else { toast.success("Saqlandi"); reset(); }
  };
  const inp = "w-full rounded-md border border-input bg-background p-2 text-sm";
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <form className="space-y-2 rounded-xl border border-border bg-card p-4" onSubmit={(e) => { e.preventDefault(); save("vocab_items", v, () => setV({ word: "", definition: "", cultural_note: "", example: "" })); }}>
        <h3 className="font-semibold">Yangi so‘z (SO‘Z)</h3>
        {(["word", "definition", "cultural_note", "example"] as const).map((k) => <input key={k} required={k === "word"} className={inp} placeholder={{ word: "So‘z", definition: "Ma’nosi", cultural_note: "Madaniy izoh", example: "Misol" }[k]} value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} />)}
        <button className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Qo‘shish</button>
      </form>
      <form className="space-y-2 rounded-xl border border-border bg-card p-4" onSubmit={(e) => { e.preventDefault(); save("texts", x, () => setX({ title: "", source: "", body: "" })); }}>
        <h3 className="font-semibold">Yangi matn (MATN)</h3>
        <input required className={inp} placeholder="Sarlavha" value={x.title} onChange={(e) => setX({ ...x, title: e.target.value })} />
        <input className={inp} placeholder="Manba" value={x.source} onChange={(e) => setX({ ...x, source: e.target.value })} />
        <textarea required rows={4} className={inp} placeholder="Matn" value={x.body} onChange={(e) => setX({ ...x, body: e.target.value })} />
        <button className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Qo‘shish</button>
      </form>
      <form className="space-y-2 rounded-xl border border-border bg-card p-4" onSubmit={(e) => { e.preventDefault(); save("discussion_topics", t, () => setT({ title: "", description: "" })); }}>
        <h3 className="font-semibold">Yangi mavzu (MUNOZARA)</h3>
        <input required className={inp} placeholder="Mavzu" value={t.title} onChange={(e) => setT({ ...t, title: e.target.value })} />
        <textarea rows={4} className={inp} placeholder="Tavsif" value={t.description} onChange={(e) => setT({ ...t, description: e.target.value })} />
        <button className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Qo‘shish</button>
      </form>
    </div>
  );
}
