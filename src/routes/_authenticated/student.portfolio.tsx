import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppShell, PageTitle } from "@/components/app/AppShell";
import { STUDENT_NAV } from "@/components/app/navs";

export const Route = createFileRoute("/_authenticated/student/portfolio")({
  head: () => ({ meta: [{ title: "Portfolio — TRIALOG" }] }),
  component: Page,
});

function Page() {
  const { user } = useRouteContext({ from: "/_authenticated" });
  const { data } = useQuery({
    queryKey: ["portfolio", user.id],
    queryFn: async () => {
      const [ex, tx, po, re] = await Promise.all([
        supabase.from("exercise_results").select("id, score, created_at, exercises(title)").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("text_responses").select("id, created_at, texts(title)").eq("user_id", user.id),
        supabase.from("discussion_posts").select("id, body, created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("reflections").select("id, body, kind, created_at").eq("user_id", user.id).eq("kind", "diary"),
      ]);
      return { ex: ex.data ?? [], tx: tx.data ?? [], po: po.data ?? [], re: re.data ?? [] };
    },
  });
  const d = (s: string) => new Date(s).toLocaleDateString("uz-UZ");
  return (
    <AppShell nav={STUDENT_NAV}>
      <PageTitle title="Elektron portfolio" sub="Barcha bajarilgan ishlaringiz bir joyda" />
      <div className="grid gap-5 md:grid-cols-2">
        <Box title="SO‘Z — mashq natijalari" color="text-soz" empty={!data?.ex.length}>
          {data?.ex.map((r) => <Row key={r.id} a={(r.exercises as { title: string } | null)?.title ?? ""} b={`${r.score}% · ${d(r.created_at)}`} />)}
        </Box>
        <Box title="MATN — tugallangan matnlar" color="text-matn" empty={!data?.tx.length}>
          {data?.tx.map((r) => <Row key={r.id} a={(r.texts as { title: string } | null)?.title ?? ""} b={d(r.created_at)} />)}
        </Box>
        <Box title="MUNOZARA — fikrlarim" color="text-munozara" empty={!data?.po.length}>
          {data?.po.map((r) => <Row key={r.id} a={r.body.slice(0, 80)} b={d(r.created_at)} />)}
        </Box>
        <Box title="OYNA — refleksiyalar" color="text-oyna" empty={!data?.re.length}>
          {data?.re.map((r) => <Row key={r.id} a={r.body.slice(0, 80)} b={d(r.created_at)} />)}
        </Box>
      </div>
    </AppShell>
  );
}

function Box({ title, color, empty, children }: { title: string; color: string; empty: boolean; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-card">
      <h2 className={`mb-3 font-semibold ${color}`}>{title}</h2>
      {empty ? <p className="text-sm text-muted-foreground">Hali yozuv yo‘q.</p> : <ul className="divide-y">{children}</ul>}
    </section>
  );
}
function Row({ a, b }: { a: string; b: string }) {
  return <li className="flex justify-between gap-3 py-2 text-sm"><span className="truncate">{a}</span><span className="shrink-0 text-xs text-muted-foreground">{b}</span></li>;
}
