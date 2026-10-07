import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell, PageTitle } from "@/components/app/AppShell";
import { ADMIN_NAV, STUDENT_NAV, TEACHER_NAV } from "@/components/app/navs";
import { ROLE_LABEL, primaryRole } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/profil")({
  head: () => ({ meta: [{ title: "Profil — TRIALOG" }] }),
  component: Page,
});

function Page() {
  const { user, roles } = useRouteContext({ from: "/_authenticated" });
  const role = primaryRole(roles);
  const nav = role === "admin" ? ADMIN_NAV : role === "teacher" ? TEACHER_NAV : STUDENT_NAV;
  const [name, setName] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle()
      .then(({ data }) => setName(data?.full_name ?? ""));
  }, [user.id]);

  async function save(e: FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("profiles").update({ full_name: name, updated_at: new Date().toISOString() }).eq("id", user.id);
    await supabase.auth.updateUser({ data: { full_name: name } });
    setMsg(error ? "Xatolik yuz berdi." : "Saqlandi.");
  }

  return (
    <AppShell nav={nav}>
      <PageTitle title="Profil" sub={ROLE_LABEL[role]} />
      <form onSubmit={save} className="max-w-lg space-y-4 rounded-2xl border bg-card p-6 shadow-card">
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">To‘liq ism</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border bg-background px-3.5 py-2.5" />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Elektron pochta</span>
          <input value={user.email ?? ""} disabled className="w-full rounded-lg border bg-muted px-3.5 py-2.5 text-muted-foreground" />
        </label>
        {msg && <p className="text-sm text-matn">{msg}</p>}
        <button className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">Saqlash</button>
      </form>
    </AppShell>
  );
}
