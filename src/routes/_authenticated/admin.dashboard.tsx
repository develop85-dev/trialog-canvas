import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, PageTitle } from "@/components/app/AppShell";
import { ADMIN_NAV } from "@/components/app/navs";
import { supabase } from "@/integrations/supabase/client";
import { ContentForms } from "@/components/app/ContentForms";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/admin/dashboard")({
  head: () => ({ meta: [{ title: "Administrator paneli / Панель администратора — TRIALOG" }] }),
  component: Page,
});

const T_UZ: Record<string, string> = {
  profiles: "Foydalanuvchilar",
  vocab_items: "So‘zlar",
  texts: "Matnlar",
  discussion_topics: "Mavzular",
  discussion_posts: "Postlar",
  reflections: "Refleksiyalar",
};

const T_RU: Record<string, string> = {
  profiles: "Пользователи",
  vocab_items: "Слова",
  texts: "Тексты",
  discussion_topics: "Темы",
  discussion_posts: "Сообщения",
  reflections: "Рефлексии",
};

const TABLES = [
  "profiles",
  "vocab_items",
  "texts",
  "discussion_topics",
  "discussion_posts",
  "reflections",
] as const;

function Page() {
  const { lang } = useLanguage();
  const isRu = lang === "ru";
  const [c, setC] = useState<Record<string, number>>({});

  useEffect(() => {
    Promise.all(
      TABLES.map((t) =>
        supabase
          .from(t)
          .select("*", { count: "exact", head: true })
          .then((r) => [t, r.count ?? 0] as const),
      ),
    ).then((x) => setC(Object.fromEntries(x)));
  }, []);

  const labels = isRu ? T_RU : T_UZ;

  return (
    <AppShell nav={ADMIN_NAV}>
      <PageTitle
        title={isRu ? "Панель администратора" : "Administrator paneli"}
        sub={
          isRu ? "Статистика платформы и управление контентом" : "Platforma statistikasi va kontent"
        }
      />
      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-6">
        {TABLES.map((t) => (
          <div key={t} className="rounded-xl border border-border bg-card p-4">
            <div className="text-2xl font-semibold">{c[t] ?? "…"}</div>
            <div className="text-xs text-muted-foreground">{labels[t]}</div>
          </div>
        ))}
      </div>
      <ContentForms />
    </AppShell>
  );
}
