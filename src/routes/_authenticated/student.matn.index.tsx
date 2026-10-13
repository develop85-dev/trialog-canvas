import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell, PageTitle } from "@/components/app/AppShell";
import { STUDENT_NAV } from "@/components/app/navs";

export const Route = createFileRoute("/_authenticated/student/matn/")({
  head: () => ({ meta: [{ title: "MATN — TRIALOG" }] }),
  component: Page,
});

function Page() {
  const { data: texts = [] } = useQuery({
    queryKey: ["texts"],
    queryFn: async () =>
      (
        await supabase
          .from("texts")
          .select("id, title, source, context, video_url")
          .order("created_at")
      ).data ?? [],
  });
  const { data: done = [] } = useQuery({
    queryKey: ["text-done"],
    queryFn: async () =>
      ((await supabase.from("text_responses").select("text_id")).data ?? []).map((r) => r.text_id),
  });
  return (
    <AppShell nav={STUDENT_NAV}>
      <PageTitle
        title="MATN"
        sub="Madaniy-bilim komponenti — matnlar, videolar va madaniy kontekst"
      />
      <div className="grid gap-4 md:grid-cols-2">
        {texts.map((t) => (
          <Link
            key={t.id}
            to="/student/matn/$id"
            params={{ id: t.id }}
            className="rounded-xl border bg-card p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{t.source}</span>
              {done.includes(t.id) && (
                <span className="flex items-center gap-1 text-xs text-matn">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Tugallangan
                </span>
              )}
            </div>
            <h3 className="font-display mt-2 text-xl text-primary">{t.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{t.context}</p>
            {t.video_url && (
              <p className="mt-3 flex items-center gap-1.5 text-xs text-matn">
                <Video className="h-3.5 w-3.5" /> Video material
              </p>
            )}
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
