import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, PageTitle } from "@/components/app/AppShell";
import { STUDENT_NAV } from "@/components/app/navs";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/student/topshiriqlar")({
  head: () => ({ meta: [{ title: "Topshiriqlar — TRIALOG" }] }),
  component: Page,
});

function Page() {
  const [ex, setEx] = useState<{ id: string; title: string; done: boolean }[]>([]);
  const [tx, setTx] = useState<{ id: string; title: string; done: boolean }[]>([]);
  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user!.id;
      const [{ data: e }, { data: er }, { data: t }, { data: tr }] = await Promise.all([
        supabase.from("exercises").select("id,title"),
        supabase.from("exercise_results").select("exercise_id").eq("user_id", uid),
        supabase.from("texts").select("id,title"),
        supabase.from("text_responses").select("text_id").eq("user_id", uid),
      ]);
      setEx((e ?? []).map((x) => ({ ...x, done: !!er?.some((r) => r.exercise_id === x.id) })));
      setTx((t ?? []).map((x) => ({ ...x, done: !!tr?.some((r) => r.text_id === x.id) })));
    })();
  }, []);
  const item = (title: string, done: boolean, link: React.ReactNode) => (
    <li
      key={title}
      className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
    >
      <span>{title}</span>
      {done ? <span className="text-sm text-muted-foreground">✓ Bajarildi</span> : link}
    </li>
  );
  return (
    <AppShell nav={STUDENT_NAV}>
      <PageTitle title="Topshiriqlar" sub="Bajarilishi kerak bo‘lgan ishlar" />
      <h2 className="mb-2 font-semibold">SO‘Z mashqlari</h2>
      <ul className="mb-6 space-y-2">
        {ex.map((x) =>
          item(
            x.title,
            x.done,
            <Link to="/student/soz" className="text-sm text-primary">
              Boshlash →
            </Link>,
          ),
        )}
      </ul>
      <h2 className="mb-2 font-semibold">MATN topshiriqlari</h2>
      <ul className="space-y-2">
        {tx.map((x) =>
          item(
            x.title,
            x.done,
            <Link to="/student/matn/$id" params={{ id: x.id }} className="text-sm text-primary">
              Boshlash →
            </Link>,
          ),
        )}
      </ul>
    </AppShell>
  );
}
