import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/parolni-tiklash")({
  head: () => ({
    meta: [
      { title: "Parolni tiklash / Восстановление пароля — TRIALOG" },
      { name: "description", content: "TRIALOG hisobingiz parolini tiklash." },
      { property: "og:title", content: "Parolni tiklash — TRIALOG" },
      { property: "og:description", content: "Hisob parolini tiklash." },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/yangi-parol`,
    });
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <form onSubmit={submit} className="space-y-4 rounded-2xl border bg-card p-8 shadow-lift">
        <h1 className="font-display text-3xl text-primary">{t.auth.resetTitle}</h1>
        {sent ? (
          <p className="text-sm text-muted-foreground">{t.auth.linkSent}</p>
        ) : (
          <>
            <input
              type="email"
              required
              placeholder={t.auth.emailLabel}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border bg-background px-3.5 py-2.5 text-sm"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground">
              {t.auth.sendResetLink}
            </button>
          </>
        )}
      </form>
    </section>
  );
}
