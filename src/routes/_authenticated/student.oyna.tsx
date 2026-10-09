import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell, PageTitle } from "@/components/app/AppShell";
import { STUDENT_NAV } from "@/components/app/navs";
import { Bar } from "@/components/app/progress";
import { progressQuery } from "@/lib/progress";

export const Route = createFileRoute("/_authenticated/student/oyna")({
  head: () => ({ meta: [{ title: "OYNA — TRIALOG" }] }),
  component: Page,
});

const SKILLS = ["Leksik bilim", "Madaniy kontekstni tushunish", "Muloqot ko‘nikmasi", "Madaniyatlararo bag‘rikenglik"];
const PROMPTS = [
  "Bugun o‘z madaniyatim haqida nimani yangicha angladim?",
  "O‘zga madaniyatdagi qaysi hodisa meni hayratlantirdi yoki o‘ylantirdi?",
  "Ikki madaniyat o‘rtasida mening shaxsiy pozitsiyam qanday?",
  "Keyingi safar nimani boshqacha qilaman?",
];

function Page() {
  const { user } = useRouteContext({ from: "/_authenticated" });
  const qc = useQueryClient();
  const [body, setBody] = useState("");
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const { data: progress } = useQuery(progressQuery(user.id));
  const { data: items = [] } = useQuery({
    queryKey: ["reflections"],
    queryFn: async () => (await supabase.from("reflections").select("*").eq("user_id", user.id).order("created_at", { ascending: false })).data ?? [],
  });
  const refresh = () => ["reflections", "progress", "activity"].forEach((k) => qc.invalidateQueries({ queryKey: [k] }));

  async function add(kind: "diary" | "self") {
    await supabase.from("reflections").insert(kind === "diary" ? { user_id: user.id, kind, body } : { user_id: user.id, kind, ratings });
    kind === "diary" ? setBody("") : setRatings({});
    refresh();
  }

  return (
    <AppShell nav={STUDENT_NAV}>
      <PageTitle title="OYNA" sub="Refleksiv komponent — o‘z bilimi, tajribasi va rivojlanishini tahlil qilish" />
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border bg-card p-6 shadow-card">
          <h2 className="mb-4 font-semibold text-oyna">O‘z-o‘zini baholash</h2>
          {SKILLS.map((s) => (
            <div key={s} className="mb-3 flex items-center justify-between gap-3 text-sm">
              <span>{s}</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setRatings({ ...ratings, [s]: n })} className={`h-8 w-8 rounded-md border text-xs ${ratings[s] === n ? "border-oyna bg-oyna text-primary-foreground" : "hover:bg-oyna-soft"}`}>{n}</button>
                ))}
              </div>
            </div>
          ))}
          <button disabled={Object.keys(ratings).length < SKILLS.length} onClick={() => add("self")} className="mt-2 rounded-lg bg-oyna px-5 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">Saqlash</button>
        </section>

        <section className="rounded-2xl border bg-card p-6 shadow-card">
          <h2 className="mb-3 font-semibold text-oyna">Refleksiya kundaligi</h2>
          <div className="mb-3 flex flex-wrap gap-2">
            {PROMPTS.map((p) => (
              <button key={p} onClick={() => setBody(body ? body + "\n\n" + p + "\n" : p + "\n")} className="rounded-full bg-oyna-soft px-3 py-1 text-left text-xs text-oyna">{p}</button>
            ))}
          </div>
          <textarea rows={6} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Fikrlaringizni yozing..." className="w-full rounded-lg border bg-background px-3 py-2 text-sm" />
          <button disabled={!body.trim()} onClick={() => add("diary")} className="mt-3 rounded-lg bg-oyna px-5 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">Yozuvni saqlash</button>
        </section>

        <section className="rounded-2xl border bg-card p-6 shadow-card">
          <h2 className="mb-4 font-semibold text-oyna">Rivojlanish dinamikasi</h2>
          <div className="space-y-3">
            {progress?.modules.map((m) => (
              <div key={m.key}>
                <div className="mb-1 flex justify-between text-sm"><span className={m.text}>{m.name}</span><span>{m.percent}%</span></div>
                <Bar value={m.percent} className={m.bg} />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-6 shadow-card">
          <h2 className="mb-4 font-semibold text-oyna">Yozuvlarim</h2>
          {items.length === 0 && <p className="text-sm text-muted-foreground">Hali yozuv yo‘q.</p>}
          <ul className="max-h-96 space-y-3 overflow-y-auto">
            {items.map((r) => (
              <li key={r.id} className="rounded-lg bg-muted p-3 text-sm">
                <p className="mb-1 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString("uz-UZ")} · {r.kind === "self" ? "O‘z-o‘zini baholash" : "Kundalik"}</p>
                {r.kind === "self"
                  ? Object.entries((r.ratings ?? {}) as Record<string, number>).map(([k, v]) => <p key={k}>{k}: <b>{v}/5</b></p>)
                  : <p className="whitespace-pre-line">{r.body}</p>}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
