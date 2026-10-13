import { createFileRoute, Link, useRouteContext } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Heart, Reply, Pencil, Flag, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app/AppShell";
import { STUDENT_NAV } from "@/components/app/navs";
import { POPS } from "@/lib/phrases";

export const Route = createFileRoute("/_authenticated/student/munozara/$id")({
  head: () => ({ meta: [{ title: "Munozara — TRIALOG" }] }),
  component: Page,
});

type Pops = Record<string, string>;
type Post = {
  id: string;
  parent_id: string | null;
  user_id: string;
  author_name: string;
  body: string;
  pops: Pops | null;
  edited: boolean;
  created_at: string;
  post_likes: { user_id: string }[];
};

function Page() {
  const { id } = Route.useParams();
  const { user, roles } = useRouteContext({ from: "/_authenticated" });
  const isStaff = roles.includes("teacher") || roles.includes("admin");
  const qc = useQueryClient();
  const { data: topic } = useQuery({
    queryKey: ["topic", id],
    queryFn: async () =>
      (await supabase.from("discussion_topics").select("*").eq("id", id).maybeSingle()).data,
  });
  const { data: posts = [] } = useQuery({
    queryKey: ["posts", id],
    queryFn: async () =>
      ((
        await supabase
          .from("discussion_posts")
          .select("*, post_likes(user_id)")
          .eq("topic_id", id)
          .order("created_at")
      ).data ?? []) as unknown as Post[],
  });
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["posts", id] });
    qc.invalidateQueries({ queryKey: ["progress"] });
    qc.invalidateQueries({ queryKey: ["activity"] });
  };
  const author = (user.user_metadata?.["full_name"] as string) || user.email || "Talaba";

  async function create(body: string, pops: Pops | null, parent: string | null) {
    await supabase.from("discussion_posts").insert({
      topic_id: id,
      parent_id: parent,
      user_id: user.id,
      author_name: author,
      body,
      pops,
    });
    refresh();
  }

  const roots = posts.filter((p) => !p.parent_id);
  return (
    <AppShell nav={STUDENT_NAV}>
      <Link
        to="/student/munozara"
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Mavzular
      </Link>
      {topic && (
        <div className="max-w-3xl">
          <h1 className="font-display text-3xl text-primary">{topic.title}</h1>
          <p className="mt-2 text-muted-foreground">{topic.description}</p>
          <Composer onSubmit={(b, p) => create(b, p, null)} />
          <div className="mt-8 space-y-4">
            {roots.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Hali fikr bildirilmagan. Birinchi bo‘ling!
              </p>
            )}
            {roots.map((p) => (
              <div key={p.id}>
                <PostCard
                  post={p}
                  me={user.id}
                  isStaff={isStaff}
                  onChange={refresh}
                  onReply={(b) => create(b, null, p.id)}
                />
                <div className="ml-8 mt-3 space-y-3 border-l pl-5">
                  {posts
                    .filter((r) => r.parent_id === p.id)
                    .map((r) => (
                      <PostCard
                        key={r.id}
                        post={r}
                        me={user.id}
                        isStaff={isStaff}
                        onChange={refresh}
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
}

function Composer({ onSubmit }: { onSubmit: (body: string, pops: Pops | null) => Promise<void> }) {
  const [mode, setMode] = useState<"oddiy" | "pops">("pops");
  const [body, setBody] = useState("");
  const [pops, setPops] = useState<Pops>({ p: "", o: "", d: "", s: "" });
  const ready = mode === "oddiy" ? body.trim() : POPS.every((x) => pops[x.key]?.trim());
  async function send() {
    if (mode === "oddiy") await onSubmit(body, null);
    else await onSubmit(POPS.map((x) => pops[x.key]).join("\n\n"), pops);
    setBody("");
    setPops({ p: "", o: "", d: "", s: "" });
  }
  return (
    <div className="mt-6 rounded-2xl border bg-card p-5 shadow-card">
      <div className="mb-4 flex gap-2 text-sm">
        {(["pops", "oddiy"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-full px-3 py-1 ${mode === m ? "bg-munozara-soft font-medium text-munozara" : "text-muted-foreground"}`}
          >
            {m === "pops" ? "POPS yordamchisi" : "Oddiy fikr"}
          </button>
        ))}
      </div>
      {mode === "oddiy" ? (
        <textarea
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Fikringizni yozing..."
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {POPS.map((x) => (
            <label key={x.key} className="text-sm">
              <span className="font-medium text-munozara">{x.label}</span>
              <textarea
                rows={3}
                value={pops[x.key]}
                onChange={(e) => setPops({ ...pops, [x.key]: e.target.value })}
                placeholder={x.hint}
                className="mt-1 w-full rounded-lg border bg-background px-3 py-2"
              />
            </label>
          ))}
        </div>
      )}
      <button
        disabled={!ready}
        onClick={send}
        className="mt-4 rounded-lg bg-munozara px-5 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        Yuborish
      </button>
    </div>
  );
}

function PostCard({
  post,
  me,
  isStaff,
  onChange,
  onReply,
}: {
  post: Post;
  me: string;
  isStaff: boolean;
  onChange: () => void;
  onReply?: (b: string) => Promise<void>;
}) {
  const mine = post.user_id === me;
  const liked = post.post_likes.some((l) => l.user_id === me);
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(post.body);
  const [replying, setReplying] = useState(false);
  const [reply, setReply] = useState("");
  const [reported, setReported] = useState(false);

  async function toggleLike() {
    if (liked) await supabase.from("post_likes").delete().eq("post_id", post.id).eq("user_id", me);
    else await supabase.from("post_likes").insert({ post_id: post.id, user_id: me });
    onChange();
  }
  async function save() {
    await supabase
      .from("discussion_posts")
      .update({ body: text, pops: null, edited: true })
      .eq("id", post.id);
    setEditing(false);
    onChange();
  }
  async function remove() {
    if (!confirm("O‘chirilsinmi?")) return;
    await supabase.from("discussion_posts").delete().eq("id", post.id);
    onChange();
  }
  async function report() {
    const reason = prompt("Shikoyat sababi:");
    if (reason === null) return;
    await supabase.from("post_reports").insert({ post_id: post.id, user_id: me, reason });
    setReported(true);
  }

  return (
    <article className="rounded-xl border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{post.author_name}</span>
        <span>
          {new Date(post.created_at).toLocaleString("uz-UZ")}
          {post.edited && " · tahrirlangan"}
        </span>
      </div>
      {editing ? (
        <div className="mt-3">
          <textarea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          />
          <div className="mt-2 flex gap-2 text-sm">
            <button
              onClick={save}
              className="rounded-lg bg-primary px-3 py-1.5 text-primary-foreground"
            >
              Saqlash
            </button>
            <button onClick={() => setEditing(false)} className="rounded-lg border px-3 py-1.5">
              Bekor qilish
            </button>
          </div>
        </div>
      ) : post.pops ? (
        <dl className="mt-3 grid gap-3 md:grid-cols-2">
          {POPS.map((x) => (
            <div key={x.key} className="rounded-lg bg-munozara-soft p-3 text-sm">
              <dt className="text-xs font-semibold text-munozara">{x.label}</dt>
              <dd className="mt-1">{post.pops?.[x.key]}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="mt-3 whitespace-pre-line text-sm">{post.body}</p>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1 ${liked ? "text-munozara" : "hover:text-munozara"}`}
        >
          <Heart className={`h-3.5 w-3.5 ${liked ? "fill-current" : ""}`} /> Foydali (
          {post.post_likes.length})
        </button>
        {onReply && (
          <button
            onClick={() => setReplying(!replying)}
            className="flex items-center gap-1 hover:text-primary"
          >
            <Reply className="h-3.5 w-3.5" /> Javob
          </button>
        )}
        {mine && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1 hover:text-primary"
          >
            <Pencil className="h-3.5 w-3.5" /> Tahrirlash
          </button>
        )}
        {(mine || isStaff) && (
          <button onClick={remove} className="flex items-center gap-1 hover:text-destructive">
            <Trash2 className="h-3.5 w-3.5" /> O‘chirish
          </button>
        )}
        {!mine && (
          <button
            disabled={reported}
            onClick={report}
            className="flex items-center gap-1 hover:text-destructive disabled:opacity-60"
          >
            <Flag className="h-3.5 w-3.5" /> {reported ? "Yuborildi" : "Shikoyat"}
          </button>
        )}
      </div>
      {replying && onReply && (
        <div className="mt-3 flex gap-2">
          <input
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Javobingiz..."
            className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm"
          />
          <button
            disabled={!reply.trim()}
            onClick={async () => {
              await onReply(reply);
              setReply("");
              setReplying(false);
            }}
            className="rounded-lg bg-munozara px-4 text-sm text-primary-foreground disabled:opacity-50"
          >
            Yuborish
          </button>
        </div>
      )}
    </article>
  );
}
