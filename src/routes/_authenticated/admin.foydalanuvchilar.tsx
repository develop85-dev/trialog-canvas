import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell, PageTitle } from "@/components/app/AppShell";
import { ADMIN_NAV } from "@/components/app/navs";
import { supabase } from "@/integrations/supabase/client";
import { ROLE_LABEL, type AppRole } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/admin/foydalanuvchilar")({
  head: () => ({ meta: [{ title: "Foydalanuvchilar — TRIALOG" }] }),
  component: Page,
});

const ROLES: AppRole[] = ["student", "teacher", "admin"];

function Page() {
  const [users, setUsers] = useState<
    { id: string; full_name: string; email: string | null; roles: AppRole[] }[]
  >([]);
  const load = async () => {
    const [{ data: p }, { data: r }] = await Promise.all([
      supabase.from("profiles").select("id,full_name,email").order("created_at"),
      supabase.from("user_roles").select("user_id,role"),
    ]);
    setUsers(
      (p ?? []).map((u) => ({
        ...u,
        roles: (r ?? []).filter((x) => x.user_id === u.id).map((x) => x.role),
      })),
    );
  };
  useEffect(() => {
    load();
  }, []);
  const toggle = async (id: string, role: AppRole, has: boolean) => {
    const { error } = has
      ? await supabase.from("user_roles").delete().eq("user_id", id).eq("role", role)
      : await supabase.from("user_roles").insert({ user_id: id, role });
    if (error) toast.error(error.message);
    else load();
  };
  return (
    <AppShell nav={ADMIN_NAV}>
      <PageTitle title="Foydalanuvchilar" sub="Rollarni belgilash uchun bosing" />
      <div className="space-y-2">
        {users.map((u) => (
          <div
            key={u.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4"
          >
            <div>
              <div className="font-medium">{u.full_name || "—"}</div>
              <div className="text-xs text-muted-foreground">{u.email}</div>
            </div>
            <div className="flex gap-2">
              {ROLES.map((r) => {
                const has = u.roles.includes(r);
                return (
                  <button
                    key={r}
                    onClick={() => toggle(u.id, r, has)}
                    className={`rounded-full border px-3 py-1 text-xs ${has ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}
                  >
                    {ROLE_LABEL[r]}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
