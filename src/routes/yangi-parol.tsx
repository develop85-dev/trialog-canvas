import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/yangi-parol")({
  head: () => ({
    meta: [
      { title: "Yangi parol — TRIALOG" },
      { name: "description", content: "TRIALOG hisobi uchun yangi parol o‘rnatish." },
      { property: "og:title", content: "Yangi parol — TRIALOG" },
      { property: "og:description", content: "Yangi parol o‘rnatish." },
    ],
  }),
  component: Page,
});

function Page() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  async function submit(e: FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setError(error.message);
    else navigate({ to: "/kirish" });
  }
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <form onSubmit={submit} className="space-y-4 rounded-2xl border bg-card p-8 shadow-lift">
        <h1 className="font-display text-3xl text-primary">Yangi parol</h1>
        <input type="password" required minLength={6} placeholder="Yangi parol" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border bg-background px-3.5 py-2.5 text-sm" />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground">Saqlash</button>
      </form>
    </section>
  );
}
