import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, PageTitle } from "@/components/app/AppShell";
import { ADMIN_NAV } from "@/components/app/navs";
import { supabase } from "@/integrations/supabase/client";
import { ContentForms } from "./teacher.dashboard";

export const Route = createFileRoute("/_authenticated/admin/dashboard")({
  head: () => ({ meta: [{ title: "Administrator paneli — TRIALOG" }] }),
  component: Page,
});

const T = [["profiles", "Foydalanuvchilar"], ["vocab_items", "So‘zlar"], ["texts", "Matnlar"], ["discussion_topics", "Mavzular"], ["discussion_posts", "Postlar"], ["reflections", "Refleksiyalar"]] as const;

function Page() {
  const [c, setC] = useState<Record<string, number>>({});
  useEffect(() => {
    Promise.all(T.map(([t]) => supabase.from(t).select("*", { count: "exact", head: true }).then((r) => [t, r.count ?? 0] as const))).then((x) => setC(Object.fromEntries(x)));
  }, []);
  return (
    <AppShell nav={ADMIN_NAV}>
      <PageTitle title="Administrator paneli" sub="Platforma statistikasi va kontent" />
      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-6">
        {T.map(([t, l]) => <div key={t} className="rounded-xl border border-border bg-card p-4"><div className="text-2xl font-semibold">{c[t] ?? "…"}</div><div className="text-xs text-muted-foreground">{l}</div></div>)}
      </div>
      <ContentForms />
    </AppShell>
  );
}
