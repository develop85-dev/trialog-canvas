import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, PageTitle } from "@/components/app/AppShell";
import { STUDENT_NAV } from "@/components/app/navs";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/student/natijalar")({
  head: () => ({ meta: [{ title: "Natijalar — TRIALOG" }] }),
  component: Page,
});

function Page() {
  const [rows, setRows] = useState<{ id: string; score: number; created_at: string; exercises: { title: string } | null }[]>([]);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) =>
      supabase.from("exercise_results").select("id,score,created_at,exercises(title)").eq("user_id", data.user!.id).order("created_at", { ascending: false })
        .then(({ data }) => setRows((data as never) ?? [])));
  }, []);
  return (
    <AppShell nav={STUDENT_NAV}>
      <PageTitle title="Natijalar" sub="Mashqlar bo‘yicha natijalaringiz" />
      {rows.length === 0 ? <p className="text-muted-foreground">Hali natija yo‘q.</p> : (
        <ul className="space-y-2">
          {rows.map((r) => <li key={r.id} className="flex justify-between rounded-xl border border-border bg-card p-4"><span>{r.exercises?.title}<span className="ml-2 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</span></span><b>{r.score}%</b></li>)}
        </ul>
      )}
    </AppShell>
  );
}
