import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/SiteHeader";
import { dashboardPath, fetchRoles, primaryRole } from "@/lib/auth";
import { useLanguage, LanguageSwitcher } from "@/lib/i18n";

export const Route = createFileRoute("/kirish")({
  head: () => ({
    meta: [
      { title: "Kirish / Вход — TRIALOG" },
      {
        name: "description",
        content: "TRIALOG elektron platformasiga kirish va ro‘yxatdan o‘tish.",
      },
      { property: "og:title", content: "TRIALOG platformasiga kirish" },
      {
        property: "og:description",
        content: "Talaba, o‘qituvchi va administratorlar uchun kirish.",
      },
    ],
  }),
  component: Page,
});

const input =
  "w-full rounded-lg border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20";

function Page() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function goToDashboard(userId: string) {
    const role = primaryRole(await fetchRoles(userId));
    navigate({ to: dashboardPath(role), replace: true });
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) goToDashboard(data.session.user.id);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((e, s) => {
      if (e === "SIGNED_IN" && s) goToDashboard(s.user.id);
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(t.auth.errorInvalid);
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name }, emailRedirectTo: `${window.location.origin}/kirish` },
      });
      if (error) setError(error.message);
      else if (!data.session) setInfo(t.auth.confirmSent);
    }
    setBusy(false);
  }

  return (
    <section className="mx-auto flex min-h-[75vh] max-w-md flex-col justify-center px-6 py-16">
      <div className="relative rounded-2xl border bg-card p-8 shadow-lift">
        <div className="absolute right-6 top-6">
          <LanguageSwitcher compact />
        </div>
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1 className="font-display mt-6 text-center text-3xl text-primary">
          {mode === "login" ? t.auth.loginTitle : t.auth.registerTitle}
        </h1>
        <div className="mt-6 grid grid-cols-2 rounded-lg bg-muted p-1 text-sm">
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-md py-2 transition ${mode === m ? "bg-card font-medium text-primary shadow-card" : "text-muted-foreground"}`}
            >
              {m === "login" ? t.auth.loginTab : t.auth.registerTab}
            </button>
          ))}
        </div>
        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "register" && (
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">{t.auth.nameLabel}</span>
              <input
                className={input}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          )}
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">{t.auth.emailLabel}</span>
            <input
              className={input}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">{t.auth.passLabel}</span>
            <input
              className={input}
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {mode === "login" && (
            <Link
              to="/parolni-tiklash"
              className="block text-right text-xs text-muted-foreground hover:text-primary"
            >
              {t.auth.forgotPass}
            </Link>
          )}
          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          {info && <p className="rounded-lg bg-matn-soft px-3 py-2 text-sm text-matn">{info}</p>}
          <button
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "login" ? t.auth.loginBtn : t.auth.registerBtn}
          </button>
        </form>
      </div>
    </section>
  );
}
