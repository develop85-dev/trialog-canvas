import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Table = "vocab_items" | "texts" | "discussion_topics" | "exercises";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = any;

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

function Card({ title, editing, onCancel, onSubmit, children }: { title: string; editing: boolean; onCancel: () => void; onSubmit: () => void; children: ReactNode }) {
  return (
    <form className={`space-y-3 rounded-xl border bg-card p-5 ${editing ? "border-primary" : "border-border"}`} onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      <h3 className="font-display text-lg">{editing ? "Tahrirlash: " : ""}{title}</h3>
      {children}
      <div className="flex gap-2">
        <button className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">{editing ? "Yangilash" : "Saqlash"}</button>
        {editing && <button type="button" onClick={onCancel} className="rounded-md border border-border px-4 py-2 text-sm">Bekor qilish</button>}
      </div>
    </form>
  );
}

async function save(table: Table, data: object, id?: string) {
  const { error } = id
    ? await supabase.from(table).update(data as never).eq("id", id)
    : await supabase.from(table).insert(data as never);
  if (error) { toast.error(error.message); return false; }
  toast.success(id ? "Yangilandi" : "Saqlandi");
  return true;
}

type FormProps = { edit: Row | null; done: () => void };

const V0 = { word: "", category: "madaniy", definition: "", translation: "", cultural_note: "", example: "", audio_url: "", phrases: "", proverbs: "" };
function VocabForm({ edit, done }: FormProps) {
  const [v, setV] = useState(edit ? { ...edit, audio_url: edit.audio_url ?? "", phrases: (edit.related_phrases ?? []).join("\n"), proverbs: (edit.related_proverbs ?? []).join("\n") } : V0);
  const s = (k: keyof typeof V0) => (e: { target: { value: string } }) => setV({ ...v, [k]: e.target.value });
  return (
    <Card title="SO‘Z — leksik birlik" editing={!!edit} onCancel={done} onSubmit={async () => {
      if (await save("vocab_items", { word: v.word, category: v.category, definition: v.definition, translation: v.translation, cultural_note: v.cultural_note, example: v.example, audio_url: v.audio_url || null, related_phrases: lines(v.phrases), related_proverbs: lines(v.proverbs) }, edit?.id)) { setV(V0); done(); }
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
const Q0 = () => QTYPES.map((type) => ({ type, prompt: "" }));
function TextForm({ edit, done }: FormProps) {
  const [t, setT] = useState(edit ? { title: edit.title, source: edit.source, body: edit.body, context: edit.context, key_words: (edit.key_words ?? []).join(", "), notes: (edit.notes ?? []).join("\n"), video_url: edit.video_url ?? "" } : T0);
  const [qs, setQs] = useState<{ type: string; prompt: string }[]>(edit?.questions?.length ? edit.questions : Q0());
  const s = (k: keyof typeof T0) => (e: { target: { value: string } }) => setT({ ...t, [k]: e.target.value });
  return (
    <Card title="MATN" editing={!!edit} onCancel={done} onSubmit={async () => {
      const ok = await save("texts", { title: t.title, source: t.source, body: t.body, context: t.context, key_words: t.key_words.split(",").map((x) => x.trim()).filter(Boolean), notes: lines(t.notes), video_url: t.video_url || null, questions: qs.filter((q) => q.prompt.trim()) }, edit?.id);
      if (ok) { setT(T0); setQs(Q0()); done(); }
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
            <button type="button" onClick={() => setQs(qs.filter((_, j) => j !== i))} className="text-muted-foreground"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
        <button type="button" className="text-sm text-primary" onClick={() => setQs([...qs, { type: "Faktik tushunish", prompt: "" }])}>+ Savol qo‘shish</button>
      </div>
    </Card>
  );
}

type Q = { prompt: string; options: string; answer: string };
function ExerciseForm({ edit, done }: FormProps) {
  const blank = (): Q => ({ prompt: "", options: "", answer: "" });
  const [title, setTitle] = useState<string>(edit?.title ?? "");
  const [kind, setKind] = useState<string>(edit?.kind ?? "multiple_choice");
  const [qs, setQs] = useState<Q[]>(edit
    ? (edit.questions as { prompt: string; options?: string[] }[]).map((q, i) => {
        const a = String(edit.answer_key?.[i] ?? "");
        return { prompt: q.prompt, answer: a, options: (q.options ?? []).filter((o) => o !== a).join("\n") };
      })
    : [blank()]);
  const up = (i: number, k: keyof Q, val: string) => setQs(qs.map((q, j) => j === i ? { ...q, [k]: val } : q));
  const hasOpts = kind !== "fill_blank";
  return (
    <Card title="SO‘Z — mashq" editing={!!edit} onCancel={done} onSubmit={async () => {
      const valid = qs.filter((q) => q.prompt.trim() && q.answer.trim());
      if (!valid.length) { toast.error("Kamida bitta savol va javob kiriting"); return; }
      const questions = valid.map((q) => {
        const opts = lines(q.options);
        if (hasOpts && !opts.includes(q.answer.trim())) opts.splice(Math.floor(Math.random() * (opts.length + 1)), 0, q.answer.trim());
        return hasOpts ? { prompt: q.prompt, options: opts } : { prompt: q.prompt };
      });
      if (await save("exercises", { module: "soz", title, kind, questions, answer_key: valid.map((q) => q.answer.trim()) }, edit?.id)) { setTitle(""); setQs([blank()]); done(); }
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
          <div className="flex items-end gap-2">
            <div className="flex-1"><F label={`${i + 1}-savol`} hint={kind === "fill_blank" ? "Bo‘sh joyni ___ bilan belgilang" : undefined}><input className={inp} value={q.prompt} onChange={(e) => up(i, "prompt", e.target.value)} /></F></div>
            <button type="button" onClick={() => setQs(qs.filter((_, j) => j !== i))} className="pb-2 text-muted-foreground"><Trash2 className="h-4 w-4" /></button>
          </div>
          {hasOpts && <F label="Noto‘g‘ri variantlar" hint="Har birini yangi qatorga yozing"><textarea rows={3} className={inp} value={q.options} onChange={(e) => up(i, "options", e.target.value)} /></F>}
          <F label="To‘g‘ri javob"><input className={inp} value={q.answer} onChange={(e) => up(i, "answer", e.target.value)} /></F>
        </div>
      ))}
      <button type="button" className="text-sm text-primary" onClick={() => setQs([...qs, blank()])}>+ Savol qo‘shish</button>
    </Card>
  );
}

function TopicForm({ edit, done }: FormProps) {
  const [t, setT] = useState({ title: edit?.title ?? "", description: edit?.description ?? "" });
  return (
    <Card title="MUNOZARA — mavzu" editing={!!edit} onCancel={done} onSubmit={async () => { if (await save("discussion_topics", t, edit?.id)) { setT({ title: "", description: "" }); done(); } }}>
      <F label="Mavzu *"><input required className={inp} value={t.title} onChange={(e) => setT({ ...t, title: e.target.value })} /></F>
      <F label="Tavsif, savollar va yo‘riqnoma"><textarea rows={5} className={inp} value={t.description} onChange={(e) => setT({ ...t, description: e.target.value })} /></F>
    </Card>
  );
}

const TABS = [
  { k: "vocab", l: "So‘z", table: "vocab_items", label: "word", Form: VocabForm, warn: "" },
  { k: "exercise", l: "Mashq", table: "exercises", label: "title", Form: ExerciseForm, warn: " Talabalarning shu mashqdagi natijalari ham o‘chadi." },
  { k: "text", l: "Matn", table: "texts", label: "title", Form: TextForm, warn: " Talabalarning shu matnga javoblari ham o‘chadi." },
  { k: "topic", l: "Munozara", table: "discussion_topics", label: "title", Form: TopicForm, warn: " Mavzudagi barcha postlar ham o‘chadi." },
] as const;

export function ContentForms() {
  const [tab, setTab] = useState<(typeof TABS)[number]["k"]>("vocab");
  const cfg = TABS.find((t) => t.k === tab)!;
  const [rows, setRows] = useState<Row[]>([]);
  const [edit, setEdit] = useState<Row | null>(null);
  const [q, setQ] = useState("");
  const load = async () => {
    const { data } = await supabase.from(cfg.table).select("*").order("created_at", { ascending: false });
    setRows(data ?? []);
  };
  useEffect(() => { setEdit(null); setQ(""); load(); }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps
  const del = async (r: Row) => {
    if (!confirm(`«${r[cfg.label]}» o‘chirilsinmi?${cfg.warn}`)) return;
    const { error } = await supabase.from(cfg.table).delete().eq("id", r.id);
    if (error) toast.error(error.message); else { toast.success("O‘chirildi"); if (edit?.id === r.id) setEdit(null); load(); }
  };
  const Form = cfg.Form;
  const shown = rows.filter((r) => String(r[cfg.label]).toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {TABS.map((t) => <button key={t.k} onClick={() => setTab(t.k)} className={`rounded-full border px-4 py-1.5 text-sm ${tab === t.k ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{t.l}</button>)}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Form key={edit?.id ?? "new-" + tab} edit={edit} done={() => { setEdit(null); load(); }} />
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="mb-2 font-semibold">Mavjudlari ({rows.length})</h3>
          <input className={inp + " mb-3"} placeholder="Qidirish…" value={q} onChange={(e) => setQ(e.target.value)} />
          <ul className="max-h-[600px] space-y-1 overflow-y-auto">
            {shown.map((r) => (
              <li key={r.id} className={`flex items-center justify-between gap-2 rounded-md p-2 text-sm ${edit?.id === r.id ? "bg-muted" : "hover:bg-muted/50"}`}>
                <span className="truncate">{r[cfg.label]}</span>
                <span className="flex shrink-0 gap-1">
                  <button title="Tahrirlash" onClick={() => { setEdit(r); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="rounded p-1 hover:bg-background"><Pencil className="h-4 w-4" /></button>
                  <button title="O‘chirish" onClick={() => del(r)} className="rounded p-1 text-destructive hover:bg-background"><Trash2 className="h-4 w-4" /></button>
                </span>
              </li>
            ))}
            {shown.length === 0 && <li className="text-sm text-muted-foreground">Hech narsa topilmadi.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
