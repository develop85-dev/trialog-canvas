import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageTitle, Placeholder } from "@/components/app/AppShell";
import { TEACHER_NAV } from "@/components/app/navs";

export const Route = createFileRoute("/_authenticated/teacher/dashboard")({
  head: () => ({ meta: [{ title: "O‘qituvchi paneli — TRIALOG" }] }),
  component: Page,
});

function Page() {
  return (
    <AppShell nav={TEACHER_NAV}>
      <PageTitle title="O‘qituvchi paneli" sub="Assalomu alaykum!" />
      <Placeholder text="Bu bo‘lim keyingi bosqichda to‘ldiriladi." />
    </AppShell>
  );
}
