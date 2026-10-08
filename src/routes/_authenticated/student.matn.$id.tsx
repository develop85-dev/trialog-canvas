import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app/AppShell";
import { STUDENT_NAV } from "@/components/app/navs";

export const Route = createFileRoute("/_authenticated/student/matn/$id")({
  head: () => ({ meta: [{ title: "Matn — TRIALOG" }] }),
  component: Page,
});

type Q = { type: string; prompt: string };

function embed(url: string) {
  const yt = url.match(/(?:youtu\.be\/|v=)([\w-]{11})/);
  return yt ? `https://www.youtube.com/embed/${yt[1]}` : null;
}

function Page() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const { data: t, isLoading } = useQuery({
    queryKey: ["text", id],
    queryFn: async () => (await supabase.from("texts").select("*").eq("id", id).maybeSingle()).data,
  });
  const { data: prev } = useQuery({
    queryKey: ["text-response", id],
    queryFn: async () => (await supabase.from("text_responses").select("answers").eq("text_id", id).maybeSingle()).data,
  });
  const questions = (t?.questions ?? []) as Q[];
  const [answers, setAnswers] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    setAnswers(questions.map((_, i) => ((prev?.answers as string[] | undefined)?.[i] ?? "")));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, prev]);

  async function submit() {
    const { error } = await supabase.rpc("submit_text", { _text_id: id, _answers: answers });
    if (!error) {
      setSaved(true);
      ["progress", "activity", "text-done"].forEach((k) => qc.invalidateQueries({ queryKey: [k] }));
    }
  }

  return (
    <AppShell nav={STUDENT_NAV}>
      <Link to="/student/matn" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" /> Matnlar</Link>
      {isLoading ? null : !t ? (
        <p className="text-muted-foreground">Matn topilmadi.</p>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <article>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{t.source}</p>
            <h1 className="font-display mt-2 text-4xl text-primary">{t.title}</h1>
            {t.video_url && (
              <div className="mt-6 aspect-video overflow-hidden rounded-xl border bg-muted">
                {embed(t.video_url) ? <iframe src={embed(t.video_url)!} className="h-full w-full" allowFullScreen title={t.title} /> : <video src={t.video_url} controls className="h-full w-full" />}
              </div>
            )}
            <div className="font-display mt-6 space-y-4 text-lg leading-relaxed">
              {t.body.split("\n").filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
            </div>

            <section className="mt-10 space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Savollar</h2>
              {questions.map((q, i) => (
                <div key={i} className="rounded-xl border bg-card p-5 shadow-card">
                  <span className="rounded-full bg-matn-soft px-2.5 py-0.5 text-xs text-matn">{q.type}</span>
                  <p className="mt-2 font-medium">{q.prompt}</p>
                  <textarea rows={3} value={answers[i] ?? ""} onChange={(e) => setAnswers(answers.map((a, j) => (j === i ? e.target.value : a)))} className="mt-3 w-full rounded-lg border bg-background px-3 py-2 text-sm" />
                </div>
              ))}
              <div className="flex items-center gap-4">
                <button disabled={answers.some((a) => !a.trim())} onClick={submit} className="rounded-lg bg-matn px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50">
                  {prev ? "Javoblarni yangilash" : "Yakunlash"}
                </button>
                {(saved || prev) && <span className="flex items-center gap-1.5 text-sm text-matn"><CheckCircle2 className="h-4 w-4" /> Tugallangan</span>}
              </div>
            </section>
          </article>
          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <Box title="Madaniy kontekst"><p>{t.context}</p></Box>
            {t.key_words.length > 0 && (
              <Box title="Muhim so‘zlar">
                <div className="flex flex-wrap gap-2">{t.key_words.map((w) => <span key={w} className="rounded-full bg-matn-soft px-2.5 py-1 text-xs text-matn">{w}</span>)}</div>
              </Box>
            )}
            {t.notes.length > 0 && <Box title="Madaniy izohlar"><ul className="list-disc space-y-2 pl-4">{t.notes.map((n) => <li key={n}>{n}</li>)}</ul></Box>}
          </aside>
        </div>
      )}
    </AppShell>
  );
}

function Box({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-5 text-sm shadow-card">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      {children}
    </div>
  );
}
