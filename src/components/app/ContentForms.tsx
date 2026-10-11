import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const inp = "w-full rounded-md border border-input bg-background p-2 text-sm";
const lines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);

function F({ label, hint, children }: { label: string; hint?: string | undefined; children: ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

function Card({ title, onSubmit, children }: { title: string; onSubmit: () => void; children: ReactNode }) {
  return (
    <form className="space-y-3 rounded-xl border border-border bg-card p-5" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      <h3 className="font-display text-lg">{title}</h3>
      {children}
      <button className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Saqlash</button>
    </form>
  );
}

async function save(table: "vocab_items" | "texts" | "discussion_topics" | "exercises", data: object) {
  const { error } = await supabase.from(table).insert(data as never);
  if (error) { toast.error(error.message); return false; }
  toast.success("Saqlandi");
  return true;
}

const V0 = { word: "", category: "madaniy", definition: "", translation: "", cultural_note: "", example: "", audio_url: "", phrases: "", proverbs: "" };
function VocabForm() {
  const [v, setV] = useState(V0);
  const s = (k: keyof typeof V0) => (e: { target: { value: string } }) => setV({ ...v, [k]: e.target.value });
  return (
    <Card title="SO‘Z — yangi leksik birlik" onSubmit={async () => {
      if (await save("vocab_items", { word: v.word, category: v.category, definition: v.definition, translation: v.translation, cultural_note: v.cultural_note, example: v.example, audio_url: v.audio_url || null, related_phrases: lines(v.phrases), related_proverbs: lines(v.proverbs) })) setV(V0);
    }}>
      <div className="grid gap-3 md:grid-cols-2">
        <F label="So‘z / ibora *"><input required className={inp} value={v.word} onChange={s("word")} /></F>
        <F label="Turkum">
          <select className={inp} value={v.category} onChange={s("category")}>
            <option value="madaniy">Madaniy leksika</option>
            <option value="bezekvivalent">Ekvivalentsiz leksika</option>
            <option value="frazeologizm">Frazeologizm</option>
            <option value="paremiya">Paremiya (maqol)</option>
          </select>
        </F>
        <F label="Ma’nosi (izoh)"><textarea rows={2} className={inp} value={v.definition} onChange={s("definition")} /></F>
        <F label="Tarjimasi"><textarea rows={2} className={inp} value={v.translation} onChange={s("translation")} /></F>
        <F label="Madaniy izoh"><textarea rows={3} className={inp} value={v.cultural_note} onChange={s("cultural_note")} /></F>
        <F label="Misol (gapda qo‘llanishi)"><textarea rows={3} className={inp} value={v.example} onChange={s("example")} /></F>
        <F label="Bog‘liq iboralar" hint="Har birini yangi qatorga yozing"><textarea rows={3} className={inp} value={v.phrases} onChange={s("phrases")} /></F>
        <F label="Bog‘liq maqollar" hint="Har birini yangi qatorga yozing"><textarea rows={3} className={inp} value={v.proverbs} onChange={s("proverbs")} /></F>
        <F label="Audio havola (ixtiyoriy)"><input className={inp} value={v.audio_url} onChange={s("audio_url")} placeholder="https://..." /></F>
      </div>
    </Card>
  );
}

const QTYPES = ["Faktik tushunish", "Madaniy talqin", "Qiyoslash", "Shaxsiy talqin"];
const T0 = { title: "", source: "", body: "", context: "", key_words: "", notes: "", video_url: "" };
function TextForm() {
  const [t, setT] = useState(T0);
  const [qs, setQs] = useState(QTYPES.map((type) => ({ type, prompt: "" })));
  const s = (k: keyof typeof T0) => (e: { target: { value: string } }) => setT({ ...t, [k]: e.target.value });
  return (
    <Card title="MATN — yangi matn" onSubmit={async () => {
      const ok = await save("texts", { title: t.title, source: t.source, body: t.body, context: t.context, key_words: t.key_words.split(",").map((x) => x.trim()).filter(Boolean), notes: lines(t.notes), video_url: t.video_url || null, questions: qs.filter((q) => q.prompt.trim()) });
      if (ok) { setT(T0); setQs(QTYPES.map((type) => ({ type, prompt: "" }))); }
    }}>
      <div className="grid gap-3 md:grid-cols-2">
        <F label="Sarlavha *"><input required className={inp} value={t.title} onChange={s("title")} /></F>
        <F label="Manba (muallif, asar)"><input className={inp} value={t.source} onChange={s("source")} /></F>
      </div>
      <F label="Matn *"><textarea required rows={8} className={inp} value={t.body} onChange={s("body")} /></F>
      <F label="Madaniy kontekst"><textarea rows={3} className={inp} value={t.context} onChange={s("context")} /></F>
      <div className="grid gap-3 md:grid-cols-2">
        <F label="Kalit so‘zlar" hint="Vergul bilan ajrating"><input className={inp} value={t.key_words} onChange={s("key_words")} /></F>
        <F label="Video havola (YouTube)"><input className={inp} value={t.video_url} onChange={s("video_url")} placeholder="https://youtube.com/..." /></F>
      </div>
      <F label="Izohlar" hint="Har bir izohni yangi qatorga yozing"><textarea rows={3} className={inp} value={t.notes} onChange={s("notes")} /></F>
      <div className="space-y-2">
        <span className="text-sm font-medium">Savollar</span>
        {qs.map((q, i) => (
          <div key={i} className="flex gap-2">
            <select className={inp + " max-w-48"} value={q.type} onChange={(e) => setQs(qs.map((x, j) => j === i ? { ...x, type: e.target.value } : x))}>
              {QTYPES.map((o) => <option key={o}>{o}</option>)}
            </select>
            <input className={inp} placeholder="Savol matni" value={q.prompt} onChange={(e) => setQs(qs.map((x, j) => j === i ? { ...x, prompt: e.target.value } : x))} />
          </div>
        ))}
        <button type="button" className="text-sm text-primary" onClick={() => setQs([...qs, { type: "Faktik tushunish", prompt: "" }])}>+ Savol qo‘shish</button>
      </div>
    </Card>
  );
}

type Q = { prompt: string; options: string; answer: string };
function ExerciseForm() {
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState("multiple_choice");
  const blank = (): Q => ({ prompt: "", options: "", answer: "" });
  const [qs, setQs] = useState<Q[]>([blank()]);
  const up = (i: number, k: keyof Q, val: string) => setQs(qs.map((q, j) => j === i ? { ...q, [k]: val } : q));
  const hasOpts = kind !== "fill_blank";
  return (
    <Card title="SO‘Z — yangi mashq" onSubmit={async () => {
      const valid = qs.filter((q) => q.prompt.trim() && q.answer.trim());
      if (!valid.length) { toast.error("Kamida bitta savol va javob kiriting"); return; }
      const questions = valid.map((q) => {
        const opts = lines(q.options);
        if (hasOpts && !opts.includes(q.answer.trim())) opts.unshift(q.answer.trim());
        return hasOpts ? { prompt: q.prompt, options: opts } : { prompt: q.prompt };
      });
      if (await save("exercises", { module: "soz", title, kind, questions, answer_key: valid.map((q) => q.answer.trim()) })) { setTitle(""); setQs([blank()]); }
    }}>
      <div className="grid gap-3 md:grid-cols-2">
        <F label="Mashq nomi *"><input required className={inp} value={title} onChange={(e) => setTitle(e.target.value)} /></F>
        <F label="Turi">
          <select className={inp} value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="multiple_choice">Test (variantli)</option>
            <option value="matching">Moslashtirish</option>
            <option value="fill_blank">Bo‘sh joyni to‘ldirish</option>
          </select>
        </F>
      </div>
      {qs.map((q, i) => (
        <div key={i} className="space-y-2 rounded-lg border border-border p-3">
          <F label={`${i + 1}-savol`} hint={kind === "fill_blank" ? "Bo‘sh joyni ___ bilan belgilang" : undefined}><input className={inp} value={q.prompt} onChange={(e) => up(i, "prompt", e.target.value)} /></F>
          {hasOpts && <F label="Noto‘g‘ri variantlar" hint="Har birini yangi qatorga yozing"><textarea rows={3} className={inp} value={q.options} onChange={(e) => up(i, "options", e.target.value)} /></F>}
          <F label="To‘g‘ri javob"><input className={inp} value={q.answer} onChange={(e) => up(i, "answer", e.target.value)} /></F>
        </div>
      ))}
      <button type="button" className="text-sm text-primary" onClick={() => setQs([...qs, blank()])}>+ Savol qo‘shish</button>
    </Card>
  );
}

function TopicForm() {
  const [t, setT] = useState({ title: "", description: "" });
  return (
    <Card title="MUNOZARA — yangi mavzu" onSubmit={async () => { if (await save("discussion_topics", t)) setT({ title: "", description: "" }); }}>
      <F label="Mavzu *"><input required className={inp} value={t.title} onChange={(e) => setT({ ...t, title: e.target.value })} /></F>
      <F label="Tavsif, savollar va yo‘riqnoma"><textarea rows={5} className={inp} value={t.description} onChange={(e) => setT({ ...t, description: e.target.value })} /></F>
    </Card>
  );
}

const TABS = [["vocab", "So‘z"], ["exercise", "Mashq"], ["text", "Matn"], ["topic", "Munozara"]] as const;
export function ContentForms() {
  const [tab, setTab] = useState<(typeof TABS)[number][0]>("vocab");
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {TABS.map(([k, l]) => <button key={k} onClick={() => setTab(k)} className={`rounded-full border px-4 py-1.5 text-sm ${tab === k ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{l}</button>)}
      </div>
      {tab === "vocab" && <VocabForm />}
      {tab === "exercise" && <ExerciseForm />}
      {tab === "text" && <TextForm />}
      {tab === "topic" && <TopicForm />}
    </div>
  );
}
