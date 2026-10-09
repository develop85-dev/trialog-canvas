import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { MessagesSquare, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell, PageTitle } from "@/components/app/AppShell";
import { STUDENT_NAV } from "@/components/app/navs";
import { PHRASE_BANK } from "@/lib/phrases";

export const Route = createFileRoute("/_authenticated/student/munozara/")({
  head: () => ({ meta: [{ title: "MUNOZARA — TRIALOG" }] }),
  component: Page,
});

function Page() {
  const [tab, setTab] = useState<"mavzu" | "qolip">("mavzu");
  const { data: topics = [] } = useQuery({
    queryKey: ["topics"],
    queryFn: async () => (await supabase.from("discussion_topics").select("id, title, description, discussion_posts(count)").order("created_at")).data ?? [],
  });
  return (
    <AppShell nav={STUDENT_NAV}>
      <PageTitle title="MUNOZARA" sub="Kommunikativ-faoliyat komponenti — fikr almashish va madaniyatlararo muloqot" />
      <div className="mb-6 inline-flex rounded-lg bg-muted p-1 text-sm">
        {(["mavzu", "qolip"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-md px-4 py-2 transition ${tab === t ? "bg-card font-medium text-munozara shadow-card" : "text-muted-foreground"}`}>
            {t === "mavzu" ? "Mavzular" : "Nutqiy qoliplar banki"}
          </button>
        ))}
      </div>
      {tab === "mavzu" ? (
        <div className="grid gap-4 md:grid-cols-2">
          {topics.map((t) => (
            <Link key={t.id} to="/student/munozara/$id" params={{ id: t.id }} className="rounded-xl border bg-card p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift">
              <h3 className="font-display text-xl text-primary">{t.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.description}</p>
              <p className="mt-4 flex items-center gap-1.5 text-xs text-munozara">
                <MessagesSquare className="h-3.5 w-3.5" /> {(t.discussion_posts as unknown as { count: number }[])[0]?.count ?? 0} ta fikr
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PHRASE_BANK.map((g) => (
            <div key={g.group} className="rounded-xl border bg-card p-5 shadow-card">
              <h3 className="mb-3 text-sm font-semibold text-munozara">{g.group}</h3>
              <ul className="space-y-2">
                {g.items.map((p) => (
                  <li key={p} className="group flex items-center justify-between gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
                    {p}
                    <button aria-label="Nusxa olish" onClick={() => navigator.clipboard.writeText(p)} className="text-muted-foreground opacity-0 transition group-hover:opacity-100"><Copy className="h-3.5 w-3.5" /></button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
