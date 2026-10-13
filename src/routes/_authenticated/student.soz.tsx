import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, Volume2, CheckCircle2, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell, PageTitle } from "@/components/app/AppShell";
import { STUDENT_NAV } from "@/components/app/navs";

export const Route = createFileRoute("/_authenticated/student/soz")({
  head: () => ({ meta: [{ title: "SO‘Z — TRIALOG" }] }),
  component: Page,
});

const CATS: Record<string, string> = {
  all: "Barchasi",
  bezekvivalent: "Bezekvivalent leksika",
  madaniy: "Madaniy belgilangan",
  frazeologizm: "Frazeologizmlar",
  paremiya: "Paremiyalar",
};
const KIND: Record<string, string> = {
  multiple_choice: "Ko‘p tanlovli",
  matching: "Moslashtirish",
  fill_blank: "Bo‘sh joyni to‘ldirish",
  meaning: "To‘g‘ri ma’no",
};

type Question = { prompt: string; options?: string[] };

function Page() {
  const [tab, setTab] = useState<"lugat" | "mashq">("lugat");
  return (
    <AppShell nav={STUDENT_NAV}>
      <PageTitle title="SO‘Z" sub="Lingvistik komponent — leksik-frazeologik blok" />
      <div className="mb-6 inline-flex rounded-lg bg-muted p-1 text-sm">
        {(["lugat", "mashq"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-md px-4 py-2 transition ${tab === t ? "bg-card font-medium text-soz shadow-card" : "text-muted-foreground"}`}
          >
            {t === "lugat" ? "Lug‘at" : "Mashqlar"}
          </button>
        ))}
      </div>
      {tab === "lugat" ? <Library /> : <Exercises />}
    </AppShell>
  );
}

function Library() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [open, setOpen] = useState<string | null>(null);
  const { data = [] } = useQuery({
    queryKey: ["vocab"],
    queryFn: async () => (await supabase.from("vocab_items").select("*").order("word")).data ?? [],
  });
  const items = useMemo(
    () =>
      data.filter(
        (v) =>
          (cat === "all" || v.category === cat) &&
          (v.word + v.translation + v.definition).toLowerCase().includes(q.toLowerCase()),
      ),
    [data, q, cat],
  );
  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="So‘z qidirish..."
            className="w-full rounded-lg border bg-card py-2.5 pl-9 pr-3 text-sm"
          />
        </div>
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="rounded-lg border bg-card px-3 py-2.5 text-sm"
        >
          {Object.entries(CATS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {items.map((v) => (
          <article key={v.id} className="rounded-xl border bg-card p-5 shadow-card">
            <button
              className="w-full text-left"
              onClick={() => setOpen(open === v.id ? null : v.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-soz">{v.word}</h3>
                  <p className="text-sm text-muted-foreground">{v.translation}</p>
                </div>
                <span className="rounded-full bg-soz-soft px-2.5 py-0.5 text-xs text-soz">
                  {CATS[v.category] ?? v.category}
                </span>
              </div>
              <p className="mt-3 text-sm">{v.definition}</p>
            </button>
            {open === v.id && (
              <dl className="mt-4 space-y-3 border-t pt-4 text-sm">
                {v.cultural_note && <Field k="Madaniy izoh" v={v.cultural_note} />}
                {v.example && <Field k="Misol" v={<em>{v.example}</em>} />}
                {v.related_phrases.length > 0 && (
                  <Field k="Bog‘liq iboralar" v={v.related_phrases.join(" · ")} />
                )}
                {v.related_proverbs.length > 0 && (
                  <Field k="Bog‘liq maqollar" v={v.related_proverbs.join(" · ")} />
                )}
                {v.audio_url && (
                  <Field
                    k="Audio"
                    v={
                      <span className="flex items-center gap-2">
                        <Volume2 className="h-4 w-4 text-soz" />
                        <audio controls src={v.audio_url} className="h-8" />
                      </span>
                    }
                  />
                )}
              </dl>
            )}
          </article>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">Hech narsa topilmadi.</p>
        )}
      </div>
    </div>
  );
}

function Field({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{k}</dt>
      <dd className="mt-0.5">{v}</dd>
    </div>
  );
}

function Exercises() {
  const qc = useQueryClient();
  const [active, setActive] = useState<string | null>(null);
  const { data: list = [] } = useQuery({
    queryKey: ["exercises", "soz"],
    queryFn: async () =>
      (
        await supabase
          .from("exercises")
          .select("id, title, kind, questions")
          .eq("module", "soz")
          .order("created_at")
      ).data ?? [],
  });
  const { data: best = {} } = useQuery({
    queryKey: ["exercise-best"],
    queryFn: async () => {
      const { data } = await supabase.from("exercise_results").select("exercise_id, score");
      const m: Record<string, number> = {};
      (data ?? []).forEach((r) => (m[r.exercise_id] = Math.max(m[r.exercise_id] ?? 0, r.score)));
      return m;
    },
  });
  const ex = list.find((e) => e.id === active);
  if (ex) {
    return (
      <ExerciseRunner
        id={ex.id}
        title={ex.title}
        questions={ex.questions as Question[]}
        onBack={() => setActive(null)}
        onDone={() => {
          qc.invalidateQueries({ queryKey: ["exercise-best"] });
          qc.invalidateQueries({ queryKey: ["progress"] });
          qc.invalidateQueries({ queryKey: ["activity"] });
        }}
      />
    );
  }
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {list.map((e) => (
        <button
          key={e.id}
          onClick={() => setActive(e.id)}
          className="rounded-xl border bg-card p-5 text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-lift"
        >
          <span className="text-xs text-muted-foreground">{KIND[e.kind] ?? e.kind}</span>
          <h3 className="mt-1 font-semibold">{e.title}</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            {(e.questions as Question[]).length} ta savol
          </p>
          {best[e.id] !== undefined && (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-soz">
              <CheckCircle2 className="h-4 w-4" /> Eng yaxshi natija: {best[e.id]}%
            </p>
          )}
        </button>
      ))}
    </div>
  );
}

function ExerciseRunner({
  id,
  title,
  questions,
  onBack,
  onDone,
}: {
  id: string;
  title: string;
  questions: Question[];
  onBack: () => void;
  onDone: () => void;
}) {
  const [answers, setAnswers] = useState<string[]>(questions.map(() => ""));
  const [score, setScore] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setErr(null);
    const { data, error } = await supabase.rpc("submit_exercise", {
      _exercise_id: id,
      _answers: answers,
    });
    setBusy(false);
    if (error) return setErr("Natijani saqlab bo‘lmadi.");
    setScore(data as number);
    onDone();
  }

  return (
    <div className="max-w-2xl">
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Mashqlar
      </button>
      <h2 className="font-display text-2xl text-primary">{title}</h2>
      {score !== null ? (
        <div className="mt-6 rounded-2xl border bg-soz-soft p-8 text-center">
          <p className="text-sm text-muted-foreground">Natija</p>
          <p className="mt-1 text-5xl font-semibold text-soz">{score}%</p>
          <button
            onClick={() => {
              setScore(null);
              setAnswers(questions.map(() => ""));
            }}
            className="mt-6 rounded-lg border bg-card px-4 py-2 text-sm"
          >
            Qayta urinish
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {questions.map((q, i) => (
            <div key={i} className="rounded-xl border bg-card p-5 shadow-card">
              <p className="font-medium">
                {i + 1}. {q.prompt}
              </p>
              {q.options ? (
                <div className="mt-3 grid gap-2">
                  {q.options.map((o) => (
                    <label
                      key={o}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition ${answers[i] === o ? "border-soz bg-soz-soft" : "hover:bg-accent"}`}
                    >
                      <input
                        type="radio"
                        name={`q${i}`}
                        checked={answers[i] === o}
                        onChange={() => setAnswers(answers.map((a, j) => (j === i ? o : a)))}
                        className="accent-[var(--color-soz)]"
                      />
                      {o}
                    </label>
                  ))}
                </div>
              ) : (
                <input
                  value={answers[i]}
                  onChange={(e) =>
                    setAnswers(answers.map((a, j) => (j === i ? e.target.value : a)))
                  }
                  placeholder="Javobingiz"
                  className="mt-3 w-full rounded-lg border bg-background px-3 py-2.5 text-sm"
                />
              )}
            </div>
          ))}
          {err && <p className="text-sm text-destructive">{err}</p>}
          <button
            disabled={busy || answers.some((a) => !a.trim())}
            onClick={submit}
            className="rounded-lg bg-soz px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            Tekshirish
          </button>
        </div>
      )}
    </div>
  );
}
